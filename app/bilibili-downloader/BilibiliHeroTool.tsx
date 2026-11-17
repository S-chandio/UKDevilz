import Grab from "../grab";
import styles from "./hero-tool.module.css";

export default function BilibiliHeroTool() {
  return (
    <div className={styles.stage}>
      <div className={styles.television}>
        <div className={styles.antennas} aria-hidden="true">
          <span className={styles.antennaLeft} />
          <span className={styles.antennaRight} />
        </div>
        <div className={styles.cabinet}>
          <svg className={styles.face} viewBox="0 0 200 90" fill="none" aria-hidden="true">
            <path d="m22 21 45-10 4 18-45 10Zm156 0-45-10-4 18 45 10Z" fill="currentColor" />
            <path d="M77 62q11 18 23 0 12 18 23 0" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className={styles.controls}>
            <Grab placeholder="Paste a Bilibili link" submitLabel="↓" />
          </div>
        </div>
        <div className={styles.feet} aria-hidden="true">
          <span />
          <span />
        </div>
      </div>
      <div className={styles.shadow} aria-hidden="true" />
    </div>
  );
}
