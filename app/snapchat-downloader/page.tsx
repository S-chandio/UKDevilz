import { pageMetadata } from "@/lib/page-seo";
// app/snapchat-downloader/page.tsx
// Snapchat landing page, built on the one thing that is true of Snapchat and of nothing else on
// this site: everything on it runs out. So this page is a clock, not the band order the other
// platform pages share - no facts grid, no ticker, no centre rail, no .pf-kinds, no .pf-why.
//   yellow hero with a 24-hour dial > black: the life of a snap, as a time axis >
//   white: four steps under a story's segment bar > yellow: after the window closes >
//   black ten more apps > white help
// It needs no artwork: the segment-bar steps replace the four step pictures the other pages wait on.
//
// Copy must match what the backend really does (README section 4): public stories through a
// snapchat.com/add/<user> profile link, and Spotlight clips, both through the picker - so a story
// arrives as a set rather than one file. Nothing claims private snaps, friends only stories,
// highlights or MP3, none of which are in section 4 for Snapchat.
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import Grab from "../grab";
import PlatformGuidance from "@/components/PlatformGuidance";
import PlatformStrip from "@/components/PlatformStrip";
import PlatformFilmstrip from "@/components/PlatformFilmstrip";
import Reveal from "@/components/Reveal";
import { PLATFORMS } from "@/lib/platforms";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata("/snapchat-downloader");

const GETS = ["Spotlight", "Public Stories", "Separate Snaps", "No Login"];

// How long each kind of snap stays reachable, plotted on one axis. The bar width is how far along
// that axis it survives - Spotlight runs off the end, a story stops at the day mark, and a private
// snap never appears on the axis at all.
const LIFE = [
  {
    id: "spotlight",
    what: "Spotlight",
    note: "An individual public video",
    reach: "open",
    width: "100%",
    label: "While the clip remains accessible",
  },
  {
    id: "story",
    what: "Public story",
    note: "Currently available profile snaps",
    reach: "open",
    width: "66%",
    label: "Often 24 hours; the creator’s timer may differ",
  },
  {
    id: "private",
    what: "Private snap",
    note: "Restricted messages or stories",
    reach: "never",
    width: "0%",
    label: "Private access is unsupported",
  },
];

// Four steps under the segment bar a story shows while it plays - one segment lit per step.
const STEPS = [
  {
    title: "Choose A Public Source",
    text: "Open the profile for an active public story, or select the individual Spotlight clip you want to save.",
  },
  {
    title: "Copy Its Shared Address",
    text: "Use Snapchat’s sharing control to copy the link. If you are on the website, you can copy the open page’s URL.",
  },
  {
    title: "Submit Your Request",
    text: "Paste the address into the field above and press the arrow. Wait for the available items to appear.",
  },
  {
    title: "Save The Returned Snaps",
    text: "A story result can contain several files. Pick individual items or use Download all, then check that each transfer completed.",
  },
];

// What it means when the window has already closed. Framed as time rather than as a generic list of
// failures, because on Snapchat that is nearly always what has actually happened.
const CLOSED = [
  {
    id: "expired",
    when: "Expired",
    text: "We cannot fetch a story once it has expired. Repeating the same request will not restore the removed snaps.",
  },
  {
    id: "private",
    when: "Restricted",
    text: "Private messages and stories limited to an account’s audience are outside this tool’s access.",
  },
  {
    id: "deleted",
    when: "Removed",
    text: "A snap may disappear before its timer ends if the creator deletes it or Snapchat removes it.",
  },
  {
    id: "wrong",
    when: "Different Source",
    text: "A profile request retrieves its available story. Use a Spotlight address when you want a particular public clip.",
  },
];

