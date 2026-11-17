"use client";
// components/ShatterImage.tsx
// An image that builds itself from flying triangles the first time it scrolls into view.
// Plain 2d canvas, no library (idea from the three.bas "slide" effect, "in" phase).
// The real <Image> is always in the page: it shows as-is on first paint, for reduced motion and when
// canvas is unavailable, and it replaces the canvas the moment the effect ends, so nothing keeps running.

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const COLS = 24;          // grid cells across; every cell is two triangles
const MIN_DURATION = 0.8; // seconds a triangle flies (before SPEED)
const MAX_DURATION = 1.2;
const MAX_DELAY_X = 0.9;  // left-to-right sweep
const MAX_DELAY_Y = 0.125; // middle rows land slightly before the top and bottom
const STRETCH = 0.11;     // random jitter so the sweep is not a hard line
const SPEED = 1.5;        // whole effect lands in about 1.6 seconds
const OVERLAP = 1.04;     // triangles drawn slightly larger so no hairline seams show while moving

type Pt = [number, number];
interface Tri { pts: Pt[]; cx: number; cy: number; delay: number; duration: number; c0: Pt; c1: Pt; spin: number }

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const bezier = (p0: number, p1: number, p2: number, p3: number, t: number) => {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
};

function buildTriangles(w: number, h: number): Tri[] {
  const rows = Math.max(1, Math.round((COLS * h) / w));
  const cw = w / COLS;
  const ch = h / rows;
  const unit = w / 100; // the original effect is tuned for a plane 100 units wide
  const tris: Tri[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < COLS; c++) {
      const x0 = c * cw, y0 = r * ch, x1 = x0 + cw, y1 = y0 + ch;
      const halves: Pt[][] = (r + c) % 2
        ? [[[x0, y0], [x1, y0], [x0, y1]], [[x1, y0], [x1, y1], [x0, y1]]]
        : [[[x0, y0], [x1, y0], [x1, y1]], [[x0, y0], [x1, y1], [x0, y1]]];

      for (const pts of halves) {
        const cx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3;
        const cy = (pts[0][1] + pts[1][1] + pts[2][1]) / 3;
        const duration = rand(MIN_DURATION, MAX_DURATION);
        const top = cy < h / 2 ? 1 : -1;
        tris.push({
          pts: pts.map(([x, y]) => [cx + (x - cx) * OVERLAP, cy + (y - cy) * OVERLAP]),
          cx,
          cy,
          duration,
          delay: (cx / w) * MAX_DELAY_X + (Math.abs(cy - h / 2) / (h / 2)) * MAX_DELAY_Y + Math.random() * STRETCH * duration,
          // curve pulls each triangle in from the left, swinging through and back out past the middle
          c0: [cx - rand(0.1, 0.3) * 50 * unit, cy + top * rand(0.1, 0.3) * 70 * unit],
          c1: [cx - rand(0.3, 0.6) * 50 * unit, cy - top * rand(0.3, 0.6) * 70 * unit],
          spin: rand(-0.8, 0.8),
        });
      }
    }
  }
  return tris;
}

function drawFrame(ctx: CanvasRenderingContext2D, fill: CanvasPattern, tris: Tri[], t: number, dpr: number) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = fill;

  for (const tri of tris) {
    const progress = Math.min(Math.max(t - tri.delay, 0), tri.duration) / tri.duration;
    const e = easeInOutCubic(progress);
    if (e < 0.001) continue;

    const x = bezier(tri.cx, tri.c0[0], tri.c1[0], tri.cx, e);
    const y = bezier(tri.cy, tri.c0[1], tri.c1[1], tri.cy, e);
    const angle = tri.spin * (1 - e);
    const cos = Math.cos(angle) * e; // grows from nothing to full size while it flies
    const sin = Math.sin(angle) * e;

    // move the triangle's own piece of the picture with it: rotate/scale around its centre, then place it at (x, y)
    ctx.setTransform(
      dpr * cos, dpr * sin, -dpr * sin, dpr * cos,
      dpr * (x - (cos * tri.cx - sin * tri.cy)),
      dpr * (y - (sin * tri.cx + cos * tri.cy)),
    );
    ctx.beginPath();
    ctx.moveTo(tri.pts[0][0], tri.pts[0][1]);
    ctx.lineTo(tri.pts[1][0], tri.pts[1][1]);
    ctx.lineTo(tri.pts[2][0], tri.pts[2][1]);
    ctx.closePath();
    ctx.fill();
  }
}

export default function ShatterImage({ src, sizes }: { src: string; sizes: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // still: the plain image. waiting: hidden until the box scrolls into view. playing: canvas animating
  const [phase, setPhase] = useState<"still" | "waiting" | "playing">("still");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!document.createElement("canvas").getContext("2d")) return;
    const box = boxRef.current;
    if (!box) return;

    setPhase("waiting");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setPhase("playing");
      },
      { threshold: 0.35 },
    );
    io.observe(box);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    const box = boxRef.current, img = imgRef.current, canvas = canvasRef.current;
    if (!box || !img || !canvas) return;
    let raf = 0;
    let cancelled = false;

    (async () => {
      try {
        if (!img.complete) {
          await new Promise((resolve, reject) => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", reject, { once: true });
          });
        }
        await img.decode();
      } catch {
        if (!cancelled) setPhase("still");
        return;
      }
      const ctx = canvas.getContext("2d");
      if (cancelled || !ctx || !img.naturalWidth) {
        if (!cancelled) setPhase("still");
        return;
      }

      const w = box.clientWidth, h = box.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      // the picture exactly as the box shows it (object-cover, centred); every triangle is filled from it
      const art = document.createElement("canvas");
      art.width = canvas.width;
      art.height = canvas.height;
      const scale = Math.max(art.width / img.naturalWidth, art.height / img.naturalHeight);
      const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
      art.getContext("2d")!.drawImage(img, (art.width - dw) / 2, (art.height - dh) / 2, dw, dh);
      const fill = ctx.createPattern(art, "no-repeat")!;
      fill.setTransform(new DOMMatrix().scale(1 / dpr));

      const tris = buildTriangles(w, h);
      const total = tris.reduce((m, t) => Math.max(m, t.delay + t.duration), 0);
      const start = performance.now();

      const frame = (now: number) => {
        if (cancelled) return;
        const t = ((now - start) / 1000) * SPEED;
        if (t >= total) {
          setPhase("still"); // hand over to the real image; the canvas unmounts
          return;
        }
        drawFrame(ctx, fill, tris, t, dpr);
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [phase]);

  return (
    <div ref={boxRef} className="absolute inset-0">
      <Image
        ref={imgRef}
        src={src}
        alt=""
        fill
        sizes={sizes}
        className={`object-cover ${phase === "still" ? "" : "opacity-0"}`}
      />
      {phase === "playing" && <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />}
    </div>
  );
}
