// app/layout.tsx
import { pageMetadata } from "@/lib/page-seo";
import { Autour_One, Comic_Relief, Lobster_Two, Playpen_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NeonPalette from "@/components/NeonPalette";

// one font per heading level, Autour One for everything else; globals.css maps them to h1/h2/h3/body
const fontH1 = Comic_Relief({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-h1", display: "swap", adjustFontFallback: false });
// italic is loaded too: accent words in headings use it (.accent in globals.css)
const fontH2 = Lobster_Two({ weight: ["400", "700"], style: ["normal", "italic"], subsets: ["latin"], variable: "--font-h2", display: "swap" });
const fontH3 = Playpen_Sans({ subsets: ["latin"], variable: "--font-h3", display: "swap" });
const fontBody = Autour_One({ weight: "400", subsets: ["latin"], variable: "--font-body", display: "swap" });

const FONT_VARS = [fontH1, fontH2, fontH3, fontBody].map((f) => f.variable).join(" ");

export const metadata = pageMetadata("/");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={FONT_VARS}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* random theme colour per neon button, new every visit */}
        <NeonPalette />
      </body>
    </html>
  );
}
