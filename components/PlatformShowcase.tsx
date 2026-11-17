// components/PlatformShowcase.tsx
// Homepage platforms section: a bento grid of tiles in mixed sizes. Each tile is covered by the platform's
// artwork (builds in from triangles when it scrolls into view); hovering, focusing or tapping a tile clears
// the artwork to reveal what you can download. The whole tile links to that platform's downloader page.
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import ShatterImage from "./ShatterImage";
import { PLATFORMS, type TileSize } from "@/lib/platforms";

// grid spans per tile size; the grid fills densely so mixed sizes leave no holes
const SPAN: Record<TileSize, string> = {
  large: "col-span-2 row-span-2",
  wide: "col-span-2",
  tall: "row-span-2",
  small: "",
};

const IMAGE_SIZES: Record<TileSize, string> = {
  large: "(min-width: 1024px) 600px, 100vw",
  wide: "(min-width: 1024px) 600px, 100vw",
  tall: "(min-width: 1024px) 300px, 50vw",
  small: "(min-width: 1024px) 300px, 50vw",
};

export default function PlatformShowcase() {
  return (
    <section className="look-grey relative isolate w-full overflow-hidden">
      {/* background artwork (loads as the section approaches); grey shows until it arrives */}
      <Image
        src="/images/hero/hero-devil-speed-silhouette.webp"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div aria-hidden="true" className="showcase-shade absolute inset-0 -z-10" />
      {/* extra bottom space so the fade into the next (light) section happens below the tiles */}
      <div className="mx-auto max-w-[1200px] px-[5vw] pb-32 pt-14 md:pb-40 md:pt-20 lg:px-6">
        {/* light text: the heading sits in the dark top of the fade from the hero (see .showcase-shade) */}
        <h2 className="text-3xl font-bold text-[var(--offwhite)] md:text-5xl">Choose The Source Of Your Link</h2>
        <p className="mt-3 max-w-[640px] text-[var(--grey)] md:text-lg">
          Select a platform to read its file options and request limits.
        </p>

        <ul className="mt-10 grid grid-flow-row-dense auto-rows-[150px] grid-cols-2 gap-3 md:auto-rows-[170px] md:gap-4 lg:auto-rows-[180px] lg:grid-cols-4">
          {PLATFORMS.map((p) => {
            const descId = `platform-${p.href.slice(1)}`;
            return (
              <li key={p.name} className={SPAN[p.size]}>
                <Link
                  href={p.href}
                  aria-label={`${p.name} downloader`}
                  aria-describedby={descId}
                  // the platform's own colours, used once the tile is revealed (see .bento in globals.css)
                  style={
                    {
                      "--tile-bg": p.theme.bg,
                      "--tile-ink": p.theme.ink,
                      "--tile-muted": p.theme.muted,
                      "--tile-accent": p.theme.accent,
                    } as CSSProperties
                  }
                  className="bento raised relative block h-full overflow-hidden rounded-2xl border border-[var(--line)]"
                >
                  {/* text behind the artwork, shown on hover / focus / tap */}
                  <div className="bento-text flex h-full flex-col justify-between gap-2 p-4 md:p-5">
                    <div>
                      <h3 className={`font-bold ${p.size === "large" ? "text-2xl md:text-3xl" : "text-lg md:text-xl"}`}>{p.name}</h3>
                      <p id={descId} className="bento-sub mt-1 line-clamp-2 text-sm text-[var(--muted)] md:line-clamp-3">
                        {p.gets}
                      </p>
                      {p.points.length > 0 && (
                        <ul className="mt-3 hidden space-y-1 text-sm md:block">
                          {p.points.map((point) => (
                            <li key={point} className="flex gap-2">
                              <span aria-hidden="true" className="bento-check font-bold text-[var(--accent)]">&#10003;</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <span className="neon self-start px-3 py-1.5 text-xs font-bold md:text-sm">
                      Open downloader <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>

                  {/* artwork on top; cleared on hover / focus / tap (see .bento-art in globals.css) */}
                  <div aria-hidden="true" className="bento-art">
                    <ShatterImage src={p.image} sizes={IMAGE_SIZES[p.size]} />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
