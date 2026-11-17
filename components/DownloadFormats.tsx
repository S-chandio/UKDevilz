// components/DownloadFormats.tsx
// Homepage section after the hero: what you can download and in which format.
// Left: statement heading and the mascot. Right: intro and the formats table.
// Rows must match what the backend really does (README section 4): stories are Snapchat public stories only.
import Image from "next/image";

const ROWS = [
  { what: "Videos", tags: ["MP4"], note: "Available source resolution", from: "YouTube, TikTok, Facebook, X, VK, Dailymotion, Bilibili" },
  { what: "Reels", tags: ["MP4"], note: "Video and audio", from: "Instagram, Facebook" },
  { what: "Shorts", tags: ["MP4"], note: "Portrait video", from: "YouTube" },
  { what: "Stories", tags: ["MP4", "JPG"], note: "Still available to view", from: "Snapchat" },
  { what: "Photos", tags: ["JPG"], note: "Source image dimensions", from: "Instagram, X, Pinterest" },
  { what: "Carousels and albums", tags: ["JPG", "MP4"], note: "Individual items", from: "Instagram, X, Snapchat" },
  { what: "GIFs", tags: ["MP4"], note: "Usually an MP4", from: "X" },
  { what: "Audio downloads", tags: ["MP3"], note: "MP3 audio", from: "Video soundtracks and public SoundCloud tracks" },
  { what: "TikTok without watermark", tags: ["MP4"], note: "Creator graphics remain", from: "TikTok" },
];

export default function DownloadFormats() {
  return (
    <section id="formats" className="formats-section look-black relative isolate w-full">
      {/* full width with side margins; capped at 1920px so table lines stay readable on very wide monitors.
          extra bottom space so the fade into the off-white section below happens under the table */}
      <div className="mx-auto grid max-w-[1920px] gap-12 px-[5vw] pb-40 pt-20 md:grid-cols-[5fr_7fr] md:pb-44 md:pt-28 lg:gap-20">
        {/* left: statement at the top, mascot at the bottom, so both columns start and end together on desktop */}
        <div className="md:flex md:flex-col md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs title-case tracking-[0.06em] text-[var(--grey)]">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--red)]" />
              Media types
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-[1.1] md:text-6xl">
              Save <em className="accent">Videos</em>, Photos And Audio
            </h2>
            <p className="mt-5 text-[var(--grey)] md:text-lg">
              A post can offer a single recording or several pictures. The result shows a button for each item the service retrieves.
            </p>
          </div>
          {/* fills the left column on desktop */}
          <div className="relative mx-auto mt-10 aspect-square w-full max-w-[300px] md:mx-0 md:max-w-none">
            <div aria-hidden="true" className="formats-glow absolute inset-[12%] -z-10 rounded-full" />
            <Image
              src="/images/sections/devil-download-bag.webp"
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 300px"
              className="object-contain md:scale-[1.2]" /* the artwork has wide empty margins; scale it up to fill the space */
            />
          </div>
        </div>

        {/* right: intro + formats table */}
        <div>
          <p className="text-[var(--grey)] md:text-lg">
            For a mixed carousel, compare the returned items with the original post. An incomplete set can leave a photo or video missing from your downloads.
          </p>
          <h3 className="mt-10 text-2xl font-bold md:text-4xl">
            Formats For <em className="accent">Each Source</em>
          </h3>
          <p className="mt-3 text-sm text-[var(--grey)] md:text-base">
            Use this table to choose a tool for your video, photo or audio link. The original post determines which media and quality are available.
          </p>

          <table className="formats-table mt-8 w-full text-left">
            <caption className="sr-only">Media types, file formats and their source platforms</caption>
            <thead>
              <tr>
                <th scope="col">What you get</th>
                <th scope="col">Format</th>
                <th scope="col">From</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.what}>
                  <th scope="row">{r.what}</th>
                  <td>
                    {r.tags.map((t) => (
                      <span key={t} className="format-tag">{t}</span>
                    ))}
                    <span className="formats-note">{r.note}</span>
                  </td>
                  <td className="formats-from">{r.from}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
