"use client";
// app/grab.tsx
// Universal downloader block: link bar + result view.
// All previews/downloads go through /api/download (video, photo) or /api/audio (mp3),
// so cobalt's internal urls never reach the browser.

import { useEffect, useRef, useState } from "react";
import type { ResolveResult, MediaItem, Mode } from "@/lib/cobalt";

const MODES: { id: Mode; label: string }[] = [
  { id: "auto", label: "Auto" },
  { id: "audio", label: "Audio only" },
  { id: "mute", label: "No sound" },
];

const YT_QUALITIES = [
  { id: "360", label: "360p" },
  { id: "720", label: "720p" },
  { id: "1080", label: "1080p" },
  { id: "max", label: "Best" },
];

const SERVICE_LABEL: Record<string, string> = {
  instagram: "Instagram", facebook: "Facebook", youtube: "YouTube", tiktok: "TikTok",
  twitter: "X", snapchat: "Snapchat", pinterest: "Pinterest", vk: "VK",
  soundcloud: "SoundCloud", dailymotion: "Dailymotion", bilibili: "Bilibili", unknown: "",
};

const MAX_WAIT_MS = 120_000;
const WAIT_MESSAGES: [number, string][] = [
  [0, "Requesting the media..."],
  [8_000, "Waiting for the retrieval service..."],
  [25_000, "Processing is still in progress."],
  [60_000, "This request is taking longer. Please wait for a result or a timeout message."],
];
const FAIL_MESSAGE = "The request timed out before a result arrived. Wait briefly before trying the source link again.";

// mascot per state (animated webp + a "-still" copy for visitors who turn animations off)
const STATE_ART = {
  loading: "/images/states/devil-running-loading",
  broken: "/images/states/devil-sitting-broken-link",
  failed: "/images/states/devil-tired-failed",
} as const;

// broken: the link itself is the problem. failed: the link is fine but the file could not be fetched.
// errors raised in the browser (timeout, no connection) have no code and count as failed.
function errorKind(code?: string): "broken" | "failed" {
  if (!code) return "failed";
  if (code === "unsupported" || code === "no_url" || code.startsWith("error.api.link.")) return "broken";
  if (code === "error.api.fetch.empty" || code === "error.api.content.post.unavailable") return "broken";
  return "failed";
}

function StateArt({ kind }: { kind: keyof typeof STATE_ART }) {
  const base = STATE_ART[kind];
  return (
    <picture className="shrink-0">
      <source srcSet={`${base}-still.webp`} media="(prefers-reduced-motion: reduce)" />
      <img src={`${base}.webp`} alt="" width={80} height={80} className="h-16 w-16 md:h-20 md:w-20" />
    </picture>
  );
}

// url helpers
const px = (p?: boolean) => (p ? "&p=1" : "");
export const dl = (url: string, name: string, p?: boolean) =>
  `/api/download?u=${encodeURIComponent(url)}&name=${encodeURIComponent(name)}${px(p)}`;
export const view = (url: string, p?: boolean) => `/api/download?u=${encodeURIComponent(url)}&inline=1${px(p)}`;
export const mp3 = (url: string, name: string, p?: boolean) =>
  `/api/audio?u=${encodeURIComponent(url)}&name=${encodeURIComponent(name.replace(/\.[a-z0-9]+$/i, "") + ".mp3")}${px(p)}`;
export const merge = (v: string, a: string, name: string, p?: boolean) =>
  `/api/merge?v=${encodeURIComponent(v)}&a=${encodeURIComponent(a)}&name=${encodeURIComponent(name)}${px(p)}`;
// video button target: merged when two streams, plain when one
export const videoHref = (it: MediaItem) => (it.audioUrl ? merge(it.url, it.audioUrl, it.filename, it.viaProxy) : dl(it.url, it.filename, it.viaProxy));
export const audioHref = (it: MediaItem) => mp3(it.audioUrl || it.url, it.filename, it.viaProxy);

function youtubeId(u: string): string | null {
  try {
    const x = new URL(u.startsWith("http") ? u : "https://" + u);
    const h = x.hostname.replace(/^www\.|^m\./, "");
    if (h === "youtu.be") return x.pathname.slice(1).split("/")[0] || null;
    if (h.endsWith("youtube.com")) {
      const v = x.searchParams.get("v");
      if (v) return v;
      const m = x.pathname.match(/\/(shorts|embed|live)\/([A-Za-z0-9_-]{11})/);
      if (m) return m[2];
    }
  } catch {}
  return null;
}

function tiktokId(u: string): string | null {
  const m = u.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/) || u.match(/tiktok\.com\/video\/(\d+)/);
  return m ? m[1] : null;
}

