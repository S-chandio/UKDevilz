import type { CSSProperties } from "react";
import Link from "next/link";
import { PLATFORM_ICONS } from "@/lib/platform-icons";

const POSITIONS = [[47, 150], [47, 90], [47, 30], [36, 165], [36, 105], [36, 45], [26, 145], [26, 65], [16, 155], [16, 35]];

export default function PlatformOrbits({ items }: { items: { name: string; href: string }[] }) {
  return (
    <div className="platform-orbits">
      <div className="platform-orbits-rings" aria-hidden="true">
        {[47, 36, 26, 16].map((r) => <span key={r} style={{ width: `${r * 2}%`, height: `${r * 4}%`, bottom: `${-r * 2}%` }} />)}
      </div>
      <ul aria-label="The other ten platforms" className="platform-orbits-list">
        {items.map((p, i) => {
          const [r, angle] = POSITIONS[i];
          const radians = angle * Math.PI / 180;
          const icon = PLATFORM_ICONS[p.name];
          return (
            <li key={p.href} style={{ "--orbit-x": `${50 + r * Math.cos(radians)}%`, "--orbit-y": `${100 - r * 2 * Math.sin(radians)}%` } as CSSProperties}>
              <Link href={p.href} aria-label={`${p.name} downloader`}>
                <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" style={{ color: p.name === "Snapchat" ? "#292929" : icon.hex }}><path fill="currentColor" d={icon.path} /></svg>
                <span>{p.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="platform-orbits-center" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="34" height="34"><path fill="currentColor" d={PLATFORM_ICONS.Instagram.path} /></svg>
      </div>
    </div>
  );
}
