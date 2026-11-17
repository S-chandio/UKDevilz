import { pageMetadata } from "@/lib/page-seo";
// app/instagram-downloader/page.tsx
// Instagram landing page. Same stack of bands as the YouTube page, built from the same .pf-* classes,
// with Instagram's own palette (look-insta). This page has no .pf-rule separators: the bands change
// colour sharply enough on their own and the client asked for them off here.
//   black strip > open hero > black facts > brand steps rail > off-white ticker >
//   the pinned save reel > black platforms > brand help > black footer
// Copy must match what the backend really does (README section 4): reels, video posts, photo posts
// and carousels. Stories are NOT supported and normalize.ts rejects them by name. There is no
// quality picker on Instagram - grab.tsx only shows one for YouTube - so nothing here offers sizes.
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import Grab from "../grab";
import PlatformGuidance from "@/components/PlatformGuidance";
import PlatformStrip from "@/components/PlatformStrip";
import StarsBackground from "@/components/StarsBackground";
import PlatformOrbits from "@/components/PlatformOrbits";
import Reveal from "@/components/Reveal";
import { PLATFORMS } from "@/lib/platforms";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata("/instagram-downloader");

const GETS = ["Reels", "Video Posts", "Photos", "Carousel Slides"];

const TICKER = ["Public post links", "Individual files", "No account", "Save in your browser", "Reels and photos", "Mixed media sets"];


// One panel per thing you can save, each a full screen of artwork with its words over the picture.
// They run sideways while the band is pinned (.pf-reel in globals.css), so the images want to be
// wide, not square. "More Apps" is not here: it had no artwork, and the platforms band further down
// already lists all ten.
const SAVES = [
  {
    id: "reels",
    title: "Reels",
    text: "Keep a reel as a video, or use the MP3 option to request its available soundtrack.",
    tag: "MP4 / MP3",
    image: "/images/instagram/save-reels.webp",
  },
  {
    id: "carousels",
    title: "Carousels",
    text: "We support photos and videos across the carousel. If a slide fails to appear or download, compare the results with the post before trying again.",
    tag: "MP4 / JPG",
    image: "/images/instagram/save-carousels.webp",
  },
  {
    id: "photos",
    title: "Photos",
    text: "The photo button saves the image supplied by Instagram. Its dimensions depend on the available source.",
    tag: "JPG",
    image: "/images/instagram/save-photos.webp",
  },
  {
    id: "videos",
    title: "Video Posts",
    text: "Use the address of the post containing the recording. A link to the profile does not select a particular video.",
    tag: "MP4 / MP3",
    image: "/images/instagram/save-videos.webp",
  },
];

// The steps run either side of a line down the middle, alternating, with a glowing point on the line
// that follows the scroll (.pf-rail in globals.css). The four pictures are the four taps, in order:
// the share arrow, Copy link, the paste bar, then the file buttons.
const STEPS = [
  {
    title: "Open The Sharing Options",
    text: "Find the reel or post and open its sharing menu. The position of this control can differ between the app and website.",
    image: "/images/instagram/step-open-share.webp",
    alt: "Illustrated reel with the Share icon circled on the right",
  },
  {
    title: "Copy The Post Address",
    text: "Choose Copy link so the address is ready to paste. Make sure it belongs to the item you want to save.",
    image: "/images/instagram/step-copy-link.webp",
    alt: "Illustrated share menu with Copy link circled",
  },
  {
    title: "Send The Link",
    text: "Enter it in the field above and press the arrow. The result appears below once the request finishes.",
    image: "/images/instagram/step-paste-link.webp",
    alt: "Illustrated phone with the link field and submit arrow circled",
  },
  {
    title: "Select Your Items",
    text: "Use the file buttons to save a photo or video. For a carousel, Download all starts the returned items as separate downloads.",
    image: "/images/instagram/step-save-file.webp",
    alt: "Illustrated video result with MP4 and MP3 buttons circled",
  },
];



// Four stickers, each with its name under it. The name is the only text - no explaining line - and
// it only inks in on hover, so the pictures carry the band at rest (.pf-fact-art in globals.css).
// The images are decorative because the name says the same thing in real text.
const FACTS = [
  { id: "free", name: "Free", image: "/images/instagram/fact-free.webp" },
  { id: "no-login", name: "No Login", image: "/images/instagram/fact-no-login.webp" },
  { id: "zero-files", name: "File Downloads", image: "/images/instagram/fact-zero-files.webp" },
  { id: "all-slides", name: "All Slides", image: "/images/instagram/fact-all-slides.webp" },
];


