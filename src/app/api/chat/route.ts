import { NextRequest } from "next/server";
import { chatCompletion } from "@/lib/cerebras";
import type { ChatCompletion } from "@cerebras/cerebras_cloud_sdk/resources/chat";

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const { question, context, history = [] } = await req.json();

    if (!question || !context) {
      return new Response(JSON.stringify({ error: "Pertanyaan dan konteks diperlukan" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const stream = await chatCompletion(question, context, history);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const rawChunk of stream) {
            const chunk = rawChunk as ChatCompletion.ChatChunkResponse;
            const content = chunk.choices?.[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          console.error("Chat stream error:", err);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: "Stream terputus" })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Chat error:", err);
    const message = err instanceof Error && err.message.includes("429")
      ? "Server sedang sibuk, coba lagi dalam beberapa detik..."
      : "Gagal memproses chat";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
