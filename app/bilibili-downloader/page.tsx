import { pageMetadata } from "@/lib/page-seo";
// app/bilibili-downloader/page.tsx
// Bilibili landing page. Bilibili has one thing nothing else on this site has - danmaku, the
// comments that fly across the video - so the page has a screen with comments drifting over it, and
// the steps are laid out as a video with several parts's parts list. Nothing is shared with the other
// platform pages: no facts grid, no ticker, no centre rail, no .pf-kinds, no .pf-why, no post
// cards, no board, no waveform, no film strip, no time axis.
//   mist hero > dark: the danmaku screen > blue: the parts list > dark: what never comes >
//   mist ten more apps > blue help
// It needs no artwork: the screen and the comments are drawn.
//
// Colours are MEASURED off bilibili.com, not taken from lib/platforms.ts, which still carries the
// older #00a1d6 / #fb7299 pair. The live site is #00aeec blue, #ff6699 pink, #f1f2f3 page, #18191c
// type. Both brand colours are mid-light - black on the blue is 8.27:1, white only 2.54:1 - so they
// are fills with black ink, or text on a dark band, never text on the light one.
//
// COPY IS DELIBERATELY MINIMAL. Bilibili is NOT in the verified list in README section 4 - see the
// note at the top of lib/platforms.ts - so nothing here names a container, a quality, subtitles,
// danmaku files, multi-part behaviour or a length limit. It claims only what the code plainly does:
// bilibili.com, bilibili.tv and the short b23.tv form are recognised, b23.tv is in normalize.ts's
// SHORT_HOSTS and followed first, and the shared mode row offers the sound on its own.
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import BilibiliHeroTool from "./BilibiliHeroTool";
import BilibiliHeroBackdrop from "./BilibiliHeroBackdrop";
import heroStyles from "./hero-backdrop.module.css";
import requestStyles from "./request-options.module.css";
import stepStyles from "./steps.module.css";
import guidanceStyles from "./guidance.module.css";
import PlatformGuidance from "@/components/PlatformGuidance";
import PlatformStrip from "@/components/PlatformStrip";
import PlatformRelated from "@/components/PlatformRelated";
import Reveal from "@/components/Reveal";
import { PLATFORMS } from "@/lib/platforms";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata("/bilibili-downloader");

// The comments that drift across the screen. Decorative and aria-hidden - moving text is never the
// only copy of anything here, so every claim in it is written out still underneath (SAYS below).
// Each lane gets its own top, speed and head start so they never march in step.
const LANES = [
  { top: "9%", dur: "19s", delay: "0s", items: [["Free", ""], ["public video links", "blue"], ["check the result", ""]] },
  { top: "26%", dur: "26s", delay: "-6s", items: [["b23.tv redirects", "pink"], ["individual videos", ""]] },
  { top: "43%", dur: "22s", delay: "-13s", items: [["video or audio request", ""], ["browser controls", "blue"]] },
  { top: "60%", dur: "30s", delay: "-3s", items: [["no extension required", ""], ["preview when available", "pink"]] },
  { top: "77%", dur: "24s", delay: "-17s", items: [["no account needed", "blue"], ["source dependent results", ""]] },
];

// the same claims, in still text, so nothing depends on being able to read something moving
const SAYS = [
  { id: "free", head: "Free", line: "You can submit an address without paying for a download." },
  { id: "login", head: "Account Access", line: "We do not ask for your Bilibili password or use your account permissions." },
  { id: "kept", head: "File Options", line: "Choose video or audio for the recording you want to keep on your device." },
];

// the steps, laid out the way a video with several parts lists its parts
const PARTS = [
  {
    p: "P1",
    title: "Select A Public Video",
    text: "Open the individual recording you want on Bilibili. Account pages and series listings do not identify one file.",
  },
  {
    p: "P2",
    title: "Copy The Shared URL",
    text: "Copy the video’s address or its b23.tv share link. If a redirect fails, use the destination page’s full URL.",
  },
  {
    p: "P3",
    title: "Enter The Address",
    text: "Paste the address above and choose video or audio before submitting. We prepare the selected media for you to save.",
  },
  {
    p: "P4",
    title: "Review The Response",
    text: "When the result appears, choose the file button to begin your download. Your browser shows the transfer progress.",
  },
];

const NEVER = [
  {
    id: "private",
    head: "Unavailable Media",
    line: "The source may require access the tool does not have, or it may have been removed. We cannot recover a deleted recording.",
  },
  {
    id: "space",
    head: "A Collection Was Submitted",
    line: "Open a specific video from the creator’s page and copy its address. The tool does not fetch a creator’s entire catalogue.",
  },
];

