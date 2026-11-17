import type { CSSProperties } from "react";
import styles from "./hero-backdrop.module.css";

const MOODS = [
  { face: "happy", color: "#24b2d6", depth: "#148baa", duration: "9s", delay: "-2s", tilt: "-14deg" },
  { face: "wink", color: "#f173a2", depth: "#d75487", duration: "11s", delay: "-6s", tilt: "13deg" },
  { face: "surprised", color: "#9a82e9", depth: "#7862bd", duration: "12s", delay: "-4s", tilt: "12deg" },
  { face: "sleepy", color: "#58bfad", depth: "#329a8a", duration: "10s", delay: "-8s", tilt: "-12deg" },
  { face: "love", color: "#efb74c", depth: "#c8912e", duration: "13s", delay: "-7s", tilt: "-10deg" },
  { face: "excited", color: "#f18f7e", depth: "#cf6b5a", duration: "9.5s", delay: "-3s", tilt: "14deg" },
  { face: "cool", color: "#6c9deb", depth: "#4978c0", duration: "14s", delay: "-10s", tilt: "-9deg" },
  { face: "shy", color: "#b68edb", depth: "#956cb9", duration: "11.5s", delay: "-5s", tilt: "9deg" },
] as const;

type Mood = (typeof MOODS)[number]["face"];

function Expression({ mood }: { mood: Mood }) {
  switch (mood) {
    case "happy":
      return <><path d="m35 64 16-4m26 0 16 4" strokeWidth="7" /><path d="M51 84q6 10 13 0 7 10 13 0" /></>;
    case "wink":
      return <><path d="m35 61 14 6-14 6m46-13v12M51 85q13 15 26-1" /></>;
    case "surprised":
      return <><ellipse cx="43" cy="66" rx="4" ry="7" fill="currentColor" stroke="none" /><ellipse cx="85" cy="66" rx="4" ry="7" fill="currentColor" stroke="none" /><ellipse cx="64" cy="88" rx="7" ry="9" /></>;
    case "sleepy":
      return <><path d="M33 67q10 7 20 0m22 0q10 7 20 0m-38 20h14" /><path d="m89 44 10 0-10 10h10" strokeWidth="3" /></>;
    case "love":
      return <><path d="M43 76 33 66c-8-10 5-18 10-9 5-9 18-1 10 9Zm42 0L75 66c-8-10 5-18 10-9 5-9 18-1 10 9Z" fill="currentColor" stroke="none" /><path d="M53 88q11 12 22 0" /></>;
    case "excited":
      return <><path d="m34 70 10-11 10 11m20 0 10-11 10 11" /><path d="M49 83h30q-2 18-15 18T49 83Z" fill="currentColor" stroke="none" /></>;
    case "cool":
      return <><path d="M29 60h70m-35 0v5" /><path d="M33 60h24v6q0 11-12 11T33 66Zm38 0h24v6q0 11-12 11T71 66Z" fill="currentColor" stroke="none" /><path d="M53 88q12 10 24-2" /></>;
    case "shy":
      return <><path d="M42 63v8m44-8v8M54 88q10 7 20 0" /><path d="m30 80 5-3m58 3 5-3" strokeWidth="6" opacity=".45" /></>;
  }
}

export default function BilibiliHeroBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.field}>
        {MOODS.map(({ face, color, depth, duration, delay, tilt }) => (
          <div
            key={face}
            className={styles.icon}
            data-mood={face}
            style={{ "--tone": color, "--depth": depth, "--duration": duration, "--delay": delay, "--tilt": tilt } as CSSProperties}
          >
            <svg viewBox="0 0 128 128" fill="none" className={styles.tv}>
              <path d="m47 34-17-20m51 20 17-20M32 108v7m64-7v7" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
              <rect x="16" y="34" width="96" height="72" rx="17" fill="#fff" stroke="currentColor" strokeWidth="10" />
              <g stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                <Expression mood={face} />
              </g>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
