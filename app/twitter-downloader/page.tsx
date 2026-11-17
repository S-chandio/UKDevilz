import { pageMetadata } from "@/lib/page-seo";
// app/twitter-downloader/page.tsx
// X (Twitter) landing page. Deliberately NOT the band order the other platform pages share: no
// facts grid, no ticker, no centre rail. Everything here is shaped like a post instead - the one
// shape X has made universally legible - and the same card carries the tool, the three kinds of
// file, the steps as a thread, and the empty results. Six bands, black and white alternating.
//   black hero (the tool, in a post) > white: what comes out of a post > black: the steps as a
//   thread > white: when a link gives you nothing > black ten more apps > white help
// It needs no artwork at all: the thread replaces the four step pictures the other pages rely on.
//
// Copy must match what the backend really does (README section 4): videos, GIFs and multi-image
// posts, redirect for one file and the picker for a set. x.com, twitter.com and t.co are accepted,
// t.co being in normalize.ts's SHORT_HOSTS and followed first. Age-restricted posts need cobalt's
// Twitter cookies, which are open item 8 and not set, so this says those come back empty.
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import Grab from "../grab";
import PlatformGuidance from "@/components/PlatformGuidance";
import PlatformStrip from "@/components/PlatformStrip";
import PlatformMarquee from "@/components/PlatformMarquee";
import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata("/twitter-downloader");

// The glyph row that sits under a post. Drawn here as plain generic shapes - a speech bubble, a
// loop, a heart, some bars, an arrow out of a tray - rather than anyone's actual icon set.
const GLYPHS: Record<string, string> = {
  reply: "M4.5 5.5h15v9.5h-9l-6 4.5z",
  repost: "M6 8.5h10.5v4M16.5 8.5 13 5M18 15.5H7.5v-4M7.5 15.5 11 19",
  like: "M12 19.5S4.8 15 4.8 10.2A3.8 3.8 0 0 1 12 8.3a3.8 3.8 0 0 1 7.2 1.9c0 4.8-7.2 9.3-7.2 9.3z",
  views: "M5 19v-7M10 19V6M15 19v-9M20 19V9",
  share: "M12 15.5V4.5M8.5 8 12 4.5 15.5 8M5.5 14v5.5h13V14",
};

function Actions({ counts }: { counts: [string, string, string, string] }) {
  const order: Array<keyof typeof GLYPHS> = ["reply", "repost", "like", "views"];
  return (
    <div aria-hidden="true" className="xp-actions">
      {order.map((k, i) => (
        <span key={k} className="xp-act">
          <svg viewBox="0 0 24 24">
            <path d={GLYPHS[k]} />
          </svg>
          {counts[i]}
        </span>
      ))}
      <span className="xp-act">
        <svg viewBox="0 0 24 24">
          <path d={GLYPHS.share} />
        </svg>
      </span>
    </div>
  );
}

function Post({
  avatar,
  tone,
  name,
  handle,
  children,
  counts,
}: {
  avatar: string;
  tone?: "quiet";
  name: string;
  handle: string;
  children: ReactNode;
  counts?: [string, string, string, string];
}) {
  return (
    <article className="xp-card">
      <header className="xp-head">
        <span aria-hidden="true" className="xp-avatar" data-tone={tone}>
          {avatar}
        </span>
        <span className="xp-who">
          <span className="xp-name">{name}</span>
          <span className="xp-handle">{handle}</span>
        </span>
      </header>
      <div className="xp-body">{children}</div>
      {counts ? <Actions counts={counts} /> : null}
    </article>
  );
}

// What a post actually gives back. The GIF one is worth saying out loud: X has not stored GIFs as
// GIFs for years, so the file that arrives is the silent MP4 it really is.
const KINDS = [
  {
    id: "video",
    avatar: "V",
    name: "Videos",
    handle: "@video",
    text: "A supported public post can return a video file. Use the preview when available to identify the recording before downloading.",
  },
  {
    id: "gif",
    avatar: "G",
    name: "GIFs",
    handle: "@animation",
    text: "An animation may arrive as an MP4 even when the post calls it a GIF. Check the extension if the app you plan to use requires an image format.",
  },
  {
    id: "photos",
    avatar: "P",
    name: "Photo Sets",
    handle: "@photos",
    text: "Pictures in a returned set have their own download buttons. Save the ones you need, then compare the set with the original post.",
  },
];

