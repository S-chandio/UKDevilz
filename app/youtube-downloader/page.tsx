import { pageMetadata } from "@/lib/page-seo";
// app/youtube-downloader/page.tsx
// YouTube landing page, and the template for the other ten. The page is a stack of colour blocks that
// alternate dark and bright, the way the reference site does it:
//   black strip > open hero > red steps > off-white ticker > black circles > off-white table >
//   grey bento > black facts > the drawing band > black platforms > off-white FAQ > red help > black footer
// Everything is built from .pf-* classes and lib/platforms.ts, so a new platform page is this page with
// a different look class, artwork and copy.
// Copy must match what the backend really does (README section 4): videos and Shorts up to 1080p,
// MP3 audio, silent clips, no login, no app required.
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import Grab from "../grab";
import PlatformGuidance from "@/components/PlatformGuidance";
import PlatformStrip from "@/components/PlatformStrip";
import { PLATFORMS } from "@/lib/platforms";
import { PLATFORM_ICONS } from "@/lib/platform-icons";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata("/youtube-downloader");

const Rule = () => <div aria-hidden="true" className="pf-rule" />;

const GETS = ["Videos And Shorts", "Quality Options", "MP3 Audio", "No Sound Mode"];

const TICKER = ["Paste a link", "Get the file", "No account", "Browser downloads", "Quality choices", "MP3 too"];

// little line drawings; the site font has no icons and a logo would be wrong here
const ICON: Record<string, ReactNode> = {
  play: <path d="M7 4.5v13l11-6.5-11-6.5z" />,
  short: <path d="M8 3h8v18H8zM3 8h2M3 12h2M3 16h2M19 8h2M19 12h2M19 16h2" />,
  note: <path d="M9 18V5l10-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm10-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />,
  mute: <path d="M11 5 6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />,
  gauge: <path d="M12 21a9 9 0 1 1 9-9M12 12l5-3" />,
  grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
};

// one circle per thing you can save. d is the diameter and x / y the spot, both as a percentage of
// the stage; the stage is twice as wide as it is tall, so a diameter of 26% is 52% of the height.
// Sizes are deliberately all different. Drop a square .webp at the image path and it appears.
const SAVES = [
  {
    id: "videos",
    icon: "play",
    title: "Videos",
    text: "Request an MP4 from an individual watch link, then open the result on your device.",
    tag: "MP4",
    bg: "transparent",
    ink: "#f7f2f2",
    image: "/images/youtube/save-videos.webp",
    d: "26%",
    x: "1%",
    y: "22%",
  },
  {
    id: "shorts",
    icon: "short",
    title: "Shorts",
    text: "Copy the address of the Short you want to keep. You can submit it through the same field as a regular video.",
    tag: "MP4",
    bg: "transparent",
    ink: "#f7f2f2",
    image: "/images/youtube/save-shorts.webp",
    d: "17.5%",
    x: "28.5%",
    y: "5%",
  },
  {
    id: "audio",
    icon: "note",
    title: "Audio Only",
    text: "Choose MP3 to save the soundtrack separately. You can listen to the recording in an audio player without keeping the video.",
    tag: "MP3",
    bg: "transparent",
    ink: "#f7f2f2",
    image: "/images/youtube/save-audio.webp",
    d: "14%",
    x: "48.5%",
    y: "19%",
  },
  {
    id: "no-sound",
    icon: "mute",
    title: "No Sound Mode",
    text: "Choose No sound to save a silent version of the clip. This option removes the soundtrack while keeping the video.",
    tag: "MP4",
    bg: "transparent",
    ink: "#f7f2f2",
    image: "/images/youtube/save-no-sound.webp",
    d: "21%",
    x: "27.5%",
    y: "45%",
  },
  {
    id: "quality",
    icon: "gauge",
    title: "Pick Your Quality",
    text: "The resolution controls appear once the field contains a YouTube address.",
    tag: "Quality choices",
    bg: "transparent",
    ink: "#f7f2f2",
    image: "/images/youtube/quality-selection.webp",
    d: "11.5%",
    x: "52%",
    y: "53%",
  },
  {
    id: "more",
    icon: "grid",
    title: "Other Sources",
    text: "Find the matching tool when your next link comes from another platform.",
    tag: "Browse tools",
    bg: "transparent",
    ink: "#f7f2f2",
    href: "#platforms",
    d: "11%",
    x: "12%",
    y: "74%",
  },
];