export default function BilibiliDownloader() {
  const others = PLATFORMS.filter((p) => p.name !== "Bilibili");

  return (
    <div className="page-bili">
      <PlatformStrip current="/bilibili-downloader" />

      {/* 1. hero on the light grey bilibili.com itself uses */}
      <section className={`${heroStyles.hero} pf-band-mist w-full`}>
        <BilibiliHeroBackdrop />
        <div className={`${heroStyles.content} mx-auto max-w-[1200px] px-[5vw] py-16 text-center md:py-24 lg:px-6`}>
          <p className="inline-flex items-center gap-2 text-xs title-case tracking-[0.06em] text-[var(--muted)]">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            Bilibili downloader
          </p>

          <h1 className="mx-auto mt-4 max-w-[20ch] text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">Bilibili <em className="accent">Video Downloader</em></h1>

          <p className="mx-auto mt-4 max-w-[60ch] text-base text-[var(--muted)] md:text-lg">
            Save video or audio from a public Bilibili recording. Paste its individual address, choose a format and download through your browser without signing in.
          </p>

          <BilibiliHeroTool />

          <p className="mt-5 text-xs text-[var(--muted)]">
            Before downloading with {SITE.name}, check that you own the recording or have permission to save it.
          </p>
        </div>
      </section>

      {/* 2. the signature: a screen with the comments drifting across it, the way Bilibili plays
             them over a video. The claims they carry are repeated in still text underneath. */}
      <section className={`${requestStyles.section} look-bili w-full`}>
        <Reveal className={`${requestStyles.reveal} mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6`}>
          <div className={`${requestStyles.heading} ${requestStyles.slide}`} data-reveal>
            <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
              Bilibili Request <em className="accent">Options</em>
            </h2>
            <p className="mt-4 max-w-[62ch] text-[var(--muted)] md:text-lg">
              The moving text is an illustration of the page controls. It is separate from any comments attached to a source video.
            </p>
            <Image
              src="/images/bilibili/request-options.webp"
              alt="Devliz holding a card with video and audio options"
              width={1254}
              height={1254}
              sizes="(max-width: 640px) 108px, (max-width: 1000px) 180px, (max-width: 1222px) 18vw, 220px"
              className={requestStyles.mascot}
            />
          </div>

          <div aria-hidden="true" className={`${requestStyles.screen} ${requestStyles.slide} bl-screen mt-8 md:mt-10`} data-reveal>
            {LANES.map((lane, i) => (
              <div
                key={i}
                className="bl-lane"
                style={{ top: lane.top, "--dur": lane.dur, "--delay": lane.delay } as CSSProperties}
              >
                {lane.items.map(([text, tone], n) => (
                  <span key={n} className="bl-dm" data-tone={tone || undefined}>
                    {text}
                  </span>
                ))}
              </div>
            ))}
          </div>

          <ul className="bl-says list-none">
            {SAYS.map((s) => (
              <li key={s.id} className={`${requestStyles.card} ${requestStyles.slide} bl-say`} data-reveal>
                <b>{s.head}</b>
                {s.line}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* 3. the steps, laid out as a parts list */}
      <section className={`${stepStyles.section} look-bili-blue w-full`}>
        <Reveal className={`${stepStyles.sequence} mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6`}>
          <h2 className={`${stepStyles.pop} text-3xl font-bold leading-[1.1] md:text-5xl`} data-reveal>
            Submit A Video In <em className="accent">4 Steps</em>
          </h2>

          <ol className="bl-parts mt-8 list-none md:mt-12">
            {PARTS.map((part) => (
              <li key={part.p} className={`${stepStyles.pop} ${stepStyles.card} bl-part`} data-reveal>
                <span className="bl-pno">{part.p}</span>
                <div className="min-w-0">
                  <h3 className="bl-part-title">{part.title}</h3>
                  <p className="bl-part-line">{part.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* 4. what never comes back */}
      <section className="look-bili w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Check The Source <em className="accent">And Link Type</em>
          </h2>

          <Reveal className="mt-8 md:mt-10">
            <ul className="bl-says list-none" style={{ marginTop: 0 }}>
              {NEVER.map((n) => (
                <li key={n.id} className="bl-say" data-reveal>
                  <b>{n.head}</b>
                  {n.line}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 5. the other ten, as a ring that turns on its own and can be grabbed and flung */}
      <PlatformGuidance platform="bilibili" revealClassName={guidanceStyles.guidance} />

      <section id="platforms" className="pf-band-mist w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Tools For <em className="accent">Other Platforms</em>
          </h2>
          <p className="mt-4 max-w-[60ch] text-[var(--muted)] md:text-lg">
            Choose another source page if your recording or soundtrack comes from elsewhere.
          </p>

          <div className="mt-6 md:mt-8">
            <PlatformRelated platforms={others} variant="bilibili" />
          </div>
        </div>
      </section>

      {/* 6. help, on the brand blue, right before the black footer */}
      <section className="look-bili-blue w-full">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-[5vw] py-12 text-center md:flex-row md:gap-10 md:py-14 md:text-left lg:px-6">
          <Image
            src="/images/bilibili/help-video.webp"
            alt=""
            width={600}
            height={600}
            sizes="160px"
            className="h-auto w-[140px] shrink-0 md:w-[160px]"
          />
          <div className="min-w-0">
            <h2 className="text-2xl font-bold md:text-4xl">Help With Bilibili Links</h2>
            <p className="mt-2 max-w-[52ch] text-[var(--muted)]">
              Read about b23.tv addresses, individual video parts and which player features stay within a downloaded recording.
            </p>
          </div>
          <Link href="#bilibili-faq" className="neon shrink-0 px-5 py-3 md:ml-auto">
            View Bilibili answers
          </Link>
        </div>
      </section>
    </div>
  );
}
