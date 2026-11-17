// components/AboutUkdevliz.tsx
// "What is ukdevliz" section after the platforms grid: statement, how it works, four stats.
// A faint line drawing of servers and flying files sits behind; the mascot on the right catches files from a pipe
// that comes in from the section's top edge. Claims must stay true to the backend: files stream through and are
// no media file storage, no user login, source dependent YouTube quality.
import Image from "next/image";
import { SITE } from "@/lib/site";
import { PLATFORMS } from "@/lib/platforms";

const STATS = [
  { value: String(PLATFORMS.length), label: "Platform tools" },
  { value: "MP3", label: "Audio downloads" },
  { value: "0", label: "Logins needed" },
  { value: "0", label: "Files stored" },
];

export default function AboutUkdevliz() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-[var(--paper)]">
      {/* phones: drawing at its own proportions along the bottom (covering the tall section would blow it up) */}
      <Image
        src="/images/sections/about-line-art.webp"
        alt=""
        fill
        sizes="100vw"
        className="about-lines -z-10 object-contain object-bottom md:object-cover md:object-center"
      />

      <div className="mx-auto grid max-w-[1920px] gap-x-16 px-[5vw] md:grid-cols-[7fr_5fr]">
        {/* mascot: centred in its column and sized to the section; the pipe's cut-off top fades out, a glow and a
            ground shadow sit him in the section (see .about-mascot) */}
        <div className="flex items-center justify-center pt-12 md:order-2 md:py-16">
          <div className="about-mascot relative aspect-[1340/2400] h-[340px] md:h-[640px]">
            <Image
              src="/images/sections/devil-file-pipe.webp"
              alt=""
              fill
              sizes="(min-width: 768px) 360px, 190px"
              className="object-contain"
            />
          </div>
        </div>

        <div className="pb-20 pt-10 md:py-28">
          <p className="inline-flex items-center rounded-full bg-[var(--red)] px-3 py-1 text-xs font-bold title-case tracking-[0.06em] text-[var(--black)]">
            About {SITE.name}
          </p>
          <h2 className="mt-5 text-4xl font-bold leading-[1.1] md:text-6xl">
            Public Media Downloads With <em className="accent">{SITE.name}</em>
          </h2>
          <div className="mt-6 max-w-[680px] space-y-4 text-[var(--muted)] md:text-lg">
            <p>
              {SITE.name} gives you file options for supported public posts. We retrieve the media when you submit a link and stream the result to your browser without storing a copy on our servers.
            </p>
            <p>
              There are {PLATFORMS.length} tools to choose from, with different options for each source. Open a platform page if you need help finding the right address or choosing a format.
            </p>
          </div>

          <dl className="mt-10 grid max-w-[780px] grid-cols-2 gap-x-10 gap-y-8 md:grid-cols-4">
            {STATS.map((s) => (
              // label first for screen readers, shown under the number; justify-end keeps every number on the top line
              // (in a reversed column "end" is the top), however many lines its label wraps to
              <div key={s.label} className="flex flex-col-reverse justify-end">
                <dt className="mt-3 text-sm text-[var(--muted)]">{s.label}</dt>
                <dd className="about-stat">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
