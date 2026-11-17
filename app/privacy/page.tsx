import { pageMetadata } from "@/lib/page-seo";
import Link from "next/link";
import styles from "./privacy.module.css";

export const metadata = pageMetadata("/privacy");

const SECTIONS = [
  { id: "about", title: "Scope Of This Notice", paragraphs: ["This page explains the information involved in a download request, a preview and a message to ukdevliz. You can use the downloader without opening an account.", "It covers the website and its download controls. Source platforms, embedded players and your email service also have their own privacy notices."] },
  { id: "information", title: "Information In A Request", paragraphs: ["Submitting a link sends its address and your selected options to our server. A response can contain a title, filename, thumbnail or temporary address for the requested media.", "The systems handling a connection receive technical details, including request headers and an IP address. The downloader can also record error information when processing fails.", "An email includes your sender address and whatever text or attachments you add. Please leave passwords, account cookies and private access tokens out of support messages."] },
  { id: "use", title: "Why Information Is Processed", paragraphs: ["The service reads the submitted URL to identify its source and request the selected media. Format settings tell it whether to prepare video or audio and, where supported, which quality to request.", "Error details can help explain a failed request. Messages to our contact addresses provide the information needed to answer a question or review a reported concern."] },
  { id: "files", title: "Media Storage And Retention", paragraphs: ["We do not store downloaded media files on our servers. The service retrieves and processes the media, then streams it to your browser.", "Preview responses permit a private browser cache of up to 5 minutes. Download responses instruct caches not to retain them. A file you choose to save remains under your device’s storage controls.", "Technical logs and email records are separate from the media itself. Their retention periods have not yet been confirmed, so this notice does not promise that those records are deleted with a download request."] },
  { id: "providers", title: "Connections To Other Providers", paragraphs: ["A request can pass through a media processing service or proxy before reaching the source host. Those services receive the URL and the technical information needed for their connection.", "Embedded previews can connect your browser directly to a source platform. That provider may receive browser information and use cookies under its own policy.", "The provider list, processing locations and any relevant transfer arrangements still require confirmation. They must be added before this draft can serve as a complete privacy notice."] },
  { id: "cookies", title: "Cookies And Browser Storage", paragraphs: ["The website code reviewed for this notice does not set a first party tracking cookie or keep a download history in local storage. Hosting services and embedded content require separate checks.", "You can manage stored site data and permissions through your browser. Blocking another provider’s content may stop an embedded preview from loading."] },
  { id: "choices", title: "Privacy Questions And Choices", paragraphs: ["You decide which public address to submit. Review a URL before sending it if it contains private information or account access details.", "Privacy rights depend on the laws that apply to the service and your circumstances. These may include requesting access, correction or deletion of personal information, subject to applicable conditions.", "Contact us with a description of the privacy request and enough context to identify the interaction. Do not attach identity documents unless an appropriate verification process has been agreed."] },
  { id: "security", title: "Account Details And External Sites", paragraphs: ["The link field is for public media addresses. We do not need your social account password, and you should not include it in a request or email.", "When you open another website, its own notice applies to the information it receives. Read that notice if you want to understand how an external player or source handles your visit."] },
  { id: "updates", title: "Revisions And Contact Details", paragraphs: ["The revision date identifies this draft. Provider details, legal grounds, operator identity and retention arrangements remain outstanding and must reflect the actual service setup.", "Use General enquiries on the contact page to ask about information handling. Include the relevant page or request so we can understand your concern."] },
];

export default function PrivacyPage() {
  return <div className={styles.page}>
    <section className={styles.hero}>
      <div className={styles.wrap}>
        <p className={styles.eyebrow}>Links, files and information</p>
        <h1>Our <em className="accent">Privacy Policy</em></h1>
        <p className={styles.intro}>We do not store downloaded media. This notice explains the separate handling of links, previews, technical details and messages.</p>
        <div className={styles.meta}><span>Privacy Policy</span><span>Draft revised 15 October 2026</span></div>
        <div className={styles.notice}><strong>Operational Details Still Required</strong><p>The operator’s legal identity, processing grounds, provider details and retention periods need confirmation before publication as a complete policy.</p></div>
      </div>
    </section>
    <section className={styles.overview} aria-label="Privacy overview"><div className={`${styles.wrap} ${styles.cards}`}>
      <article><span>01</span><h2>No User Account</h2><p>A request does not require registration or a social account password.</p></article>
      <article><span>02</span><h2>Request Information</h2><p>The submitted address and format settings are processed to prepare a result.</p></article>
      <article><span>03</span><h2>External Previews</h2><p>An embedded player may connect your browser to its own provider.</p></article>
    </div></section>
    <div className={`${styles.wrap} ${styles.layout}`}>
      <nav className={styles.contents} aria-label="Privacy policy contents"><p>Policy Sections</p>{SECTIONS.map((s,i)=><a key={s.id} href={`#privacy-${s.id}`}><span>{String(i+1).padStart(2,"0")}</span>{s.title}</a>)}</nav>
      <div>{SECTIONS.map((s,i)=><section className={styles.policySection} id={`privacy-${s.id}`} key={s.id}><span className={styles.eyebrow}>Section {String(i+1).padStart(2,"0")}</span><h2>{s.title}</h2>{s.paragraphs.map(p=><p key={p}>{p}</p>)}</section>)}</div>
    </div>
    <section className={styles.contact}><div className={styles.wrap}><div><h2>Send A <em className="accent">Privacy Question</em></h2><p>Explain which interaction or information you are asking about when you contact us.</p></div><Link href="/contact">Contact general enquiries <span aria-hidden="true">↗</span></Link></div></section>
  </div>;
}
