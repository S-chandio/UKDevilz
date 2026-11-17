"use client";

import { useRef } from "react";
import Grab from "../grab";
import styles from "./hero.module.css";

export default function VkHeroTool() {
  const player = useRef<HTMLDivElement>(null);

  return (
    <div ref={player} className={styles.player}>
      <div className={styles.playerScreen}>
        <div className={styles.playerTopline}>
          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none" /></svg> VK VIDEO</span>
          <span>PUBLIC VIDEO DOWNLOADER</span>
        </div>
        <button
          type="button"
          className={styles.playButton}
          aria-label="Enter a VK video link"
          onClick={() => player.current?.querySelector<HTMLInputElement>('input[aria-label="Media link"]')?.focus()}
        >
          <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 8 39 24 15 40Z" /></svg>
        </button>
        <p className={styles.playerPrompt}>Your video starts with a link.</p>
      </div>
      <div className={styles.timeline} aria-hidden="true"><span /></div>
      <div className={styles.playerControls}>
        <Grab placeholder="Paste a VK video link" submitLabel="↓" />
      </div>
    </div>
  );
}
