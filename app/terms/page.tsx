import { pageMetadata } from "@/lib/page-seo";
import Link from "next/link";
import styles from "./terms.module.css";

export const metadata = pageMetadata("/terms");

const SECTIONS = [
  { id: "about", title: "About The Service Terms", paragraphs: ["These draft terms describe use of the ukdevliz website and its download tools. The Privacy Policy explains the information involved in those requests.", "The operator’s legal identity and applicable jurisdiction still need confirmation. This draft does not select a governing court or establish final contractual provisions."] },
  { id: "service", title: "Download Tools And Access", paragraphs: ["ukdevliz requests media from supported public addresses and provides the file options returned by the service. Each source can have different formats and access limits.", "There is no required subscription or user account. We do not keep a personal media library for you, and your network provider’s data charges may still apply."] },
  { id: "rights", title: "Permission To Save And Reuse", paragraphs: ["Submit material you own, have permission to download or are otherwise legally entitled to save. Check the rights attached to a source before copying it.", "Saving a file does not transfer ownership of its content. Any later editing, publication or distribution must respect the rights and conditions that apply to that material."] },
  { id: "conduct", title: "Using The Website Responsibly", paragraphs: ["Use public links without confidential credentials. Do not use the service to seek unauthorised account access or retrieve restricted material unlawfully.", "Avoid requests intended to overload the service, disrupt other visitors or evade its usage controls. Do not send malicious material through the website or support channels.", "If your permission to download is unclear, resolve that with the relevant rights holder before submitting the address."] },
  { id: "limitations", title: "Availability And Output Quality", paragraphs: ["A request may fail because the source is removed, restricted or inaccessible to the retrieval service. Changes at a platform can also affect a link that worked earlier.", "The recording or image available from the source sets the limit on output detail. Your connection and the services involved affect transfer speed and completion.", "We cannot promise a result for every public URL or uninterrupted access to the tools. Read any error shown before making another request."] },
  { id: "platforms", title: "Independent Source Platforms", paragraphs: ["The website can connect to media hosts and display players supplied by other services. Their own terms apply to your use of those services.", "Names and logos identify where content comes from. Their appearance here does not mean a platform endorses ukdevliz or grants permission to reuse its content."] },
  { id: "privacy", title: "Information And Support Messages", paragraphs: ["Submitting a request involves processing its address and settings. The Privacy Policy covers media handling and the information exchanged with other providers.", "Send support the public source URL and a description of the problem. Include only the personal details needed for a reply or to explain the concern."] },
  { id: "concerns", title: "Reporting A Content Concern", paragraphs: ["Use the Content concerns address to identify the source and explain the issue. If you represent a rights holder, include the capacity in which you are contacting us.", "We cannot remove an original post from another platform through an email report. Contact the source platform as well when your concern requires action on its hosted material."] },
  { id: "responsibility", title: "Saved Files And Legal Rights", paragraphs: ["Check the completed download before relying on it, and keep your own copy if you need the file later. A source URL or generated download address can stop working.", "This draft does not remove rights or remedies that applicable law gives you. It also does not exclude responsibility that cannot lawfully be excluded.", "The operator must confirm their circumstances and jurisdiction before settling responsibility provisions. This draft sets no financial liability cap or compulsory dispute procedure."] },
  { id: "restrictions", title: "Access Restrictions And Errors", paragraphs: ["Usage controls may limit requests when traffic is excessive or a security concern arises. A restriction can also reflect an unavailable source rather than an issue with your device.", "If you believe access was restricted incorrectly, describe the error to support. Do not attempt to evade an active security or usage control."] },
  { id: "changes", title: "Revisions And Further Questions", paragraphs: ["This page’s date identifies the current draft. Changes to features or service arrangements may require us to revise the terms.", "Any final terms need to state their scope and effective arrangements clearly. This draft does not apply undisclosed changes to an earlier request.", "For a question about these conditions, use General enquiries on the contact page and identify the section you want explained."] },
];

export default function TermsPage() {
  return <div className={styles.page}>
    <section className={styles.hero}><div className={styles.wrap}>
      <p className={styles.eyebrow}>Website use and content rights</p>
      <h1>Terms For <em className="accent">Using ukdevliz</em></h1>
      <p className={styles.intro}>Use the tools for media you have the right to save. The conditions below cover requests, source access and responsibility for a downloaded file.</p>
      <div className={styles.meta}><span>Terms &amp; Conditions</span><span>Draft revised 15 October 2026</span></div>
      <div className={styles.notice}><strong>Legal Details Still Required</strong><p>The operator must confirm their identity, jurisdiction and final contractual provisions before publishing these terms as complete.</p></div>
    </div></section>
    <div className={`${styles.wrap} ${styles.layout}`}>
      <nav className={styles.contents} aria-label="Terms and conditions contents"><p>Terms Sections</p>{SECTIONS.map((s,i)=><a href={`#terms-${s.id}`} key={s.id}><span>{String(i+1).padStart(2,"0")}</span>{s.title}</a>)}<Link href="/privacy">Read the Privacy Policy ↗</Link></nav>
      <div>{SECTIONS.map((s,i)=><section key={s.id} id={`terms-${s.id}`} className={styles.policySection}><span className={styles.eyebrow}>Section {String(i+1).padStart(2,"0")}</span><h2>{s.title}</h2>{s.paragraphs.map(p=><p key={p}>{p}</p>)}{s.id === "privacy" && <Link href="/privacy">Read the Privacy Policy ↗</Link>}</section>)}</div>
    </div>
    <section className={styles.contact}><div className={styles.wrap}><div><h2>Ask About <em className="accent">These Terms</em></h2><p>Refer to the relevant section and tell us what needs clarification.</p></div><Link href="/contact">Contact general enquiries <span aria-hidden="true">↗</span></Link></div></section>
  </div>;
}
