import Cerebras from "@cerebras/cerebras_cloud_sdk";
import type { ChatCompletion } from "@cerebras/cerebras_cloud_sdk/resources/chat";

const CEREBRAS_MODEL = "gpt-oss-120b";
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000;

function createClient(key: string | undefined, fallback: string): Cerebras {
  return new Cerebras({ apiKey: key || fallback });
}

const materiKey = process.env.MODEL_MATERI_KEY || "";
const soalKey = process.env.MODEL_SOAL_KEY || materiKey;
const chatKey = process.env.MODEL_CHATBOT_KEY || materiKey;

const materiClient = createClient(materiKey, materiKey);
const soalClient = createClient(process.env.MODEL_SOAL_KEY, soalKey);
const chatClient = createClient(process.env.MODEL_CHATBOT_KEY, chatKey);

// ── Retry helper for rate limiting (429) ──
async function withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const isRateLimit =
        err instanceof Error &&
        (err.message.includes("429") || err.message.includes("too_many") || err.message.includes("high traffic"));
      if (isRateLimit && attempt < MAX_RETRIES) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt);
        console.warn(`[${label}] Rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
  throw new Error("Max retries exceeded");
}

// ── Generate Summary ──
export async function generateSummary(text: string) {
  const res = await withRetry(
    () => materiClient.chat.completions.create({
      model: CEREBRAS_MODEL,
      messages: [
        {
          role: "system",
          content: `Kamu adalah seorang guru ahli yang bertugas membuat rangkuman materi dari teks yang diberikan. 
Buat rangkuman yang terstruktur dalam Bahasa Indonesia dengan format JSON berikut:
{
  "title": "judul materi yang singkat",
  "summary": "rangkuman menyeluruh dalam 2-3 paragraf",
  "keyPoints": ["poin penting 1", "poin penting 2", ...],
  "definitions": [{"term": "istilah", "definition": "penjelasan"}],
  "formulas": ["rumus atau formula jika ada, kosongkan array jika tidak ada"]
}
Pastikan output HANYA JSON valid tanpa markdown atau teks tambahan.`,
        },
        {
          role: "user",
          content: `Buat rangkuman dari materi berikut:\n\n${text.slice(0, 12000)}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    }),
    "generateSummary"
  );

  const result = res as ChatCompletion.ChatCompletionResponse;
  const raw = result.choices[0]?.message?.content || "{}";
  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      title: "Materi",
      summary: raw,
      keyPoints: [],
      definitions: [],
      formulas: [],
    };
  }
}

// ── Chat Completion (streaming) ──
export async function chatCompletion(
  question: string,
  context: string,
  history: { role: string; content: string }[] = []
) {
  const messages = [
    {
      role: "system" as const,
      content: `Kamu adalah asisten belajar AI bernama AIKisi. Tugasmu adalah menjawab pertanyaan siswa tentang materi yang diberikan. 
Jawab dalam Bahasa Indonesia yang santai tapi edukatif. Gunakan konteks materi berikut sebagai referensi utama:

---MATERI---
${context.slice(0, 8000)}
---AKHIR MATERI---

Jika pertanyaan di luar konteks materi, tetap jawab dengan ramah tapi ingatkan bahwa kamu paling paham tentang materi yang diberikan.`,
    },
    ...history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: question },
  ];

  const stream = await withRetry(
    () => chatClient.chat.completions.create({
      model: CEREBRAS_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    }),
    "chatCompletion"
  );

  return stream;
}

// ── Generate Quiz ──
export async function generateQuiz(text: string, count: number = 10) {
  const res = await withRetry(
    () => soalClient.chat.completions.create({
      model: CEREBRAS_MODEL,
      messages: [
        {
          role: "system",
          content: `Kamu adalah guru yang membuat soal latihan pilihan ganda. Buat soal berdasarkan materi yang diberikan.
Format output HARUS JSON array valid tanpa markdown:
[
  {
    "question": "pertanyaan",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correctIndex": 0,
    "explanation": "penjelasan kenapa jawaban ini benar"
  }
]
Buat ${count} soal dengan tingkat kesulitan bervariasi (mudah, sedang, sulit).
Pastikan output HANYA JSON valid tanpa markdown atau teks tambahan.`,
        },
        {
          role: "user",
          content: `Buat ${count} soal latihan dari materi berikut:\n\n${text.slice(0, 10000)}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 4096,
    }),
    "generateQuiz"
  );

  const result = res as ChatCompletion.ChatCompletionResponse;
  const raw = result.choices[0]?.message?.content || "[]";
  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return [];
  }
}
