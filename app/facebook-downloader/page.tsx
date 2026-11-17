import { pageMetadata } from "@/lib/page-seo";
// app/facebook-downloader/page.tsx
// Facebook landing page. Same bands and the same .pf-* classes as the other platform pages, in
// Facebook's blue, white and near-black (look-fb / pf-band-white / look-black under .page-fb).
//   blue strip > blue hero > black facts > which links work (white) > black steps rail >
//   blue ticker > why nothing came back (white) > black ten more apps > blue help
// Copy must match what the backend really does (README section 4 and lib/normalize.ts): videos and
// reels only, through /share/v/, /share/r/, /videos/, /watch and fb.watch. Photo posts and stories
// are turned away by name with their own messages, so this page says so rather than staying quiet.
// Nothing here claims photos, albums or stories, and nothing promises a quality - there is no picker
// for Facebook in grab.tsx.
import Image from "next/image";
import Link from "next/link";
import Grab from "../grab";
import PlatformGuidance from "@/components/PlatformGuidance";
import PlatformStrip from "@/components/PlatformStrip";
import FacebookStories from "@/components/FacebookStories";
import Reveal from "@/components/Reveal";
import { PLATFORMS } from "@/lib/platforms";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata("/facebook-downloader");

const GETS = ["Videos", "Reels", "Share Links", "fb.watch"];

const TICKER = ["Public video URLs", "Videos", "Reels", "Reel addresses", "No account", "MP4 downloads"];

const FACTS = [
  { id: "free", name: "Free", text: "Use the website without a paid subscription." },
  { id: "no-login", name: "No Login", text: "We do not ask you to connect a Facebook account." },
  { id: "zero-files", name: "File Downloads", text: "Choose where your browser saves the result." },
  { id: "video-reels", name: "Videos & Reels", text: "Individual public posts can provide video files." },
];

// The band this page is built around. Facebook hands out several shapes of link and only some of
// them point at a video, so these are the exact patterns lib/normalize.ts matches, beside the three
// it turns away by name. Nothing here is guessed.
const LINKS = [
  { id: "share-v", works: "yes", pattern: "facebook.com/share/v/…", what: "Shared videos" },
  { id: "share-r", works: "yes", pattern: "facebook.com/share/r/…", what: "Shared reels" },
  { id: "videos", works: "yes", pattern: "facebook.com/…/videos/…", what: "Page and profile videos" },
  { id: "watch", works: "yes", pattern: "facebook.com/watch…", what: "Watch links" },
  { id: "fbwatch", works: "yes", pattern: "fb.watch/…", what: "Short share links" },
  { id: "photo", works: "no", pattern: "facebook.com/share/p/…", what: "Photo posts are not supported" },
  { id: "stories", works: "no", pattern: "facebook.com/stories/…", what: "Stories are not supported" },
  { id: "private", works: "no", pattern: "Friends only and private", what: "Restricted account access" },
];

// Four steps, on the rail. Each half arrives once and stays (components/Reveal.tsx).
const STEPS = [
  {
    title: "Select The Video",
    text: "Open the individual video or Reel you want to keep. Check that it is the recording you intended to request.",
    image: "step-open",
    caption: "Open the individual recording",
  },
  {
    title: "Copy The Shared Address",
    text: "Use the video’s Share control and choose Copy link. The copied URL should point to the recording itself.",
    image: "step-share",
    caption: "Share → Copy link",
  },
  {
    title: "Request The Download",
    text: "Enter the copied address above and press the arrow. We also follow supported share links and fb.watch redirects.",
    image: "step-paste",
    caption: "Your link goes here",
  },
  {
    title: "Save The MP4",
    text: "Choose the file button and wait for the browser to finish. Use its download list to open the saved recording.",
    image: "step-save",
    caption: "Check the completed transfer",
  },
];

// Why a link comes back with nothing. The first three are refusals the backend makes by name.
const WHYS = [
  {
    id: "not-public",
    title: "Account Access",
    question: "Why can I watch a post but get no file?",
    text: "Your Facebook session may let you see material that the downloader cannot access. A friends only audience or private group can restrict the source.",
  },
  {
    id: "photo",
    title: "Photo Links",
    question: "Can I submit a picture post?",
    text: "Facebook photo posts are outside this tool’s support. Choose a public video or Reel if you want an MP4 result.",
  },
  {
    id: "story",
    title: "Stories",
    question: "Does the downloader accept Stories?",
    text: "We do not retrieve Facebook Stories through this page. Use the address of an individual public video instead.",
  },
  {
    id: "gone",
    title: "Changed Availability",
    question: "Why has a previously working link failed?",
    text: "A post can be removed or restricted, and retrieval can also fail temporarily. Check whether the original still plays before requesting it again.",
  },
];

