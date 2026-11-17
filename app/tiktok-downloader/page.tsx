import { pageMetadata } from "@/lib/page-seo";
// app/tiktok-downloader/page.tsx
// TikTok landing page. Same bands and the same .pf-* classes as the Instagram page, with TikTok's
// palette (look-tiktok: black carrying the brand, cyan doing the accent work).
//   black strip > chevron hero > facts on the cyan > the gear wheels on the red > cyan ticker >
//   the pinned save run > ten more apps > help > black footer
// The two brand bands are bright, so everything on them is dark ink - see .pf-band-cyan /
// .pf-band-red in globals.css for the numbers.
// Copy must match what the backend really does (README section 4): videos with no watermark, and
// sounds. There is no quality picker on TikTok - grab.tsx only shows one for YouTube - so nothing
// here offers sizes, and nothing claims photos or slideshows.
import Image from "next/image";
import Link from "next/link";
import Grab from "../grab";
import PlatformGuidance from "@/components/PlatformGuidance";
import PlatformStrip from "@/components/PlatformStrip";
import StarsBackground from "@/components/StarsBackground";
import StarBurst from "@/components/StarBurst";
import PlatformRelated from "@/components/PlatformRelated";
import NeonArrows from "@/components/NeonArrows";
import Reveal from "@/components/Reveal";
import GearWheels from "@/components/GearWheels";
import { PLATFORMS } from "@/lib/platforms";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata("/tiktok-downloader");

const GETS = ["No Watermark", "Videos", "Video Audio", "Short Links"];

const TICKER = ["Shared video links", "MP4 files", "No watermark", "No account", "Browser saving", "MP3 option"];

// Three stickers on this page, each with its name under it - no watermark claim here, that one is
// made in the hero chips and all over the save steps. The name only inks in on hover, so the
// pictures carry the band at rest (.pf-fact-art in globals.css). The images are decorative - the
// name says the same thing in real text.
const FACTS = [
  { id: "free", name: "Free", image: "/images/tiktok/fact-free.webp" },
  { id: "no-login", name: "No Login", image: "/images/tiktok/fact-no-login.webp" },
  { id: "zero-files", name: "File Downloads", image: "/images/tiktok/fact-zero-files.webp" },
];

// The four taps, in order: the share arrow, Copy link, the paste bar, then the file buttons. They ride
// two half-visible wheels that turn against each other as the page scrolls
// (components/GearWheels.tsx).
const STEPS = [
  {
    title: "Open The Video Menu",
    text: "Find the clip you want, then use its Share control. This gives you the address for that recording.",
    image: "/images/tiktok/step-open-share.webp",
    alt: "TikTok post with the Share arrow on the right side",
  },
  {
    title: "Copy Its Address",
    text: "Select Copy link from the sharing options. Keep the URL without any extra message text.",
    image: "/images/tiktok/step-copy-link.webp",
    alt: "TikTok share menu with the Copy link option",
  },
  {
    title: "Submit The URL",
    text: "Paste the copied address above and press the arrow. Short vm.tiktok.com and vt.tiktok.com links are recognised too.",
    image: "/images/tiktok/step-paste-link-current.jpg",
    alt: "TikTok downloader with a video address entered and download modes beneath the field",
  },
  {
    title: "Choose MP4 Or MP3",
    text: "Save MP4 for the clip, or use MP3 when you need the soundtrack. Let the browser complete the transfer before opening it.",
    image: "/images/tiktok/step-save-file.webp",
    alt: "TikTok result with MP4 and MP3 download buttons",
  },
];

// The mascot standing at the foot of the staircase, looking up it. The drawing has not arrived yet,
// and the three clips on the steps are all mascot animations themselves, so the staircase runs
// without him for now: set this to his path and the grid gives him back his column on its own.
const MASCOT: string | null = null;

