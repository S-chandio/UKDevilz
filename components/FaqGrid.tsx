// components/FaqGrid.tsx
// FAQ section after "Our approach", above the footer: a ruled grid of rectangular cells that share their borders
// (2 columns x 3 rows; one column on phones). Rain falls down a strip along the grid's left edge and grass grows up
// along the bottom of every cell, where the text stops. Both are drawn in code (no images); the grass sways, and grows
// in as the section scrolls into view where the browser supports scroll-linked animation.
// Answers come from lib/faq.ts and must match what the backend really does.
import { FAQ } from "@/lib/faq";

// small deterministic random, so the drawing is identical on every render
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const GRASS_W = 600;
const GRASS_H = 90;

// one SVG path per blade: a thin curved leaf rising from the baseline and leaning a little
function blades(seed: number) {
  const r = rng(seed);
  const groups: string[][] = [[], [], []];
  for (let x = 4; x < GRASS_W; x += 5 + r() * 7) {
    const h = 22 + r() * 58;
    const w = 3 + r() * 3;
    const lean = (r() - 0.5) * 26;
    const d =
      `M${(x - w / 2).toFixed(1)} ${GRASS_H}` +
      `Q${(x + lean * 0.35).toFixed(1)} ${(GRASS_H - h * 0.55).toFixed(1)} ${(x + lean).toFixed(1)} ${(GRASS_H - h).toFixed(1)}` +
      `Q${(x + lean * 0.35 + w * 0.4).toFixed(1)} ${(GRASS_H - h * 0.5).toFixed(1)} ${(x + w / 2).toFixed(1)} ${GRASS_H}Z`;
    groups[Math.floor(r() * 3)].push(d);
  }
  return groups;
}

function Grass({ seed }: { seed: number }) {
  const groups = blades(seed);
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${GRASS_W} ${GRASS_H}`}
      preserveAspectRatio="xMidYMax slice"
      className="faq-grass"
    >
      {groups.map((paths, g) => (
        <g key={g} className={`faq-blades faq-blades-${g}`}>
          {paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      ))}
    </svg>
  );
}

// rain streaks: position, length, speed and delay per drop; --p places each streak when animation is off
const DROPS = (() => {
  const r = rng(7);
  return Array.from({ length: 18 }, (_, i) => ({
    left: `${(8 + r() * 84).toFixed(1)}%`,
    len: Math.round(28 + r() * 46),
    dur: (1.1 + r() * 1.3).toFixed(2),
    delay: (-r() * 2.4).toFixed(2),
    p: r().toFixed(2),
    red: i % 5 === 0,
  }));
})();

export default function FaqGrid() {
  return (
    <section id="faq" className="look-black relative w-full">
      <div className="mx-auto max-w-[1300px] px-[5vw] pb-24 pt-10 md:pb-32 lg:px-6">
        <div className="text-center">
          <p className="inline-flex items-center rounded-full bg-[var(--red)] px-3 py-1 text-xs font-bold title-case tracking-[0.06em] text-[var(--black)]">
            FAQ
          </p>
          <h2 className="mt-4 text-4xl font-bold leading-[1.1] md:text-6xl">
            Download <em className="accent">Questions</em>
          </h2>
        </div>

        <div className="mt-12 flex md:mt-16">
          {/* rain along the left edge of the whole grid */}
          <div aria-hidden="true" className="faq-rain">
            {DROPS.map((d, i) => (
              <span
                key={i}
                className={`faq-drop ${d.red ? "faq-drop-red" : ""}`}
                style={{
                  left: d.left,
                  ["--len" as string]: `${d.len}px`,
                  ["--p" as string]: d.p,
                  animationDuration: `${d.dur}s`,
                  animationDelay: `${d.delay}s`,
                }}
              />
            ))}
          </div>

          {/* ruled grid: cells share their borders (1px red gaps over a red background) */}
          <dl className="faq-grid">
            {FAQ.map((f, i) => (
              <div key={f.q} className="faq-cell">
                <dt>
                  <h3 className="text-xl font-bold md:text-2xl">{f.q}</h3>
                </dt>
                <dd className="mt-4 text-[var(--grey)] md:text-lg">{f.a}</dd>
                <Grass seed={101 + i * 37} />
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
