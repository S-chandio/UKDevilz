// app/api/audio/route.ts
// GET /api/audio?u=<video url>&name=<file.mp3>
// Pulls the video and converts to mp3 on the fly with ffmpeg, streamed to the browser.
// npm i ffmpeg-static   and add  serverExternalPackages: ["ffmpeg-static"]  in next.config

import { NextRequest, NextResponse } from "next/server";
import { spawn } from "node:child_process";
import ffmpegPath from "ffmpeg-static";
import { FILE_PROXY, ALLOWED_HOST_SUFFIXES, hostAllowed } from "@/lib/proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COBALT_URL = process.env.COBALT_URL || "http://127.0.0.1:9000";
const COBALT_PROXY_URL = process.env.COBALT_PROXY_URL || "";
const ALLOWED = ALLOWED_HOST_SUFFIXES([
  new URL(COBALT_URL).hostname,
  ...(COBALT_PROXY_URL ? [new URL(COBALT_PROXY_URL).hostname] : []),
]);
const safeName = (n: string) => (n || "audio.mp3").replace(/[\\/:*?"<>|\r\n]+/g, "_").slice(0, 150);

export async function GET(req: NextRequest) {
  const u = req.nextUrl.searchParams.get("u") || "";
  const name = safeName(req.nextUrl.searchParams.get("name") || "audio.mp3");
  const bitrate = ["128", "192", "320"].includes(req.nextUrl.searchParams.get("br") || "") ? req.nextUrl.searchParams.get("br")! : "192";
  const viaProxy = req.nextUrl.searchParams.get("p") === "1" && !!FILE_PROXY;

  let target: URL;
  try { target = new URL(u); } catch { return NextResponse.json({ error: "bad url" }, { status: 400 }); }
  if (!/^https?:$/.test(target.protocol) || !hostAllowed(target.hostname, ALLOWED)) return NextResponse.json({ error: "host not allowed" }, { status: 403 });
  if (!ffmpegPath) return NextResponse.json({ error: "ffmpeg missing" }, { status: 500 });

  const args = [
    "-hide_banner", "-loglevel", "error",
    "-user_agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "-i", target.toString(),
    "-vn", "-acodec", "libmp3lame", "-b:a", `${bitrate}k`,
    "-f", "mp3", "pipe:1",
  ];
  const env = viaProxy ? { ...process.env, http_proxy: FILE_PROXY, https_proxy: FILE_PROXY } : process.env;
  const ff = spawn(ffmpegPath as string, args, { stdio: ["ignore", "pipe", "pipe"], env, windowsHide: true });

  let errBuf = "";
  ff.stderr.on("data", (d) => { errBuf += d.toString(); });

  let closed = false;
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const safe = (fn: () => void) => { if (closed) return; try { fn(); } catch { closed = true; } };
      ff.stdout.on("data", (chunk: Buffer) => safe(() => controller.enqueue(new Uint8Array(chunk))));
      ff.stdout.on("end", () => safe(() => { controller.close(); closed = true; }));
      ff.on("error", (e) => safe(() => { controller.error(e); closed = true; }));
      ff.on("close", (code) => { if (code !== 0 && errBuf) console.error("[audio] ffmpeg:", errBuf.slice(-500)); });
    },
    cancel() { closed = true; ff.kill("SIGKILL"); },
  });

  req.signal.addEventListener("abort", () => ff.kill("SIGKILL"));

  return new NextResponse(stream, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Disposition": `attachment; filename="${name}"; filename*=UTF-8''${encodeURIComponent(name)}`,
      "Cache-Control": "no-store",
    },
  });
}