// One slab per thing you can save, laid out as a staircase climbing to the right (.pf-stairs): each
// slab reaches down to the floor so their top edges make the steps, and each one's clip sits on its
// own tread, like something left on the stair. The mascot stands on the floor at the foot of it.
// Short copy on purpose: the lowest step is only one riser tall.
// The clips are animated .webp converted from the client's GIFs - 8.9MB of GIF came to 1.35MB this
// way. They carry `unoptimized` because Next never resizes an animated file anyway, and warns on
// every request for one that does not say so.
const SAVES = [
  {
    id: "videos",
    title: "Videos",
    text: "An MP4 result keeps the moving picture and its available audio. The source controls the resolution we can deliver.",
    tag: "MP4",
    clip: "/images/tiktok/save-videos.webp",
  },
  {
    id: "clean",
    title: "No Watermark",
    text: "We remove TikTok’s added watermark. Text, captions or logos already included by the creator remain in the recording.",
    tag: "Platform mark removed",
    clip: "/images/tiktok/save-no-watermark.webp",
  },
  {
    id: "sound",
    title: "Audio From A Video",
    text: "Choose MP3 to keep the linked clip’s soundtrack as an audio file. The option uses that recording, including any speech or music within it.",
    tag: "MP3",
    clip: "/images/tiktok/save-sound.webp",
  },
  {
    id: "short",
    title: "Short Links",
    text: "We follow the shared address to find its video. If the short link fails, open it and copy the full URL.",
    tag: "vm / vt",
    clip: "/images/tiktok/save-short-links.webp" as string | null,
  },
];

// Where the file actually ends up once the browser has it. This is the browser's and the phone's
// behaviour, not ours - nothing here is a claim about the backend.
const LANDS = [
  {
    id: "iphone",
    tag: "iPhone",
    title: "Find The Saved Video",
    text: "Check the browser’s download list, then open the file in Files. Safari’s chosen location may be iCloud Drive or On My iPhone.",
    image: "/images/tiktok/where-iphone.webp",
    alt: "The Files app on an iPhone with the Downloads folder open and a saved video in it",
  },
  {
    id: "android",
    tag: "Android",
    title: "Open Your Downloads",
    text: "Your browser or file manager should list the completed transfer. Open it there if it has not appeared in the photo gallery.",
    image: "/images/tiktok/where-android.webp",
    alt: "An Android phone's Download folder with a saved video in it",
  },
  {
    id: "computer",
    tag: "PC or Mac",
    title: "Locate The Completed Transfer",
    text: "Use Show in folder on Windows or Show in Finder on a Mac from your browser’s downloads list.",
    image: "/images/tiktok/where-computer.webp",
    alt: "A computer's Downloads folder holding an MP4 and an MP3",
  },
];

// Why a link comes back with nothing. The first two quote the messages the tool really shows
// (lib/cobalt.ts): "This post is private." and "This post is unavailable." The download switch is
// deliberately hedged - TikTok's setting is real, but we do not read it ourselves.
const WHYS = [
  {
    id: "private",
    title: "Restricted Account Access",
    text: "A private post may be visible to you while signed in. We cannot use your account permissions to retrieve it.",
  },
  {
    id: "gone",
    title: "Unavailable Source Video",
    text: "The creator may have removed the clip, or access may have changed. Open the original to check whether it is still available.",
  },
  {
    id: "switch",
    title: "A Request Was Refused",
    text: "A public clip can fail because TikTok refuses the retrieval request. Wait before retrying, and report the error if the same address keeps failing.",
  },
  {
    id: "profile",
    title: "A Profile Address Was Copied",
    text: "Open the individual video from the profile and copy its shared link. The profile address does not identify which clip you want.",
  },
];

