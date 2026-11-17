import Link from "next/link";
import { PLATFORM_ICONS } from "@/lib/platform-icons";
import type { Platform } from "@/lib/platforms";
import styles from "./PlatformRelated.module.css";

export default function PlatformRelated({ platforms, variant }: { platforms: Platform[]; variant: string }) {
  return <nav aria-label="More download tools" className={`${styles.list} ${styles[variant]}`}>
    {platforms.map((platform, i) => <Link href={platform.href} key={platform.href} className={styles.link}>
      <span aria-hidden="true" className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
      <span aria-hidden="true" className={styles.icon}><svg viewBox="0 0 24 24" fill="currentColor"><path d={PLATFORM_ICONS[platform.name].path} /></svg></span>
      <span>{platform.name}</span><span aria-hidden="true" className={styles.arrow}>↗</span>
    </Link>)}
  </nav>;
}
