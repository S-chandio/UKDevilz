// app/api/resolve/route.ts
// POST { url, mode?, quality? }  ->  ResolveResult (see lib/cobalt.ts)

import { NextRequest, NextResponse } from "next/server";
import { normalize } from "@/lib/normalize";
import { resolveWithCobalt, type Mode } from "@/lib/cobalt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const QUALITIES = new Set(["max", "1080", "720", "480", "360"]);

export async function POST(req: NextRequest) {
  let body: { url?: unknown; mode?: unknown; quality?: unknown };
  try {
    const parsed: unknown = await req.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Expected an object");
    body = parsed;
  } catch {
    return NextResponse.json({ kind: "error", code: "bad_request", message: "Invalid request." }, { status: 400 });
  }

  const raw = String(body?.url || "");
  const mode: Mode = body.mode === "audio" || body.mode === "mute" ? body.mode : "auto";
  const quality = QUALITIES.has(String(body?.quality)) ? String(body.quality) : "1080";

  if (!raw) {
    return NextResponse.json({ kind: "error", code: "no_url", message: "Paste a link first." }, { status: 400 });
  }

  const n = await normalize(raw);
  if (!n.ok) {
    return NextResponse.json(
      { kind: "error", service: n.service, code: "unsupported", message: n.message, retryable: false },
      { status: 200 },
    );
  }

  const result = await resolveWithCobalt(n.url, n.service, mode, quality);
  return NextResponse.json(result, { status: 200 });
}
