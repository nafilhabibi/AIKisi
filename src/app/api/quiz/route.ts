import { NextRequest, NextResponse } from "next/server";
import { generateQuiz } from "@/lib/cerebras";
import { incrementStats } from "@/lib/stats-server";

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const { text, count = 10 } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length < 50) {
      return NextResponse.json({ error: "Teks terlalu pendek atau kosong" }, { status: 400 });
    }

    const questions = await generateQuiz(text, Math.min(count, 20));

    // ── Track stats ──────────────────────────────────────
    if (questions.length > 0) {
      incrementStats({ questionsGenerated: questions.length }).catch(console.error);
    }

    return NextResponse.json({ questions });
  } catch (err) {
    console.error("Quiz error:", err);
    return NextResponse.json({ error: "Gagal membuat soal latihan" }, { status: 500 });
  }
}
