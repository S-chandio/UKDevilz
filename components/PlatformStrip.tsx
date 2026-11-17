// components/PlatformStrip.tsx
// The row of every platform we support, shown at the top of each platform landing page with the
// current one picked out. It carries the header's height, so the see-through header sits on this
// black band instead of on the page background (see .pf-band / .under-header in globals.css).
import Link from "next/link";
import { PLATFORMS } from "@/lib/platforms";

export default function PlatformStrip({ current }: { current: string }) {
  return (
    <div className="pf-band under-header">
      <nav aria-label="All platforms" className="mx-auto max-w-[1200px] px-[5vw] lg:px-6">
        <ul className="pf-strip list-none">
          {PLATFORMS.map((p) => {
            const here = p.href === current;
            return (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="pf-strip-link"
                  data-current={here || undefined}
                  aria-current={here ? "page" : undefined}
                >
                  {p.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
