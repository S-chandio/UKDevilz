import PlatformFAQ from "./PlatformFAQ";
import Image from "next/image";
import { PLATFORM_GUIDANCE } from "./platform-guidance-data";
import styles from "./PlatformGuidance.module.css";
import Reveal from "./Reveal";

export default function PlatformGuidance({ platform, revealClassName }: { platform: string; revealClassName?: string }) {
  const guide = PLATFORM_GUIDANCE[platform];
  if (!guide) return null;
  const Content = revealClassName ? Reveal : "div";
  return <div className={`${styles.guide} ${styles[platform]}`}>
    <section className={styles.main} aria-labelledby={`${platform}-guide-title`}>
      <Content className={`${styles.wrap}${revealClassName ? ` ${revealClassName}` : ""}`}>
        <header className={styles.header} data-reveal={revealClassName ? "" : undefined}><p className={styles.label}>{guide.label}</p><h2 id={`${platform}-guide-title`}>{guide.title}</h2><p>{guide.intro}</p></header>
        <div className={styles.items}>{guide.items.map((item, index) => <article key={item.title} className={styles.item} data-reveal={revealClassName ? "" : undefined}>
          <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          {item.image && <Image src={item.image} alt="" width={720} height={540} sizes="(max-width: 580px) 80vw, 380px" className={styles.itemArt} />}
          <h3>{item.title}</h3><p>{item.text}</p>{item.example && <code>{item.example}</code>}
        </article>)}</div>
        <aside className={`${styles.save} ${guide.saveImage ? styles.saveIllustrated : ""}`} data-reveal={revealClassName ? "" : undefined}>{guide.saveImage ? <Image src={guide.saveImage} alt="" width={720} height={540} sizes="(max-width: 580px) 80vw, 320px" className={styles.saveArt} /> : <span aria-hidden="true" className={styles.saveMark}>↓</span>}<div><h3>{guide.saveTitle}</h3><p>{guide.saveText}</p></div></aside>
      </Content>
    </section>
    <PlatformFAQ platform={platform} title={guide.faqTitle} questions={guide.questions} />
  </div>;
}