// The steps, as a thread rather than as a row of pictures.
const THREAD = [
  {
    title: "Open The Media Post",
    text: "Select the post that contains the recording or pictures. A feed or profile URL will not identify that item.",
  },
  {
    title: "Copy The Post Link",
    text: "Use the post’s sharing menu to copy its address. On the website, opening the post also puts its URL in the address bar.",
  },
  {
    title: "Send It To The Tool",
    text: "Paste the link above and press Download. We recognise x.com and twitter.com addresses and follow t.co redirects.",
  },
  {
    title: "Save The Returned Media",
    text: "Choose a file button or Download all for a returned set. Wait until the browser finishes before opening your saved items.",
  },
];

// When a link gives you nothing. The last one is the X-specific trap and the one people hit without
// realising: a quote post is its own post, and its link means its own media.
const EMPTIES = [
  {
    id: "protected",
    name: "Protected Posts",
    handle: "@restricted",
    text: "Viewing a protected post through your own account does not grant this tool access. We do not use your follower permissions.",
    slot: "Account access may be required",
  },
  {
    id: "deleted",
    name: "Removed Posts",
    handle: "@gone",
    text: "If the source post has been deleted, we cannot recover its media from that address. A saved copy must come from somewhere else.",
    slot: "The source may be unavailable",
  },
  {
    id: "age",
    name: "Restricted Media",
    handle: "@sensitive",
    text: "Age or regional restrictions can prevent retrieval. A visible post or warning page does not establish that its media is available to the downloader.",
    slot: "Access depends on the source",
  },
  {
    id: "no-media",
    name: "Text Posts",
    handle: "@text",
    text: "This tool saves attached media. A text post with no picture or recording will not provide a downloadable file.",
    slot: "No attached media to retrieve",
  },
  {
    id: "quote",
    name: "Quoted Posts",
    handle: "@quoted",
    text: "Open the quoted post when that is where the media appears. Copying its own URL helps avoid requesting an outer post without the attachment you wanted.",
    slot: "Use the address containing the media",
  },
];

