// components/HowWeWork.tsx
// "How we work / our goals" section after the "what is" section: six points arranged in an arc around the energy-core
// mascot loop (forward then reverse, baked into one animated webp; a still for reduced motion).
// Claims must stay true to the backend: files come from the platform's servers, nothing is stored, no login,
// links are not logged against the visitor.
import Image from "next/image";
import type { ReactNode } from "react";

type Point = { title: string; text: string; icon: ReactNode };

const I = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

const HOW: Point[] = [
  {
    title: "Source Quality",
    text: "The available recording or image sets the limit. Requesting a larger resolution cannot restore detail missing from the source.",
    icon: I(<path d="M12 3v12M7 10l5 5 5-5M5 21h14" />),
  },
  {
    title: "Media File Handling",
    text: "We stream the requested media through the service. You decide where to keep the completed download on your device.",
    icon: I(<><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>),
  },
  {
    title: "Access Without An Account",
    text: "You can submit a public address without registering. We do not ask for your social account password.",
    icon: I(<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c5 0 9 4.5 10 7-.4 1-1.2 2.3-2.4 3.5M6.6 6.6C4.4 8 2.9 10.1 2 12c1 2.5 5 7 10 7 1.9 0 3.6-.6 5-1.5M9.9 9.9a3 3 0 0 0 4.2 4.2" />),
  },
];

const GOALS: Point[] = [
  {
    title: "Links We Can Read",
    text: "Each tool explains the types of post it accepts, including restrictions that apply to stories, profiles and collections.",
    icon: I(<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />),
  },
  {
    title: "Use An Existing Browser",
    text: "Open the website on your mobile, tablet or computer. The download controls do not require an extension.",
    icon: I(<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />),
  },
  {
    title: "Help When A Request Fails",
    text: "An error message gives you a starting point. If a public post keeps failing, send its address and the message to support.",
    icon: I(<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z" />),
  },
];

function Column({ label, points, side }: { label: string; points: Point[]; side: "left" | "right" }) {
  const left = side === "left";
  return (
    <div>
      <h3 data-side={side} className={`howwe-label text-center text-2xl font-bold md:text-3xl lg:mb-2 ${left ? "lg:text-right" : "lg:text-left"}`}>
        {label}
      </h3>
      <ul className="mt-6 space-y-8 lg:mt-8 lg:space-y-12">
        {points.map((p, i) => (
          <li
            key={p.title}
            // top and bottom points sit closer to the centre, so the six points follow an arc around the mascot
            data-arc={i === 1 ? "out" : "in"}
            className={`howwe-point flex items-start gap-4 ${left ? "lg:flex-row-reverse lg:text-right" : ""}`}
            data-side={side}
          >
            <span aria-hidden="true" className="howwe-icon">{p.icon}</span>
            <div>
              <p className="howwe-title">{p.title}</p>
              <p className="mt-1 text-sm text-[var(--grey)] md:text-base">{p.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HowWeWork() {
  return (
    <section className="howwe look-black relative isolate w-full overflow-hidden">
      {/* server line art along the bottom: wires and files rise toward the mascot. Sits just above the bottom fade,
          and never narrower than 900px so phones get a cropped drawing instead of a tiny one (see .howwe-lines) */}
      <Image
        src="/images/sections/howwe-line-art.webp"
        alt=""
        width={2400}
        height={1340}
        sizes="max(100vw, 900px)"
        className="howwe-lines pointer-events-none absolute bottom-[90px] left-1/2 -z-10 w-[max(100%,900px)] max-w-none -translate-x-1/2"
      />
      <div className="mx-auto max-w-[1300px] px-[5vw] py-32 md:py-40 lg:px-6">
        <div className="text-center">
          <p className="inline-flex items-center rounded-full bg-[var(--red)] px-3 py-1 text-xs font-bold title-case tracking-[0.06em] text-[var(--black)]">
            Using the service
          </p>
          <h2 className="mt-4 text-4xl font-bold leading-[1.1] md:text-6xl">
            How We Handle <em className="accent">Your Downloads</em>
          </h2>
        </div>

        {/* both columns start at the same height; only the mascot is centred between them */}
        <div className="mt-14 grid items-start gap-12 md:mt-20 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
          <div className="lg:order-2 lg:self-center">
            <div className="howwe-core relative mx-auto aspect-square w-[300px] md:w-[380px] lg:w-[400px] xl:w-[480px]">
              <picture>
                <source srcSet="/images/sections/devil-energy-core-still.webp" media="(prefers-reduced-motion: reduce)" />
                <img
                  src="/images/sections/devil-energy-core.webp"
                  alt=""
                  width={720}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  // the artwork has empty transparent margins; scaling it up fills the space without widening the layout
                  className="h-full w-full scale-[1.15] object-contain"
                />
              </picture>
            </div>
          </div>
          <div className="lg:order-1">
            <Column label="Download Handling" points={HOW} side="left" />
          </div>
          <div className="lg:order-3">
            <Column label="Using The Tools" points={GOALS} side="right" />
          </div>
        </div>
      </div>
    </section>
  );
}
