"use client";
// components/GuideSteps.tsx
// How-to guide right after the hero: an endless step carousel. The current step sits large in the middle, the
// others peek out smaller and faded on each side (positions come from data-pos, see .guide-slide in globals.css).
// It loops both ways and moves on by itself every 5 seconds. Visitors stay in control: arrows, numbered step
// buttons, a click on a side step, left / right keys and swipes all work, and any of them restarts the timer.
// Auto-play pauses while the carousel is hovered or keyboard-focused, off screen, or the tab is hidden; a
// pause / play button stops it for good (visitors who prefer reduced motion start paused).
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

const STEPS = [
  {
    image: "/images/guide/guide-step-1-open-post-menu.webp",
    title: "Find The Original Post",
    text: "Open the individual post so you can copy its own address. Depending on the app, the link option appears under Share or the post menu.",
    alt: "Instagram reel with its post menu highlighted in the top corner",
  },
  {
    image: "/images/guide/guide-step-2-copy-link.webp",
    title: "Choose Copy Link",
    text: "Copy the address from the sharing options. On a computer, you can also select it in the browser address bar.",
    alt: "Instagram post menu with Copy link highlighted",
  },
  {
    image: "/images/guide/guide-step-3-current.jpg",
    title: "Submit Your Request",
    text: "Enter that address above and choose a mode before pressing the arrow. Auto requests the available media, while Audio only asks for its soundtrack.",
    alt: "ukdevliz link field containing an Instagram address, with download modes beneath it",
  },
  {
    image: "/images/guide/guide-step-4-download-file.webp",
    title: "Open The Download",
    text: "When the result appears, choose its file button. Wait for the transfer to finish, then open the saved item from your browser’s downloads list.",
    alt: "ukdevliz result card with a video preview and the MP4, MP3, Copy link and New link buttons highlighted",
  },
];

const COUNT = STEPS.length;
const AUTOPLAY_MS = 5000; // keep in sync with the .guide-progress animation in globals.css
const SWIPE_PX = 40;

// position of a step relative to the current one on the loop: 0 is the middle, negative left, positive right
const offsetOf = (i: number, active: number) => {
  const d = (((i - active) % COUNT) + COUNT) % COUNT;
  return d > COUNT / 2 ? d - COUNT : d;
};


