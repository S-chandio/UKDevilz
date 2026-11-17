"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Platform } from "@/lib/platforms";

export default function FacebookStories({ platforms }: { platforms: Platform[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [paused, setPaused] = useState(false);
  const resumeAt = useRef(0);

  function updateEdges() {
    const el = track.current;
    if (el) setEdges({ start: el.scrollLeft < 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
  }

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el || paused) return;
    const motion = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    let visible = false;
    let direction = 1;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.5 });
    observer.observe(el);
    const timer = window.setInterval(() => {
      if (!visible || !motion.matches || document.hidden || Date.now() < resumeAt.current || el.parentElement?.matches(":hover, :focus-within")) return;
      const end = el.scrollWidth - el.clientWidth;
      if (end <= 0) return;
      if (el.scrollLeft >= end - 2) direction = -1;
      if (el.scrollLeft <= 2) direction = 1;
      const cards = el.children;
      const distance = cards.length > 1 ? (cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft : el.clientWidth;
      el.scrollBy({ left: direction * distance, behavior: "smooth" });
    }, 3500);
    return () => { clearInterval(timer); observer.disconnect(); };
  }, [paused]);

  function advance(direction: number) {
    resumeAt.current = Date.now() + 6000;
    track.current?.scrollBy({
      left: direction * track.current.clientWidth * 0.8,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  return (
    <div className="fb-stories">
      <div className="fb-stories-toolbar">
        <p><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="18" rx="2" /><rect x="14" y="3" width="7" height="18" rx="2" /></svg>Explore platforms</p>
        <div className="fb-stories-controls">
          <button className="fb-stories-play" type="button" aria-label={paused ? "Play automatic stories" : "Pause automatic stories"} aria-pressed={paused} onClick={() => setPaused(!paused)}><span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span></button>
          <button type="button" aria-label="Previous platforms" aria-controls="facebook-platform-stories" disabled={edges.start} onClick={() => advance(-1)}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m14 6-6 6 6 6M8 12h13" /></svg></button>
          <button type="button" aria-label="Next platforms" aria-controls="facebook-platform-stories" disabled={edges.end} onClick={() => advance(1)}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m10 6 6 6-6 6M3 12h13" /></svg></button>
        </div>
      </div>
      <ul ref={track} id="facebook-platform-stories" className="fb-stories-track" onScroll={updateEdges} onPointerDown={() => { resumeAt.current = Date.now() + 6000; }} onWheel={() => { resumeAt.current = Date.now() + 6000; }} aria-label="The other ten platform downloaders">
        {platforms.map((platform) => (
          <li key={platform.href} className="fb-story">
            <Link href={platform.href} aria-label={`${platform.name} downloader`} style={{ background: platform.theme.bg }}>
              <Image className="fb-story-backdrop" src={platform.image} alt="" fill sizes="200px" />
              <div className="fb-story-art"><Image src={platform.image} alt="" fill sizes="200px" /></div>
              <span className="fb-story-avatar"><Image src={platform.image} alt="" fill sizes="48px" /></span>
              <span className="fb-story-footer"><strong>{platform.name}</strong><span>Open downloader <span aria-hidden="true">↗</span></span></span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="fb-stories-hint">Use the arrows or swipe to choose another platform tool.</p>
    </div>
  );
}
