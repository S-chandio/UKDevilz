import { pageMetadata } from "@/lib/page-seo";
// app/pinterest-downloader/page.tsx
// Pinterest landing page. Pinterest is one shape - a board of white pin cards at uneven heights -
// so this page is a board, and nothing on it is borrowed from the other platform pages: no facts
// grid, no ticker, no centre rail, no .pf-kinds, no .pf-why, no post cards, no time axis.
//   cream hero with pins floating either side of the tool > red: the board (real masonry) >
//   cream: one pin's journey, left to right > red: the pins that never come >
//   cream ten more apps > red help
// It needs no artwork: the pins are cards, not pictures.
//
// Copy must match what the backend really does (README section 4): pins, image and video, through
// the tunnel. pin.it short links are in normalize.ts's SHORT_HOSTS and followed first. The mode row
// is left on, unlike the older "photo-only" note in section 17, because section 4 lists video pins
// as well and the modes are meaningful on those.
import Image from "next/image";
import Link from "next/link";
import Grab from "../grab";
import PlatformGuidance from "@/components/PlatformGuidance";
import PlatformStrip from "@/components/PlatformStrip";
import Reveal from "@/components/Reveal";
import { PLATFORMS } from "@/lib/platforms";
import { PLATFORM_ICONS } from "@/lib/platform-icons";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata("/pinterest-downloader");

// the pins that drift either side of the tool, decorative only
const FLOATERS = [
  { id: "a", side: "left", title: "Image pins", note: "Available image dimensions" },
  { id: "b", side: "left", title: "pin.it links", note: "Shared addresses recognised" },
  { id: "c", side: "right", title: "Video pins", note: "Video files when available" },
  { id: "d", side: "right", title: "No account", note: "No Pinterest sign in required" },
];

// The board. Uneven on purpose - a board of equal cards is just a grid. Sizes are s / m / l.
const BOARD = [
  {
    id: "images",
    size: "m",
    kind: "Image pin",
    title: "Save An Image File",
    line: "The result uses the picture available from Pinterest. Save it with the image button, then check its dimensions on your device.",
  },
  {
    id: "video",
    size: "s",
    kind: "Video pin",
    title: "Request The Video",
    line: "A supported video pin can return a clip. Its soundtrack and picture depend on the media the source supplies.",
  },
  {
    id: "free",
    size: "s",
    kind: "Cost",
    title: "No Download Fee",
    line: "You can submit a pin without entering payment details or starting a trial.",
  },
  {
    id: "shortlink",
    size: "m",
    kind: "Short links",
    title: "Use A Shared Address",
    line: "A pin.it URL redirects to a pin. We follow that address during the request; if it fails, copy the destination page’s full link.",
  },
  {
    id: "login",
    size: "s",
    kind: "Account",
    title: "Keep Your Account Private",
    line: "We do not need your Pinterest credentials. The source pin must be accessible to the retrieval service.",
  },
  {
    id: "kept",
    size: "s",
    kind: "Storage",
    title: "Save To Your Device",
    line: "Choose a location through your browser and let the transfer finish before closing it.",
  },
  {
    id: "secret",
    size: "m",
    state: "no",
    kind: "Access",
    title: "Private Board Content",
    line: "A secret board requires account permissions that this tool does not share. Use a publicly available pin.",
  },
  {
    id: "quality",
    size: "l",
    kind: "Quality",
    title: "Check Image Dimensions",
    line: "The tool has no image size control. A picture supplied by Pinterest may have different dimensions from the creator’s original.",
  },
];

// One pin's journey, left to right.
const JOURNEY = [
  { title: "Select An Individual Pin", text: "Open the picture or video you want to save from its board. Make sure you have reached the pin’s own page." },
  { title: "Copy The Pin Address", text: "Use its sharing options or the browser address bar. Both a full Pinterest URL and a pin.it link can identify the source." },
  { title: "Request The Media", text: "Enter that address above and press the arrow. The file options appear when the service returns a result." },
  { title: "Open The Saved Item", text: "Choose the image or video button. Your browser’s downloads list records the transfer and lets you locate the completed file." },
];

