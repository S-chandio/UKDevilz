import { pageMetadata } from "@/lib/page-seo";
// app/page.tsx
import Image from "next/image";
import Grab from "./grab";
import AboutUkdevliz from "@/components/AboutUkdevliz";
import DownloadFormats from "@/components/DownloadFormats";
import FaqGrid from "@/components/FaqGrid";
import GuideSteps from "@/components/GuideSteps";
import HowWeWork from "@/components/HowWeWork";
import PlatformMarquee from "@/components/PlatformMarquee";
import PlatformShowcase from "@/components/PlatformShowcase";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata("/");

export default function Home() {
  return (
    <>
      {/* hero: link-spark artwork behind the floating header, headline and downloader on the dark left side */}
      <section className="look-black under-header relative isolate overflow-hidden">
        {/* artwork starts below the floating header, so the mascot's horns are never hidden behind it (see .hero-art) */}
        <div className="hero-art absolute inset-x-0 bottom-0 -z-10">
          <Image
            src="/images/hero/hero-devil-link-spark.webp"
            alt=""
            fill
            preload
            sizes="100vw"
            className="object-cover object-[72%_top]"
          />
        </div>
        <div aria-hidden="true" className="hero-shade absolute inset-0 -z-10" />
        <div className="mx-auto flex min-h-[600px] max-w-[1200px] flex-col justify-center px-[5vw] pb-16 pt-12 md:min-h-[min(84vh,820px)] md:pb-20 lg:px-6">
          <div className="max-w-[640px] text-center md:text-left">
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">UkDevilz Your Free <strong>Online Downloader</strong></h1>
            <p className="mt-4 text-base text-[var(--muted)] md:text-lg">
              Use our free online video downloader to save videos, photos and audio from supported public links. No login required.
            </p>
          </div>
          <div className="mt-8 w-full max-w-[640px]">
            <Grab />
          </div>
          <p className="mt-4 max-w-[640px] text-center text-xs text-[var(--muted)] md:text-left">
            Use {SITE.name} to download material you own or have permission to save.
          </p>
        </div>
      </section>

      {/* supported platforms logo slider */}
      <PlatformMarquee />

      {/* how-to guide, step by step */}
      <GuideSteps />

      {/* platforms */}
      <PlatformShowcase />

      {/* what you can download, and in which format */}
      <DownloadFormats />

      {/* what is ukdevliz */}
      <AboutUkdevliz />

      {/* how we work and our goals, around the energy-core mascot */}
      <HowWeWork />

      {/* FAQ grid, right above the footer (text in lib/faq.ts) */}
      <FaqGrid />
    </>
  );
}
