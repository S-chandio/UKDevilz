import { pageMetadata } from "@/lib/page-seo";
// app/dailymotion-downloader/page.tsx
// Dailymotion landing page. This page is a PLAYER: the hero is a real player shell - stage, control
// bar, progress, timecode - with the tool sitting on the stage, and the steps run along a film strip
// whose sprocket holes travel. Nothing is shared with the other platform pages: no facts grid, no
// ticker, no centre rail, no .pf-kinds, no .pf-why, no post cards, no board, no waveform, no axis.
//   cinematic dark hero > near-black: the four steps along a film strip >
//   white: what comes back > near-black: what never does > white ten more apps > near-black help
// The hero uses a dark, faceted backdrop and floating Dailymotion/media symbols.
// The player, film strip and pink-to-lavender accents continue through the rest of the page.
//
// COPY IS DELIBERATELY MINIMAL. Dailymotion is NOT in the verified list in README section 4 - see
// the note at the top of lib/platforms.ts - so nothing here names a container, a quality, subtitles,
// playlists or a length limit. It claims only what the code plainly does: dailymotion.com and the
// short dai.ly form are recognised, dai.ly is in normalize.ts's SHORT_HOSTS and followed first, and
// the shared mode row offers the sound on its own. Widen this once the platform has been tested.
import Image from "next/image";
import Link from "next/link";
import Grab from "../grab";
import PlatformGuidance from "@/components/PlatformGuidance";
import PlatformStrip from "@/components/PlatformStrip";
import PlatformRelated from "@/components/PlatformRelated";
import Reveal from "@/components/Reveal";
import { PLATFORMS } from "@/lib/platforms";
import { SITE } from "@/lib/site";
import DailymotionHeroBackdrop from "./DailymotionHeroBackdrop";
import heroStyles from "./hero.module.css";
import downloadStyles from "./download-options.module.css";

export const metadata = pageMetadata("/dailymotion-downloader");

// the control bar under the stage - generic player shapes, drawn here rather than taken from anyone
const PLAY = "M8 5.5 18.5 12 8 18.5z";
const SOUND = "M4.5 9.5h3l4-3.5v12l-4-3.5h-3zM15 9.5a3.5 3.5 0 0 1 0 5M17.5 7a7 7 0 0 1 0 10";
const COG = "M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M18 6l-1.4 1.4M7.4 16.6 6 18";
const FULL = "M4.5 9V4.5H9M15 4.5h4.5V9M19.5 15v4.5H15M9 19.5H4.5V15";

// the four steps, as cues along the strip
const CUES = [
  {
    at: "00:01",
    title: "Select A Video",
    text: "Open the recording’s own page and check that it is still available. A channel or search page does not select a video for you.",
  },
  {
    at: "00:02",
    title: "Copy Its URL",
    text: "Use the sharing menu to copy the address, or select it from your browser. Include only the link in the input field.",
  },
  {
    at: "00:03",
    title: "Send Your Request",
    text: "Choose Auto for the video or Audio only for its soundtrack, then press the arrow. Keep the page open while we prepare the file options.",
  },
  {
    at: "00:04",
    title: "Download And Open",
    text: "Use the returned file button and allow the transfer to finish. Open the completed item from your browser’s download list.",
  },
];

const OUTS = [
  {
    id: "video",
    tag: "Video",
    title: "Save The Recording",
    line: "Auto requests the clip with its available audio. Check the result’s format before saving, because retrieval depends on the source media.",
  },
  {
    id: "audio",
    tag: "Sound only",
    title: "Request An MP3",
    line: "Audio only asks for the soundtrack from the linked video. You can also use an MP3 option on an available video result.",
  },
];

const NEVER = [
  { id: "temporary", tag: "Source response", title: "An Available Video Fails", line: "Dailymotion may play a recording while refusing the retrieval request. If a later retry also fails, report the public address and the error shown." },
  { id: "unfinished", tag: "Transfer status", title: "A Download Was Interrupted", line: "Open the browser’s transfer list and check your connection and free storage. Request a fresh result from the source URL if the old link no longer works." },
  {
    id: "private",
    tag: "Restricted source",
    title: "Access Has Changed",
    line: "Private, removed or restricted videos may be inaccessible. Your personal account permissions are not passed to this service.",
  },
  {
    id: "list",
    tag: "Collection address",
    title: "A Playlist Was Submitted",
    line: "Choose one video within the playlist or channel, then copy its address. The tool does not download a collection from that page.",
  },
];