export default function TikTokDownloader() {
  const others = PLATFORMS.filter((p) => p.name !== "TikTok");

  return (
    <div className="page-tiktok">
      <PlatformStrip current="/tiktok-downloader" />

      {/* 1. hero: two chevron stacks facing each other with the downloader in the gap between them.
          The backdrop is drawn in code and has no background of its own, so the band's black shows
          through (components/NeonArrows.tsx). */}
      <section className="pf-hero-dark na-band relative isolate w-full overflow-hidden">
        <NeonArrows />

        <div className="na-hero mx-auto max-w-[1200px] px-[5vw] py-16 md:py-24 lg:px-6">
          <div className="pf-hero-text na-hero-text">
            <p className="inline-flex items-center gap-2 text-xs title-case tracking-[0.06em] text-[var(--muted)]">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--emphasis)]" />
              TikTok downloader
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">TikTok Downloader <em className="accent">Without Watermark</em></h1>

            <p className="mt-4 text-base md:text-lg">
              Download a public TikTok clip as an MP4 without the platform watermark. Save its soundtrack as MP3 too, with no account or app installation needed.
            </p>

            {/* the tool, in the gap the two stacks leave */}
            <div className="mt-8 w-full">
              <Grab placeholder="Paste a TikTok link" />
            </div>

            <ul className="mt-6 flex flex-wrap justify-center gap-2">
              {GETS.map((g) => (
                <li key={g} className="pf-chip">
                  {g}
                </li>
              ))}
            </ul>

            <p className="mt-5 text-xs">
              Only save a clip through {SITE.name} when you have the right to download it.
            </p>
          </div>
        </div>
      </section>

      {/* 2. three facts, straight under the hero, on TikTok's cyan */}
      <section className="pf-band-cyan w-full">
        <div className="relative mx-auto max-w-[1200px] px-[5vw] py-8 md:py-10 lg:px-6">
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

      {/* 3. the four steps, as two gears turning against each other. The band takes the full width so
             each wheel can sit half off its own edge of the screen, with the heading in the gap
             between them; they turn on their own and can be taken hold of and turned by hand
             (components/GearWheels.tsx). */}
      <section className="pf-band-red w-full overflow-x-clip">
        <GearWheels steps={STEPS} label="How to save a TikTok video">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-4xl lg:text-5xl">
            Save A TikTok Clip In <em className="accent">4 Steps</em>
          </h2>
          {/* only true where the wheels are actually turning - .gw-hint is hidden in the stack */}
          <p className="gw-hint mt-3 text-sm text-[var(--muted)] md:text-base">
            Drag either wheel to move through the instructions.
          </p>
        </GearWheels>
      </section>

      {/* 4. running claims, on the brand cyan */}
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

      {/* 5. what you can save, as a staircase: four slabs climbing to the right, each one reaching
             down to the floor so their top edges are the steps, with the mascot standing on the
             third tread. Below 768px it is a plain stack of boxes with the mascot above them. */}
      <section className="look-black w-full">
        <div className="pf-stairs-band">
          <StarsBackground starColor="#f7f2f2" />
          {/* tap anywhere on the band and a few more stars shoot out of that point */}
          <StarBurst />

          <div className="relative z-[1] mx-auto max-w-[1200px] px-[5vw] pt-16 pb-16 md:pt-24 md:pb-20 lg:px-6">
            <h2 className="max-w-[18ch] text-3xl font-bold leading-[1.1] md:text-5xl">
              TikTok File And <em className="accent">Link Options</em>
            </h2>
            <p className="mt-4 max-w-[60ch] text-[var(--muted)] md:text-lg">
              Use the format that fits the recording you want to keep. Creator graphics stay within the picture.
            </p>

            <div className="pf-stairs mt-10 md:mt-14" data-mascot={MASCOT ? "yes" : "no"}>
              {/* display: contents, so each step's clip and slab are grid items of the staircase
                  itself and can be placed in their own cells */}
              <ol className="pf-stairs-run list-none">
                {SAVES.map((item) => (
                  // display: contents on the step, so its clip and its slab are both grid items of
                  // the staircase and can be placed in their own cells
                  <li key={item.id} className="pf-stair-cell">
                    {item.clip ? (
                      <span className="pf-stair-clip">
                        <Image
                          src={item.clip}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 20vw, 70vw"
                          unoptimized
                        />
                      </span>
                    ) : null}

                    <div className="pf-stair">
                      <span className="pf-card-tag inline-flex">{item.tag}</span>
                      <h3 className="pf-stair-title">{item.title}</h3>
                      <p className="pf-stair-line">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ol>

              {MASCOT ? (
                <div className="pf-stair-mascot">
                  <Image src={MASCOT} alt="" fill sizes="(min-width: 1024px) 16vw, 46vw" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* 6. where the file goes once the browser has it, built on the same rail as the Instagram
             steps (.pf-rail): a line down the middle with a lit point that tracks the scroll, and
             the three devices alternating either side of it. The band stays on TikTok's white -
             only the layout is borrowed, not the colours. */}
      <section className="pf-band-white w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Find Your <em className="accent">Saved TikTok File</em>
          </h2>
          <p className="mt-4 max-w-[62ch] text-[var(--muted)] md:text-lg">
            After downloading, open the browser’s transfer list to locate the clip. The destination folder depends on your device settings.
          </p>

          {/* the same rail the Instagram steps use: a line down the middle with a lit point riding
              it, and each device landing on alternate sides. Not an <ol> - these are three places a
              file can be, not three things to do in order, so the badge is the device name rather
              than a number.
              The six halves each arrive once, from their own side, and then stay put whichever way
              the page moves afterwards - that is components/Reveal.tsx, and it is why these are not
              on a scroll timeline like the Instagram rail's are. */}
          <Reveal className="mt-12 md:mt-16">
            <ul className="pf-rail list-none">
              <span aria-hidden="true" className="pf-rail-dot" />

              {LANDS.map((l, i) => (
                <li key={l.id} className="pf-rail-step" data-side={i % 2 ? "right" : "left"}>
                  <div className="pf-rail-text" data-reveal>
                    <span className="pf-card-tag inline-flex">{l.tag}</span>
                    <h3 className="mt-4 text-2xl font-bold md:text-3xl">{l.title}</h3>
                    <p className="mt-3 text-[var(--muted)] md:text-lg">{l.text}</p>
                  </div>

                  <div className="pf-rail-art" data-reveal>
                    <Image src={l.image} alt={l.alt} fill sizes="(min-width: 768px) 30vw, 90vw" />
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 7. the other ten, as a ring that turns on its own, faster while the page scrolls, and can be
          grabbed and flung (components/ImageWheel.tsx) */}
      <PlatformGuidance platform="tiktok" />

      <section id="platforms" className="look-black w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Download From <em className="accent">Other Apps</em>
          </h2>
          <p className="mt-4 max-w-[60ch] text-[var(--muted)] md:text-lg">
            These pages handle recordings and pictures shared outside TikTok.
          </p>

          <div className="mt-6 md:mt-8">
            <PlatformRelated platforms={others} variant="tiktok" />
          </div>
        </div>
      </section>

      {/* 8. why a link sometimes comes back with nothing, right before the help band it leads into.
             Back on the brand red. The drawing rises into place and then bobs; the four reasons slide
             in from the right in turn, and back out again on the way up. */}
      <section className="pf-band-red w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <div className="pf-why">
            <div className="pf-why-art">
              <Image src="/images/tiktok/why-no-file.webp" alt="" fill sizes="(min-width: 900px) 32vw, 72vw" />
            </div>

            <div className="min-w-0">
              <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
                TikTok Links <em className="accent">And Access</em>
              </h2>
              <p className="mt-4 max-w-[56ch] text-[var(--muted)] md:text-lg">
                Read the message beneath the link field before retrying. It may identify an access restriction or a temporary problem reaching the source.
              </p>

              <ul className="pf-why-list mt-8 list-none">
                {WHYS.map((w) => (
                  <li key={w.id} className="pf-why-item">
                    <h3 className="pf-why-title">{w.title}</h3>
                    <p className="pf-why-line">{w.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 9. help, right before the black footer */}
      <section className="look-tiktok w-full">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-[5vw] py-12 text-center md:flex-row md:gap-10 md:py-14 md:text-left lg:px-6">
          <Image
            src="/images/tiktok/help-share.webp"
            alt=""
            width={600}
            height={600}
            sizes="160px"
            className="h-auto w-[140px] shrink-0 md:w-[160px]"
          />
          <div className="min-w-0">
            <h2 className="text-2xl font-bold md:text-4xl">Need Help With The Result?</h2>
            <p className="mt-2 max-w-[52ch] text-[var(--muted)]">
              The answers cover sound extraction, short addresses and logos that remain inside the recording.
            </p>
          </div>
          <Link href="#tiktok-faq" className="neon shrink-0 px-5 py-3 md:ml-auto">
            Read TikTok answers
          </Link>
        </div>
      </section>
    </div>
  );
}
