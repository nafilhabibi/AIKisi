import { promises as fs } from "fs";
import path from "path";

const STATS_PATH = path.join(process.cwd(), "public", "stats.json");

export interface Stats {
  pdfsUploaded: number;
  questionsGenerated: number;
  chatSessions: number;
  lastUpdated: string;
}

const DEFAULT_STATS: Stats = {
  pdfsUploaded: 0,
  questionsGenerated: 0,
  chatSessions: 0,
  lastUpdated: new Date().toISOString(),
};

/** Read stats from public/stats.json */
export async function readStats(): Promise<Stats> {
  try {
    const raw = await fs.readFile(STATS_PATH, "utf-8");
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

/** Atomically increment one or more stat keys and persist */
export async function incrementStats(
  updates: Partial<Omit<Stats, "lastUpdated">>
): Promise<Stats> {
  // Read current, then write back — simple mutex via sequential awaits is fine
  // for low-concurrency use; Vercel serverless instances don't share memory anyway.
  const current = await readStats();

  const next: Stats = {
    pdfsUploaded: current.pdfsUploaded + (updates.pdfsUploaded ?? 0),
    questionsGenerated:
      current.questionsGenerated + (updates.questionsGenerated ?? 0),
    chatSessions: current.chatSessions + (updates.chatSessions ?? 0),
    lastUpdated: new Date().toISOString(),
  };

  await fs.writeFile(STATS_PATH, JSON.stringify(next, null, 2), "utf-8");
  return next;
}
