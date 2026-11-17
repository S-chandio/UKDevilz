"use client";
// components/Header.tsx
// Flat, full-width header: logo left, plain text links right. The bar is half see-through over the page, and once
// scrolled it gains a hairline and shrinks a little (a sentinel at the very top tells us when; the heights live in
// .site-bar / .site-logo). The Platforms menu opens on hover and on keyboard focus; phones get a hamburger panel.
// Deliberately plain: the neon buttons live in the page, not here.
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";
import { PLATFORMS } from "@/lib/platforms";

const NAV = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#formats", label: "What you can save" },
  { href: "/#faq", label: "FAQ" },
];

export default function Header() {
  const [stuck, setStuck] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // the sentinel sits at the very top of the page: once it scrolls out of view, the header turns solid
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // the phone panel closes on Escape and on a tap anywhere outside the header
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    const onDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [menuOpen]);

  return (
    <>
      <div ref={sentinel} aria-hidden="true" className="absolute top-0 h-px w-px" />
      <header ref={headerRef} data-stuck={stuck || undefined} data-open={menuOpen || undefined} className="site-header">
        <div className="site-bar mx-auto flex max-w-[1320px] items-center justify-between gap-6 px-[5vw] lg:px-8">
          <Link href="/" className="shrink-0">
            <Image
              src="/images/brand/ukdevliz-logo.webp"
              alt={`${SITE.name} home`}
              width={1671}
              height={652}
              sizes="150px"
              loading="eager"
              className="site-logo"
            />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
            <div className="nav-menu">
              <span className="nav-link" aria-hidden="true">
                Platforms
                <svg viewBox="0 0 10 6" width="10" height="6" fill="none" stroke="currentColor" strokeWidth="1.5" className="nav-caret">
                  <path d="M1 1l4 4 4-4" />
                </svg>
              </span>
              <div className="nav-panel">
                <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
                  {PLATFORMS.map((p) => (
                    <li key={p.href}>
                      <Link href={p.href} className="nav-sub">{p.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="nav-link">{n.label}</Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="nav-burger md:hidden"
          >
            <span data-open={menuOpen || undefined} />
          </button>
        </div>

        {menuOpen && (
          <nav id="mobile-menu" aria-label="Main" className="nav-mobile md:hidden" onClick={() => setMenuOpen(false)}>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="nav-mobile-link">{n.label}</Link>
            ))}
            <p className="nav-mobile-label">Platforms</p>
            <div className="grid grid-cols-2 gap-x-6">
              {PLATFORMS.map((p) => (
                <Link key={p.href} href={p.href} className="nav-mobile-link nav-mobile-sub">{p.name}</Link>
              ))}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