// official embeds for platforms whose files come as cobalt tunnels (no seeking) or who allow it freely.
// returns null when the inline <video>/<img> should be used instead.
function embedFor(service: string, sourceUrl: string): { src: string; ratio: "video" | "portrait" | "audio"; allow?: string } | null {
  let u: URL;
  try { u = new URL(sourceUrl.startsWith("http") ? sourceUrl : "https://" + sourceUrl); } catch { return null; }
  const path = u.pathname;

  if (service === "youtube") {
    const id = youtubeId(sourceUrl);
    return id ? { src: `https://www.youtube-nocookie.com/embed/${id}?rel=0`, ratio: "video", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" } : null;
  }
  if (service === "tiktok") {
    const id = tiktokId(sourceUrl);
    return id ? { src: `https://www.tiktok.com/embed/v2/${id}`, ratio: "portrait", allow: "encrypted-media; picture-in-picture" } : null;
  }
  // vk: no embed. video_ext.php needs a per-video hash from the page, otherwise the player is black.
  if (service === "dailymotion") {
    const m = path.match(/\/video\/([A-Za-z0-9]+)/) || (u.hostname === "dai.ly" ? path.match(/^\/([A-Za-z0-9]+)/) : null);
    return m ? { src: `https://www.dailymotion.com/embed/video/${m[1]}?queue-enable=false`, ratio: "video", allow: "autoplay; fullscreen; picture-in-picture" } : null;
  }
  if (service === "bilibili") {
    const m = path.match(/\/video\/(BV[A-Za-z0-9]+)/);
    return m ? { src: `https://player.bilibili.com/player.html?bvid=${m[1]}&autoplay=0&high_quality=1`, ratio: "video", allow: "autoplay; fullscreen; picture-in-picture" } : null;
  }
  if (service === "soundcloud") {
    return { src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(u.origin + path)}&visual=false&show_comments=false&hide_related=true`, ratio: "audio", allow: "autoplay" };
  }
  return null;
}

function isYouTube(u: string) {
  return /(^|\.)(youtube\.com|youtu\.be)/i.test((() => { try { return new URL(u.startsWith("http") ? u : "https://" + u).hostname; } catch { return ""; } })());
}

interface GrabProps {
  placeholder?: string;
  initialMode?: Mode;
  showModes?: boolean;
  submitLabel?: string;
}

export default function Grab({ placeholder = "Paste a link here", initialMode = "auto", showModes = true, submitLabel }: GrabProps) {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<Mode>(initialMode);
  const [quality, setQuality] = useState("1080");
  const [busy, setBusy] = useState(false);
  const [waitMsg, setWaitMsg] = useState(WAIT_MESSAGES[0][1]);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [result, setResult] = useState<ResolveResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const warmed = useRef(false);

  // the loading mascot is the heaviest file; fetch it once the visitor shows intent so it is ready on submit
  function warmLoadingArt() {
    if (warmed.current) return;
    warmed.current = true;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    new window.Image().src = `${STATE_ART.loading}${still ? "-still" : ""}.webp`;
  }

  const yt = isYouTube(url);

  // wait messages + timer while busy
  useEffect(() => {
    if (!busy) return;
    const start = Date.now();
    const t = setInterval(() => {
      const e = Date.now() - start;
      setElapsed(Math.floor(e / 1000));
      const m = [...WAIT_MESSAGES].reverse().find(([at]) => e >= at);
      if (m) setWaitMsg(m[1]);
    }, 500);
    return () => clearInterval(t);
  }, [busy]);

  function reset() {
    abortRef.current?.abort();
    setUrl("");
    setError(null);
    setResult(null);
    setBusy(false);
    inputRef.current?.focus();
  }

  async function paste() {
    try {
      const t = (await navigator.clipboard.readText()).trim();
      if (!t) return;
      setUrl(t);
      if (window.matchMedia("(max-width: 640px)").matches) submit(t);
    } catch {
      inputRef.current?.focus();
    }
  }

  async function submit(value?: string) {
    const u = (value ?? url).trim();
    if (!u || busy) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setElapsed(0);
    setWaitMsg(WAIT_MESSAGES[0][1]);

    const ac = new AbortController();
    abortRef.current = ac;
    const killer = setTimeout(() => ac.abort(), MAX_WAIT_MS);

    try {
      const r = await fetch("/api/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: u, mode, quality: isYouTube(u) ? quality : "1080" }),
        signal: ac.signal,
      });
      const data: ResolveResult = await r.json();
      if (data.kind === "error") setError({ message: data.message, code: data.code });
      else setResult(data);
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") setError({ message: FAIL_MESSAGE });
      else setError({ message: "The request could not reach the server. Check your connection and try again." });
    } finally {
      clearTimeout(killer);
      setBusy(false);
    }
  }

  return (
    <div className="w-full">
      {/* ---------- bar ---------- */}
      <form
        onSubmit={(e) => { e.preventDefault(); submit(); }}
        onPointerEnter={warmLoadingArt}
        className="raised flex h-14 w-full overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] focus-within:border-[var(--ink)] md:h-16"
      >
        <input
          ref={inputRef}
          type="url"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          value={url}
          disabled={busy}
          onFocus={warmLoadingArt}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={placeholder}
          aria-label="Media link"
          className="min-w-0 flex-1 bg-transparent px-4 text-base outline-none placeholder:text-[var(--muted)] disabled:opacity-60 md:px-5 md:text-lg"
        />
        {url && !busy && (
          <button type="button" onClick={reset} aria-label="Clear" className="px-3 text-xl text-[var(--muted)] hover:text-[var(--ink)]">
            &times;
          </button>
        )}
        <button
          type="submit"
          disabled={busy || !url}
          aria-label="Download"
          className="neon my-1.5 mr-1.5 flex w-14 shrink-0 items-center justify-center text-xl font-bold md:w-[4.5rem]"
        >
          {busy ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" /> : <span aria-hidden="true">{submitLabel || ">>"}</span>}
        </button>
      </form>

      {/* ---------- options row ---------- */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {showModes && (
          <div role="radiogroup" aria-label="Download mode" className="flex rounded-full border border-[var(--line)] bg-[var(--surface)] p-1">
            {MODES.map((m) => {
              const on = m.id === mode;
              return (
                <button key={m.id} type="button" role="radio" aria-checked={on} disabled={busy} onClick={() => setMode(m.id)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-60 ${on ? "bg-[var(--ink)] text-[var(--paper)]" : "text-[var(--muted)] hover:text-[var(--ink)]"}`}>
                  {m.label}
                </button>
              );
            })}
          </div>
        )}

        {yt && mode !== "audio" && (
          <div role="radiogroup" aria-label="Video quality" className="flex rounded-full border border-[var(--line)] bg-[var(--surface)] p-1">
            {YT_QUALITIES.map((q) => {
              const on = q.id === quality;
              return (
                <button key={q.id} type="button" role="radio" aria-checked={on} disabled={busy} onClick={() => setQuality(q.id)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-60 ${on ? "bg-[var(--ink)] text-[var(--paper)]" : "text-[var(--muted)] hover:text-[var(--ink)]"}`}>
                  {q.label}
                </button>
              );
            })}
          </div>
        )}

        <button type="button" onClick={paste} disabled={busy} className="neon ml-auto px-4 py-1.5 text-sm font-medium">
          Paste
        </button>
      </div>

      {/* ---------- loading ---------- */}
      {busy && (
        <div className="mt-4 flex items-center gap-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-left text-sm" aria-live="polite">
          <StateArt kind="loading" />
          <span className="flex-1">{waitMsg}</span>
          <span className="text-[var(--muted)]">{elapsed}s</span>
        </div>
      )}

      {/* ---------- error: sitting devil for a broken link, tired devil when fetching failed ---------- */}
      {error && !busy && (
        <div role="alert" className="mt-4 flex items-center gap-4 rounded-xl border border-[var(--accent)]/40 bg-[var(--surface)] px-4 py-2 text-left text-sm">
          <StateArt kind={errorKind(error.code)} />
          <span>{error.message}</span>
        </div>
      )}

      {/* ---------- results ---------- */}
      {!busy && result?.kind === "single" && <SingleCard service={result.service} item={result.item} sourceUrl={url} onReset={reset} />}
      {!busy && result?.kind === "album" && <AlbumGrid service={result.service} items={result.items} audio={result.audio} onReset={reset} />}
    </div>
  );
}

/* ---------- shared buttons ---------- */
// every action button is a neon button (colour picked at random per visit, see components/NeonPalette.tsx)
const NEON_BTN = "neon inline-flex h-10 items-center justify-center gap-1.5 px-4 text-sm font-bold";

function Btn({ href, name, children }: { href: string; name: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <a href={href} download={name} className={NEON_BTN}>
      {children}
    </a>
  );
}

/* =========================================================
   single file card
   ========================================================= */
function SingleCard({ service, item, sourceUrl, onReset }: { service: string; item: MediaItem; sourceUrl: string; onReset: () => void }) {
  const [previewFailed, setPreviewFailed] = useState(false);
  const label = SERVICE_LABEL[service] || service;
  const embed = embedFor(service, sourceUrl);
  const embedded = !!embed;

  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)]">
      {embed && (
        <div
          className={
            embed.ratio === "portrait"
              ? "mx-auto w-full max-w-[340px] bg-[var(--surface)]"
              : embed.ratio === "audio"
              ? "w-full"
              : "aspect-video w-full bg-black"
          }
        >
          <iframe
            src={embed.src}
            title={`${SERVICE_LABEL[service] || service} preview`}
            allow={embed.allow}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            scrolling="no"
            className={embed.ratio === "portrait" ? "h-[600px] w-full" : embed.ratio === "audio" ? "h-[166px] w-full" : "h-full w-full"}
          />
        </div>
      )}
      {!embedded && !previewFailed && item.type === "video" && (
        <video controls playsInline preload="metadata" poster={item.thumb ? view(item.thumb) : undefined} src={view(item.url)} onError={() => setPreviewFailed(true)} className="max-h-[70vh] w-full bg-black" />
      )}
      {!embedded && !previewFailed && item.type === "photo" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={view(item.url)} alt="" onError={() => setPreviewFailed(true)} className="max-h-[70vh] w-full bg-black object-contain" />
      )}
      {!embedded && !previewFailed && item.type === "audio" && (
        <div className="p-4"><audio controls preload="metadata" src={view(item.url)} onError={() => setPreviewFailed(true)} className="w-full" /></div>
      )}
      {!embedded && previewFailed && (
        <div className="flex h-40 items-center justify-center bg-[var(--paper)] text-sm text-[var(--muted)]">Preview unavailable. You can still try the file button below.</div>
      )}

      <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--muted)]">{label} {item.type}</p>
          <p className="truncate text-sm font-medium" title={item.filename}>{item.filename}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {item.type === "video" && (
            <>
              <Btn primary href={videoHref(item)} name={item.filename}>MP4</Btn>
              <Btn href={audioHref(item)} name={item.filename.replace(/\.[a-z0-9]+$/i, ".mp3")}>MP3</Btn>
            </>
          )}
          {item.type === "photo" && <Btn primary href={dl(item.url, item.filename, item.viaProxy)} name={item.filename}>JPG</Btn>}
          {item.type === "audio" && <Btn primary href={mp3(item.url, item.filename, item.viaProxy)} name={item.filename.replace(/\.[a-z0-9]+$/i, ".mp3")}>MP3</Btn>}
          <CopyLink href={item.type === "video" ? videoHref(item) : dl(item.url, item.filename, item.viaProxy)} />
          <button type="button" onClick={onReset} className={NEON_BTN}>
            New link
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- copy the site's download link (works in other apps / share) ---------- */
function CopyLink({ href }: { href: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(new URL(href, window.location.origin).toString());
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch {}
  }
  return (
    <button type="button" onClick={copy} className={NEON_BTN}>
      {done ? "Copied" : "Copy link"}
    </button>
  );
}

/* =========================================================
   album / carousel grid
   ========================================================= */
function AlbumGrid({ service, items, audio, onReset }: { service: string; items: MediaItem[]; audio?: MediaItem; onReset: () => void }) {
  const label = SERVICE_LABEL[service] || service;
  const [busyAll, setBusyAll] = useState(false);

  async function downloadAll() {
    setBusyAll(true);
    for (const it of items) {
      const a = document.createElement("a");
      a.href = dl(it.url, it.filename);
      a.download = it.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      await new Promise((r) => setTimeout(r, 700));
    }
    setBusyAll(false);
  }

  return (
    <div className="mt-5 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">{label}: {items.length} {items.length === 1 ? "item" : "items"}</p>
        <div className="flex gap-2">
          <button type="button" onClick={downloadAll} disabled={busyAll} className={NEON_BTN}>
            {busyAll ? "Starting..." : "Download all"}
          </button>
          <button type="button" onClick={onReset} className={NEON_BTN}>
            New link
          </button>
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((it, i) => {
          const isVideo = it.type === "video" || it.type === "gif";
          return (
            <li key={i} className="overflow-hidden rounded-lg border border-[var(--line)]">
              <div className="relative aspect-[4/5] bg-black">
                {isVideo ? (
                  <video controls playsInline preload="none" poster={it.thumb ? view(it.thumb) : undefined} src={view(it.url)} className="h-full w-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={view(it.thumb || it.url)} alt="" loading="lazy" className="h-full w-full object-cover"
                    onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = "hidden")} />
                )}
                <span className="absolute left-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white">{i + 1}/{items.length}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 p-2">
                {isVideo ? (
                  <>
                    <Btn primary href={dl(it.url, it.filename)} name={it.filename}>MP4</Btn>
                    <Btn href={mp3(it.url, it.filename)} name={it.filename.replace(/\.[a-z0-9]+$/i, ".mp3")}>MP3</Btn>
                  </>
                ) : (
                  <Btn primary href={dl(it.url, it.filename)} name={it.filename}>JPG</Btn>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {audio && (
        <div className="mt-3 flex items-center justify-between rounded-lg border border-[var(--line)] px-3 py-2 text-sm">
          <span>Returned audio</span>
          <Btn href={dl(audio.url, audio.filename)} name={audio.filename}>MP3</Btn>
        </div>
      )}
    </div>
  );
}
