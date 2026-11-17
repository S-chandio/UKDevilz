import styles from "./hero.module.css";

// Decorative, independent tiles. CSS supplies the depth and movement without client JavaScript.
export default function VkHeroBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={`${styles.tile} ${styles.vk}`}>
        <svg viewBox="0 0 24 24" fill="currentColor" focusable="false">
          <path d="M6.79 7.3H4.05c.13 6.24 3.25 9.99 8.72 9.99h.31v-3.57c2.01.2 3.53 1.67 4.14 3.57h2.84c-.78-2.84-2.83-4.41-4.11-5.01 1.28-.74 3.08-2.54 3.51-4.98h-2.58c-.56 1.98-2.22 3.78-3.8 3.95V7.3H10.5v6.92c-1.6-.4-3.62-2.34-3.71-6.92Z" />
        </svg>
      </div>
      <div className={`${styles.tile} ${styles.globe}`}>
        <svg viewBox="0 0 48 48" focusable="false">
          <circle cx="24" cy="24" r="17" /><ellipse cx="24" cy="24" rx="7" ry="17" />
          <path d="M8 18h32M8 30h32" />
        </svg>
      </div>
      <div className={`${styles.tile} ${styles.chart}`}>
        <svg viewBox="0 0 48 48" focusable="false">
          <path d="M12 36V21m8 15V27m8 9V12m8 24v-8" strokeWidth="4" />
        </svg>
      </div>
      <div className={`${styles.tile} ${styles.box}`}>
        <svg viewBox="0 0 48 48" focusable="false">
          <path d="m24 6 16 9v18l-16 9-16-9V15Zm0 18 16-9M24 24 8 15m16 9v18M16 10l16 9" />
        </svg>
      </div>
      <div className={`${styles.tile} ${styles.leaf}`}>
        <svg viewBox="0 0 48 48" focusable="false">
          <path d="M24 39C7 39 6 24 14 12c7 4 10 11 10 17 2-9 8-14 16-15 6 14-2 25-16 25Z" />
        </svg>
      </div>
      <div className={`${styles.tile} ${styles.play}`}>
        <svg viewBox="0 0 48 48" focusable="false">
          <circle cx="24" cy="24" r="17" /><path d="m20 16 12 8-12 8Z" />
        </svg>
      </div>
      <div className={`${styles.tile} ${styles.moon}`}>
        <svg viewBox="0 0 48 48" focusable="false">
          <path d="M39 28A17 17 0 0 1 13 9a17 17 0 1 0 26 19Z" />
        </svg>
      </div>
      <div className={`${styles.tile} ${styles.gift}`}>
        <svg viewBox="0 0 48 48" focusable="false">
          <rect x="7" y="18" width="34" height="9" rx="2" />
          <path d="M10 27v14h28V27M24 18v23m0-23c-13 0-15-11-8-11 5 0 8 11 8 11Zm0 0C37 18 39 7 32 7c-5 0-8 11-8 11Z" />
        </svg>
      </div>
    </div>
  );
}
