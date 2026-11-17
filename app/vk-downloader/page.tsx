import { pageMetadata } from "@/lib/page-seo";
// app/vk-downloader/page.tsx
// VK landing page, built on the one thing that is true of VK and of nothing else here: it answers
// to four hostnames. vk.com, vk.ru, m.vk.com and vkvideo.ru are all the same place, and
// lib/normalize.ts rewrites every one of them to vk.com before anything else happens. So the page
// is a routing diagram - four doors, one room, with the flow marching along the joins - and the
// steps are address bars showing what you are holding at each point.
//   blue hero > white: four doors one room > blue: the four address bars > white: what never comes >
//   blue ten more apps > white help
// Illustrated guidance below complements the route diagram and address-bar steps.
//
// VK IS in the verified list (README section 4: videos, tunnel, official embed), so unlike the
// Dailymotion and Bilibili pages this copy can be specific. It still claims nothing beyond that
// row: videos, a preview from VK's own embed, and the host rewriting that is plainly in the code.
//
// The colours are the ones already in lib/platforms.ts and are NOT verified against vk.com, which
// could not be reached from here. See the note above .look-vk in globals.css.
import Image from "next/image";
import Link from "next/link";
import PlatformGuidance from "@/components/PlatformGuidance";
import PlatformStrip from "@/components/PlatformStrip";
import PlatformRelated from "@/components/PlatformRelated";
import Reveal from "@/components/Reveal";
import { PLATFORMS } from "@/lib/platforms";
import { SITE } from "@/lib/site";
import VkHeroBackdrop from "./VkHeroBackdrop";
import VkHeroTool from "./VkHeroTool";
import heroStyles from "./hero.module.css";
import addressStyles from "./addresses.module.css";
import stepStyles from "./steps.module.css";
import sourceStyles from "./sources.module.css";
import guidanceStyles from "./guidance.module.css";

export const metadata = pageMetadata("/vk-downloader");

// every host VK answers to, exactly as normalize.ts lists them
const DOORS = ["vk.com", "vk.ru", "m.vk.com", "vkvideo.ru"];

// the joins, drawn to stretch into whatever box they are given
const WIRES = [
  "M0 12 C 48 12, 52 50, 100 50",
  "M0 37 C 48 37, 52 50, 100 50",
  "M0 63 C 48 63, 52 50, 100 50",
  "M0 88 C 48 88, 52 50, 100 50",
];

// the steps, each headed by the address bar you are holding at that moment
const STEPS = [
  {
    url: "vkvideo.ru/video-00000_000",
    title: "Select The Recording",
    text: "Open an individual public video on VK or VK Video. If you found it in a community post, select the video itself.",
  },
  {
    url: "copied to clipboard",
    title: "Copy Its Address",
    text: "Use the video’s sharing control or copy the open page URL. The examples shown here illustrate the expected address format.",
  },
  {
    url: "vk.com/video-00000_000",
    title: "Request A Result",
    text: "Paste that address into the field above and submit it. The result gives you a file button for the selected recording.",
  },
  {
    url: "video.mp4",
    title: "Download The Clip",
    text: "Use the returned file button and follow the transfer in your browser. Open the saved recording after it has finished.",
  },
];

const NEVER = [
  {
    id: "private",
    title: "Restricted Audience",
    text: "Friends only material needs account permissions that the downloader cannot borrow from your browser.",
  },
  {
    id: "gone",
    title: "Removed Source",
    text: "A deleted video cannot be recovered from its old URL through this tool. Check whether the creator provides another public copy.",
  },
  {
    id: "page",
    title: "Community Or Profile Link",
    text: "Select the particular recording before sharing its address. A profile or community contains several items and does not choose one for the request.",
  },
];

