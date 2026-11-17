// app/api/merge/route.ts
// GET /api/merge?v=<video url>&a=<audio url>&name=<file.mp4>[&p=1]
// Joins a video-only and an audio-only stream into one mp4 with ffmpeg (stream copy, no re-encode)
// and streams it to the browser. Used for youtube via yt-dlp when no pre-muxed format exists.

import { NextRequest, NextResponse } from "next/server";
import { spawn } from "node:child_process";
import ffmpegPath from "ffmpeg-static";
import { ALLOWED_HOST_SUFFIXES, hostAllowed, FILE_PROXY, UA } from "@/lib/proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COBALT_URL = process.env.COBALT_URL || "http://127.0.0.1:9000";
const COBALT_PROXY_URL = process.env.COBALT_PROXY_URL || "";
const ALLOWED = ALLOWED_HOST_SUFFIXES([
  new URL(COBALT_URL).hostname,
  ...(COBALT_PROXY_URL ? [new URL(COBALT_PROXY_URL).hostname] : []),
]);
const safeName = (n: string) => (n || "video.mp4").replace(/[\\/:*?"<>|\r\n]+/g, "_").slice(0, 150);

export async function GET(req: NextRequest) {
  const v = req.nextUrl.searchParams.get("v") || "";
  const a = req.nextUrl.searchParams.get("a") || "";
  const name = safeName(req.nextUrl.searchParams.get("name") || "video.mp4");
  const viaProxy = req.nextUrl.searchParams.get("p") === "1" && !!FILE_PROXY;

  let vu: URL, au: URL;
  try { vu = new URL(v); au = new URL(a); } catch { return NextResponse.json({ error: "bad url" }, { status: 400 }); }
  if (!/^https?:$/.test(vu.protocol) || !/^https?:$/.test(au.protocol) || !hostAllowed(vu.hostname, ALLOWED) || !hostAllowed(au.hostname, ALLOWED)) {
    return NextResponse.json({ error: "host not allowed" }, { status: 403 });
  }
  if (!ffmpegPath) return NextResponse.json({ error: "ffmpeg missing" }, { status: 500 });

  const args = [
    "-hide_banner", "-loglevel", "error",
    "-user_agent", UA, "-i", vu.toString(),
    "-user_agent", UA, "-i", au.toString(),
    "-map", "0:v:0", "-map", "1:a:0",
    "-c", "copy",
    "-movflags", "frag_keyframe+empty_moov+faststart",
    "-f", "mp4", "pipe:1",
  ];
  const env = viaProxy ? { ...process.env, http_proxy: FILE_PROXY, https_proxy: FILE_PROXY } : process.env;
  const ff = spawn(ffmpegPath as string, args, { stdio: ["ignore", "pipe", "pipe"], env, windowsHide: true });

  let errBuf = "";
  ff.stderr.on("data", (d) => (errBuf += d.toString()));

  let closed = false;
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const safe = (fn: () => void) => { if (closed) return; try { fn(); } catch { closed = true; } };
      ff.stdout.on("data", (chunk: Buffer) => safe(() => controller.enqueue(new Uint8Array(chunk))));
      ff.stdout.on("end", () => safe(() => { controller.close(); closed = true; }));
      ff.on("error", (e) => safe(() => { controller.error(e); closed = true; }));
      ff.on("close", (code) => { if (code !== 0 && errBuf) console.error("[merge] ffmpeg:", errBuf.slice(-500)); });
    },
    cancel() { closed = true; ff.kill("SIGKILL"); },
  });

  return new NextResponse(stream, {
    status: 200,
    headers: {
      "Content-Type": "video/mp4",
      "Content-Disposition": `attachment; filename="${name}"; filename*=UTF-8''${encodeURIComponent(name)}`,
      "Cache-Control": "no-store",
    },
  });
}
