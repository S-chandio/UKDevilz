"use client";

import { useEffect, useState } from "react";
import styles from "./contact.module.css";

export default function CopyEmailButton({ email, topic }: { email: string; topic: string }) {
  const [status, setStatus] = useState<"idle" | "copying" | "copied" | "failed">("idle");

  useEffect(() => {
    if (status !== "copied") return;
    const timeout = window.setTimeout(() => setStatus("idle"), 4000);
    return () => window.clearTimeout(timeout);
  }, [status]);

  async function copyEmail() {
    setStatus("copying");
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className={styles.copyControl}>
      <button
        type="button"
        className={styles.copyButton}
        onClick={copyEmail}
        disabled={status === "copying"}
        aria-label={`Copy ${topic.toLowerCase()} email address`}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {status === "copied" ? <path d="m5 12 4 4L19 6" /> : <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>}
        </svg>
        {status === "copied" ? "Copied!" : status === "copying" ? "Copying…" : "Copy email"}
      </button>
      <p className={styles.copyStatus} role="status" aria-live="polite" aria-atomic="true">
        {status === "copied" ? "Email address copied to your clipboard." : status === "failed" ? "Select the address below to copy it manually." : ""}
      </p>
      {status === "failed" && <input className={styles.manualCopy} type="text" readOnly value={email} aria-label={`${topic} email address to copy manually`} onFocus={(event) => event.currentTarget.select()} />}
    </div>
  );
}