// Each step carries its own picture. `tilt` leans the frame in the page, `turn` swings it away from
// the reader on its own axis - both are wiped on hover so the card comes straight and sharp
// (.pf-step-art in globals.css).
const STEPS = [
  {
    title: "Copy A Video Address",
    text: "Open Share on the video and select Copy link. A direct watch or Shorts address identifies the recording you want.",
    image: "/images/youtube/step-copy-link.webp",
    alt: "Illustrated video share panel with Copy link highlighted",
    tilt: "6deg",
    turn: "0deg",
  },
  {
    title: "Choose A Mode",
    text: "Paste the address, select the format and choose a video quality if needed. Press the arrow to send your request.",
    image: "/images/youtube/step-paste-link.webp",
    alt: "Link field with the Paste button and submit arrow",
    tilt: "-6deg",
    turn: "0deg",
  },
  {
    title: "Download The Result",
    text: "Use the MP4 or MP3 button when a result is ready. Your browser’s downloads list shows whether the transfer has finished.",
    image: "/images/youtube/step-save-file.webp",
    alt: "Illustrated MP4 download button beside a video preview",
    tilt: "2deg",
    turn: "-18deg",
  },
];

// what the mode you choose actually gives you (app/grab.tsx: Auto, Audio only, No sound + YT qualities)
const TABLE = [
  { pick: "Auto", get: "Video with the available soundtrack", file: "MP4" },
  { pick: "Best", get: "Highest quality the service can supply", file: "MP4" },
  { pick: "1080p", get: "Request Full HD from a suitable source", file: "MP4" },
  { pick: "720p", get: "Request a 720p version", file: "MP4" },
  { pick: "360p", get: "Request a smaller video frame", file: "MP4" },
  { pick: "Audio only", get: "Soundtrack converted to MP3", file: "MP3" },
  { pick: "No sound", get: "Request video without its soundtrack", file: "MP4" },
];

// the bento: six panels, one big one holding two rows. Claims have to match the backend (README
// section 4) - up to 1080p, MP4 / MP3 / silent MP4, no app required, no account
const BENTO = [
  {
    size: "big",
    title: "Choose A Smaller File",
    text: "A lower resolution can save storage and transfer time. For a clearer picture, select a higher option when the original recording supports it.",
    href: "#formats",
    more: "Compare quality options",
  },
  {
    size: "wide",
    title: "Check The File Extension",
    text: "MP4 opens as a video and MP3 contains audio. The buttons identify the format before you start the transfer.",
  },
  {
    size: "wide",
    title: "Start Without Signing In",
    text: "You do not need a YouTube or ukdevliz account to make a request. Private and restricted material may still be inaccessible.",
  },
  {
    size: "small",
    title: "Wait For File Preparation",
    text: "Some results need video and audio joined before delivery. Leave the request running while the service prepares them.",
  },
  {
    size: "small",
    title: "Listen Before Reusing Audio",
    text: "Play the completed file and check its soundtrack. The available recording may already contain silence or missing audio.",
  },
  {
    size: "small",
    title: "Resume An Interrupted Transfer",
    text: "If your browser reports an interrupted download, return to the original link and request a fresh result.",
    href: "#faq",
    more: "Get download help",
  },
];

const FACTS = [
  { big: "Free", small: "No download fee." },
  { big: "No Login", small: "No personal account credentials." },
  { big: "File Downloads", small: "No media archive on our servers." },
  { big: "Best", small: "Quality depends on the available source." },
];

const SAFETY = [
  "We send your chosen link and settings to the service that retrieves the media.",
  "The result may include an embedded preview supplied by another platform.",
  "Read the Privacy Policy for details about technical records and provider connections.",
];

const FAQ = [
  {
    q: "Can I download without a subscription?",
    a: "Yes. The tool has no subscription step or payment form. Your internet connection may still have data charges.",
  },
  {
    q: "How do I submit a Short?",
    a: "Open the individual Short and copy its shared address. The tool accepts that link without needing the channel page.",
  },
  {
    q: "Can I convert the soundtrack to MP3?",
    a: "Select Audio only before submitting the link, or choose MP3 from the video result. We convert the available soundtrack into an audio file.",
  },
  {
    q: "Does Best always produce 4K?",
    a: "Best selects the highest quality available for that recording. Its resolution depends on the source, so it does not always mean 4K.",
  },
  {
    q: "Why does a public video sometimes fail?",
    a: "YouTube may refuse a request, or the media may be unavailable to the retrieval service. Confirm the original still plays, then report a persistent error with its public address.",
  },
  {
    q: "Can I retrieve an earlier download?",
    a: "We do not keep a library of downloaded videos. Keep the file on your device, or submit the original address again while the recording remains available.",
  },
];

// TikTok, X and Dailymotion are black brands: on the black band they need the off-white instead
const logoColour = (hex: string) => (Number.parseInt(hex.slice(1), 16) < 0x222222 ? "#f7f2f2" : hex);