export default function TwitterDownloader() {

  return (
    <div className="page-x">
      <PlatformStrip current="/twitter-downloader" />

      {/* 1. the hero is a post, and the tool is what it says */}
      <section className="x-space-hero look-x w-full">
        <div className="x-space-flock" aria-hidden="true">
          {Array.from({ length: 20 }, (_, i) => (
            <span key={i} className="x-space-mark" style={{
              "--space-x": `${[5, 89, 14, 79, 3, 94, 20, 84, 8, 91, 28, 68, 17, 81, 2, 96, 36, 62, 10, 88][i]}%`,
              "--space-y": `${[8, 11, 25, 22, 43, 38, 59, 55, 75, 73, 4, 6, 90, 91, 62, 88, 96, 97, 51, 45][i]}%`,
              "--space-size": `${28 + (i % 5) * 11}px`,
              "--space-tilt": `${(i % 2 ? 1 : -1) * (8 + i % 4 * 7)}deg`,
              "--space-speed": `${7 + i % 6}s`,
              "--space-delay": `${-i * 1.7}s`,
            } as CSSProperties}>
              {i % 2 === 0 ? <svg viewBox="0 0 24 24"><path d="M23 4.8a9 9 0 0 1-2.6.7 4.6 4.6 0 0 0 2-2.5 9.2 9.2 0 0 1-2.9 1.1A4.6 4.6 0 0 0 11.6 8a13 13 0 0 1-9.4-4.8 4.6 4.6 0 0 0 1.4 6.1 4.5 4.5 0 0 1-2.1-.6 4.6 4.6 0 0 0 3.7 4.6 4.6 4.6 0 0 1-2.1.1 4.6 4.6 0 0 0 4.3 3.2A9.2 9.2 0 0 1 1 18.5a13 13 0 0 0 20-11c0-.2 0-.4-.1-.6A9.3 9.3 0 0 0 23 4.8Z" /></svg> : <svg viewBox="0 0 24 24"><path d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.8-7.3L5.8 22H2.6l8.1-9.4L2 2h6.4l4.3 6.6ZM17.8 20h1.7L7.3 4H5.5Z" /></svg>}
            </span>
          ))}
        </div>
        <div className="x-space-content mx-auto max-w-[54rem] px-[5vw] py-16 md:py-20 lg:px-6">
            <h1 className="x-shattered-title">
              <span className="sr-only">Twitter Video Downloader</span>
              <span className="x-title-intact" aria-hidden="true">Twitter video <em className="accent">downloader</em></span>
              <span className="x-title-fragments" aria-hidden="true">
                {[
                  "polygon(0 0, 29% 0, 48% 48%, 0 25%)",
                  "polygon(31% 0, 68% 0, 51% 46%)",
                  "polygon(70% 0, 100% 0, 100% 29%, 54% 48%)",
                  "polygon(0 28%, 46% 50%, 0 74%)",
                  "polygon(100% 32%, 100% 76%, 55% 51%)",
                  "polygon(0 78%, 48% 54%, 28% 100%, 0 100%)",
                  "polygon(31% 100%, 50% 56%, 69% 100%)",
                  "polygon(72% 100%, 54% 55%, 100% 80%, 100% 100%)",
                ].map((clip, i) => <span key={clip} className="x-title-fragment" style={{ clipPath: clip, "--crack-x": `${[-2, 0, 2, -3, 3, -2, 0, 2][i]}px`, "--crack-y": `${[-2, -3, -2, 0, 0, 2, 3, 2][i]}px` } as CSSProperties}>Twitter video <em className="accent">downloader</em></span>)}
              </span>
              <span className="x-glass-field" aria-hidden="true">
                {Array.from({ length: 18 }, (_, i) => <i key={i} style={{ "--shard-x": `${Math.cos(i * Math.PI / 9) * (170 + i % 3 * 65)}px`, "--shard-y": `${Math.sin(i * Math.PI / 9) * (70 + i % 4 * 25)}px`, "--shard-turn": `${i % 2 ? 210 : -170}deg`, "--shard-delay": `${-i * 0.37}s`, "--shard-size": `${9 + i % 5 * 4}px` } as CSSProperties} />)}
              </span>
            </h1>
            <p className="x-feed-intro">
              Keep a clip, animation or photo set from a public X post. Paste its address below to see the available file options, without signing into an account.
            </p>

          <div className="x-feed">
            <div className="x-feed-tabs"><span>For your link</span><a href="#x-download-steps">How it works</a></div>
            <div className="x-compose">
              <span className="x-feed-avatar" aria-hidden="true">𝕏</span>
              <div className="x-compose-tool"><Grab placeholder="Paste an X or Twitter post link" submitLabel="Download" /></div>
            </div>
            <article className="x-feed-post">
              <span className="x-feed-avatar x-feed-guide-avatar" aria-hidden="true">u</span>
              <div className="x-feed-post-body">
                <div className="x-feed-byline"><strong>{SITE.name}</strong><span>@mediahelp</span><span aria-hidden="true" className="x-feed-more">···</span></div>
                <p>Copy the address of the individual post.</p>
                <div className="x-feed-quote"><strong>Choose From The Returned Files</strong><p>Auto requests the attached media. If the post provides several pictures, each returned item has its own save control.</p></div>
                <Actions counts={["Videos", "GIFs", "Photos", "Free"]} />
              </div>
            </article>
          </div>
          <p className="mt-5 text-center text-xs text-[var(--muted)]">Save media with {SITE.name} only where your ownership or permission allows it.</p>
        </div>
      </section>

      {/* 2. what comes out of a post, as three posts */}
      <section className="x-comments-section pf-band-white w-full">
        <Image className="x-comments-decoration x-comments-bird" src="/images/twitter/comment-bird.webp" alt="" width={501} height={487} sizes="(max-width: 767px) 90px, 230px" />
        <Image className="x-comments-decoration x-comments-x" src="/images/twitter/comment-x.webp" alt="" width={491} height={475} sizes="(max-width: 767px) 90px, 280px" />
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Media Formats <em className="accent">From X Posts</em>
          </h2>
          <p className="mt-4 max-w-[62ch] text-[var(--muted)] md:text-lg">
            The attachment determines which file options appear. An animation may use a video format, while pictures remain separate items.
          </p>

          <div className="x-comments-layout mt-8 md:mt-12">
            <ul className="x-comments-list">
              {KINDS.map((k) => (
                <li key={k.id}>
                  <article className="x-comment">
                    <header className="x-comment-header">
                      <span className="x-comment-avatar" data-kind={k.id} aria-hidden="true">
                        <svg viewBox="0 0 24 24">{k.id === "video" ? <path d="m9 5 11 7-11 7Z" /> : k.id === "gif" ? <><path d="M19 8a8 8 0 0 0-13-2L3 9m0-5v5h5M5 16a8 8 0 0 0 13 2l3-3m0 5v-5h-5" /></> : <><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1"/><path d="m4 17 5-5 4 4 3-3 5 5"/></>}</svg>
                      </span>
                      <div><h3>{k.name}</h3><span className="x-comment-handle">{k.handle}</span></div>
                      <span className="x-comment-more" aria-hidden="true">···</span>
                    </header>
                    <p>{k.text}</p>
                    <div className="x-comment-actions" aria-hidden="true">{["reply", "repost", "like", "share"].map((action) => <svg key={action} viewBox="0 0 24 24"><path d={GLYPHS[action]}/></svg>)}</div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. the steps, as a thread: avatars down the left joined by a line, no artwork */}
      <section id="x-download-steps" className="x-character-steps look-x w-full">
        <Reveal className="x-standoff-cast">
          <div className="x-standoff-actor x-standoff-blue" data-reveal><Image src="/images/twitter/steps-blue.webp" alt="" width={470} height={404} sizes="36vw" /></div>
          <div className="x-standoff-actor x-standoff-black" data-reveal><Image src="/images/twitter/steps-black.webp" alt="" width={474} height={397} sizes="36vw" /></div>
          <div className="x-standoff-actor x-standoff-red" data-reveal><Image src="/images/twitter/steps-red.webp" alt="" width={338} height={370} sizes="24vw" /></div>
        </Reveal>
        <div className="x-character-content mx-auto max-w-[46rem] px-[5vw] py-16 md:py-24 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Download A Post In <em className="accent">4 Steps</em>
          </h2>

          <Reveal className="mt-10 md:mt-12">
            <ol className="xp-thread list-none">
              {THREAD.map((s, i) => (
                <li key={s.title} className="xp-thread-item" tabIndex={0} data-reveal>
                  <div className="xp-thread-rail">
                    <span aria-hidden="true" className="xp-avatar">
                      {i + 1}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="xp-step-title">{s.title}</h3>
                    <p className="xp-step-line">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* 4. when a link gives you nothing, as the posts that would have given it */}
      <section className="pf-band-white w-full">
        <Reveal className="x-empty-reveal mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <h2 className="x-smoke-item text-3xl font-bold leading-[1.1] md:text-5xl" data-reveal>
            Reasons A Post <em className="accent">May Return No Media</em>
          </h2>
          <p className="x-smoke-item mt-4 max-w-[62ch] text-[var(--muted)] md:text-lg" data-reveal>
            Access and content type affect what we can retrieve. Check these cases if your request produces no file.
          </p>

          <div className="xp-grid x-empty-posts mt-8 md:mt-12">
            {EMPTIES.map((e) => (
              <div key={e.id} className="x-smoke-item" data-reveal>
              <Post avatar="✕" tone="quiet" name={e.name} handle={e.handle}>
                <p className="xp-line">{e.text}</p>
                <p className="xp-empty">{e.slot}</p>
              </Post>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 5. the homepage's drifting logo pills, with the other ten platforms */}
      <PlatformGuidance platform="twitter" />

      <section id="platforms" className="look-x w-full">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-16 md:py-20 lg:px-6">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-5xl">
            Download Media From <em className="accent">Another Source</em>
          </h2>
          <p className="mt-4 max-w-[60ch] text-[var(--muted)] md:text-lg">
            Find a tool for the platform that hosts your next clip, picture or track.
          </p>

        </div>
        <PlatformMarquee compact exclude="X (Twitter)" staticMobile />
      </section>

      {/* 6. help, right before the black footer */}
      <section className="pf-band-white w-full">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-[5vw] py-12 text-center md:flex-row md:gap-10 md:py-14 md:text-left lg:px-6">
          <Image
            src="/images/twitter/help-links.webp"
            alt=""
            width={600}
            height={600}
            sizes="160px"
            className="h-auto w-[140px] shrink-0 md:w-[160px]"
          />
          <div className="min-w-0">
            <h2 className="text-2xl font-bold md:text-4xl">Questions About X Downloads</h2>
            <p className="mt-2 max-w-[52ch] text-[var(--muted)]">
              Read the additional help for mixed media results, file formats and copying the address of a quoted post.
            </p>
          </div>
          <Link href="#twitter-faq" className="neon shrink-0 px-5 py-3 md:ml-auto">
            View the answers
          </Link>
        </div>
      </section>
    </div>
  );
}