export default function GuideSteps() {
  const [active, setActive] = useState(0);
  const [prevActive, setPrevActive] = useState(0);
  const reducedMotion = useReducedMotion();
  const [playChoice, setPlayChoice] = useState<boolean | null>(null); // null until the visitor presses pause / play
  const playing = playChoice ?? !reducedMotion; // reduced-motion visitors start paused
  const [userMoved, setUserMoved] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const regionRef = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<number | null>(null);
  const swiped = useRef(false);

  const paused = !playing || hovered || focused || !inView || !tabVisible;

  const show = (i: number, byUser: boolean) => {
    setPrevActive(active);
    setActive(((i % COUNT) + COUNT) % COUNT);
    setUserMoved(byUser);
  };
  const go = (i: number) => show(i, true);

  // watch whether the carousel is on screen and whether the tab is visible
  useEffect(() => {
    const el = regionRef.current;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    if (el) io.observe(el);

    const onVisibility = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // one timer per step: any move (by the visitor or by the timer) restarts the 5 seconds
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => {
      setPrevActive(active);
      setActive((active + 1) % COUNT);
      setUserMoved(false);
    }, AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [active, paused]);

  const step = STEPS[active];

  return (
    <section id="how-it-works" className="look-black relative isolate w-full overflow-hidden">
      <div aria-hidden="true" className="guide-glow absolute inset-x-0 top-1/4 -z-10 mx-auto h-[60%] max-w-[900px]" />

      <div className="mx-auto max-w-[1200px] px-[5vw] py-20 md:py-28 lg:px-6">
        <div className="text-center">
          <p className="inline-flex items-center gap-2 text-xs title-case tracking-[0.06em] text-[var(--grey)]">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--red)]" />
            How it works
          </p>
          <h2 className="mt-4 text-4xl font-bold leading-[1.1] md:text-6xl">
            Copy A Link And <em className="accent">Save</em> The Result
          </h2>
        </div>

        <div
          ref={regionRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="How to download, step by step"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") { e.preventDefault(); go(active + 1); }
            if (e.key === "ArrowLeft") { e.preventDefault(); go(active - 1); }
          }}
          onPointerEnter={(e) => { if (e.pointerType === "mouse") setHovered(true); }}
          onPointerLeave={(e) => { if (e.pointerType === "mouse") setHovered(false); }}
          onFocus={(e) => { if (e.target.matches(":focus-visible")) setFocused(true); }}
          onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false); }}
          className="guide-carousel mt-14 rounded-3xl md:mt-16"
        >
          {/* stage: every slide is stacked on the same spot and moved sideways by its data-pos */}
          <div
            className="guide-stage relative mx-auto aspect-[16/10] w-[min(680px,84vw)] select-none"
            onPointerDown={(e) => { swipeStart.current = e.clientX; swiped.current = false; }}
            onPointerUp={(e) => {
              if (swipeStart.current === null) return;
              const dx = e.clientX - swipeStart.current;
              swipeStart.current = null;
              if (Math.abs(dx) > SWIPE_PX) {
                swiped.current = true;
                go(active + (dx < 0 ? 1 : -1));
              }
            }}
            onPointerCancel={() => { swipeStart.current = null; }}
          >
            {STEPS.map((s, i) => {
              const offset = offsetOf(i, active);
              // a step that wraps around the loop jumps to its new side instead of sliding across the middle
              const wrapped = Math.abs(offset - offsetOf(i, prevActive)) > 1;
              return (
                <div
                  key={s.image}
                  data-pos={offset}
                  data-wrap={wrapped || undefined}
                  aria-hidden={offset !== 0}
                  onClick={() => {
                    if (swiped.current) { swiped.current = false; return; }
                    if (offset !== 0) go(i);
                  }}
                  className="guide-slide raised absolute inset-0 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]"
                >
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    draggable={false}
                    sizes="(min-width: 768px) 680px, 84vw"
                    className="object-contain p-2 md:p-3"
                  />
                </div>
              );
            })}
          </div>

          {/* the current step, written out; announced to screen readers only when the visitor moved it */}
          <div aria-live={userMoved ? "polite" : "off"} className="mx-auto mt-10 max-w-[640px] text-center">
            <p className="text-xs title-case tracking-[0.06em] text-[var(--grey)]">
              Step {active + 1} of {COUNT}
            </p>
            <h3 className="mt-2 text-2xl font-bold md:text-4xl">{step.title}</h3>
            <p className="mt-3 text-[var(--grey)] md:text-lg">{step.text}</p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3 md:gap-4">
            <button type="button" onClick={() => go(active - 1)} aria-label="Previous step" className="neon guide-arrow">
              <span aria-hidden="true">&larr;</span>
            </button>
            <ol className="flex items-center gap-2">
              {STEPS.map((s, i) => (
                <li key={s.image}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Step ${i + 1}: ${s.title}`}
                    aria-current={i === active ? "step" : undefined}
                    className="guide-dot"
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ol>
            <button type="button" onClick={() => go(active + 1)} aria-label="Next step" className="neon guide-arrow">
              <span aria-hidden="true">&rarr;</span>
            </button>
            <button
              type="button"
              onClick={() => setPlayChoice(!playing)}
              aria-label={playing ? "Pause automatic slides" : "Play automatic slides"}
              className="guide-dot guide-play inline-flex items-center justify-center"
            >
              {/* drawn icons: the site font has no pause glyph */}
              <svg aria-hidden="true" viewBox="0 0 12 12" width="12" height="12" fill="currentColor" className="mx-auto">
                {playing ? (
                  <>
                    <rect x="2" y="1.5" width="3" height="9" rx="1" />
                    <rect x="7" y="1.5" width="3" height="9" rx="1" />
                  </>
                ) : (
                  <path d="M3.5 1.8v8.4a.6.6 0 0 0 .9.5l6.3-4.2a.6.6 0 0 0 0-1L4.4 1.3a.6.6 0 0 0-.9.5z" />
                )}
              </svg>
            </button>
          </div>

          {/* time left before the next automatic slide; restarts on every step change */}
          <div aria-hidden="true" className="guide-progress-track mx-auto mt-5 h-[3px] w-40 overflow-hidden rounded-full">
            {/* keyed on pause too: the timer restarts its full 5 seconds after a pause, so the bar starts over with it */}
            {playing && <span key={`${active}-${paused}`} data-paused={paused || undefined} className="guide-progress block h-full" />}
          </div>
        </div>
      </div>
    </section>
  );
}
