"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles, MessageCircle, Send, ArrowRight, BookOpen,
  Lightbulb, Sigma, Loader2, CheckCircle2,
} from "lucide-react";
import { getMaterial, type MaterialData } from "@/lib/storage";
import katex from "katex";
import "katex/dist/katex.min.css";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function RangkumanPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [material, setMaterial] = useState<MaterialData | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      const m = getMaterial(id);
      if (!m) {
        router.push("/materi");
        return;
      }
      setTimeout(() => {
        setMaterial(m);
      }, 0);
    }
  }, [id, router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!chatInput.trim() || !material || streaming) return;

    const question = chatInput.trim();
    setChatInput("");

    const userMsg: ChatMessage = { role: "user", content: question };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setStreaming(true);

    // Add empty assistant message
    setMessages([...updatedMessages, { role: "assistant", content: "" }]);

    try {
      const history = updatedMessages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          context: material.text,
          history: history.slice(0, -1), // exclude the current question
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Chat gagal" }));
        throw new Error(errData.error || "Chat gagal");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  assistantContent += parsed.content;
                  setMessages([
                    ...updatedMessages,
                    { role: "assistant", content: assistantContent },
                  ]);
                }
              } catch {
                // skip invalid JSON
              }
            }
          }
        }
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: `Maaf, ${errMsg}. Silakan coba tanya lagi ya!` },
      ]);
    } finally {
      setStreaming(false);
    }
  }, [chatInput, material, messages, streaming]);

  if (!material) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-coral" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/materi"
          className="text-sm font-bold text-muted hover:text-coral transition-colors font-display flex items-center gap-1 mb-4"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Kembali ke materi
        </Link>
        <div className="inline-flex items-center gap-2 hand-drawn-border-mint px-4 py-1.5 mb-4 bg-white transform -rotate-1">
          <Sparkles className="w-4 h-4 text-coral" />
          <span className="text-sm font-bold text-coral uppercase tracking-wider font-display">
            Rangkuman AI
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black font-display text-text">
          {material.title}
        </h1>
        <p className="text-sm text-muted mt-2 font-medium">
          {material.pageCount ? `${material.pageCount} halaman · ` : ""}
          Dirangkum pada {new Date(material.createdAt).toLocaleDateString("id-ID", {
            day: "numeric", month: "long", year: "numeric",
          })}
        </p>
      </div>

      {/* Main grid: Summary + Chatbot */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Summary (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Summary card */}
          <div className="bento-card bg-white p-8">
            <h2 className="text-xl font-bold font-display text-text mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-mint" />
              Rangkuman
            </h2>
            <div className="prose prose-lg max-w-none text-text/80 leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]}
              >
                {material.summary.replace(/\\\(/g, '$').replace(/\\\)/g, '$').replace(/\\\[/g, '$$$').replace(/\\\]/g, '$$$')}
              </ReactMarkdown>
            </div>
          </div>

          {/* Key Points */}
          {material.keyPoints.length > 0 && (
            <div className="bento-card bg-yellow p-8">
              <h2 className="text-xl font-bold font-display text-text mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Poin Penting
              </h2>
              <ul className="space-y-3">
                {material.keyPoints.map((kp, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-text mt-0.5 flex-shrink-0" />
                    <div className="text-text/80 font-medium prose prose-sm max-w-none prose-p:my-0">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]}
                      >
                        {kp.replace(/\\\(/g, '$').replace(/\\\)/g, '$').replace(/\\\[/g, '$$$').replace(/\\\]/g, '$$$')}
                      </ReactMarkdown>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Definitions */}
          {material.definitions.length > 0 && (
            <div className="bento-card bg-white p-8">
              <h2 className="text-xl font-bold font-display text-text mb-4 flex items-center gap-2">
                <Sigma className="w-5 h-5 text-coral" />
                Definisi Istilah
              </h2>
              <div className="space-y-4">
                {material.definitions.map((d, i) => (
                  <div key={i} className="border-l-4 border-mint pl-4">
                    <div className="font-bold text-text font-display prose prose-sm max-w-none prose-p:my-0">
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]}>
                        {d.term.replace(/\\\(/g, '$').replace(/\\\)/g, '$').replace(/\\\[/g, '$$$').replace(/\\\]/g, '$$$')}
                      </ReactMarkdown>
                    </div>
                    <div className="text-text/70 text-sm mt-1 prose prose-sm max-w-none prose-p:my-0">
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]}>
                        {d.definition.replace(/\\\(/g, '$').replace(/\\\)/g, '$').replace(/\\\[/g, '$$$').replace(/\\\]/g, '$$$')}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulas */}
          {material.formulas.length > 0 && (
            <div className="bento-card bg-[#D4F5E9] p-8">
              <h2 className="text-xl font-bold font-display text-text mb-4 flex items-center gap-2">
                <Sigma className="w-5 h-5" />
                Rumus & Formula
              </h2>
              <div className="space-y-3">
                {material.formulas.map((f, i) => {
                  let html = f;
                  try {
                    html = katex.renderToString(f, { throwOnError: false, displayMode: true });
                  } catch (e) {
                    console.error(e);
                  }
                  return (
                    <div 
                      key={i} 
                      className="bg-white/80 rounded-xl px-4 py-3 text-text border-2 border-bg-dark overflow-x-auto"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA to quiz */}
          <div className="bento-card bg-coral p-8 text-center">
            <h2 className="text-2xl font-black font-display text-white mb-3">
              Sudah paham materinya?
            </h2>
            <p className="text-white/80 font-medium mb-6">
              Uji pemahamanmu dengan latihan soal yang di-generate AI!
            </p>
            <Link
              href={`/latihan/${material.id}`}
              className="btn-editorial bg-white text-text px-8 py-3 rounded-full text-lg"
            >
              Mulai Latihan Soal
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Right: Chatbot (2 cols) */}
        <div className="lg:col-span-2">
          <div className="bento-card bg-white flex flex-col h-[600px] lg:h-[calc(100vh-200px)] lg:sticky lg:top-24">
            {/* Chat header */}
            <div className="p-4 border-b-2 border-border flex items-center gap-3">
              <div className="w-10 h-10 bg-mint rounded-xl border-2 border-bg-dark flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-text" />
              </div>
              <div>
                <h3 className="font-bold font-display text-text">Tanya AI</h3>
                <p className="text-xs text-muted">Bingung? Tanya apa aja tentang materi ini</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-bg rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-coral" />
                  </div>
                  <p className="text-sm text-muted font-medium">
                    Tanya apa aja tentang materi ini!
                  </p>
                  <div className="mt-4 space-y-2">
                    {[
                      "Jelaskan poin utama materi ini",
                      "Apa yang paling penting dihafal?",
                      "Buat contoh penerapan",
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => { setChatInput(q); }}
                        className="block w-full text-left text-sm bg-bg hover:bg-mint/20 px-3 py-2 rounded-lg text-text/70 font-medium transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-coral text-white rounded-br-sm"
                        : "bg-bg text-text rounded-bl-sm border border-border"
                    }`}
                  >
                    {msg.role === "assistant" && msg.content === "" && streaming ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown 
                          remarkPlugins={[remarkMath]} 
                          rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]}
                        >
                          {msg.content.replace(/\\\(/g, '$').replace(/\\\)/g, '$').replace(/\\\[/g, '$$$').replace(/\\\]/g, '$$$')}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <span className="whitespace-pre-wrap">{msg.content}</span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t-2 border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Ketik pertanyaan..."
                  className="flex-1 bg-bg border-2 border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-mint transition-colors font-medium"
                  disabled={streaming}
                />
                <button
                  onClick={sendMessage}
                  disabled={streaming || !chatInput.trim()}
                  className="btn-editorial bg-coral text-white w-11 h-11 rounded-xl justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {streaming ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
