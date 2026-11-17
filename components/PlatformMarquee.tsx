"use client";
// components/PlatformMarquee.tsx
// Endless logo slider right under the hero: every supported platform as a brand-colour badge and name,
// drifting right to left. Grab it and pull either way; it keeps a little momentum, then eases back into its drift.
// Pauses while hovered or off screen (background tabs stop animation frames by themselves); visitors who prefer reduced
// motion get a still row (they can still pull it). No pause button, by request.
// Each chip opens its downloader. Only the middle copy participates in keyboard navigation.
import type { CSSProperties, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PLATFORMS } from "@/lib/platforms";
import { PLATFORM_ICONS } from "@/lib/platform-icons";
import { useReducedMotion } from "@/lib/useReducedMotion";

const SPEED = 40; // drift, px per second, right to left
const COPIES = 3; // the list repeated so the row stays full while one copy scrolls away
const DRAG_THRESHOLD = 6; // px a press has to move before it counts as a drag
const MAX_FLING = 1500; // px per second

// white or black icon, whichever reads better on the brand colour
const iconInk = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#000000" : "#ffffff";
};

const ITEMS = PLATFORMS.filter((p) => PLATFORM_ICONS[p.name]).map((p) => ({ ...p, icon: PLATFORM_ICONS[p.name] }));

export default function PlatformMarquee({ compact = false, exclude, staticMobile = false }: { compact?: boolean; exclude?: string; staticMobile?: boolean }) {
  const items = ITEMS.filter((p) => p.name !== exclude);
  const playing = !useReducedMotion();
  const [dragging, setDragging] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const playingRef = useRef(playing);
  const hovered = useRef(false);
  const focused = useRef(false);
  const motion = useRef({ x: 0, v: -SPEED });
  const drag = useRef({ down: false, active: false, pointerId: -1, lastX: 0, lastT: 0, moved: 0, v: 0 });

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  // animation loop: runs only while the slider is on screen
  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const m = motion.current;
    let width = track.scrollWidth / COPIES;
    let raf = 0;
    let last = 0;
    let running = false;
    const mobile = window.matchMedia("(max-width: 767px)");

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      if (!drag.current.active) {
        const target = playingRef.current && !hovered.current && !focused.current && !(staticMobile && mobile.matches) ? -SPEED : 0;
        m.v += (target - m.v) * Math.min(1, dt * 3); // a fling's momentum eases back into the drift
        m.x += m.v * dt;
      }
      // keep x within one copy either side, so the three copies always cover the view
      while (m.x >= width) m.x -= width;
      while (m.x < -width) m.x += width;
      track.style.transform = `translate3d(${m.x - width}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const ro = new ResizeObserver(() => {
      width = track.scrollWidth / COPIES;
    });
    ro.observe(track);
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(viewport);
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, [staticMobile]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { down: true, active: false, pointerId: e.pointerId, lastX: e.clientX, lastT: e.timeStamp, moved: 0, v: 0 };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.down || e.pointerId !== d.pointerId) return;
    const dx = e.clientX - d.lastX;
    d.moved += Math.abs(dx);
    if (!d.active && d.moved > DRAG_THRESHOLD) {
      // only now take the pointer over, so a plain click still reaches the link
      d.active = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      motion.current.v = 0;
      setDragging(true);
    }
    if (d.active) {
      const dt = Math.max((e.timeStamp - d.lastT) / 1000, 0.001);
      motion.current.x += dx;
      d.v = 0.8 * (dx / dt) + 0.2 * d.v;
    }
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.down) return;
    d.down = false;
    if (!d.active) return;
    d.active = false;
    motion.current.v = Math.max(-MAX_FLING, Math.min(MAX_FLING, d.v));
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  };

  return (
    // black look: it sits between the hero and the how-to carousel, both black, so the page flows without hard edges
    <section className={compact ? "look-black w-full overflow-hidden pb-12 md:pb-16" : "look-black w-full overflow-hidden py-16 md:py-20"}>
      <p className="sr-only">Supported platforms: {items.map((p) => p.name).join(", ")}.</p>

      <div
        ref={viewportRef}
        data-dragging={dragging || undefined}
        className="marquee"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDragStart={(e) => e.preventDefault()}
        onClickCapture={(e) => { if (drag.current.moved > DRAG_THRESHOLD) { e.preventDefault(); e.stopPropagation(); } }}
        onFocusCapture={() => { focused.current = true; motion.current.v = 0; }}
        onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) focused.current = false; }}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") hovered.current = true; }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") hovered.current = false; }}
      >
        <div ref={trackRef} className="marquee-track">
          {Array.from({ length: COPIES }, (_, copy) => (
            <ul key={copy} className="marquee-set" aria-hidden={copy !== 1 || undefined}>
              {items.map((p) => (
                <li key={p.name}>
                  <Link href={p.href} className="marquee-chip raised" aria-label={`${p.name} downloader`} tabIndex={copy === 1 ? 0 : -1}
                    onFocus={(e) => {
                      if (!e.currentTarget.matches(":focus-visible")) return;
                      drag.current.moved = 0;
                      const item = e.currentTarget.closest("li");
                      const set = item?.parentElement;
                      if (item && set && trackRef.current && viewportRef.current) {
                        const offset = item.offsetLeft - set.offsetLeft;
                        const width = trackRef.current.scrollWidth / COPIES;
                        motion.current.x = -offset + 24;
                        motion.current.v = 0;
                        viewportRef.current.scrollLeft = 0;
                        trackRef.current.style.transform = `translate3d(${motion.current.x - width}px, 0, 0)`;
                      }
                    }}>
                    <span
                      className="marquee-badge"
                      style={{ "--brand": p.icon.hex, "--brand-ink": iconInk(p.icon.hex) } as CSSProperties}
                    >
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path d={p.icon.path} />
                      </svg>
                    </span>
                    <span className="marquee-name">{p.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
