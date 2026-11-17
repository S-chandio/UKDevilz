import { pageMetadata } from "@/lib/page-seo";
// app/soundcloud-downloader/page.tsx
// SoundCloud landing page. SoundCloud is a waveform with things pinned along it, so that is the
// page - nothing here is borrowed from the other platform pages: no facts grid, no ticker, no
// centre rail, no .pf-kinds, no .pf-why, no post cards, no board, no time axis.
//   ash hero with the track underneath > orange: the four steps pinned along the waveform, its
//   playhead filling as you scroll > ash: what comes back, as track rows > orange: the tracks that
//   never arrive > ash ten more apps > orange help
// The waveform is drawn from numbers; audio illustrations support the surrounding guidance.
//
// Copy must match what the backend really does (README section 4): public tracks, through the
// tunnel, with SoundCloud's own embed as the preview. The tool opens in audio mode here, which is
// the documented prop for an MP3-focused page.
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import Grab from "../grab";
import { LinkGuide, SaveGuide, SoundCloudFAQ } from "./guides";
import PlatformStrip from "@/components/PlatformStrip";
import PlatformRelated from "@/components/PlatformRelated";
import Reveal from "@/components/Reveal";
import { PLATFORMS } from "@/lib/platforms";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata("/soundcloud-downloader");

// The bar heights are worked out, not random: a random waveform would differ between the server
// render and the browser one and React would throw a hydration mismatch. Three sines at different
// rates give something that reads as audio and is the same every time.
const BARS = Array.from({ length: 72 }, (_, i) => {
  const h =
    22 +
    Math.abs(Math.sin(i * 0.37)) * 32 +
    Math.abs(Math.sin(i * 0.11 + 1.1)) * 26 +
    Math.abs(Math.sin(i * 0.93)) * 14;
  return Math.round(Math.min(100, h));
});

function Waveform({ scrub, played }: { scrub?: boolean; played?: string }) {
  const bars = (
    <div className="wf">
      {BARS.map((h, i) => (
        <i key={i} style={{ "--h": `${h}%` } as CSSProperties} />
      ))}
    </div>
  );
  return (
    <div
      aria-hidden="true"
      className="wf-wrap"
      data-scrub={scrub ? "" : undefined}
      style={played ? ({ "--played": played } as CSSProperties) : undefined}
    >
      {bars}
      <div className="wf-played">{bars}</div>
      <span className="wf-head" />
    </div>
  );
}

// Four steps, pinned along the track at their own marks the way comments are pinned to a timestamp.
const PINS = [
  {
    at: "0:00",
    mark: "8%",
    title: "Select The Recording",
    text: "Open the public track you have permission to save. Its own page supplies the address needed for a request.",
  },
  {
    at: "0:08",
    mark: "34%",
    title: "Copy Its Address",
    text: "Use the track’s sharing options or copy the URL from the browser. Keep the complete address.",
  },
  {
    at: "0:16",
    mark: "60%",
    title: "Request Audio",
    text: "Paste the link above and press the arrow. Audio mode is already selected on this page.",
  },
  {
    at: "0:24",
    mark: "86%",
    title: "Save Your MP3",
    text: "Choose MP3 to save the track, then wait for the transfer to finish. Open the completed file in your preferred audio player.",
  },
];

const GETS = [
  {
    id: "mp3",
    art: "MP3",
    title: "MP3 Audio Format",
    by: "The MP3 option uses the audio available to the retrieval service. Its quality depends on that source and the conversion.",
  },
  {
    id: "listen",
    art: "PLAY",
    title: "Track Preview",
    by: "A result may include the SoundCloud player so you can identify the recording. Playback in that player does not confirm a completed download.",
  },
  {
    id: "kept",
    art: "FILE",
    title: "Browser File Delivery",
    by: "The service prepares available audio for your browser. We do not keep downloaded tracks in a personal library for later access.",
  },
];

const NEVER = [
  {
    id: "private",
    art: "LOCK",
    title: "Restricted Track Access",
    by: "Use public recordings. Private links and account credentials should not be submitted to this tool.",
  },
  {
    id: "gone",
    art: "GONE",
    title: "Removed Recordings",
    by: "When the track is no longer available from its original address, we cannot recover it. Check whether the creator offers another source.",
  },
  {
    id: "playlist",
    art: "LIST",
    title: "Profile And Playlist Links",
    by: "Open the particular recording you want within the collection. Its track address identifies which audio to request.",
  },
];

