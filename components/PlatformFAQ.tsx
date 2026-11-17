import Link from "next/link";
import styles from "./PlatformFAQ.module.css";
import Reveal from "./Reveal";

const labels: Record<string, string> = {
  youtube: "YouTube playback", tiktok: "TikTok file help", instagram: "Instagram results",
  facebook: "Facebook playback", twitter: "X media help", pinterest: "Pinterest files",
  snapchat: "Snapchat results", dailymotion: "Dailymotion help", bilibili: "Bilibili requests", vk: "VK retrieval help",
};
const expanded = new Set(["youtube", "facebook", "twitter", "pinterest"]);

export default function PlatformFAQ({ platform, title, questions }: {
  platform: string; title: string; questions: [string, string][];
}) {
  const slideIn = platform === "vk";
  const Content = slideIn ? Reveal : "div";
  return <section id={`${platform}-faq`} className={`${styles.faq} ${styles[platform]}`} aria-labelledby={`${platform}-faq-title`}>
    <Content className={styles.wrap}>
      <header className={styles.heading} data-reveal={slideIn ? "" : undefined}>
        <p className={styles.eyebrow}>{labels[platform] || "Download help"}</p>
        <h2 id={`${platform}-faq-title`}>{title}</h2>
        <Link className={styles.contact} href="/contact">Contact support <span aria-hidden="true">↗</span></Link>
      </header>
      <div className={styles.questions}>
        {questions.map(([question, answer], index) => expanded.has(platform)
          ? <article className={styles.card} key={question}>
              <span className={styles.index} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{question}</h3><p className={styles.answer}>{answer}</p>
            </article>
          : <details className={styles.card} key={question} data-reveal={slideIn ? "" : undefined}>
              <summary><span className={styles.index} aria-hidden="true">{platform === "bilibili" ? "P" : ""}{String(index + 1).padStart(2, "0")}</span><span className={styles.question}>{question}</span><span className={styles.toggle} aria-hidden="true">+</span></summary>
              <p className={styles.answer}>{answer}</p>
            </details>)}
      </div>
      <footer className={styles.footer} data-reveal={slideIn ? "" : undefined}>Our handling of request information is explained in the <Link href="/privacy">Privacy Policy</Link>.</footer>
    </Content>
  </section>;
}