export default function FacebookDownloader() {
  const others = PLATFORMS.filter((p) => p.name !== "Facebook");

  return (
    <div className="page-fb">
      <PlatformStrip current="/facebook-downloader" />

      {/* 1. hero, on the brand blue */}
      <section className="look-fb w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 text-center md:py-24 lg:px-6">
          <p className="inline-flex items-center gap-2 text-xs title-case tracking-[0.06em]">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--ink)]" />
            Facebook downloader
          </p>

          <h1 className="fb-hero-title mx-auto mt-4 max-w-[20ch] text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">Facebook Video Downloader <em className="accent">For Public Reels</em></h1>

          <p className="mx-auto mt-4 max-w-[62ch] text-base md:text-lg">
            Use a public Facebook video or Reel address to request an MP4. We follow supported share links without needing your account details.
          </p>

          <div className="fb-composer">
            <div className="fb-reaction-pill" aria-hidden="true">
              <i /><i />
              <span className="fb-heart"><svg viewBox="0 0 64 64"><path d="M32 54S7 40 7 23C7 8 25 6 32 18 39 6 57 8 57 23c0 17-25 31-25 31Z" /></svg></span>
            </div>
            <div className="fb-profile-card">
              <div className="fb-profile-cover" aria-hidden="true" />
              <div className="fb-profile-body">
                <div className="fb-profile-heading">
                  <div className="fb-avatar" aria-hidden="true"><Image src="/images/facebook/profile-avatar.webp" alt="" width={320} height={320} sizes="(max-width: 767px) 88px, 144px" /></div>
                  <div className="fb-profile-copy"><p>Enter the video address below.</p><span>Individual videos &amp;amp; Reels</span></div>
                  <span className="fb-check" aria-hidden="true"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="25" /><path d="m20 32 9 9 17-18" /></svg></span>
                </div>
                <div className="fb-profile-tool"><Grab placeholder="Paste a Facebook link" /></div>
              </div>
            </div>
            <div className="fb-add" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M24 10v28M10 24h28" /></svg></div>
            <div className="fb-social-pill" aria-hidden="true">
              <svg viewBox="0 0 32 32"><path d="M10 28H5V14h5m0 14h13c2 0 3-2 3-4l2-10H18l1-7c0-4-5-4-5-1 0 4-2 7-4 9Z" /></svg><i />
              <svg viewBox="0 0 32 32"><path d="m19 5 10 10-10 10v-7C9 18 5 22 3 27 3 15 9 10 19 11Z" /></svg><i />
            </div>
          </div>

          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {GETS.map((g) => (
              <li key={g} className="pf-chip">
                {g}
              </li>
            ))}
          </ul>

          <p className="mt-5 text-xs">
            Check your permission to download the video before using {SITE.name}.
          </p>
        </div>
      </section>

      {/* 2. four facts, framed as film clapperboards */}
      <section className="fb-facts-band w-full" aria-label="Facebook downloader features">
        <div className="mx-auto max-w-[1000px] px-[5vw] py-16 md:py-24 lg:px-6">
          <ul className="fb-clappers list-none">
            {FACTS.map((f, i) => (
              <li key={f.id} className="fb-clapper" tabIndex={0}>
                <span className="fb-clapper-arm" aria-hidden="true" />
                <div className="fb-clapper-slate">
                  <div className="fb-clapper-heading">
                    <h2>{f.name}</h2>
                    <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p>{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. which links work: the exact shapes the box reads, and the ones it turns away */}
      <section className="pf-band-white w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <div className="fb-link-art-header">
            <div><h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
              Facebook Link Types <em className="accent">We Accept</em>
            </h2>
            <p className="mt-4 max-w-[62ch] text-[var(--muted)] md:text-lg">
              Start with the address of the recording itself. The examples below distinguish video links from photo posts and Stories that this tool cannot retrieve.
            </p></div>
            <Image src="/images/facebook/link-sorting.webp" alt="Devliz separates public videos and Reels from photos and locked posts" width={800} height={546} sizes="(max-width: 767px) 280px, 380px" className="fb-link-mascot" />
          </div>

          <ul className="pf-links mt-8 list-none md:mt-10">
            {LINKS.map((l) => (
              <li key={l.id} className="pf-link-row" data-works={l.works}>
                <span className="pf-link-pattern">{l.pattern}</span>
                <span className="pf-link-what">{l.what}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. a responsive timeline with native, keyboard-accessible disclosures. */}
      <section className="fb-timeline-section w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-24 lg:px-6">
          <h2 className="text-center text-3xl font-bold leading-[1.1] md:text-5xl">
            Copy And Save A <em className="accent">Facebook Video</em>
          </h2>
          <p className="fb-timeline-intro">Use the post’s sharing control to identify the recording, then choose its file button when a result appears.</p>

          <Reveal className="mt-12 md:mt-16">
            <ol className="fb-timeline">
              {STEPS.map((s, i) => (
                <li key={s.title} className="fb-timeline-step">
                  <span className="fb-timeline-node" aria-hidden="true">{i + 1}</span>
                  <article className="fb-timeline-card" data-reveal>
                    <div className="fb-timeline-art" aria-hidden="true">
                      <span className="fb-timeline-take">STEP 0{i + 1}</span>
                      <Image src={`/images/facebook/${s.image}.webp`} alt="" width={640} height={640} sizes="(max-width: 767px) 240px, 320px" className="fb-step-mascot" />
                      <span className="fb-timeline-caption">{s.caption}</span>
                    </div>
                    <details open>
                      <summary><h3>{s.title}</h3><span aria-hidden="true" className="fb-timeline-toggle">+</span></summary>
                      <p>{s.text}</p>
                    </details>
                  </article>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* 5. running claims, on the blue */}
      <section aria-hidden="true" className="pf-ticker w-full">
        <div className="pf-ticker-track">
          {[0, 1].map((copy) => (
            <div key={copy}>
              {TICKER.map((w) => (
                <span key={w} className="flex items-center gap-[2.2rem]">
                  <span className="pf-ticker-word">{w}</span>
                  <span className="pf-ticker-dot" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* 6. why a link sometimes comes back with nothing */}
      <section className="fb-chat-section w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <div className="fb-chat-header">
            <div>
              <p className="fb-chat-eyebrow">Post access and errors</p>
              <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
                Troubleshooting <em className="accent">Facebook Requests</em>
              </h2>
              <p className="fb-chat-intro">
                Check the post type and its audience when an address is refused. A public video may also fail because the source cannot be reached.
              </p>
            </div>
            <div className="fb-chat-checks" aria-label="Check the post">
              <div><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0M12 14v3"/></svg><span>Public post</span></div>
              <div><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m10 8 6 4-6 4Z"/></svg><span>Video or reel</span></div>
              <div><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2"/></svg><span>Still available</span></div>
            </div>
          </div>
          <ol className="fb-chat-list">
            {WHYS.map((w, i) => (
              <li key={w.id} className="fb-chat-row">
                <div className="fb-chat-topic">
                  <Image src={`/images/facebook/${w.id === "not-public" ? "private-post" : w.id === "photo" ? "photo-video" : w.id === "story" ? "expired-story" : "broken-link"}.webp`} alt="" width={640} height={640} sizes="(max-width: 767px) 180px, 260px" className="fb-topic-mascot" />
                  <h3>{w.title}</h3><span>0{i + 1} / Check the source</span>
                </div>
                <div className="fb-chat-exchange">
                  <div className="fb-chat-question"><span className="fb-chat-speaker">You</span><p>{w.question}</p></div>
                  <div className="fb-chat-answer"><span className="fb-chat-avatar" aria-hidden="true"><Image src="/images/facebook/support-guide.webp" alt="" width={48} height={48} sizes="40px" /></span><div><span className="fb-chat-speaker">{SITE.name} guide</span><p>{w.text}</p></div></div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 7. platform links in a Facebook-style stories tray */}
      <PlatformGuidance platform="facebook" />

      <section id="platforms" className="fb-stories-section w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Tools For Other <em className="accent">Media Sources</em>
          </h2>
          <p className="mt-4 max-w-[60ch] text-[var(--muted)] md:text-lg">
            Open the relevant page for photos, stories or clips from a different platform.
          </p>

          <div className="mt-6 md:mt-8">
            <FacebookStories platforms={others} />
          </div>
        </div>
      </section>

      {/* 8. help, right before the black footer */}
      <section className="look-fb w-full">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-[5vw] py-12 text-center md:flex-row md:gap-10 md:py-14 md:text-left lg:px-6">
          <Image
            src="/images/facebook/support-guide.webp"
            alt=""
            width={600}
            height={600}
            sizes="160px"
            className="h-auto w-[140px] shrink-0 md:w-[160px]"
          />
          <div className="min-w-0">
            <h2 className="text-2xl font-bold md:text-4xl">Help With A Saved Video</h2>
            <p className="mt-2 max-w-[52ch]">
              Check the additional answers for resolution, playback and locating the completed file on your device.
            </p>
          </div>
          <Link href="#facebook-faq" className="neon shrink-0 px-5 py-3 md:ml-auto">
            Open Facebook help
          </Link>
        </div>
      </section>
    </div>
  );
}
