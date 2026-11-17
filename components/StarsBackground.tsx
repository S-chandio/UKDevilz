// components/StarsBackground.tsx
// A star field to sit behind a band. Same shape as the animate-ui component the client sent
// (starColor + className over a radial-gradient sky), built against this project instead of pulling
// in animate-ui, next-themes, clsx/tailwind-merge and a motion runtime for one background: the site
// has no dark mode to read, and the movement here is driven by a scroll timeline, which is CSS.
//
// Five layers: three that travel with the scroll at different depths, and two that drift on their own
// so the sky is never still.
// Everything else lives in .pf-stars in globals.css. No client JavaScript.
import type { CSSProperties } from "react";

export default function StarsBackground({
  starColor = "#ffffff",
  className,
}: {
  starColor?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={["pf-stars", className].filter(Boolean).join(" ")}
      style={{ "--star": starColor } as CSSProperties}
    >
      {/* these three travel with the scroll */}
      <span className="pf-stars-layer" data-depth="far" />
      <span className="pf-stars-layer" data-depth="mid" />
      <span className="pf-stars-layer" data-depth="near" />
      {/* and these two drift on their own, whether anyone is scrolling or not */}
      <span className="pf-stars-drift" data-drift="a" />
      <span className="pf-stars-drift" data-drift="b" />
    </div>
  );
}
