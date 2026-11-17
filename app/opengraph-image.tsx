import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE } from "@/lib/site";

export const alt = "UkDevilz free online downloader with the red devil mascot";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function SocialImage() {
  const mascot = await readFile(join(process.cwd(), "app/icon.png"));
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#000", color: "#f7f2f2", padding: "56px", alignItems: "center", position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", width: 690 }}>
        <div style={{ display: "flex", fontSize: 34, fontWeight: 700, marginBottom: 38 }}>UkDevilz</div>
        <div style={{ display: "flex", fontSize: 65, fontWeight: 700, lineHeight: 1.1 }}>Your Free</div>
        <div style={{ display: "flex", fontSize: 65, fontWeight: 700, lineHeight: 1.1, color: "#e43636" }}>Online Downloader</div>
        <div style={{ display: "flex", fontSize: 27, color: "#bababa", marginTop: 26, maxWidth: 610 }}>Save videos, photos and audio from public links.</div>
        <div style={{ display: "flex", fontSize: 25, marginTop: 14 }}>No login required.</div>
        <div style={{ display: "flex", fontSize: 23, color: "#bababa", marginTop: 42 }}>{SITE.domain}</div>
      </div>
      {/* ImageResponse renders this embedded asset directly into the PNG. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`data:image/png;base64,${mascot.toString("base64")}`} alt="" width={370} height={370} style={{ position: "absolute", right: 30, top: 135 }} />
    </div>,
    size,
  );
}
