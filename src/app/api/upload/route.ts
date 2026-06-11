import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang diupload" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Hanya file PDF yang didukung" }, { status: 400 });
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran file maksimal 20MB" }, { status: 400 });
    }

    const buffer = new Uint8Array(await file.arrayBuffer());
    const { text, totalPages } = await extractText(buffer, { mergePages: true });

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: "PDF tidak mengandung cukup teks untuk diproses" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      text,
      pageCount: totalPages,
      title: file.name.replace(/\.pdf$/i, ""),
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Gagal memproses file PDF" }, { status: 500 });
  }
}
