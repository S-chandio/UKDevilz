import type { CSSProperties } from "react";
import { PLATFORM_ICONS } from "@/lib/platform-icons";
import styles from "./hero.module.css";

const FLOATERS = [
  { kind: "brand", duration: "13s", delay: "-4s", tilt: "8deg" },
  { kind: "play", duration: "10s", delay: "-2s", tilt: "-12deg" },
  { kind: "film", duration: "12s", delay: "-7s", tilt: "12deg" },
  { kind: "audio", duration: "11s", delay: "-5s", tilt: "-8deg" },
  { kind: "link", duration: "14s", delay: "-9s", tilt: "14deg" },
  { kind: "download", duration: "10.5s", delay: "-6s", tilt: "-10deg" },
  { kind: "brand-small", duration: "12.5s", delay: "-3s", tilt: "-14deg" },
  { kind: "video", duration: "15s", delay: "-11s", tilt: "9deg" },
] as const;

type SymbolKind = (typeof FLOATERS)[number]["kind"];

function DailymotionMark() {
  return <svg viewBox="0 0 24 24" fill="currentColor" focusable="false"><path d={PLATFORM_ICONS.Dailymotion.path} /></svg>;
}

function MediaSymbol({ kind }: { kind: SymbolKind }) {
  if (kind === "brand" || kind === "brand-small") return <DailymotionMark />;

  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
      {kind === "play" && <><circle cx="24" cy="24" r="17" /><path d="m20 16 12 8-12 8Z" fill="currentColor" stroke="none" /></>}
      {kind === "film" && <><rect x="7" y="9" width="34" height="30" rx="4" /><path d="M7 17h34M7 31h34M15 9v8m9-8v8m9-8v8M15 31v8m9-8v8m9-8v8m-13-19 6 4-6 4Z" /></>}
      {kind === "audio" && <><path d="M8 21v6m8-12v18m8-24v30m8-21v12m8-9v6" strokeWidth="3" /><path d="M8 39h32" opacity=".25" /></>}
      {kind === "link" && <><path d="m28 20-8 8m-2-4-2 2a7 7 0 0 0 10 10l7-7a7 7 0 0 0-1-11m-2 6 2-2A7 7 0 0 0 22 12l-7 7a7 7 0 0 0 1 11" /></>}
      {kind === "download" && <><path d="M24 8v23m-9-9 9 9 9-9M10 33v6h28v-6" /></>}
      {kind === "video" && <><rect x="5" y="9" width="38" height="29" rx="5" /><path d="m20 16 11 8-11 7Z" fill="currentColor" stroke="none" /><path d="M10 33h28" opacity=".35" /></>}
    </svg>
  );
}

export default function DailymotionHeroBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.facet} />
      <div className={styles.beam} />
      <div className={styles.watermark}><DailymotionMark /></div>
      <div className={styles.field}>
        {FLOATERS.map(({ kind, duration, delay, tilt }) => (
          <div
            key={kind}
            className={styles.floater}
            data-symbol={kind}
            style={{ "--duration": duration, "--delay": delay, "--tilt": tilt } as CSSProperties}
          >
            <div className={styles.drift}>
              <div className={styles.tile}><MediaSymbol kind={kind} /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
