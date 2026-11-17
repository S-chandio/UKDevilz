// lib/ytdlp.ts
// YouTube fallback engine (used only when cobalt fails on a YouTube link).
// Rule: whoever looks up the link streams the file. Nothing is handed to the visitor's browser.
//
// Attempt order:
//   1. direct (server ip, no cookies)
//   2. direct + cookies       (YTDLP_COOKIES file, if present)
//   3. proxy  + cookies       (YTDLP_PROXY pool, random pick) -> result tagged viaProxy so
//                              /api/download, /api/audio, /api/merge fetch through the same proxy
//
// Output: one pre-muxed file, or a video stream + audio stream that /api/merge joins with ffmpeg.
//
// env (ukdevlizlive/.env.local or production env):
//   YTDLP_PATH=yt-dlp                       optional, default: yt-dlp on PATH
//   YTDLP_COOKIES=../youtube-cookies.txt    optional, relative to the site folder
//   YTDLP_PROXY=http://...,http://...       optional, comma separated pool

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import type { ResolveResult, MediaItem, Mode } from "./cobalt";

const YTDLP_PATH = process.env.YTDLP_PATH || "yt-dlp";
// These are operator-installed runtime dependencies, not files to bundle into the site.
const COOKIES = process.env.YTDLP_COOKIES ? path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.YTDLP_COOKIES) : "";
const PROXIES = (process.env.YTDLP_PROXY || "").split(",").map((x) => x.trim()).filter(Boolean);
const TIMEOUT_MS = 60_000;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

export const pickProxy = () => PROXIES[Math.floor(Math.random() * PROXIES.length)] || "";
const hasCookies = () => !!COOKIES && existsSync(COOKIES);

function formatFor(quality: string, mode: Mode): string {
  if (mode === "audio") return "bestaudio[ext=m4a]/bestaudio";
  const h = quality === "max" ? 2160 : Math.min(parseInt(quality, 10) || 720, 2160);
  // pre-muxed mp4 first; else best mp4 video + m4a audio (merged server side by /api/merge)
  return `best[ext=mp4][height<=${h}][acodec!=none][vcodec!=none]/bestvideo[ext=mp4][height<=${h}]+bestaudio[ext=m4a]/best[height<=${h}]`;
}

function videoId(url: string): string {
  const m = url.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : "video";
}

function run(args: string[]): Promise<{ code: number; out: string; err: string }> {
  return new Promise((resolve) => {
    const p = spawn(/* turbopackIgnore: true */ YTDLP_PATH, args, { stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
    let out = "", err = "";
    const t = setTimeout(() => p.kill("SIGKILL"), TIMEOUT_MS);
    p.stdout.on("data", (d) => (out += d.toString()));
    p.stderr.on("data", (d) => (err += d.toString()));
    p.on("error", (e) => { clearTimeout(t); resolve({ code: -1, out, err: String(e) }); });
    p.on("close", (code) => { clearTimeout(t); resolve({ code: code ?? -1, out, err }); });
  });
}

async function attempt(url: string, mode: Mode, quality: string, opts: { proxy?: string; cookies?: boolean }) {
  const args = [
    "--no-playlist", "--no-warnings", "--quiet",
    "--extractor-retries", "1", "--retries", "1",
    "--user-agent", UA,
    "-f", formatFor(quality, mode),
    "--print", "%(id)s\t%(height)s\t%(ext)s",
    "--print", "urls",
  ];
  if (opts.proxy) args.push("--proxy", opts.proxy);
  if (opts.cookies && hasCookies()) args.push("--cookies", COOKIES);
  args.push(url);
  return run(args);
}

function classify(err: string, code: number): { code: string; message: string; retryable: boolean } {
  const e = err.toLowerCase();
  if (code === -1) return { code: "ytdlp.missing", message: "Downloader is offline right now.", retryable: false };
  if (e.includes("sign in") || e.includes("bot")) return { code: "ytdlp.bot", message: "YouTube is asking for verification right now. Try again in a few minutes.", retryable: true };
  if (e.includes("private")) return { code: "ytdlp.private", message: "This video is private.", retryable: false };
  if (e.includes("age")) return { code: "ytdlp.age", message: "This video is age restricted.", retryable: false };
  if (e.includes("unavailable") || e.includes("removed")) return { code: "ytdlp.unavailable", message: "This video is unavailable.", retryable: false };
  return { code: "ytdlp.fail", message: "YouTube did not return this video. Try again shortly.", retryable: true };
}

export async function resolveWithYtdlp(url: string, mode: Mode, quality = "1080"): Promise<ResolveResult> {
  const plan: { label: string; proxy?: string; cookies?: boolean }[] = [
    { label: "direct" },
    ...(hasCookies() ? [{ label: "direct+cookies", cookies: true }] : []),
    ...(PROXIES.length ? [{ label: "proxy", proxy: pickProxy(), cookies: true }] : []),
  ];

  let last = { code: -1, out: "", err: "no attempts" };
  let viaProxy = false;
  for (const step of plan) {
    const r = await attempt(url, mode, quality, step);
    if (r.code === 0 && r.out.trim()) { last = r; viaProxy = !!step.proxy; break; }
    console.error(`[ytdlp] ${step.label} failed:`, r.err.slice(-200).replace(/\s+/g, " "));
    last = r;
    // do not keep hammering on hard failures
    const c = classify(r.err, r.code).code;
    if (c === "ytdlp.private" || c === "ytdlp.unavailable" || c === "ytdlp.missing") break;
  }

  if (last.code !== 0 || !last.out.trim()) {
    const c = classify(last.err, last.code);
    return { kind: "error", service: "youtube", ...c };
  }

  // line 1: id \t height \t ext ; following lines: one url per stream (1 = pre-muxed, 2 = video + audio)
  const lines = last.out.trim().split("\n").map((l) => l.trim()).filter(Boolean);
  const [id, height, ext] = (lines.shift() || "").split("\t");
  const urls = lines.filter((l) => l.startsWith("http"));
  if (!urls.length) {
    return { kind: "error", service: "youtube", code: "ytdlp.nourl", message: "Could not get a download link for this video.", retryable: true };
  }

  const vid = id || videoId(url);
  const q = height && height !== "NA" ? `${height}p` : "video";

  if (mode === "audio") {
    const item: MediaItem = { type: "audio", url: urls[0], filename: `youtube_${vid}.${ext || "m4a"}`, viaProxy };
    return { kind: "single", service: "youtube", item };
  }

  const item: MediaItem = {
    type: "video",
    url: urls[0],
    audioUrl: urls[1],                       // present only when a merge is needed
    filename: `youtube_${vid}_${q}.mp4`,
    viaProxy,
  };
  return { kind: "single", service: "youtube", item };
}
