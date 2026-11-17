"use client";
// components/Reveal.tsx
// A one-shot entrance. Anything inside carrying data-reveal starts hidden, is uncovered the first
// time it comes into view, and then stays exactly where it is - scrolling back up does not send it
// away again. That is the whole difference between this and the scroll-driven entrances used
// elsewhere on the site, where the progress IS the scroll position and so always reverses.
//
// It stops watching a piece the moment it has been seen, so nothing is measured or computed after
// the entrance is over.
//
// The hiding is done in CSS, but only under [data-reveal-ready], which is rendered on the server
// with the markup - not added in an effect - so a visitor who reloads part way down the page never
// sees the pieces flash in before the script hides them. The <noscript> block puts everything back
// for anyone running without JavaScript, so the content can never be left invisible by a script
// that did not arrive.
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

export default function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const bits = Array.from(el.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!bits.length) return;

    const showAll = () => {
      for (const b of bits) b.dataset.seen = "true";
    };

    // anyone who has asked for less movement, and anything too old for the observer, gets the lot
    // at once rather than nothing at all
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      showAll();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.seen = "true";
          io.unobserve(e.target); // once only: this is what makes it stay put
        }
      },
      // a little way in from the bottom, so a piece starts moving once it is properly on screen
      // rather than while its first pixel is still off it
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    for (const b of bits) io.observe(b);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <noscript>
        <style>{`[data-reveal]{opacity:1!important;animation:none!important}`}</style>
      </noscript>
      <div ref={root} className={className} data-reveal-ready="">
        {children}
      </div>
    </>
  );
}
