// lib/cobalt.ts
// Talks to the self-hosted cobalt api and returns ONE normalised shape,
// so the front end never sees cobalt's raw json.

import type { Service } from "./normalize";

const COBALT_URL = process.env.COBALT_URL || "http://127.0.0.1:9000";
const COBALT_PROXY_URL = process.env.COBALT_PROXY_URL || ""; // optional second instance

export type Mode = "auto" | "audio" | "mute";

export interface MediaItem {
  type: "video" | "photo" | "audio" | "gif";
  url: string;        // where the bytes are (cdn link or cobalt tunnel)
  thumb?: string;
  filename: string;
  audioUrl?: string;  // second stream (audio) when the file must be merged server side (/api/merge)
  viaProxy?: boolean; // fetch through the same proxy the lookup used (ip-locked links)
}

export type ResolveResult =
  | { kind: "single"; service: Service; item: MediaItem }
  | { kind: "album"; service: Service; items: MediaItem[]; audio?: MediaItem }
  | { kind: "error"; service: Service; code: string; message: string; retryable: boolean };

// cobalt error code -> plain message for the visitor, and whether a proxied retry can help
const ERRORS: Record<string, { message: string; retryable: boolean }> = {
  "error.api.link.unsupported":         { message: "This type of link is not supported.", retryable: false },
  "error.api.link.invalid":             { message: "That link could not be read. Check it and try again.", retryable: false },
  "error.api.fetch.empty":              { message: "No downloadable media was found at that link.", retryable: true },
  "error.api.fetch.fail":               { message: "The site refused the request. Please try again.", retryable: true },
  "error.api.fetch.critical":           { message: "Something went wrong fetching this. Please try again.", retryable: true },
  "error.api.content.post.private":     { message: "This post is private.", retryable: false },
  "error.api.content.post.unavailable": { message: "This post is unavailable.", retryable: true },
  "error.api.content.post.age":         { message: "This content is age restricted.", retryable: false },
  "error.api.rate_exceeded":            { message: "Too many requests right now. Try again in a moment.", retryable: false },
  "error.api.service.disabled":         { message: "This site is currently disabled.", retryable: false },
};

// names cobalt gives for the "mode" switch
const MODE_MAP: Record<Mode, "auto" | "audio" | "mute"> = { auto: "auto", audio: "audio", mute: "mute" };

const FALLBACK_ON = new Set([
  "error.api.fetch.fail",
  "error.api.fetch.empty",
  "error.api.fetch.critical",
  "error.api.content.post.unavailable",
]);

function extOf(url: string, type: MediaItem["type"]): string {
  const m = url.match(/\.(mp4|webm|jpg|jpeg|png|gif|mp3|m4a|ogg)(?:$|\?)/i);
  if (m) return m[1].toLowerCase().replace("jpeg", "jpg");
  return type === "photo" ? "jpg" : type === "audio" ? "mp3" : "mp4";
}

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

async function callInstance(base: string, url: string, mode: Mode, quality: string): Promise<unknown> {
  const r = await fetch(base.replace(/\/$/, "") + "/", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      downloadMode: MODE_MAP[mode],
      videoQuality: quality,
      audioFormat: "mp3",
      filenameStyle: "classic",
    }),
    signal: AbortSignal.timeout(120_000),
  });
  return r.json();
}