export default function SoundCloudDownloader() {
  const others = PLATFORMS.filter((p) => p.name !== "SoundCloud");

  return (
    <div className="page-sc">
      <PlatformStrip current="/soundcloud-downloader" />

      {/* 1. hero on the light neutral, with an unplayed track under the box */}
      <section className="pf-band-ash w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 text-center md:py-16 lg:px-6">
          <div className="grid items-center gap-6 md:grid-cols-[1.6fr_1fr] md:text-left">
          <div>
          <p className="inline-flex items-center gap-2 text-xs title-case tracking-[0.06em] text-[var(--muted)]">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            SoundCloud downloader
          </p>

          <h1 className="mx-auto mt-4 max-w-[20ch] text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">SoundCloud Downloader <em className="accent">For Track Audio</em></h1>

          <p className="mx-auto mt-4 max-w-[60ch] text-base text-[var(--muted)] md:text-lg">
            Save an individual public SoundCloud track as MP3. Copy its address into the field below and download the audio without creating an account.
          </p>
          </div>
          <Image src="/images/soundcloud/hero-audio.webp" alt="" width={720} height={720} sizes="(max-width: 767px) 220px, 320px" loading="eager" className="mx-auto h-auto w-[220px] md:w-full md:max-w-[320px]" />
          </div>

          <div className="mx-auto mt-8 w-full max-w-[44rem]">
            <Grab placeholder="Paste a SoundCloud link" initialMode="audio" />
          </div>

          <div className="mt-10">
            <Waveform played="34%" />
          </div>

          <p className="mt-5 text-xs text-[var(--muted)]">
            Download a track with {SITE.name} when you own it or have the creator’s permission.
          </p>
        </div>
      </section>

      <LinkGuide />

      {/* 2. the signature: the four steps pinned along one track, whose playhead fills as the band
             is scrolled and empties again on the way back */}
      <section className="look-sc w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Request A SoundCloud <em className="accent">Track Download</em>
          </h2>
          <p className="mt-4 max-w-[62ch] text-[var(--muted)] md:text-lg">
            Use the track’s own address to select the recording. Follow the steps below to save it and find the MP3 on your device.
          </p>

          <div className="mt-10 md:mt-12">
            <Waveform scrub />
            <div aria-hidden="true" className="sc-marks">
              {PINS.map((p, i) => (
                <span key={p.at} className="sc-mark" style={{ "--at": p.mark } as CSSProperties}>
                  {i + 1}
                </span>
              ))}
            </div>

            <Reveal>
              <ol className="sc-pins list-none">
                {PINS.map((p) => (
                  <li key={p.at} className="sc-pin" data-reveal>
                    <span className="sc-at">{p.at}</span>
                    <h3 className="sc-pin-title">{p.title}</h3>
                    <p className="sc-pin-line">{p.text}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. what comes back, listed the way tracks are listed */}
      <section className="pf-band-ash w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Audio Results And <em className="accent">File Handling</em>
          </h2>
          <Image src="/images/soundcloud/guide-preview.webp" alt="" width={720} height={405} sizes="(max-width: 767px) 90vw, 560px" className="mx-auto mt-8 h-auto w-full max-w-[560px]" />
          <Reveal className="mt-8 md:mt-10">
            <ul className="sc-rows list-none">
              {GETS.map((g) => (
                <li key={g.id} className="sc-row" data-reveal>
                  <span aria-hidden="true" className="sc-art">
                    {g.art}
                  </span>
                  <div className="min-w-0">
                    <h3 className="sc-title">{g.title}</h3>
                    <p className="sc-by">{g.by}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 4. the tracks that never arrive */}
      <section className="look-sc w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Supported <em className="accent">Track Addresses</em>
          </h2>
          <p className="mt-4 max-w-[62ch] text-[var(--muted)] md:text-lg">
            Use an individual public track link. The examples below explain which account and collection addresses to avoid.
          </p>

          <Reveal className="mt-8 md:mt-10">
            <ul className="sc-rows list-none">
              {NEVER.map((n) => (
                <li key={n.id} className="sc-row" data-state="no" data-reveal>
                  <span aria-hidden="true" className="sc-art">
                    {n.art}
                  </span>
                  <div className="min-w-0">
                    <h3 className="sc-title">{n.title}</h3>
                    <p className="sc-by">{n.by}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <SaveGuide />
      <SoundCloudFAQ />

      {/* 5. the other ten, as a ring that turns on its own and can be grabbed and flung */}
      <section id="platforms" className="pf-band-ash w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Audio From <em className="accent">Other Platforms</em>
          </h2>
          <p className="mt-4 max-w-[60ch] text-[var(--muted)] md:text-lg">
            For a soundtrack attached to a video, choose the tool for the site where that clip appears.
          </p>

          <div className="mt-6 md:mt-8">
            <PlatformRelated platforms={others} variant="soundcloud" />
          </div>
        </div>
      </section>

      {/* 6. help, right before the black footer */}
      <section className="look-sc w-full">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-[5vw] py-12 text-center md:flex-row md:gap-10 md:py-14 md:text-left lg:px-6">
          <Image
            src="/images/soundcloud/help-track.webp"
            alt=""
            width={600}
            height={600}
            sizes="160px"
            className="h-auto w-[140px] shrink-0 md:w-[160px]"
          />
          <div className="min-w-0">
            <h2 className="text-2xl font-bold md:text-4xl">Ask About A SoundCloud Download</h2>
            <p className="mt-2 max-w-[52ch] text-[var(--muted)]">
              Send support the public track address and the message shown after your request. Include your browser and device so we can follow the report.
            </p>
          </div>
          <Link href="/contact" className="neon shrink-0 px-5 py-3 md:ml-auto">
            Email download support
          </Link>
        </div>
      </section>
    </div>
  );
}
