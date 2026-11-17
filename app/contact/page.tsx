import { pageMetadata } from "@/lib/page-seo";
import Image from "next/image";
import Link from "next/link";
import CopyEmailButton from "./CopyEmailButton";
import styles from "./contact.module.css";

export const metadata = pageMetadata("/contact");

// Contact addresses confirmed by the site owner.
const CONTACTS = [
  { name: "General enquiries", email: "Info@ukdevils.com", text: "For questions about the website or its information handling, write to our general inbox.", mark: "01" },
  { name: "Download support", email: "Support@ukdevils.com", text: "Send the public media address and explain where the download stopped.", mark: "02" },
  { name: "Questions & queries", email: "Qurry@ukdevils.com", text: "Ask about an option, file type or link format you are unsure how to use.", mark: "03" },
  { name: "Partnerships", email: "Business@ukdevils.com", text: "Use this address for a business proposal, with enough detail for us to understand what you have in mind.", mark: "04" },
  { name: "Ideas & feedback", email: "Feedback@ukdevils.com", text: "Suggest a change to a tool or tell us where the website was difficult to use.", mark: "05" },
  { name: "Content concerns", email: "Copyright@ukdevils.com", text: "Identify the source post and explain the rights or content issue you want to raise.", mark: "06" },
];

function emailHref(email: string, topic: string) {
  return `mailto:${email}?subject=${encodeURIComponent(`ukdevliz - ${topic}`)}`;
}

const FAQS = [
  ["Where should I send a technical problem?", "Choose Download support and include the details listed above. Keeping the report in one email thread helps us follow any updates."],
  ["How can I use my own email app?", "Select Copy email, open a new message and paste the address into the recipient field. You can select the address manually if your browser blocks the copy button."],
  ["Should I send my login details?", "Please keep passwords, session cookies and private access links out of your message. Our tools do not use your personal account to retrieve posts."],
  ["Where can I request another tool?", "Use Ideas & feedback and name the source platform. An example of the type of public post you want to save will help explain the request."],
  ["What should I attach to a report?", "The public URL and the error text are usually enough to begin. If a screenshot would help, crop out personal details before attaching it."],
];

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={`${styles.wrap} ${styles.heroGrid}`}>
          <div>
            <p className={styles.eyebrow}>Contact ukdevliz</p>
            <h1>Contact <em className="accent">ukdevliz</em></h1>
            <p className={styles.lead}>Tell us where a download failed, ask about a feature or suggest a change. Choose the relevant address below so your message reaches the right inbox.</p>
            <a href="#contact-emails" className={styles.button}>Choose An Email Address <span aria-hidden="true">↗</span></a>
            <div className={styles.heroTags}><span>Questions</span><span>Support</span><span>Feedback</span></div>
          </div>
          <div className={styles.heroArt}>
            <Image src="/images/contact/devliz-contact.webp" width={1000} height={1000} sizes="(max-width: 767px) 280px, (max-width: 1100px) 40vw, 440px" alt="Devliz wearing a support headset and holding an envelope" preload />
          </div>
        </div>
      </section>

      <section id="contact-emails" className={styles.directory} aria-labelledby="inbox-title">
        <div className={styles.wrap}>
          <div className={styles.directoryIntro}>
            <div>
              <p className={styles.eyebrow}>01 / The right inbox</p>
              <h2 id="inbox-title">Email Us About<br /><em className="accent">Your Request</em></h2>
              <p className={styles.directoryLead}>Each card opens a message with a subject filled in. You can also copy the address and write through your usual email service.</p>
            </div>
            <Image className={styles.copyArt} src="/images/contact/devliz-copy-email.webp" width={1000} height={750} sizes="(max-width: 767px) 240px, 300px" alt="Devliz pointing to the email copy button" />
          </div>
          <div className={styles.emailGrid}>
            {CONTACTS.map((c) => (
              <article key={c.email} className={styles.emailCard}>
                <span className={styles.cardNo}>{c.mark} <span aria-hidden="true">↗</span></span>
                <h3>{c.name}</h3>
                <p className={styles.cardDescription}>{c.text}</p>
                <a className={styles.emailAddress} href={emailHref(c.email, c.name)}>{c.email}</a>
                <CopyEmailButton email={c.email} topic={c.name} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.prepare} aria-labelledby="prepare-title">
        <div className={`${styles.wrap} ${styles.twoCol}`}>
          <div>
            <p className={styles.eyebrow}>02 / A little context helps</p>
            <h2 id="prepare-title">Details To Include<br /><em className="accent">With Your Report</em></h2>
            <Image className={styles.supportArt} src="/images/contact/devliz-support-details.webp" width={1000} height={1000} sizes="(max-width: 767px) 240px, 320px" alt="Devliz pointing out an error message on a phone" />
          </div>
          <div>
            <p className={styles.checklistIntro}>A download report is easier to follow when we can identify the source and the point where it failed.</p>
            <ol className={styles.checklist}>
            <li><span>01</span><div><h3>Source Address</h3><p>Paste the public post URL, including the platform name if a shortened address hides it.</p></div></li>
            <li><span>02</span><div><h3>Result Or Error</h3><p>Describe which button you used and what appeared afterwards. Include the error wording when there is one.</p></div></li>
            <li><span>03</span><div><h3>Device And Browser</h3><p>Name the browser and device you used, and say whether the same issue affects another public post.</p></div></li>
            </ol>
            <p className={styles.threadNote}><strong>Add Updates To Your Email</strong> If you learn more after sending a report, reply to that message. We can then read the additional details with the original request.</p>
          </div>
        </div>
      </section>

      <section className={styles.faq} aria-labelledby="contact-faq">
        <div className={`${styles.wrap} ${styles.twoCol}`}>
          <div><p className={styles.eyebrow}>03 / Before you send</p><h2 id="contact-faq">Before You<br /><em className="accent">Send A Message</em></h2><Link href="/#faq" className={styles.textLink}>Read the general FAQ ↗</Link></div>
          <div className={styles.questions}>{FAQS.map(([q,a]) => <details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div>
        </div>
      </section>

      <section className={styles.closing} aria-labelledby="support-title">
        <div className={`${styles.wrap} ${styles.twoCol}`}>
          <div><p className={styles.eyebrow}>04 / Stay in touch</p><h2 id="support-title">Report A<br />Download Problem</h2><p className={styles.closingDescription}>Use the support address for a failed request or a file that will not open. Include the source link and what you tried.</p><a href={emailHref(CONTACTS[1].email, CONTACTS[1].name)} className={styles.button}>Write to download support <span aria-hidden="true">↗</span></a></div>
          <div className={styles.closingNote}><h3>Suggest A<br />Website Change</h3><p>Tell us which page or control you would change and how it affects you. A specific example gives us more to work with.</p><a href={emailHref(CONTACTS[4].email, CONTACTS[4].name)} className={styles.button}>Send your suggestion <span aria-hidden="true">↗</span></a></div>
        </div>
      </section>
    </div>
  );
}