function toResult(payload: unknown, service: Service): ResolveResult {
  const raw = record(payload);
  const st = raw.status;

  if ((st === "redirect" || st === "tunnel") && typeof raw.url === "string" && raw.url) {
    const filename = typeof raw.filename === "string" && raw.filename ? raw.filename : `${service}_download.mp4`;
    const type: MediaItem["type"] = /\.(mp3|m4a|ogg)$/i.test(filename)
      ? "audio"
      : /\.(jpg|jpeg|png|gif)$/i.test(filename)
      ? "photo"
      : "video";
    return { kind: "single", service, item: { type, url: raw.url, filename } };
  }

  if (st === "picker" && Array.isArray(raw.picker)) {
    const items: MediaItem[] = raw.picker.flatMap((entry: unknown, i: number): MediaItem[] => {
      const p = record(entry);
      if (typeof p.url !== "string" || !p.url) return [];
      const type: MediaItem["type"] = p.type === "photo" ? "photo" : p.type === "gif" ? "gif" : "video";
      return [{
        type,
        url: p.url,
        thumb: typeof p.thumb === "string" ? p.thumb : undefined,
        filename: `${service}_item_${i + 1}.${extOf(p.url, type)}`,
      }];
    });
    const audio: MediaItem | undefined = typeof raw.audio === "string" && raw.audio
      ? { type: "audio", url: raw.audio, filename: typeof raw.audioFilename === "string" && raw.audioFilename ? raw.audioFilename : `${service}_audio.mp3` }
      : undefined;
    if (items.length) return { kind: "album", service, items, audio };
  }

  if (st === "local-processing") {
    // only happens when the instance has local processing forced on. we do not enable it.
    return {
      kind: "error",
      service,
      code: "local-processing",
      message: "This video needs server processing which is not enabled.",
      retryable: false,
    };
  }

  const error = record(raw.error);
  const code = typeof error.code === "string" && error.code ? error.code : "unknown";
  let known = ERRORS[code];
  if (!known) {
    // families we have not listed one by one
    if (code.startsWith("error.api.content.")) known = { message: "This content cannot be fetched (private, removed or blocked in this region).", retryable: false };
    else if (code.startsWith("error.api.fetch.")) known = { message: "The site refused the request. Please try again.", retryable: true };
    else if (code.startsWith("error.api.link.")) known = { message: "This type of link is not supported.", retryable: false };
    else if (code.startsWith("error.api.youtube.")) known = { message: "YouTube refused this request right now.", retryable: true };
    else known = { message: "Could not fetch this link.", retryable: true };
    console.error("[cobalt] unmapped error code:", code, JSON.stringify(error.context || {}));
  }
  return { kind: "error", service, code, ...known };
}

// GET the tunnel and wait for the first chunk. true = data flows, false = empty/timeout.
async function tunnelHasBytes(url: string, timeoutMs = 20_000): Promise<boolean> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const r = await fetch(url, { signal: ac.signal, headers: { range: "bytes=0-65535" } });
    if (!r.ok && r.status !== 206) return false;
    if (!r.body) return false;
    const reader = r.body.getReader();
    const { value, done } = await reader.read();
    reader.cancel().catch(() => {});
    return !done && !!value && value.byteLength > 0;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

export async function resolveWithCobalt(
  url: string,
  service: Service,
  mode: Mode = "auto",
  quality = "1080",
): Promise<ResolveResult> {
  let raw: unknown;
  try {
    raw = await callInstance(COBALT_URL, url, mode, quality);
  } catch {
    return {
      kind: "error",
      service,
      code: "instance.unreachable",
      message: "Downloader is offline right now. Please try again shortly.",
      retryable: false,
    };
  }

  let result = toResult(raw, service);

  // optional second instance (proxied) for platforms that refuse the first ip
  if (result.kind === "error" && COBALT_PROXY_URL && FALLBACK_ON.has(result.code)) {
    try {
      const raw2 = await callInstance(COBALT_PROXY_URL, url, mode, quality);
      const r2 = toResult(raw2, service);
      if (r2.kind !== "error") result = r2;
    } catch {
      /* keep first error */
    }
  }

  // youtube tunnels can come back "ok" but stream nothing (blocked stream fetch / broken merge).
  // probe the first bytes so that case is treated as a failure too.
  if (result.kind === "single" && service === "youtube" && /\/tunnel\?/.test(result.item.url)) {
    const alive = await tunnelHasBytes(result.item.url);
    if (!alive) {
      console.error("[cobalt] youtube tunnel returned no bytes, switching to yt-dlp");
      result = { kind: "error", service, code: "cobalt.empty_tunnel", message: "YouTube stream was empty.", retryable: true };
    }
  }

  // youtube only: second engine when cobalt could not deliver
  if (result.kind === "error" && service === "youtube") {
    try {
      const { resolveWithYtdlp } = await import("./ytdlp");
      const alt = await resolveWithYtdlp(url, mode, quality);
      if (alt.kind !== "error") return alt;
      result = alt;
    } catch {
      /* keep cobalt's error */
    }
  }

  return result;
}
