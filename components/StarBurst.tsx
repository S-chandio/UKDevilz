"use client";
// components/StarBurst.tsx
// Click or tap anywhere on the band and a handful of stars shoot out of that point: between three
// and eight of them, each its own colour from the TikTok palette, its own size, distance and speed.
//
// The sparks are made as plain elements and dropped straight into this layer rather than held in
// React state. A burst is a throwaway visual, not something the page needs to remember, and putting
// it in state would re-render the band on every tap. Each spark removes itself when its animation
// ends, so nothing is left behind and nothing is polled.
//
// The layer itself never takes a click - the listener is on the band, so the sparks cannot swallow
// anything underneath them. Styles are .pf-burst / .pf-spark in globals.css.
import { useEffect, useRef } from "react";

const COLOURS = ["#ffffff", "#25f4ee", "#fe2c55"];
const FEWEST = 3;
const MOST = 8;
// a ceiling, so holding a tap down or hammering the band cannot pile up thousands of elements
const MAX_LIVE = 140;

export default function StarBurst() {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = layer.current;
    const band = el?.parentElement;
    if (!el || !band) return;
    // anyone who has asked for less movement gets a sky that stays where it is
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const burst = (e: PointerEvent) => {
      if (el.childElementCount > MAX_LIVE) return;

      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;

      const n = FEWEST + Math.floor(Math.random() * (MOST - FEWEST + 1));
      // spread them round the circle and then knock each one off its mark, which reads as a burst
      // rather than as a cartwheel of evenly spaced dots
      const start = Math.random() * Math.PI * 2;

      for (let i = 0; i < n; i++) {
        const angle = start + (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.9;
        const reach = 42 + Math.random() * 86;
        const spark = document.createElement("span");
        spark.className = "pf-spark";
        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;
        spark.style.setProperty("--dx", `${Math.cos(angle) * reach}px`);
        spark.style.setProperty("--dy", `${Math.sin(angle) * reach}px`);
        spark.style.setProperty("--s", `${3 + Math.random() * 4}px`);
        spark.style.setProperty("--c", COLOURS[Math.floor(Math.random() * COLOURS.length)]);
        spark.style.setProperty("--d", `${620 + Math.random() * 480}ms`);
        spark.addEventListener("animationend", () => spark.remove(), { once: true });
        el.appendChild(spark);
      }
    };

    band.addEventListener("pointerdown", burst);
    return () => {
      band.removeEventListener("pointerdown", burst);
      el.replaceChildren();
    };
  }, []);

  return <div ref={layer} aria-hidden="true" className="pf-burst" />;
}
