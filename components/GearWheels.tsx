"use client";
// components/GearWheels.tsx
// Two wheels side by side across the full width of the screen, each centred on its own edge so only
// its inner half shows, turning against each other like a pair of meshing gears. The left one carries
// the words, the right one the pictures, and the heading sits in the gap between them.
//
// One angle drives both - --gw-turn, which is just --gw-spin (a slow, endless CSS turn) plus
// --gw-drag (whatever the visitor has turned them by hand). The right wheel takes 180deg MINUS that
// angle instead of plus, which does two things at once: it turns the opposite way, the way meshing
// gears do, and it puts picture 3 exactly opposite word 3. Whatever faces the gap on the left always
// faces it on the right.
//
// Nothing is rotated, only moved - each item finds its place with cos()/sin() - so the words and the
// pictures stay the right way up instead of tipping over as they come round.
//
// The JavaScript here is only the hand on the gear: a pointer drag on either wheel is turned into an
// angle around that wheel's own centre (so dragging the edge up or down turns it, like a real one),
// and letting go lets it coast to a stop. The right wheel's sign is flipped because it runs the other
// way. The idle turn pauses while a wheel is held. Everything else is .gw-* in globals.css, which
// also stacks the whole thing into plain boxes on a phone and for anyone who asks for less movement -
// and there the drag is left switched off.
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react";

export interface GearStep {
  title: string;
  text: string;
  image: string;
  alt: string;
}

// how quickly a fling dies away, and the speed below which we call it stopped (degrees per frame)
const FRICTION = 0.94;
const STOP_AT = 0.02;

const DEG = 180 / Math.PI;

export default function GearWheels({
  steps,
  label,
  children,
}: {
  steps: GearStep[];
  label?: string;
  children?: ReactNode;
}) {
  const band = useRef<HTMLDivElement>(null);
  const turn = useRef(0); // degrees added by hand
  const vel = useRef(0); // degrees per frame, for the coast after a fling
  const raf = useRef(0);
  const grip = useRef<{
    id: number;
    cx: number;
    cy: number;
    px: number;
    py: number;
    sign: number;
  } | null>(null);

  const apply = useCallback(() => {
    band.current?.style.setProperty("--gw-drag", `${turn.current}deg`);
  }, []);

  // let a fling run down instead of stopping dead
  const coast = useCallback(() => {
    const step = () => {
      vel.current *= FRICTION;
      if (Math.abs(vel.current) < STOP_AT) {
        vel.current = 0;
        return;
      }
      turn.current += vel.current;
      apply();
      raf.current = requestAnimationFrame(step);
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(step);
  }, [apply]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const onDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const el = band.current;
    if (!el) return;
    // on a phone, and for anyone who has asked for less movement, this is a plain stack: nothing turns
    if (window.matchMedia("(max-width: 767px), (prefers-reduced-motion: reduce)").matches) return;

    const wheel = (e.target as HTMLElement | null)?.closest<HTMLElement>(".gw-wheel");
    if (!wheel) return; // the heading in the middle is left alone, so it can still be selected

    const r = wheel.getBoundingClientRect();
    cancelAnimationFrame(raf.current);
    vel.current = 0;
    grip.current = {
      id: e.pointerId,
      cx: r.left + r.width / 2,
      cy: r.top + r.height / 2,
      px: e.clientX,
      py: e.clientY,
      sign: wheel.dataset.side === "art" ? -1 : 1,
    };
    el.setPointerCapture(e.pointerId);
    el.dataset.dragging = "true";
  }, []);

  const onMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const g = grip.current;
      if (!g || e.pointerId !== g.id) return;

      const dx = e.clientX - g.px;
      const dy = e.clientY - g.py;
      g.px = e.clientX;
      g.py = e.clientY;

      // the part of that movement which goes round the wheel rather than in or out of its hub
      const ax = e.clientX - g.cx;
      const ay = e.clientY - g.cy;
      const rr = Math.max(ax * ax + ay * ay, 2500); // near the hub a small move is not a big turn
      const by = ((dx * -ay + dy * ax) / rr) * DEG * g.sign;

      turn.current += by;
      vel.current = by;
      apply();
    },
    [apply],
  );

  const onUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const g = grip.current;
      if (!g || e.pointerId !== g.id) return;
      grip.current = null;
      const el = band.current;
      if (el) {
        if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
        delete el.dataset.dragging;
      }
      coast();
    },
    [coast],
  );

  return (
    <div
      ref={band}
      className="gw"
      style={{ "--n": steps.length } as CSSProperties}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      {/* left gear: the words */}
      <div className="gw-wheel" data-side="copy">
        <span aria-hidden="true" className="gw-rim" />
        <ol className="gw-ring list-none" aria-label={label}>
          {steps.map((s, i) => (
            <li key={s.title} className="gw-item" style={{ "--i": i } as CSSProperties}>
              <span aria-hidden="true" className="gw-num">
                {i + 1}
              </span>
              <h3 className="gw-title">{s.title}</h3>
              <p className="gw-line">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* the gap in the middle, where the heading goes */}
      {children ? <div className="gw-mid">{children}</div> : null}

      {/* right gear: the pictures, mirrored so each one faces its own words across the gap */}
      <div className="gw-wheel" data-side="art">
        <span aria-hidden="true" className="gw-rim" />
        <ul className="gw-ring list-none">
          {steps.map((s, i) => (
            <li key={s.title} className="gw-item" style={{ "--i": i } as CSSProperties}>
              <span className="gw-pic">
                <Image src={s.image} alt={s.alt} fill sizes="(min-width: 768px) 16vw, 55vw" />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