export default function SnapchatDownloader() {
  const others = PLATFORMS.filter((p) => p.name !== "Snapchat");

  return (
    <div className="page-snap">
      <PlatformStrip current="/snapchat-downloader" />

      {/* 1. hero on the brand yellow, under a dial showing how long a story has left */}
      <section className="sn-hero look-snap w-full">
        <div className="sn-hero-content mx-auto max-w-[1200px] px-[5vw] py-16 text-center md:py-24 lg:px-6">
          {/* a day's worth of arc, drawn open at the end because it is always running out */}
          <svg aria-hidden="true" className="sn-dial" viewBox="0 0 100 100">
            <circle className="sn-dial-rail" cx="50" cy="50" r="40" />
            <path className="sn-dial-arc" d="M50 10a40 40 0 1 1-28.3 11.7" />
            <text x="50" y="56">24h</text>
          </svg>

          <h1 className="mx-auto mt-5 max-w-[20ch] text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">Snapchat Downloader For <em className="accent">Stories And Spotlight</em></h1>

          <p className="mx-auto mt-4 max-w-[62ch] text-base md:text-lg">
            Save snaps from an available public story or request a Spotlight clip. We do not need your login, and expired stories cannot be retrieved.
          </p>

          <div className="sn-composer">
            <svg className="sn-composer-plus" aria-hidden="true" viewBox="0 0 100 100" fill="none">
              <path d="M50 12v76M12 50h76" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
            </svg>
            <div className="sn-message look-black">
              <p className="sn-message-label">Enter a public profile or Spotlight address.</p>
              <Grab placeholder="Paste a Snapchat link" />
            </div>
          </div>

          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {GETS.map((g) => (
              <li key={g} className="pf-chip">
                {g}
              </li>
            ))}
          </ul>

          <p className="mt-5 text-xs">
            Use {SITE.name} for public snaps you have permission to keep.
          </p>
        </div>
      </section>

      {/* 2. the signature band: how long each kind of snap stays reachable, on one axis */}
      <section className="look-black w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <Reveal>
            <h2 className="sn-life-heading text-3xl font-bold leading-[1.1] md:text-5xl" data-reveal>
              Availability Of <em className="accent">Public Snaps</em>
            </h2>
            <p className="sn-life-intro mt-4 max-w-[62ch] text-[var(--muted)] md:text-lg" data-reveal>
              Stories have an expiry time, which may vary with the creator’s settings. The timeline illustrates a common 24 hour story; Spotlight clips can also be removed or restricted.
            </p>
          </Reveal>

          <Reveal className="mt-8 md:mt-12">
            <div className="sn-life">
              <div className="sn-scale" aria-hidden="true">
                <span />
                <div className="sn-scale-ticks">
                  <span>Posted</span>
                  <span>+12 hours</span>
                  <span>+24 hours</span>
                  <span>Later</span>
                </div>
              </div>

              {LIFE.map((l) => (
                <div key={l.id} className="sn-row" data-reveal>
                  <p className="sn-what">
                    {l.what}
                    <small>{l.note}</small>
                  </p>
                  <div className="sn-track" data-reach={l.reach}>
                    {l.reach === "never" ? (
                      l.label
                    ) : (
                      <span className="sn-bar" style={{ "--w": l.width } as CSSProperties}>
                        {l.label}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. the steps, each under the segment bar a story shows as it plays */}
      <section className="pf-band-white w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Copy A Link And <em className="accent">Download The Snaps</em>
          </h2>

          <ol className="sn-taps mt-8 list-none md:mt-12">
            {STEPS.map((s, i) => (
              <li key={s.title} className="sn-tap" tabIndex={0}>
                <span className="sn-tap-number"><span className="sr-only">Step </span>{String(i + 1).padStart(2, "0")}</span>
                <h3 className="sn-step-title">{s.title}</h3>
                <p className="sn-step-line">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. after the window closes */}
      <section className="sn-check look-snap w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <div className="sn-check-header">
            <div>
              <p className="sn-check-eyebrow">Request help</p>
              <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
                When A Story <em className="accent">Returns No Files</em>
              </h2>
              <p className="sn-check-intro">
                Open the source to check its availability. An expired item cannot be recovered, while a temporary retrieval error may allow a later retry.
              </p>
            </div>
            <div className="sn-check-symbols" aria-hidden="true">
              <div><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="24" cy="24" r="17" /><path d="M24 13v12l8 5" /></svg><span>Still live</span></div>
              <div><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="10" y="21" width="28" height="21" rx="4" /><path d="M16 21v-7a8 8 0 0 1 16 0" /><circle cx="24" cy="31" r="2" /><path d="M24 33v3" /></svg><span>Public post</span></div>
              <div><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 29 10-10M18 32l-3 3a7 7 0 0 1-10-10l10-10a7 7 0 0 1 10 0m5 1 3-3a7 7 0 0 1 10 10L33 33a7 7 0 0 1-10 0" /></svg><span>Right link</span></div>
            </div>
          </div>

          <ul className="sn-check-list">
            {CLOSED.map((c, i) => (
              <li key={c.id} className="sn-check-row">
                <div className="sn-check-title">
                  <h3>{c.when}</h3>
                  <span>0{i + 1} / {c.id === "expired" ? "Story expired" : c.id === "private" ? "Access restricted" : c.id === "deleted" ? "Post removed" : "Check the source"}</span>
                </div>
                <p>{c.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. the other ten platforms, each in a frame of a browsable filmstrip */}
      <PlatformGuidance platform="snapchat" />

      <section id="platforms" className="look-black w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Tools For <em className="accent">Other Sources</em>
          </h2>
          <p className="mt-4 max-w-[60ch] text-[var(--muted)] md:text-lg">
            Save a reel, image or recording shared on another platform through its own tool page.
          </p>

        </div>
        <PlatformFilmstrip platforms={others} />
      </section>

      {/* 6. help, right before the black footer */}
      <section className="pf-band-white w-full">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-[5vw] py-12 text-center md:flex-row md:gap-10 md:py-14 md:text-left lg:px-6">
          <Image
            src="/images/snapchat/help-story.webp"
            alt=""
            width={600}
            height={600}
            sizes="160px"
            className="h-auto w-[140px] shrink-0 md:w-[160px]"
          />
          <div className="min-w-0">
            <h2 className="text-2xl font-bold md:text-4xl">Help With Story Downloads</h2>
            <p className="mt-2 max-w-[52ch] text-[var(--muted)]">
              If some snaps appear but others are missing, compare the returned set with the current story. The answers explain what to check before retrying.
            </p>
          </div>
          <Link href="#snapchat-faq" className="neon shrink-0 px-5 py-3 md:ml-auto">
            Read Snapchat help
          </Link>
        </div>
      </section>
    </div>
  );
}
