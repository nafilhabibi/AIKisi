import { NextResponse } from "next/server";
import { readStats } from "@/lib/stats-server";

/** GET /api/stats — returns live stats from public/stats.json */
export async function GET() {
  try {
    const stats = await readStats();
    return NextResponse.json(stats, {
      headers: {
        // Allow client to re-fetch every 60 s, but stale-while-revalidate for 5 min
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return NextResponse.json({ error: "Gagal membaca statistik" }, { status: 500 });
  }
}
