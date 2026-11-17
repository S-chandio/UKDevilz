"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface FilmPlatform { name: string; href: string; image: string }

export default function PlatformFilmstrip({ platforms }: { platforms: FilmPlatform[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);
  const interacting = useRef(false);
  const resumeAt = useRef(0);
  const drag = useRef({ active: false, x: 0, left: 0, moved: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const motion = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let last = 0;
    let direction = 1;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(el);
    function tick(now: number) {
      const elapsed = Math.min(now - last, 50);
      last = now;
      if (el && visible && motion.matches && !paused && !interacting.current && !drag.current.active && now > resumeAt.current && !document.hidden) {
        const end = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= end - 1) direction = -1;
        if (el.scrollLeft <= 0) direction = 1;
        el.scrollLeft += direction * elapsed * 0.035;
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [paused]);

  function advance(direction: number) {
    const el = track.current;
    if (!el) return;
    resumeAt.current = performance.now() + 4000;
    el.scrollBy({
      left: direction * el.clientWidth * 0.8,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  return (
    <div className="sn-film"
      onMouseEnter={() => { interacting.current = true; }}
      onMouseLeave={() => { interacting.current = false; }}
      onFocusCapture={() => { interacting.current = true; }}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) interacting.current = false; }}
    >
      <div className="sn-film-toolbar">
        <p>{platforms.length} platform tools to choose from.</p>
        <div className="sn-film-controls">
          <button className="sn-film-play" type="button" aria-label={paused ? "Play automatic scrolling" : "Pause automatic scrolling"} aria-pressed={paused} onClick={() => setPaused(!paused)}>
            <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
          </button>
          <button type="button" aria-label="Previous platforms" aria-controls="snap-platform-film" onClick={() => advance(-1)}>
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m14 6-6 6 6 6M8 12h13" /></svg>
          </button>
          <button type="button" aria-label="Next platforms" aria-controls="snap-platform-film" onClick={() => advance(1)}>
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m10 6 6 6-6 6M3 12h13" /></svg>
          </button>
        </div>
      </div>
      <div className="sn-film-stock">
        <ul ref={track} id="snap-platform-film" className="sn-film-track" aria-label="The other ten platforms"
          onWheel={() => { resumeAt.current = performance.now() + 4000; }}
          onPointerDown={(event) => {
            resumeAt.current = performance.now() + 4000;
            if (event.pointerType !== "mouse" || event.button !== 0) return;
            drag.current = { active: true, x: event.clientX, left: event.currentTarget.scrollLeft, moved: false };
          }}
          onPointerMove={(event) => {
            if (!drag.current.active) return;
            const distance = event.clientX - drag.current.x;
            if (Math.abs(distance) > 5) {
              drag.current.moved = true;
              event.currentTarget.setPointerCapture(event.pointerId);
              event.currentTarget.scrollLeft = drag.current.left - distance;
            }
          }}
          onPointerUp={() => { drag.current.active = false; }}
          onPointerCancel={() => { drag.current.active = false; }}
          onLostPointerCapture={() => { drag.current.active = false; }}
          onPointerLeave={() => { if (!drag.current.moved) drag.current.active = false; }}
          onDragStart={(event) => event.preventDefault()}
          onClickCapture={(event) => { if (drag.current.moved) { event.preventDefault(); event.stopPropagation(); drag.current.moved = false; } }}
        >
          {platforms.map((p, i) => (
            <li key={p.href} className="sn-film-frame">
              <Link href={p.href} aria-label={`${p.name} downloader`}>
                <div className="sn-film-image">
                  <Image src={p.image} alt="" fill sizes="(max-width: 767px) 176px, 216px" draggable={false} />
                </div>
                <div className="sn-film-caption">
                  <span className="sn-film-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span>{p.name}</span>
                  <span aria-hidden="true">↗</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <p className="sn-film-hint">Swipe or use the arrows to see more tools.</p>
    </div>
  );
}