export default function DailymotionDownloader() {
  const others = PLATFORMS.filter((p) => p.name !== "Dailymotion");

  return (
    <div className="page-dm">
      <PlatformStrip current="/dailymotion-downloader" />

      {/* 1. the hero is a player, and the tool is on the stage */}
      <section className={heroStyles.hero}>
        <DailymotionHeroBackdrop />
        <div className={heroStyles.content}>
          <div className={`dm-player ${heroStyles.player}`}>
            <div className={`dm-stage text-center ${heroStyles.stage}`}>
              <p className="inline-flex items-center gap-2 text-xs title-case tracking-[0.06em] text-[var(--muted)]">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                Dailymotion downloader
              </p>

              <h1 className="mx-auto mt-4 max-w-[18ch] text-3xl font-bold leading-tight md:text-5xl">Dailymotion <em className="accent">Video Downloader</em></h1>

              <p className="mx-auto mt-4 max-w-[56ch] text-base text-[var(--muted)] md:text-lg">
                Download an available public Dailymotion video or request its soundtrack as MP3. Enter a direct address or dai.ly share link, with no registration required.
              </p>

              <div className="mt-8">
                <Grab placeholder="Paste a Dailymotion link" />
              </div>
            </div>

            {/* the control bar: chrome, not controls, so it is hidden from screen readers */}
            <div aria-hidden="true" className="dm-bar">
              <svg viewBox="0 0 24 24" data-fill="">
                <path d={PLAY} />
              </svg>
              <span className="dm-time">0:00</span>
              <span className="dm-prog">
                <span />
              </span>
              <span className="dm-time">3:12</span>
              <svg viewBox="0 0 24 24">
                <path d={SOUND} />
              </svg>
              <svg viewBox="0 0 24 24">
                <path d={COG} />
              </svg>
              <svg viewBox="0 0 24 24">
                <path d={FULL} />
              </svg>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-[var(--muted)]">
            Keep recordings through {SITE.name} with the owner’s permission or rights of your own.
          </p>
        </div>
      </section>

      {/* 2. the signature: four cues along a strip of film, its sprocket holes running */}
      <section className="look-dm w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Download From <em className="accent">A Dailymotion Link</em>
          </h2>
          <p className="mt-4 max-w-[62ch] md:text-lg">
            Allow the service to retrieve and prepare the media after you submit the request. The time needed varies with the source and connection.
          </p>

          <Reveal className="mt-8 md:mt-12">
            <div className="dm-strip">
              <ol className="dm-frames list-none">
                {CUES.map((c) => (
                  <li key={c.at} className="dm-frame" data-reveal>
                    <span className="dm-cue">{c.at}</span>
                    <h3 className="dm-frame-title">{c.title}</h3>
                    <p className="dm-frame-line">{c.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. what comes back */}
      <section className={`pf-band-paper w-full ${downloadStyles.section}`}>
        <div className={`mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6 ${downloadStyles.container}`}>
          <div className={downloadStyles.content}>
            <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
              Video And <em className="accent">Audio Downloads</em>
            </h2>

            <Reveal className="mt-8 md:mt-10">
              <ul className="dm-outs list-none">
                {OUTS.map((o) => (
                  <li key={o.id} className={`dm-out ${downloadStyles.card}`} data-reveal>
                    <span className="dm-out-tag">{o.tag}</span>
                    <h3 className="dm-out-title">{o.title}</h3>
                    <p className="dm-out-line">{o.line}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="pf-band-paper w-full" aria-labelledby="dm-file-checks">
        <div className="mx-auto max-w-[1200px] px-[5vw] pb-16 lg:px-6">
          <h2 id="dm-file-checks" className="text-2xl font-bold md:text-3xl">Check Your Completed Download</h2>
          <ul className="mt-6 grid list-none gap-6 md:grid-cols-3">
            <li className="border-t border-black/20 pt-5"><h3 className="text-lg font-bold">Confirm The Recording</h3><p className="mt-3 leading-7">Compare the returned title or preview with the source you selected. If they differ, copy the intended video’s own address again.</p></li>
            <li className="border-t border-black/20 pt-5"><h3 className="text-lg font-bold">Watch The Transfer Status</h3><p className="mt-3 leading-7">The browser reports when a file has finished saving. Wait for that confirmation before closing an active download.</p></li>
            <li className="border-t border-black/20 pt-5"><h3 className="text-lg font-bold">Open The Local File</h3><p className="mt-3 leading-7">Play the completed item on your device. If it will not open, check the extension and whether your player supports it.</p></li>
          </ul>
          <p className="mt-6 text-sm leading-7"><strong>Check Your Selected Mode</strong> No sound asks for a silent version. Use Auto for a normal video request and check the saved recording’s audio.</p>
        </div>
      </section>

      {/* 4. source and retrieval troubleshooting */}
      <section className="look-dm w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Fix A <em className="accent">Dailymotion Request</em>
          </h2>

          <Reveal className="mt-8 md:mt-10">
            <ul className="dm-outs list-none">
              {NEVER.map((n) => (
                <li key={n.id} className="dm-out" data-state="no" data-reveal>
                  <span className="dm-out-tag">{n.tag}</span>
                  <h3 className="dm-out-title">{n.title}</h3>
                  <p className="dm-out-line">{n.line}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 5. the other ten, as a ring that turns on its own and can be grabbed and flung */}
      <PlatformGuidance platform="dailymotion" />

      <section id="platforms" className="pf-band-paper w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Choose A <em className="accent">Different Video Source</em>
          </h2>
          <p className="mt-4 max-w-[60ch] text-[var(--muted)] md:text-lg">
            Open another tool when your recording is hosted on a different platform.
          </p>

          <div className="mt-6 md:mt-8">
            <PlatformRelated platforms={others} variant="dailymotion" />
          </div>
        </div>
      </section>

      {/* 6. help, right before the black footer */}
      <section className="look-dm w-full">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-[5vw] py-12 text-center md:flex-row md:gap-10 md:py-14 md:text-left lg:px-6">
          <Image
            src="/images/dailymotion/help-video.webp"
            alt=""
            width={600}
            height={600}
            sizes="160px"
            className="h-auto w-[140px] shrink-0 md:w-[160px]"
          />
          <div className="min-w-0">
            <h2 className="text-2xl font-bold md:text-4xl">Send A Download Report</h2>
            <p className="mt-2 max-w-[52ch] text-[var(--muted)]">
              For a persistent problem, include the public URL, the displayed error and your device in a message to support.
            </p>
          </div>
          <Link href="/contact" className="neon shrink-0 px-5 py-3 md:ml-auto">
            Report the problem
          </Link>
        </div>
      </section>
    </div>
  );
}