export default function YouTubeDownloader() {
  const others = PLATFORMS.filter((p) => p.name !== "YouTube");

  return (
    <>
      <PlatformStrip current="/youtube-downloader" />

      <Rule />

      {/* 1. hero: the artwork is the background, full width and shown whole, with the text over it */}
      <section className="relative isolate w-full overflow-hidden">
        {/* mascot pulling the file out of the player: decorative, the headline already says what the page does */}
        <div aria-hidden="true" className="pf-art">
          <Image
            src="/images/youtube/youtube-hero-devil-filmstrip.webp"
            alt=""
            fill
            preload
            sizes="100vw"
          />
        </div>

        <div className="pf-hero mx-auto max-w-[1200px] px-[5vw] pt-12 lg:px-6">
          <div className="pf-hero-text">
            <p className="inline-flex items-center gap-2 text-xs title-case tracking-[0.06em] text-[var(--muted)]">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              YouTube downloader
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">YouTube Downloader For <em className="accent">Video And Audio</em></h1>

            <p className="mt-4 text-base md:text-lg">
              Download a public video or Short, or save its audio as MP3. Choose the quality after entering your link, then save the available result without signing in.
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {GETS.map((g) => (
                <li key={g} className="pf-chip">
                  {g}
                </li>
              ))}
            </ul>

            <div className="mt-8 w-full">
              <Grab placeholder="Paste a YouTube link here" />
            </div>

            <p className="mt-4 text-xs">
              Use {SITE.name} to save recordings you own or have permission to download.
            </p>
          </div>
        </div>
      </section>

      <Rule />

      {/* 2. three steps, on red */}
      <section className="look-red w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-24 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Download A YouTube Video In <em className="accent">3 Steps</em>
          </h2>

          <ol className="pf-steps mt-10 list-none md:mt-14">
            {STEPS.map((s, i) => (
              <li key={s.title} className="pf-step" tabIndex={0}>
                <div className="pf-step-head">
                  <span aria-hidden="true" className="pf-step-num">
                    {i + 1}
                  </span>
                  <span
                    className="pf-step-art"
                    style={
                      { "--tilt": s.tilt, "--turn": s.turn } as CSSProperties
                    }
                  >
                    <Image src={s.image} alt={s.alt} fill sizes="(min-width: 768px) 18rem, 60vw" />
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold md:text-2xl">{s.title}</h3>
                <p className="mt-2 text-[var(--muted)]">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Rule />

      {/* 3. running claims, off-white against the red above and the black below */}
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

      <Rule />

      {/* 4. what you can save: a cluster of circles, each a different size. Hover one and the rest
          fade out while its text appears on the right (all CSS, see .pf-stage in globals.css) */}
      <section className="look-black yt-save-section w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-24 lg:px-6">
          <h2 className="max-w-[18ch] text-3xl font-bold leading-[1.1] md:text-5xl">
            Video And Audio Options For <em className="accent">YouTube</em>
          </h2>
          <p className="mt-4 max-w-[60ch] text-[var(--muted)] md:text-lg">
            Choose the type of file you need.<span className="yt-save-hover-copy"> Open a circle for its description.</span>
          </p>

          <div className="pf-stage mt-10 md:mt-14">
            {SAVES.map((item) => {
              const style = {
                "--d": item.d,
                "--x": item.x,
                "--y": item.y,
                "--circle-bg": item.bg,
                "--circle-ink": item.ink,
              } as CSSProperties;
              const inside = (
                <>
                  {/* a circle with a picture says what it is on its own; the name arrives with the
                      caption on hover. Only a circle without one carries an icon and a label. */}
                  {item.image ? (
                    <Image src={item.image} alt="" width={600} height={600} sizes="(min-width: 1024px) 320px, 45vw" />
                  ) : (
                    <>
                      <span aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          {ICON[item.icon]}
                        </svg>
                      </span>
                      <span className="pf-circle-title">{item.title}</span>
                    </>
                  )}
                </>
              );

              return (
                <div key={item.id} className="pf-layer" data-save-kind={item.id}>
                  {item.href ? (
                    <Link href={item.href} className="pf-circle" style={style}>
                      {inside}
                    </Link>
                  ) : (
                    <span className="pf-circle" style={style}>
                      {inside}
                    </span>
                  )}

                  <div className="pf-cap">
                    <h3 className="text-2xl font-bold md:text-4xl">{item.title}</h3>
                    <p className="mt-3 text-[var(--muted)] md:text-lg">{item.text}</p>
                    <span className="pf-card-tag mt-4 inline-flex">{item.tag}</span>
                  </div>
                </div>
              );
            })}

            <p className="pf-hint text-[var(--muted)] md:text-lg">
              Select an option to read its description.
            </p>
          </div>
        </div>
      </section>

      <Rule />

      {/* 5. what each choice gives you */}
      <section id="formats" className="w-full">
        <div className="mx-auto max-w-[900px] px-[5vw] py-16 md:py-24 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Video Quality And <em className="accent">File Formats</em>
          </h2>
          <p className="mt-4 max-w-[60ch] text-[var(--muted)] md:text-lg">
            Choose 360p, 720p, 1080p or Best for a video request. The service may return a lower resolution if the source or retrieval method limits it.
          </p>

          <table className="pf-table mt-8 md:mt-12">
            <thead>
              <tr>
                <th scope="col">Setting</th>
                <th scope="col">Requested result</th>
                <th scope="col">File</th>
              </tr>
            </thead>
            <tbody>
              {TABLE.map((r) => (
                <tr key={r.pick}>
                  <th scope="row">{r.pick}</th>
                  <td>{r.get}</td>
                  <td>{r.file}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Rule />

      {/* 6. what you get, as a bento: one big panel and five around it (.pf-bento in globals.css).
          The drawing is the whole band - it is a frame with an empty black middle, so the cards sit
          in the middle of it and the band's own black fills whatever the picture does not reach. */}
      <section
        className="look-black pf-bg pf-bg-get w-full overflow-hidden"
        style={{ "--band-bg": "url('/images/youtube/section-what-you-get.webp')" } as CSSProperties}
      >
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-24 lg:px-6">
          <div className="pf-get-head">
            <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
              Preparing And Saving <em className="accent">Your File</em>
            </h2>
            <p className="mt-4 max-w-[60ch] text-[var(--muted)] md:text-lg">
              Check the format before downloading, and allow time for media that needs processing.
            </p>
          </div>

          <div className="pf-bento mt-10 md:mt-14">
            {BENTO.map((b) => (
              <article key={b.title} className="pf-bento-card" data-size={b.size}>
                {b.href && (
                  <Link href={b.href} className="pf-bento-arrow" aria-label={`${b.more}: ${b.title}`}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </Link>
                )}
                <h3 className="pf-bento-title">{b.title}</h3>
                <p className="pf-bento-text">{b.text}</p>
                {b.href && (
                  <Link href={b.href} className="pf-bento-more" tabIndex={-1}>
                    {b.more}
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <Rule />

      {/* 7. four facts, on black */}
      <section className="look-black w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-14 md:py-16 lg:px-6">
          <ul className="pf-facts list-none">
            {FACTS.map((f) => (
              <li key={f.big} className="pf-fact">
                <p className="text-2xl font-bold md:text-3xl">{f.big}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{f.small}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Rule />

      {/* 8. what happens to your file: the drawing is the whole band, so the words sit on a slab */}
      <section
        className="look-grey pf-bg w-full"
        style={{ "--band-bg": "url('/images/sections/section-nothing-kept.webp')" } as CSSProperties}
      >
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-24 lg:px-6">
          <div className="pf-panel">
            <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
              How We Process <em className="accent">A Link</em>
            </h2>
            <ul className="mt-7 flex list-none flex-col gap-4">
              {SAFETY.map((s) => (
                <li key={s} className="pf-point">
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m4 12 6 6L20 6" />
                  </svg>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Rule />

      {/* 9. the other ten, on black */}
      <PlatformGuidance platform="youtube" />

      <section id="platforms" className="look-black w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Tools For <em className="accent">More Platforms</em>
          </h2>
          <p className="mt-4 max-w-[60ch] text-[var(--muted)] md:text-lg">
            Use a different source page for reels, pictures, public stories or individual tracks.
          </p>

          <ul className="pf-logos mt-10 list-none">
            {others.map((p) => {
              const icon = PLATFORM_ICONS[p.name];
              return (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="pf-logo"
                    style={{ "--logo": logoColour(icon.hex) } as CSSProperties}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
                      <path d={icon.path} />
                    </svg>
                    {p.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <Rule />

      {/* 10. questions people actually ask about YouTube */}
      <section id="faq" className="w-full">
        <div className="mx-auto max-w-[900px] px-[5vw] py-16 md:py-24 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            YouTube Download <em className="accent">Questions</em>
          </h2>

          <div className="pf-faq mt-8 md:mt-12">
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Rule />

      {/* 11. help, bright red right before the black footer */}
      <section className="look-youtube w-full">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-[5vw] py-12 text-center md:flex-row md:gap-10 md:py-14 md:text-left lg:px-6">
          <Image
            src="/images/youtube/help-warning.webp"
            alt=""
            width={600}
            height={600}
            sizes="160px"
            className="h-auto w-[140px] shrink-0 md:w-[160px]"
          />
          <div className="min-w-0">
            <h2 className="text-2xl font-bold md:text-4xl">YouTube Download Support</h2>
            <p className="mt-2 max-w-[52ch] text-[var(--muted)]">
              Read the answers about Shorts, MP3 audio and quality settings, or contact us with a question about your recording.
            </p>
          </div>
          <Link href="#youtube-faq" className="neon shrink-0 px-5 py-3 md:ml-auto">
            Open download help
          </Link>
        </div>
      </section>

      <Rule />
    </>
  );
}
