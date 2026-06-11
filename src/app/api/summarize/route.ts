import { NextRequest, NextResponse } from "next/server";
import { generateSummary } from "@/lib/cerebras";

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length < 50) {
      return NextResponse.json({ error: "Teks terlalu pendek atau kosong" }, { status: 400 });
    }

    const summary = await generateSummary(text);
    const id = crypto.randomUUID();

    return NextResponse.json({ id, ...summary });
  } catch (err) {
    console.error("Summarize error:", err);
    return NextResponse.json({ error: "Gagal membuat rangkuman" }, { status: 500 });
  }
}
