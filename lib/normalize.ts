// lib/normalize.ts
// Cleans a pasted link before it goes to cobalt.
// - strips tracking junk
// - rewrites hosts cobalt does not know (m.vk.ru -> vk.com)
// - rewrites snapchat @user links to the /add/<user> form cobalt accepts
// - follows share / short links to the real url
// - rejects content types we do not support, with a plain message

export type Service =
  | "instagram" | "facebook" | "youtube" | "tiktok" | "twitter"
  | "snapchat" | "pinterest" | "vk" | "rutube" | "soundcloud" | "dailymotion" | "bilibili" | "unknown";

export interface Normalized {
  ok: true;
  url: string;
  service: Service;
}
export interface NormalizeError {
  ok: false;
  service: Service;
  message: string;
}

const JUNK_PARAMS = new Set([
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "stkn", "igsh", "igshid", "s", "t", "feature", "si", "fbclid", "mibextid",
  "share_id", "sender_device", "is_from_webapp", "list", "start_radio", "index",
]);

const SHORT_HOSTS = [
  "vm.tiktok.com", "vt.tiktok.com", "pin.it", "youtu.be", "t.co", "fb.watch", "redd.it", "dai.ly", "b23.tv",
];

export function detectService(u: URL): Service {
  const h = u.hostname.replace(/^www\./, "").replace(/^m\./, "");
  if (h.endsWith("instagram.com")) return "instagram";
  if (h.endsWith("facebook.com") || h === "fb.watch") return "facebook";
  if (h.endsWith("youtube.com") || h === "youtu.be") return "youtube";
  if (h.endsWith("tiktok.com")) return "tiktok";
  if (h === "x.com" || h.endsWith("twitter.com") || h === "t.co") return "twitter";
  if (h.endsWith("snapchat.com")) return "snapchat";
  if (h.endsWith("pinterest.com") || h === "pin.it") return "pinterest";
  if (h.endsWith("vk.com") || h.endsWith("vk.ru") || h.endsWith("vkvideo.ru")) return "vk";
  if (h.endsWith("rutube.ru")) return "rutube";
  if (h.endsWith("soundcloud.com")) return "soundcloud";
  if (h.endsWith("dailymotion.com") || h === "dai.ly") return "dailymotion";
  if (h.endsWith("bilibili.com") || h.endsWith("bilibili.tv") || h === "b23.tv") return "bilibili";
  return "unknown";
}

function stripJunk(u: URL): URL {
  for (const k of Array.from(u.searchParams.keys())) {
    if (JUNK_PARAMS.has(k)) u.searchParams.delete(k);
  }
  u.hash = "";
  return u;
}

async function followRedirects(url: string): Promise<string> {
  try {
    const r = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(10_000),
    });
    return r.url || url;
  } catch {
    return url;
  }
}

export async function normalize(raw: string): Promise<Normalized | NormalizeError> {
  let input = raw.trim();
  if (!/^https?:\/\//i.test(input)) input = "https://" + input;

  let u: URL;
  try {
    u = new URL(input);
  } catch {
    return { ok: false, service: "unknown", message: "That does not look like a valid link." };
  }

  // follow short / share links first so the real path can be checked
  const host = u.hostname.replace(/^www\./, "");
  const isShare =
    SHORT_HOSTS.includes(host) ||
    /\/share\//.test(u.pathname) ||
    /\/s\/[A-Za-z0-9]+\/?$/.test(u.pathname);
  if (isShare) {
    const resolved = await followRedirects(u.toString());
    try { u = new URL(resolved); } catch { /* keep original */ }
  }

  const service = detectService(u);
  if (service === "unknown") {
    return { ok: false, service, message: "This site is not supported." };
  }
  if (service === "rutube") {
    return { ok: false, service, message: "Rutube is not available from our servers in this region." };
  }

  // host rewrites
  if (service === "vk") {
    u.hostname = "vk.com";            // vkvideo.ru, m.vk.com, vk.ru all map to vk.com
  }
  if (service === "dailymotion" && u.hostname !== "dai.ly") {
    u.hostname = "www.dailymotion.com";
  }
  if (service === "bilibili" && u.hostname.endsWith("bilibili.com")) {
    u.hostname = "www.bilibili.com";
  }
  if (service === "youtube" && u.hostname !== "youtu.be") {
    u.hostname = "www.youtube.com";
  }
  if (service === "twitter") {
    u.hostname = "x.com";
  }

  // unsupported content types
  if (service === "instagram" && /^\/stories\//.test(u.pathname)) {
    return { ok: false, service, message: "Instagram stories are not supported." };
  }
  if (service === "facebook" && /\/stories\//.test(u.pathname)) {
    return { ok: false, service, message: "Facebook stories are not supported." };
  }
  if (service === "facebook" && /^\/share\/p\//.test(u.pathname)) {
    return { ok: false, service, message: "Facebook photo posts are not supported, videos and reels are." };
  }

  // snapchat: @user/<story id> and @user/spotlight/<id> -> forms cobalt matches
  if (service === "snapchat") {
    const spot = u.pathname.match(/^\/@[^/]+\/spotlight\/([A-Za-z0-9_-]+)/);
    const story = u.pathname.match(/^\/@([^/]+)\/[A-Za-z0-9_-]{20,}/);
    const user = u.pathname.match(/^\/@([^/]+)\/?$/);
    if (spot) u.pathname = `/spotlight/${spot[1]}`;
    else if (story) u.pathname = `/add/${story[1]}`;
    else if (user) u.pathname = `/add/${user[1]}`;
    u.search = "";
  }

  stripJunk(u);
  return { ok: true, url: u.toString(), service };
}