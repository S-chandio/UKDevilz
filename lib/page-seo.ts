import type { Metadata } from "next";
import { SITE } from "./site";

// Focus keywords are editorial targets, not HTML meta keywords.
export const PAGE_SEO = {
  "/": {
    "title": "Online Video Downloader | ukdevliz",
    "description": "Save videos, photos and audio from supported public links with our online video downloader. Choose a platform, check its file options and download without a login.",
    "focusKeyword": "online video downloader"
  },
  "/youtube-downloader": {
    "title": "YouTube Downloader: MP4 and MP3 | ukdevliz",
    "description": "Download YouTube videos and Shorts as MP4, or save audio as MP3. Choose 360p, 720p, 1080p or Best and use No sound for a silent clip, without signing in.",
    "focusKeyword": "YouTube downloader"
  },
  "/tiktok-downloader": {
    "title": "TikTok Downloader Without Watermark | ukdevliz",
    "description": "Download a public TikTok clip without the platform watermark or save its soundtrack as MP3. Paste a shared video link and keep the file without signing in.",
    "focusKeyword": "TikTok downloader without watermark"
  },
  "/instagram-downloader": {
    "title": "Instagram Downloader: Reels and Photos | ukdevliz",
    "description": "Save Instagram reels, photos and every slide from a public carousel. Choose individual files or the returned set and download in your browser without a login.",
    "focusKeyword": "Instagram downloader"
  },
  "/facebook-downloader": {
    "title": "Facebook Video Downloader: Videos and Reels | ukdevliz",
    "description": "Download public Facebook videos and Reels as MP4 using a direct or shared link. Save the recording in your browser and find help with supported video addresses.",
    "focusKeyword": "Facebook video downloader"
  },
  "/twitter-downloader": {
    "title": "X Video Downloader: Twitter Videos and Photos | ukdevliz",
    "description": "Save videos, animations and photos from public X or Twitter posts. Paste the post link, select its media and download the files to your device without signing in.",
    "focusKeyword": "Twitter video downloader"
  },
  "/snapchat-downloader": {
    "title": "Snapchat Downloader: Stories and Spotlight | ukdevliz",
    "description": "Download available public Snapchat stories and Spotlight clips without an account. Save separate snaps, check a returned set and understand story expiry limits.",
    "focusKeyword": "Snapchat downloader"
  },
  "/pinterest-downloader": {
    "title": "Pinterest Downloader: Images and Videos | ukdevliz",
    "description": "Save the image or video from a public Pinterest pin. Use a full pin address or pin.it link, then check the returned file, its dimensions and your download folder.",
    "focusKeyword": "Pinterest downloader"
  },
  "/soundcloud-downloader": {
    "title": "SoundCloud Downloader: Save Tracks as MP3 | ukdevliz",
    "description": "Download individual public SoundCloud tracks as MP3 without signing in. Paste a track link, save its audio and find guidance on file quality and supported addresses.",
    "focusKeyword": "SoundCloud downloader"
  },
  "/dailymotion-downloader": {
    "title": "Dailymotion Video Downloader | ukdevliz",
    "description": "Save a public Dailymotion video or its audio as MP3 using a direct address or dai.ly link. Find guidance on file formats, playback and locating your completed download.",
    "focusKeyword": "Dailymotion video downloader"
  },
  "/bilibili-downloader": {
    "title": "Bilibili Video Downloader | ukdevliz",
    "description": "Download public Bilibili videos or audio using an individual video address or b23.tv share link. Save the selected recording in your browser without signing in.",
    "focusKeyword": "Bilibili video downloader"
  },
  "/vk-downloader": {
    "title": "VK Video Downloader: Save Public Videos | ukdevliz",
    "description": "Download public VK and VK Video recordings without signing in. Paste an individual video link, save the file and find help with supported addresses and source quality.",
    "focusKeyword": "VK video downloader"
  },
  "/contact": {
    "title": "Contact ukdevliz: Download Support and Feedback",
    "description": "Find the ukdevliz email address for download support, privacy questions, content concerns or feedback. Read which details to include when reporting a problem.",
    "focusKeyword": "contact ukdevliz"
  },
  "/privacy": {
    "title": "Privacy Policy: Files, Links and Previews | ukdevliz",
    "description": "Read the ukdevliz privacy draft covering media storage, submitted links, embedded previews and support messages, with outstanding operational details identified.",
    "focusKeyword": "ukdevliz privacy policy"
  },
  "/terms": {
    "title": "Terms of Use: Downloads and Content Rights | ukdevliz",
    "description": "Read the draft terms for ukdevliz downloads, including content permissions, source access, service limits and support reports. Final legal details remain pending.",
    "focusKeyword": "ukdevliz terms of use"
  }
} as const;

export function pageMetadata(route: keyof typeof PAGE_SEO): Metadata {
  const { title, description } = PAGE_SEO[route];
  const origin = new URL(`https://${SITE.domain}`);
  const url = new URL(route, origin).toString();
  const image = {
    url: new URL("/opengraph-image", origin).toString(),
    width: 1200,
    height: 630,
    alt: "UkDevilz free online downloader with the red devil mascot",
  };
  return {
    metadataBase: origin,
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_GB",
      siteName: "UkDevilz",
      title,
      description,
      url,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
