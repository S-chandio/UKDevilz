// lib/platforms.ts
// Platforms shown in the homepage showcase (and later on the landing pages).
// Copy must match what the backend really does (README section 4 and 17): Facebook is videos only,
// Snapchat is public stories, Instagram has no stories. Dailymotion and Bilibili are not in the verified
// list yet, so their copy stays minimal until they are tested.
//
// Order and size drive the homepage grid (4 columns, filled densely):
// one large (2x2), one wide (2x1), one tall (1x2) and eight small tiles make four full rows.
// Sizes follow each image's shape: wide banners go in wide or small tiles, the Snapchat ghost grid crops well tall.

export type TileSize = "large" | "wide" | "tall" | "small";

// the platform's own colours, used when a homepage tile is hovered and shows its text.
// bg is always written as a gradient (solid colours repeat the same value) so one CSS property covers both.
// ink/muted are checked for readable contrast on bg: SoundCloud orange and Bilibili cyan are too light for white
// text, so those use black; VK's bright blue is too light, so bg is a deeper shade of it with the bright one as accent.
export interface PlatformTheme {
  bg: string;
  ink: string;
  muted: string;
  accent: string;
}

export interface Platform {
  name: string;
  href: string;
  image: string;
  size: TileSize;
  gets: string;
  points: string[]; // shown on the bigger tiles only
  theme: PlatformTheme;
}

const img = (slug: string) => `/images/platforms/platform-${slug}.webp`;
const solid = (c: string) => `linear-gradient(${c}, ${c})`;

export const PLATFORMS: Platform[] = [
  {
    name: "YouTube",
    href: "/youtube-downloader",
    image: img("youtube"),
    size: "large",
    gets: "Choose a video resolution or save the soundtrack as MP3.",
    points: ["360p, 720p, 1080p or Best", "MP3 audio", "Regular videos and Shorts"],
    theme: { bg: solid("#0F0F0F"), ink: "#FFFFFF", muted: "#AAAAAA", accent: "#FF0000" },
  },
  {
    name: "TikTok",
    href: "/tiktok-downloader",
    image: img("tiktok"),
    size: "wide",
    gets: "Save a clip without the platform watermark.",
    points: ["No watermark", "Audio from the linked video"],
    theme: { bg: solid("#000000"), ink: "#FFFFFF", muted: "#A9A9AE", accent: "#25F4EE" },
  },
  {
    name: "Snapchat",
    href: "/snapchat-downloader",
    image: img("snapchat"),
    size: "tall",
    gets: "Retrieve available public snaps and Spotlight clips.",
    points: ["Profile addresses for active stories", "Spotlight videos", "Separate buttons for returned snaps"],
    theme: { bg: solid("#FFFC00"), ink: "#000000", muted: "#3A3A00", accent: "#000000" },
  },
  {
    name: "Instagram",
    href: "/instagram-downloader",
    image: img("instagram"),
    size: "small",
    gets: "Select images and videos from public posts.",
    points: [],
    theme: { bg: "linear-gradient(135deg, #3A1C71, #B4256B, #C2255C)", ink: "#FFFFFF", muted: "#F0D9EA", accent: "#FCB045" },
  },
  {
    name: "Facebook",
    href: "/facebook-downloader",
    image: img("facebook"),
    size: "small",
    gets: "Download public videos and Reels as MP4.",
    points: [],
    theme: { bg: solid("#0866FF"), ink: "#FFFFFF", muted: "#DCE9FF", accent: "#FFFFFF" },
  },
  {
    name: "X (Twitter)",
    href: "/twitter-downloader",
    image: img("x"),
    size: "small",
    gets: "Keep media attached to an individual post.",
    points: [],
    theme: { bg: solid("#000000"), ink: "#FFFFFF", muted: "#9BA2A8", accent: "#FFFFFF" },
  },
  {
    name: "Pinterest",
    href: "/pinterest-downloader",
    image: img("pinterest"),
    size: "small",
    gets: "Save the image or clip attached to a pin.",
    points: [],
    theme: { bg: solid("#BD081C"), ink: "#FFFFFF", muted: "#F6D2D6", accent: "#FFFFFF" },
  },
  {
    name: "SoundCloud",
    href: "/soundcloud-downloader",
    image: img("soundcloud"),
    size: "small",
    gets: "Keep a public track as an MP3 for your audio player.",
    points: [],
    theme: { bg: solid("#FF5500"), ink: "#000000", muted: "#3D1600", accent: "#000000" },
  },
  {
    name: "Dailymotion",
    href: "/dailymotion-downloader",
    image: img("dailymotion"),
    size: "small",
    gets: "Open a video result and choose a file option.",
    points: [],
    theme: { bg: solid("#000000"), ink: "#FFFFFF", muted: "#BDBDBD", accent: "#FFFFFF" },
  },
  {
    name: "Bilibili",
    href: "/bilibili-downloader",
    image: img("bilibili"),
    size: "small",
    gets: "Save video or audio from an individual recording.",
    points: [],
    theme: { bg: solid("#00A1D6"), ink: "#000000", muted: "#06364A", accent: "#FB7299" },
  },
  {
    name: "VK",
    href: "/vk-downloader",
    image: img("vk"),
    size: "small",
    gets: "Download a public recording from VK or VK Video.",
    points: [],
    theme: { bg: solid("#004C99"), ink: "#FFFFFF", muted: "#CFE2FA", accent: "#0077FF" },
  },
];
