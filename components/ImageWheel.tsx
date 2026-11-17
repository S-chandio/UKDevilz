"use client";
// components/ImageWheel.tsx
// A ring of pictures that turns on its own, turns faster while the page scrolls, and can be grabbed
// and flung with a pointer.
//
// Three things add up to one angle, so they can never fight each other:
//   --spin        the idle turn, a CSS animation
//   --scroll-turn extra turn from the scroll, a scroll-driven animation (no listener, no per-frame JS)
//   --drag        set here, from pointer events
// Each card works out where it sits from that total with cos()/sin(), so the pictures stay face-on
// to the reader instead of turning edge-on the way a 3D carousel does. See .wheel in globals.css.
//
// Only the drag needs JavaScript. With it switched off the ring still turns and still reacts to the
// scroll, and every card is still a link.
import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

export interface WheelItem {
  href: string;
  name: string;
  image: string;
}

const FRICTION = 0.94; // how quickly a fling dies away
const STOP_AT = 0.02; // degrees per frame below which it is standing still

export default function ImageWheel({ items, label }: { items: WheelItem[]; label?: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const angle = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const dragging = useRef(false);
  const frame = useRef(0);

  const apply = useCallback(() => {
    stage.current?.style.setProperty("--drag", `${angle.current}deg`);
  }, []);

  // the fling: keep turning after release, slowing down, until it is still
  const startCoast = useCallback(() => {
    const step = () => {
      if (Math.abs(velocity.current) < STOP_AT) {
        velocity.current = 0;
        return;
      }
      angle.current += velocity.current;
      velocity.current *= FRICTION;
      apply();
      frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  }, [apply]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // let a click through to a card; only a real drag takes over
    cancelAnimationFrame(frame.current);
    dragging.current = true;
    velocity.current = 0;
    lastX.current = e.clientX;
    stage.current?.setAttribute("data-dragging", "");
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    // a drag across the stage is about one full turn
    const step = (dx / Math.max(1, stage.current?.clientWidth ?? 1)) * 320;
    angle.current += step;
    velocity.current = step;
    apply();
    if (Math.abs(dx) > 2) e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    stage.current?.removeAttribute("data-dragging");
    startCoast();
  };

  return (
    <div
      ref={stage}
      className="wheel"
      style={{ "--n": items.length } as React.CSSProperties}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerLeave={onUp}
    >
      <div className="wheel-scroll">
        <ul className="wheel-ring list-none" aria-label={label}>
          {items.map((item, i) => (
            <li key={item.href} className="wheel-card" style={{ "--i": i } as React.CSSProperties}>
              <Link href={item.href} draggable={false}>
                <Image src={item.image} alt="" fill sizes="220px" draggable={false} />
                <span className="wheel-name">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
