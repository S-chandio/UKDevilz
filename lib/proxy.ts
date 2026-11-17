// lib/proxy.ts
// shared: the proxy used for ip-locked youtube links (same pool as yt-dlp lookups).
// routes read ?p=1 and fetch through it so the ip matches the lookup.
import { ProxyAgent } from "undici";

const PROXIES = (process.env.YTDLP_PROXY || "").split(",").map((x) => x.trim()).filter(Boolean);
// sticky: one agent for the process so all file fetches use the same exit as much as the pool allows
export const FILE_PROXY = PROXIES[0] || "";
export const proxyAgent = FILE_PROXY ? new ProxyAgent(FILE_PROXY) : null;

export const ALLOWED_HOST_SUFFIXES = (cobaltHosts: string[]) => [
  ...cobaltHosts, "localhost", "127.0.0.1",
  "cdninstagram.com", "fbcdn.net", "twimg.com", "tiktokcdn.com", "tiktokcdn-us.com",
  "tiktok.com", "googlevideo.com", "sc-cdn.net", "pinimg.com", "vkuservideo.net",
  "userapi.com", "rutube.ru", "sndcdn.com", "dmcdn.net", "bilivideo.com", "hdslb.com", "akamaized.net",
];
export const hostAllowed = (h: string, list: string[]) => list.some((s) => h === s || h.endsWith("." + s));
export const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";