export default function VkDownloader() {
  const others = PLATFORMS.filter((p) => p.name !== "VK");

  return (
    <div className="page-vk">
      <PlatformStrip current="/vk-downloader" />

      {/* 1. hero on the deep blue */}
      <section className={`look-vk w-full ${heroStyles.hero}`}>
        <VkHeroBackdrop />
        <div className={`${heroStyles.content} mx-auto max-w-[1200px] px-[5vw] py-16 text-center md:py-24 lg:px-6`}>
          <p className="inline-flex items-center gap-2 text-xs title-case tracking-[0.06em] text-[var(--muted)]">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            VK downloader
          </p>

          <h1 className={heroStyles.heading}>
            <span className={heroStyles.titleLine}>
              <span>VK</span>{" "}<span>Video</span>{" "}<span>Downloader</span>
            </span>{" "}
            <span className={heroStyles.accentEntrance}>
              <span className={heroStyles.hangTarget} tabIndex={0}>
                <em className={heroStyles.hangingText}>For Public Clips</em>
              </span>
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-[60ch] text-base text-[var(--muted)] md:text-lg">
            Save a public VK or VK Video recording to your device. Enter its video address and use the download button when the result is ready.
          </p>

          <VkHeroTool />

          <p className="mt-5 text-xs text-[var(--muted)]">
            Use {SITE.name} with recordings you are entitled to download.
          </p>
        </div>
      </section>

      {/* 2. the signature: four doors into one room */}
      <section className="pf-band-clear w-full">
        <Reveal className={`${addressStyles.addresses} mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6`}>
          <h2 className={`${addressStyles.fade} text-3xl font-bold leading-[1.1] md:text-5xl`} data-reveal>
            VK Addresses <em className="accent">We Recognise</em>
          </h2>
          <p className={`${addressStyles.fade} ${addressStyles.intro} mt-4 max-w-[62ch] text-[var(--muted)] md:text-lg`} data-reveal>
            The tool recognises the video hosts shown below and handles them as VK requests. Use an individual recording’s URL on any of these domains.
          </p>

          <div className={`${addressStyles.fade} ${addressStyles.diagram} mt-8 md:mt-12`} data-reveal>
            <div className={`${addressStyles.route} vk-route`}>
              <ul className="vk-doors list-none">
                {DOORS.map((d) => (
                  <li key={d} className="vk-door">
                    {d}
                  </li>
                ))}
              </ul>

              <svg aria-hidden="true" className="vk-wires" viewBox="0 0 100 100" preserveAspectRatio="none">
                {WIRES.map((d) => (
                  <path key={d} d={d} />
                ))}
              </svg>

              <div className={addressStyles.recognised}>
                <p className="vk-room">
                  <b>vk.com</b>
                  <small>recognised video link</small>
                </p>
                <Image
                  src="/images/vk/recognised-link.webp"
                  alt="Devliz pointing to the recognised VK link while holding a checked video card"
                  width={1448}
                  height={1086}
                  sizes="(min-width: 1333px) 320px, (min-width: 900px) 24vw, (max-width: 580px) 45vw, 280px"
                  className={addressStyles.mascot}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 3. the four steps, each headed by the address bar you are holding */}
      <section className={`${stepStyles.section} look-vk w-full`}>
        <Reveal className={`${stepStyles.sequence} mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6`}>
          <h2 className={`${stepStyles.heading} text-3xl font-bold leading-[1.1] md:text-5xl`} data-reveal>
            Copy And Save <em className="accent">A VK Video</em>
          </h2>

          <div className="mt-8 md:mt-12">
            <ol className="vk-steps list-none">
              {STEPS.map((s) => (
                <li key={s.title} className={`${stepStyles.step} vk-step`} data-reveal>
                  <span className="vk-url">
                    <i aria-hidden="true" />
                    {s.url}
                  </span>
                  <h3 className="vk-step-title">{s.title}</h3>
                  <p className="vk-step-line">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </section>

      {/* 4. what never comes back */}
      <section className="pf-band-clear w-full">
        <Reveal className={`${sourceStyles.sources} mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6`}>
          <h2 className={`${sourceStyles.fade} text-3xl font-bold leading-[1.1] md:text-5xl`} data-reveal>
            Check These <em className="accent">Unavailable Sources</em>
          </h2>

          <div className="mt-8 md:mt-10">
            <ul className="vk-steps list-none">
              {NEVER.map((n) => (
                <li key={n.id} className={`${sourceStyles.fade} ${sourceStyles.card} vk-step`} data-reveal>
                  <h3 className="vk-step-title" style={{ marginTop: 0 }}>
                    {n.title}
                  </h3>
                  <p className="vk-step-line">{n.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* 5. the other ten, as a ring that turns on its own and can be grabbed and flung */}
      <PlatformGuidance platform="vk" revealClassName={guidanceStyles.guidance} />

      <section id="platforms" className="look-vk w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Download From <em className="accent">Another Platform</em>
          </h2>
          <p className="mt-4 max-w-[60ch] text-[var(--muted)] md:text-lg">
            Use a different tool for media posted outside VK and VK Video.
          </p>

          <div className="mt-6 md:mt-8">
            <PlatformRelated platforms={others} variant="vk" />
          </div>
        </div>
      </section>

      {/* 6. help, right before the black footer */}
      <section className="pf-band-clear w-full">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-[5vw] py-12 text-center md:flex-row md:gap-10 md:py-14 md:text-left lg:px-6">
          <Image
            src="/images/vk/help-video.webp"
            alt=""
            width={600}
            height={600}
            sizes="160px"
            className="h-auto w-[140px] shrink-0 md:w-[160px]"
          />
          <div className="min-w-0">
            <h2 className="text-2xl font-bold md:text-4xl">Questions About VK Results</h2>
            <p className="mt-2 max-w-[52ch] text-[var(--muted)]">
              Find answers about video links, source resolution and choosing a recording from a community feed.
            </p>
          </div>
          <Link href="#vk-faq" className="neon shrink-0 px-5 py-3 md:ml-auto">
            Open VK help
          </Link>
        </div>
      </section>
    </div>
  );
}