export default function InstagramDownloader() {
  const others = PLATFORMS.filter((p) => p.name !== "Instagram");

  return (
    <div className="page-insta">
      <PlatformStrip current="/instagram-downloader" />

      {/* 1. hero: the artwork is the background, full width and shown whole, with the text over it.
          This drawing is the brand gradient edge to edge, so the hero runs pf-hero-dark: off-white
          letters in a deep halo, the mirror of the pale YouTube drawing. --art-ratio is the
          drawing's own 1376x784, which is what sets the band's height from lg up. */}
      <section
        className="pf-hero-dark relative isolate w-full overflow-hidden"
        style={{ "--art-ratio": "1.755" } as CSSProperties}
      >
        {/* mascot beside the phone and the grid: decorative, the headline already says what the page does */}
        <div aria-hidden="true" className="pf-art">
          <Image src="/images/instagram/instagram-hero-devil-grid.webp" alt="" fill preload sizes="100vw" />
        </div>

        <div className="pf-hero mx-auto max-w-[1200px] px-[5vw] pt-12 lg:px-6">
         <div className="pf-hero-grid">
          <div className="pf-hero-text">
            <p className="inline-flex items-center gap-2 text-xs title-case tracking-[0.06em] text-[var(--muted)]">
              {/* --emphasis, not --accent: --accent also feeds the paste box's button */}
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--emphasis)]" />
              Instagram downloader
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">Instagram Downloader For <em className="accent">Reels And Photos</em></h1>

            <p className="mt-4 text-base md:text-lg">
              Save media from a public Instagram post without signing in. A carousel can return separate pictures and clips, so you can choose individual slides or download the available set.
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {GETS.map((g) => (
                <li key={g} className="pf-chip">
                  {g}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-xs">
              Choose posts you own or have permission to save with {SITE.name}.
            </p>
          </div>

          {/* the downloader sits on the screen of a drawn phone, which rises into the band on load
              (.pf-hand in globals.css). The drawing is decorative - the heading already says what
              the page is - so it is a background, not an <img>. */}
          <div
            className="pf-hand mt-10 lg:mt-0"
            style={{ "--hand-art": "url('/images/sections/hand-holding-phone.webp')" } as CSSProperties}
          >
            <div className="pf-hand-screen">
              <Grab placeholder="Paste a link" />
            </div>
          </div>
         </div>
        </div>
      </section>

      {/* 2. four facts, falling through space towards the black hole. The clip is decorative, so it
          is aria-hidden and muted; the poster carries it before it plays and instead of it for
          anyone who asks for reduced motion (.pf-space in globals.css). */}
      <section className="look-black pf-space w-full">
        <video
          aria-hidden="true"
          className="pf-space-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/videos/black-hole-poster.webp"
        >
          {/* The source carries a media condition, so on a phone nothing matches and the browser
              fetches no video at all - hiding it in CSS does not help, preload goes and gets it
              anyway. The poster stands in there instead.
              Reduced motion is deliberately NOT in this condition: the client wants the clip to play
              for those visitors too. It is a slow ambient loop rather than parallax, but it is still
              motion running past five seconds with nothing to stop it, which is what WCAG 2.2.2 asks
              about - a pause control is the usual answer if that ever needs closing. */}
          <source src="/videos/black-hole.mp4" type="video/mp4" media="(min-width: 768px)" />
        </video>

        <div className="relative mx-auto max-w-[1200px] px-[5vw] py-12 md:py-14 lg:px-6">
          <ul className="pf-facts list-none">
            {FACTS.map((f) => (
              <li key={f.id} className="pf-fact">
                <span className="pf-fact-art">
                  <Image src={f.image} alt="" fill sizes="(min-width: 768px) 24vw, 44vw" />
                </span>
                <span className="pf-fact-name">{f.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. the four steps, on the brand gradient, as a rail (.pf-rail) */}
      <section className="look-insta w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-24 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Save An Instagram Post In <em className="accent">4 Steps</em>
          </h2>

          {/* Each half arrives once, from the side it sits on, and then stays put whichever way the
              page moves - components/Reveal.tsx, the same as the TikTok rail. All eight get their
              own entrance so no two land the same way. */}
          <Reveal className="mt-12 md:mt-16">
            <ol className="pf-rail list-none">
              {/* the point that rides the line as the page scrolls */}
              <span aria-hidden="true" className="pf-rail-dot" />

              {STEPS.map((s, i) => (
                <li key={s.title} className="pf-rail-step" data-side={i % 2 ? "right" : "left"}>
                  <div className="pf-rail-text" data-reveal>
                    <span aria-hidden="true" className="pf-step-num">
                      {i + 1}
                    </span>
                    <h3 className="mt-4 text-2xl font-bold md:text-3xl">{s.title}</h3>
                    <p className="mt-3 text-[var(--muted)] md:text-lg">{s.text}</p>
                  </div>

                  <div className="pf-rail-art" data-reveal>
                    <Image src={s.image} alt={s.alt} fill sizes="(min-width: 768px) 30vw, 90vw" />
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* 4. running claims, on its own purple between the brand band above and the black below */}
      <section aria-hidden="true" className="pf-ticker w-full">
        <div className="pf-ticker-track">
          {[0, 1].map((copy) => (
            <div key={copy}>
              {TICKER.map((w) => (
                <span key={w} className="flex items-center gap-[2.2rem]">
                  <span className="pf-ticker-word">{w}</span>
                  <span className="pf-ticker-dot" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* 5. what you can save: the band is pinned and the pictures run sideways under it, one screen
          each, until all four have passed; then the page carries on. Below 768px, and without
          scroll-driven animations, the same markup is a swipeable strip (.pf-reel in globals.css). */}
      <section className="look-black w-full">
        <div
          className="pf-reel"
          style={{ "--panels": SAVES.length } as CSSProperties}
        >
          <div className="pf-reel-stage">
            {/* the sky the panels run across; its layers slide on the same timeline as the run */}
            <StarsBackground starColor="#f7f2f2" />

            <div className="pf-reel-head mx-auto max-w-[1200px] px-[5vw] pt-16 pb-8 md:pt-24 lg:px-6">
              <h2 className="max-w-[18ch] text-3xl font-bold leading-[1.1] md:text-5xl">
                Supported Posts On <em className="accent">Instagram</em>
              </h2>
              <p className="mt-4 max-w-[60ch] text-[var(--muted)] md:text-lg">
                Reels, video posts and photo carousels each have file options. This tool does not accept Instagram Stories or access private accounts.
              </p>
            </div>

            <ul className="pf-reel-track list-none">
              {SAVES.map((item) => (
                <li key={item.id} className="pf-reel-panel">
                  {/* the picture keeps the artwork's own 2400x1340 shape; the panel is just the
                      space it sits in (.pf-reel-shot in globals.css) */}
                  <div className="pf-reel-shot">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 100vw, 86vw"
                    />
                    <div className="pf-reel-cap">
                      <span className="pf-card-tag inline-flex">{item.tag}</span>
                      <h3 className="mt-2 text-xl font-bold md:mt-3 md:text-4xl">{item.title}</h3>
                      <p className="mt-1.5 text-sm md:mt-2 md:text-lg">{item.text}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 6. the other ten, on the drawing. pf-bg-keep means the picture stays on a phone too, unlike
          every other .pf-bg band on the site, which drop theirs below 768px. */}
      <PlatformGuidance platform="instagram" />

      <section
        id="platforms"
        className="look-black pf-bg pf-bg-keep relative isolate w-full"
        style={{ "--band-bg": "url('/images/instagram/section-ten-more-apps.webp')" } as CSSProperties}
      >
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Download From <em className="accent">Another Platform</em>
          </h2>
          <p className="mt-4 max-w-[60ch] text-[var(--muted)] md:text-lg">
            Choose a source below when the address you have copied belongs to another app.
          </p>

          <div className="mt-6 md:mt-8">
            <PlatformOrbits items={others} />
          </div>
        </div>
      </section>

      {/* 7. help, on Instagram's orange right before the black footer. The orange is light, so the
          band carries dark ink (.pf-help in globals.css). */}
      <section className="look-insta pf-help w-full">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-[5vw] py-12 text-center md:flex-row md:gap-10 md:py-14 md:text-left lg:px-6">
          <Image
            src="/images/instagram/help-post.webp"
            alt=""
            width={600}
            height={600}
            sizes="160px"
            className="h-auto w-[140px] shrink-0 md:w-[160px]"
          />
          <div className="min-w-0">
            <h2 className="text-2xl font-bold md:text-4xl">Check An Instagram Request</h2>
            <p className="mt-2 max-w-[52ch] text-[var(--muted)]">
              A missing slide and a rejected link need different checks. Read the answers for carousel results, account access and saved files.
            </p>
          </div>
          <Link href="#instagram-faq" className="neon shrink-0 px-5 py-3 md:ml-auto">
            View Instagram help
          </Link>
        </div>
      </section>

    </div>
  );
}
