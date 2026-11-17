"use client";
// components/NeonArrows.tsx
// The TikTok hero's backdrop, drawn in code: a pair of chevron stacks facing each other across an
// empty middle, over faint zigzag ribbons and two hairlines, in TikTok's colours (#FE2C55, #25F4EE,
// #FFFFFF). Its own background is transparent, so whatever band it sits on shows through.
//
// Each chevron is a stroked polyline drawn twice - cyan, and pink offset behind it - which is what
// gives the doubled outline. Nothing is filled except the two dots.
//
// The stacks hover: a four-cornered loop (right, down, left, up) rather than a back-and-forth, so
// the movement never reverses on itself. The two sides run at different lengths and start at
// different points in the loop, so they are never in step.
//
// The only JavaScript is reading the pointer: it writes --mx / --my (0-100, where the pointer is
// across the band) and --on (0 or 1), and CSS leans the pieces towards it. The hover uses
// `transform`, the lean uses `translate` - separate properties, so both apply at once.
import { useCallback, useEffect, useRef } from "react";
import type { CSSProperties } from "react";

// one chevron: a V on its side. Drawn right-pointing; the left-hand stack is mirrored in CSS.
const CHEVRON = "4,4 74,62 4,120";

export default function NeonArrows({ className }: { className?: string }) {
  const field = useRef<HTMLDivElement>(null);

  const set = useCallback((x: number, y: number, on: number) => {
    const el = field.current;
    if (!el) return;
    el.style.setProperty("--mx", String(x));
    el.style.setProperty("--my", String(y));
    el.style.setProperty("--on", String(on));
  }, []);

  useEffect(() => {
    const el = field.current;
    const band = el?.parentElement;
    if (!el || !band) return;
    const move = (e: PointerEvent) => {
      const r = band.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100, 1);
    };
    const leave = () => set(50, 50, 0);
    band.addEventListener("pointermove", move, { passive: true });
    band.addEventListener("pointerleave", leave);
    return () => {
      band.removeEventListener("pointermove", move);
      band.removeEventListener("pointerleave", leave);
    };
  }, [set]);

  const stack = (side: "left" | "right") => (
    <div className="na-stack" data-side={side} style={{ "--xn": side === "left" ? 12 : 88, "--yn": 50 } as CSSProperties}>
      <svg viewBox="0 0 180 124" aria-hidden="true">
        {/* pink sits behind, offset, so the pair reads as one doubled outline */}
        <polyline className="na-ink" data-ink="pink" points={CHEVRON} transform="translate(14 -9)" />
        <polyline className="na-ink" data-ink="cyan" points={CHEVRON} />
        <polyline className="na-ink" data-ink="pink" points={CHEVRON} transform="translate(90 -9)" />
        <polyline className="na-ink" data-ink="cyan" points={CHEVRON} transform="translate(76 0)" />
      </svg>
      <span className="na-dot" />
    </div>
  );

  return (
    <div ref={field} aria-hidden="true" className={["na", className].filter(Boolean).join(" ")}>
      {/* the faint ribbons and hairlines that run across behind everything */}
      <svg className="na-weave" viewBox="0 0 1200 400" preserveAspectRatio="none">
        <polyline className="na-zig" points="0,96 30,74 60,96 90,74 120,96 150,74 180,96 210,74 240,96 270,74 300,96 330,74 360,96 390,74 420,96 450,74 480,96" />
        <polyline className="na-zig" points="720,300 750,278 780,300 810,278 840,300 870,278 900,300 930,278 960,300 990,278 1020,300 1050,278 1080,300 1110,278 1140,300 1170,278 1200,300" />
        <polyline className="na-zig" data-faint="" points="300,200 340,176 380,200 420,176 460,200 500,176 540,200 580,176 620,200 660,176 700,200 740,176 780,200 820,176 860,200" />
        <line className="na-rule" data-ink="pink" x1="120" y1="150" x2="1080" y2="150" />
        <line className="na-rule" data-ink="cyan" x1="200" y1="258" x2="1000" y2="258" />
      </svg>

      {stack("left")}
      {stack("right")}
    </div>
  );
}
