// components/Footer.tsx
// Blueprint-style footer: a grid of ruled cells (statement, link columns, mascot, facts), a full-width outlined
// wordmark framed by ruler ticks and corner marks, and a slim legal bar. The FAQ is its own section above
// (components/FaqGrid.tsx); the FAQ links here jump to it.
// Only real content: no newsletter form (no backend for it) and no invented emails or social links.
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { PLATFORMS } from "@/lib/platforms";

const SITE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#formats", label: "What you can save" },
  { href: "/#faq", label: "FAQ" },
];

const LEGAL = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/contact", label: "Contact" },
];

const TOP_PLATFORMS = PLATFORMS.slice(0, 6);
const MORE_PLATFORMS = PLATFORMS.slice(6);

function Col({ title, links, highlightFirst = false }: { title: string; links: { href: string; label: string }[]; highlightFirst?: boolean }) {
  return (
    <div className="bp-cell">
      <p className="bp-label">{title}</p>
      <ul className="mt-5 space-y-2.5">
        {links.map((l, i) => (
          <li key={l.href}>
            <Link href={l.href} className={`bp-link ${highlightFirst && i === 0 ? "text-[var(--red)]" : ""}`}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const brand = SITE.name.toUpperCase();

  return (
    // dark footer: look-black sets the black background and light text; lines and small titles are red (.bp in globals.css)
    <footer className="bp look-black w-full bg-[var(--paper)] text-[var(--ink)]">
      <div className="mx-auto max-w-[1920px] px-[3vw] pt-10 lg:px-6">
        <div className="bp-frame">
          {/* ruled grid */}
          <div className="bp-grid">
            <div className="bp-cell bp-statement">
              <p className="bp-headline title-case">
                Save Media
                <br />
                From A <span className="text-[var(--red)]">Public Link</span>
              </p>
            </div>

            <Col title="Site" links={SITE_LINKS} highlightFirst />
            <Col title="Downloaders" links={TOP_PLATFORMS.map((p) => ({ href: p.href, label: p.name }))} />
            <Col title="More platforms" links={MORE_PLATFORMS.map((p) => ({ href: p.href, label: p.name }))} />

            <div className="bp-cell bp-mascot">
              <Image
                src="/images/brand/ukdevliz-mascot.webp"
                alt=""
                width={1254}
                height={1254}
                sizes="(min-width: 1024px) 220px, 160px"
                className="logo-3d h-auto w-[160px] lg:w-[220px]"
              />
            </div>

            <div className="bp-cell bp-about">
              <p className="bp-label">About</p>
              <p className="mt-5 text-[var(--muted)]">
                {SITE.name} provides browser tools for media shared through supported public links. File options depend on the source.
              </p>
              <p className="mt-3 text-sm text-[var(--muted)]">Check permission before downloading or reusing a creator’s work.</p>
            </div>

            <div className="bp-cell">
              <p className="bp-label">Formats</p>
              <ul className="mt-5 space-y-2.5">
                <li>MP4 video</li>
                <li>JPG photos</li>
                <li>MP3 audio</li>
              </ul>
            </div>

            <div className="bp-cell">
              <p className="bp-label">Tool options</p>
              <ul className="mt-5 space-y-2.5">
                <li>YouTube quality options</li>
                <li>TikTok without watermark</li>
                <li>Individual carousel files</li>
              </ul>
            </div>

            <div className="bp-cell">
              <p className="bp-label">Help</p>
              <ul className="mt-5 space-y-2.5">
                <li><Link href="/contact" className="bp-link">Contact us</Link></li>
                <li><Link href="/#faq" className="bp-link">Read the FAQ</Link></li>
              </ul>
            </div>          </div>

          {/* blueprint wordmark */}
          <div className="bp-ruler" aria-hidden="true">
            <span className="bp-plus bp-plus-tl">+</span>
            <span className="bp-plus bp-plus-tr">+</span>
            <span className="bp-plus bp-plus-bl">+</span>
            <span className="bp-plus bp-plus-br">+</span>
            <svg viewBox="0 0 1000 230" className="block w-full" preserveAspectRatio="xMidYMid meet">
              {/* construction lines: cap height, middle and baseline */}
              <g className="bp-guides">
                <line x1="20" x2="980" y1="40" y2="40" />
                <line x1="20" x2="980" y1="115" y2="115" />
                <line x1="20" x2="980" y1="190" y2="190" />
              </g>
              <text
                x="500"
                y="190"
                textAnchor="middle"
                textLength="920"
                lengthAdjust="spacingAndGlyphs"
                className="bp-wordmark"
              >
                {brand}
              </text>
            </svg>
          </div>
          <p className="sr-only">{SITE.name}</p>

          {/* legal bar */}
          <div className="bp-bar">
            <p className="bp-copy">
              &copy; {year} {SITE.name}. All rights reserved.
            </p>
            <nav aria-label="Legal" className="bp-legal">
              {LEGAL.map((l) => (
                <Link key={l.href} href={l.href} className="bp-link">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