// Pins that never arrive, as outlined cards on the board.
const NEVER = [
  {
    id: "secret",
    kind: "Account access",
    title: "A Pin Is Private",
    line: "If the pin is visible only when signed into an authorised account, we cannot use those permissions to retrieve it.",
  },
  {
    id: "deleted",
    kind: "Unavailable source",
    title: "The Pin Was Removed",
    line: "A deleted pin no longer provides its media through that address. Ask the creator for an available source if you need another copy.",
  },
  {
    id: "board",
    kind: "Collection address",
    title: "The Link Opens A Board",
    line: "Select the individual pin within the board before copying. A collection URL does not choose a particular picture or recording.",
  },
];

export default function PinterestDownloader() {
  const others = PLATFORMS.filter((p) => p.name !== "Pinterest");

  return (
    <div className="page-pin">
      <PlatformStrip current="/pinterest-downloader" />

      {/* 1. hero: the tool with pins drifting either side of it */}
      <section id="pinterest-tool" className="pb-art-hero pf-band-cream w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-24 lg:px-6">
          <div className="pb-hero">
            <div aria-hidden="true" className="pb-side" data-side="left">
              {FLOATERS.filter((f) => f.side === "left").map((f) => (
                <span key={f.id} className="pb-chip-pin">
                  {f.title}
                  <small>{f.note}</small>
                </span>
              ))}
            </div>

            <div className="text-center">
              <p className="inline-flex items-center gap-2 text-xs title-case tracking-[0.06em] text-[var(--muted)]">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                Pinterest downloader
              </p>

              <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">Pinterest Downloader For <em className="accent">Images And Videos</em></h1>

              <p className="mx-auto mt-4 max-w-[46ch] text-base text-[var(--muted)] md:text-lg">
                Save the picture or recording attached to a public pin. Enter its Pinterest or pin.it address to request the available file without creating an account.
              </p>

              <div className="mt-8">
                <Grab placeholder="Paste a Pinterest link" />
              </div>

              <p className="mt-5 text-xs text-[var(--muted)]">
                Make sure you have the right to save the pin’s media through {SITE.name}.
              </p>
            </div>

            <div aria-hidden="true" className="pb-side" data-side="right">
              {FLOATERS.filter((f) => f.side === "right").map((f) => (
                <span key={f.id} className="pb-chip-pin">
                  {f.title}
                  <small>{f.note}</small>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* A pin's four stops, directly below the hero. */}
      <section className="pb-journey pf-band-cream w-full" aria-labelledby="pin-journey-heading">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <h2 id="pin-journey-heading" className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Save A Pin In <em className="accent">4 Steps</em>
          </h2>
          <ol className="pb-journey-list">
            {JOURNEY.map((j, i) => (
              <li key={j.title} className="pb-journey-row">
                <div className="pb-journey-status" aria-hidden="true">
                  <span>STOP 0{i + 1}</span>
                  <div className="pb-journey-bars">{[0, 1, 2, 3].map((n) => <i key={n} data-active={n <= i} />)}</div>
                  <div className="pb-journey-progress"><span style={{ width: ((i + 1) * 25) + "%" }} /></div>
                  <small>{["Open the pin", "Copy its URL", "Send the request", "Save the result"][i]}</small>
                </div>
                <div className="pb-journey-copy">
                  <span className="pb-journey-label">Step {i + 1} of 4</span>
                  <h3>{j.title}</h3>
                  <p>{j.text}</p>
                </div>
                <Image src={`/images/pinterest/step-${["board", "copy", "paste", "save"][i]}.webp`} alt="" width={480} height={480} sizes="(max-width: 767px) 140px, 280px" className="pb-journey-art" />
              </li>
            ))}
          </ol>
          <p className="pb-journey-outro">If you found the item in a board, open it first so your copied address points to that pin.</p>
        </div>
      </section>

      {/* 2. an illustrated guide to what a public pin can return */}
      <section className="pb-guide w-full" aria-labelledby="pin-guide-heading">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <p className="pb-guide-eyebrow">Pin formats and access</p>
          <h2 id="pin-guide-heading" className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Pinterest Downloads And <em className="accent">File Options</em>
          </h2>
          <p className="pb-guide-intro">
            The source pin determines whether you receive a picture or video. Check the returned file type and image dimensions before using it.
          </p>

          <Reveal className="mt-8 md:mt-12">
            <ol className="pb-guide-list">
              {BOARD.map((p, i) => (
                <li key={p.id} className="pb-guide-row">
                  <div className="pb-guide-copy">
                    <span className="pb-guide-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <span className="pb-guide-kind">{p.kind}</span>
                      <h3>{p.title}</h3>
                      <p>{p.line}</p>
                    </div>
                  </div>
                  <div className="pb-guide-visual" aria-hidden="true">
                    <span className="pb-guide-arrow" />
                    <Image
                      src={`/images/pinterest/guide-${p.id}.webp`}
                      alt=""
                      width={480}
                      height={480}
                      sizes="(max-width: 767px) 96px, 180px"
                      className="pb-guide-art"
                    />
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* 4. the pins that never come, outlined on the red */}
      <section className="look-pin w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Why A Pin <em className="accent">Cannot Be Retrieved</em>
          </h2>
          <p className="mt-4 max-w-[62ch] text-[var(--muted)] md:text-lg">
            Check the original address against these cases before sending another request.
          </p>

          <Reveal className="mt-8 md:mt-12">
            <div className="pb-board">
              {NEVER.map((n) => (
                <article key={n.id} className="pb-pin" data-size="m" data-state="no" data-reveal>
                  <span className="pb-kind">{n.kind}</span>
                  <h3 className="pb-title">{n.title}</h3>
                  <p className="pb-line">{n.line}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5. a compact platform logo wall */}
      <PlatformGuidance platform="pinterest" />

      <section id="platforms" className="pb-platforms w-full" aria-labelledby="pin-platforms-heading">
        <div className="pb-platforms-layout mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <div className="pb-platforms-intro">
            <h2 id="pin-platforms-heading">
              <span>More Tools For</span> <em className="accent">Your Media Links</em>
            </h2>
            <p>Use another source page for a post, reel or track that was shared outside Pinterest.</p>
            <Link href="#pinterest-tool" className="pb-platforms-cta">Return to the link field <span aria-hidden="true">↗</span></Link>
          </div>
          <ul className="pb-platforms-logos" aria-label="Other platform tools">
            {others.map((p) => (
              <li key={p.href}>
                <Link href={p.href} aria-label={`${p.name} downloader`}>
                  <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" style={{ color: PLATFORM_ICONS[p.name].hex }} className={p.name === "Snapchat" ? "pb-logo-snapchat" : undefined}>
                    <path fill="currentColor" d={PLATFORM_ICONS[p.name].path} />
                  </svg>
                  <span>{p.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. help, right before the black footer */}
      <section className="look-pin w-full">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-[5vw] py-12 text-center md:flex-row md:gap-10 md:py-14 md:text-left lg:px-6">
          <Image
            src="/images/pinterest/help-pin.webp"
            alt=""
            width={600}
            height={600}
            sizes="160px"
            className="h-auto w-[140px] shrink-0 md:w-[160px]"
          />
          <div className="min-w-0">
            <h2 className="text-2xl font-bold md:text-4xl">Questions About Pinterest Files</h2>
            <p className="mt-2 max-w-[52ch] text-[var(--muted)]">
              The help section explains image sizes, shortened links and saving a pin that contains a video.
            </p>
          </div>
          <Link href="#pinterest-faq" className="neon shrink-0 px-5 py-3 md:ml-auto">
            Read Pinterest answers
          </Link>
        </div>
      </section>
    </div>
  );
}
