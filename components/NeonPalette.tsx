"use client";
// components/NeonPalette.tsx
// Gives every .neon button one of the four theme colours at random on each visit (red, off-white, grey, black), so
// buttons do not all look the same. Buttons next to each other (in page order) never get the same colour. Buttons that
// appear later (download results, the phone menu) are coloured as they arrive. It only sets data-neon="0".."3";
// the colours themselves live in globals.css (.neon[data-neon=...]). Renders nothing; mounted once in app/layout.tsx.
import { useEffect } from "react";

const COLOUR_COUNT = 4; // 0 red, 1 off-white, 2 grey, 3 black

export default function NeonPalette() {
  useEffect(() => {
    let last = -1;
    const paint = () => {
      document.querySelectorAll<HTMLElement>(".neon:not([data-neon])").forEach((el) => {
        let i = Math.floor(Math.random() * COLOUR_COUNT);
        if (i === last) i = (i + 1 + Math.floor(Math.random() * (COLOUR_COUNT - 1))) % COLOUR_COUNT;
        last = i;
        el.dataset.neon = String(i);
      });
    };
    paint();
    const mo = new MutationObserver(paint);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);

  return null;
}
