// app/api/download/route.ts
// GET  /api/download?u=<encoded url>&name=<filename>          -> save as file
// GET  /api/download?u=<encoded url>&inline=1                  -> preview (video/img/audio src)
// HEAD supported. Streams through the site so cobalt tunnels and cdn links work for the visitor.

import { NextRequest, NextResponse } from "next/server";
import { proxyAgent, ALLOWED_HOST_SUFFIXES, hostAllowed } from "@/lib/proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COBALT_URL = process.env.COBALT_URL || "http://127.0.0.1:9000";
const COBALT_PROXY_URL = process.env.COBALT_PROXY_URL || "";

const ALLOWED = ALLOWED_HOST_SUFFIXES([
  new URL(COBALT_URL).hostname,
  ...(COBALT_PROXY_URL ? [new URL(COBALT_PROXY_URL).hostname] : []),
]);

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const FIRST_BYTE_TIMEOUT_MS = 30_000;

const EXT_BY_TYPE: Record<string, string> = {
  "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov",
  "image/jpeg": "jpg", "image/png": "png", "image/gif": "gif", "image/webp": "webp",
  "audio/mpeg": "mp3", "audio/mp4": "m4a", "audio/ogg": "ogg", "audio/wav": "wav",
};

function safeName(name: string, contentType: string) {
  let n = (name || "download").replace(/[\\/:*?"<>|\r\n]+/g, "_").trim().slice(0, 150);
  if (!/\.[a-z0-9]{2,5}$/i.test(n)) {
    const ext = EXT_BY_TYPE[contentType.split(";")[0].trim().toLowerCase()];
    if (ext) n += "." + ext;
  }
  return n || "download";
}

function disposition(kind: "attachment" | "inline", name: string) {
  const ascii = name.replace(/[^\x20-\x7E]/g, "_");
  return `${kind}; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(name)}`;
}

async function handle(req: NextRequest, method: "GET" | "HEAD") {
  const u = req.nextUrl.searchParams.get("u") || "";
  const rawName = req.nextUrl.searchParams.get("name") || "download";
  const inline = req.nextUrl.searchParams.get("inline") === "1";
  const viaProxy = req.nextUrl.searchParams.get("p") === "1" && !!proxyAgent;

  let target: URL;
  try {
    target = new URL(u);
  } catch {
    return NextResponse.json({ error: "bad url" }, { status: 400 });
  }
  if (!/^https?:$/.test(target.protocol) || !hostAllowed(target.hostname, ALLOWED)) {
    return NextResponse.json({ error: "host not allowed" }, { status: 403 });
  }

  // cap time-to-first-byte; upstream is cancelled later only if the browser stops reading
  const ac = new AbortController();
  const firstByteTimer = setTimeout(() => ac.abort(), FIRST_BYTE_TIMEOUT_MS);

  const headers: Record<string, string> = { "user-agent": UA };
  const range = req.headers.get("range");
  if (range) headers["range"] = range;

  let upstream: Response;
  try {
    upstream = await fetch(target.toString(), {
      method, headers, redirect: "follow", signal: ac.signal,
      ...(viaProxy ? { dispatcher: proxyAgent } : {}),
    });
  } catch (e: unknown) {
    clearTimeout(firstByteTimer);
    const status = e instanceof Error && e.name === "AbortError" ? 504 : 502;
    return NextResponse.json({ error: status === 504 ? "source timed out" : "source unreachable" }, { status });
  }
  clearTimeout(firstByteTimer);

  if (!upstream.ok && upstream.status !== 206) {
    const expired = [403, 404, 410].includes(upstream.status);
    return NextResponse.json(
      { error: expired ? "link expired, fetch the post again" : `source error ${upstream.status}` },
      { status: expired ? 410 : 502 },
    );
  }

  const contentType = upstream.headers.get("content-type") || "application/octet-stream";
  const name = safeName(rawName, contentType);

  const out = new Headers();
  out.set("Content-Type", contentType);
  out.set("Content-Disposition", disposition(inline ? "inline" : "attachment", name));
  out.set("Cache-Control", inline ? "private, max-age=300" : "no-store");
  out.set("Accept-Ranges", upstream.headers.get("accept-ranges") || "bytes");
  out.set("X-Content-Type-Options", "nosniff");

  // only forward length if the body was not transparently decompressed
  if (!upstream.headers.get("content-encoding")) {
    const len = upstream.headers.get("content-length");
    if (len) out.set("Content-Length", len);
  }
  const cr = upstream.headers.get("content-range");
  if (cr) out.set("Content-Range", cr);

  if (method === "HEAD" || !upstream.body) {
    return new NextResponse(null, { status: upstream.status, headers: out });
  }

  // pipe upstream -> browser; if the browser cancels, abort the upstream fetch
  const reader = upstream.body.getReader();
  const body = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) controller.close();
      else controller.enqueue(value);
    },
    cancel() {
      ac.abort();
      reader.cancel().catch(() => {});
    },
  });
  return new NextResponse(body, { status: upstream.status, headers: out });
}

export async function GET(req: NextRequest) {
  return handle(req, "GET");
}

export async function HEAD(req: NextRequest) {
  return handle(req, "HEAD");
}
