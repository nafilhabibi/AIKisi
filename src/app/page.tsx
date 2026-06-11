"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, ArrowRight, Loader2, BookOpen, Sparkles, MessageCircle, ClipboardList } from "lucide-react";
import { getMaterials, saveMaterial, type MaterialData } from "@/lib/storage";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const [recent, setRecent] = useState<MaterialData[]>([]);

  useEffect(() => {
    setRecent(getMaterials().slice(0, 3));
  }, []);

  const processFile = useCallback(
    async (file: File) => {
      setError("");
      setLoading(true);

      try {
        // Step 1: Upload & parse PDF
        setProgress("Membaca PDF...");
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          throw new Error(err.error || "Gagal membaca PDF");
        }
        const { text, pageCount, title } = await uploadRes.json();

        // Step 2: Generate summary
        setProgress("AI sedang merangkum materi...");
        const sumRes = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        if (!sumRes.ok) {
          const err = await sumRes.json();
          throw new Error(err.error || "Gagal membuat rangkuman");
        }
        const summaryData = await sumRes.json();

        // Step 3: Save to localStorage
        const material: MaterialData = {
          id: summaryData.id,
          title: summaryData.title || title,
          text,
          summary: summaryData.summary,
          keyPoints: summaryData.keyPoints || [],
          definitions: summaryData.definitions || [],
          formulas: summaryData.formulas || [],
          createdAt: new Date().toISOString(),
          pageCount,
        };
        saveMaterial(material);

        // Step 4: Navigate
        setProgress("Selesai! Mengalihkan...");
        router.push(`/rangkuman/${material.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
        setLoading(false);
        setProgress("");
      }
    },
    [router]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return (
    <div className="flex flex-col">
      {/* ══════ HERO ══════ */}
      <section className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32 overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left */}
          <div className="relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 hand-drawn-border-mint px-4 py-1.5 mb-6 bg-white transform -rotate-2">
              <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />
              <span className="text-sm font-bold text-coral uppercase tracking-wider font-display">
                AI-Powered · Gratis
              </span>
            </div>

            <h1 className="text-[3.5rem] md:text-[5rem] lg:text-[5.5rem] font-black text-text leading-[0.95] mb-6 tracking-tight font-display">
              Upload{" "}
              <span className="scribble-underline text-coral">materi</span>,
              <br />
              <span className="font-cursive text-mint text-[4.5rem] md:text-[6.5rem] font-bold inline-block transform -rotate-3 ml-2">
                AI ajarin!
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed font-medium">
              Upload kisi-kisi atau materi dari guru. AI akan merangkum, menjelaskan, dan membuat latihan soal — semua otomatis.
            </p>
          </div>

          {/* Right: Upload Zone */}
          <div className="relative flex items-center justify-center">
            {/* Background blobs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[250px] h-[250px] bg-yellow rounded-full opacity-50 blur-xl" />
              <div className="w-[200px] h-[200px] bg-mint rounded-full opacity-30 blur-xl absolute top-5 left-5" />
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`relative z-10 w-full max-w-md bento-card bg-white p-10 flex flex-col items-center text-center transition-all cursor-pointer
                ${dragging ? "border-coral bg-coral/5 scale-[1.02]" : ""}
                ${loading ? "pointer-events-none opacity-80" : ""}
              `}
            >
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileInput}
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                disabled={loading}
              />

              {loading ? (
                <>
                  <Loader2 className="w-16 h-16 text-coral animate-spin mb-4" />
                  <p className="text-lg font-bold font-display text-text mb-2">{progress}</p>
                  <p className="text-sm text-muted">Mohon tunggu sebentar...</p>
                </>
              ) : (
                <>
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors ${dragging ? "bg-coral text-white" : "bg-mint text-text"} border-2 border-bg-dark shadow-[4px_4px_0px_#1A1A2E]`}>
                    <Upload className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black font-display text-text mb-2">
                    Drop PDF di sini
                  </h3>
                  <p className="text-muted font-medium mb-4">
                    atau klik untuk pilih file
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted/60 font-medium">
                    <FileText className="w-4 h-4" />
                    <span>Maksimal 20MB · Format PDF</span>
                  </div>
                </>
              )}

              {error && (
                <div className="mt-4 bg-coral/10 border-2 border-coral rounded-xl px-4 py-3 text-coral text-sm font-bold">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ MARQUEE DIVIDER ══════ */}
      <div className="w-full bg-coral py-3 border-y-2 border-bg-dark overflow-hidden flex whitespace-nowrap">
        <div className="animate-[marquee_20s_linear_infinite] flex items-center gap-8 text-yellow font-display font-bold text-xl uppercase tracking-widest">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="contents">
              <span>UPLOAD PDF</span>
              <span className="text-white text-3xl leading-none">*</span>
              <span>AI RANGKUM</span>
              <span className="text-white text-3xl leading-none">*</span>
              <span>TANYA CHATBOT</span>
              <span className="text-white text-3xl leading-none">*</span>
              <span>LATIHAN SOAL</span>
              <span className="text-white text-3xl leading-none">*</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════ HOW IT WORKS ══════ */}
      <section className="py-24 bg-white relative z-10 border-b-2 border-bg-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-[3rem] md:text-[4rem] font-black text-text leading-tight mb-4 font-display">
              Gimana{" "}
              <span className="font-cursive text-coral text-[4rem] md:text-[5rem] transform -rotate-2 inline-block">caranya?</span>
            </h2>
            <p className="text-lg text-muted font-medium max-w-2xl mx-auto">
              Cuma 3 langkah. Upload, baca rangkuman, latihan soal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
            {[
              {
                num: "01",
                title: "Upload Materi",
                desc: "Upload PDF kisi-kisi atau catatan dari guru. AI akan membaca dan mengekstrak isinya.",
                icon: <BookOpen className="w-10 h-10 text-text" />,
                color: "bg-mint",
                numColor: "text-mint",
              },
              {
                num: "02",
                title: "Baca & Tanya AI",
                desc: "AI buatkan rangkuman. Bingung? Tanya langsung ke chatbot AI yang paham materinya.",
                icon: <MessageCircle className="w-10 h-10 text-text" />,
                color: "bg-coral",
                numColor: "text-coral",
              },
              {
                num: "03",
                title: "Latihan Soal",
                desc: "Kalau sudah paham, AI generate soal latihan sesuai materi. Langsung ada pembahasannya.",
                icon: <ClipboardList className="w-10 h-10 text-text" />,
                color: "bg-yellow",
                numColor: "text-yellow",
              },
            ].map((step) => (
              <div key={step.num} className="relative flex flex-col items-center text-center group">
                <div className="w-32 h-32 mb-6 relative flex items-center justify-center">
                  <span className={`absolute text-[8rem] font-black ${step.numColor} opacity-10 -z-10 group-hover:scale-110 transition-transform font-display`}>
                    {step.num}
                  </span>
                  <div className={`w-20 h-20 bg-white border-2 border-bg-dark rounded-2xl flex items-center justify-center transform -rotate-3 shadow-[4px_4px_0px_#1A1A2E] group-hover:rotate-0 transition-all`}>
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-text mb-3 font-display">{step.title}</h3>
                <p className="text-muted font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ RECENT MATERIALS ══════ */}
      {recent.length > 0 && (
        <section className="py-24 bg-bg relative z-10 border-b-2 border-bg-dark">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-12">
              <h2 className="section-heading font-display text-text">
                Materi <span className="text-coral">terakhir</span>
              </h2>
              <Link
                href="/materi"
                className="text-sm font-bold text-text hover:text-coral transition-colors font-display flex items-center gap-1"
              >
                Lihat semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recent.map((m) => (
                <Link
                  key={m.id}
                  href={`/rangkuman/${m.id}`}
                  className="bento-card bg-white p-6 flex flex-col hover-lift"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-mint rounded-xl border-2 border-bg-dark flex items-center justify-center">
                      <FileText className="w-5 h-5 text-text" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold font-display text-text truncate">{m.title}</h3>
                      <p className="text-xs text-muted">
                        {m.pageCount ? `${m.pageCount} halaman · ` : ""}
                        {new Date(m.createdAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted line-clamp-2 flex-1">{m.summary}</p>
                  <div className="mt-4 flex items-center gap-2 text-coral font-bold text-sm font-display">
                    <Sparkles className="w-4 h-4" />
                    <span>Buka rangkuman</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════ CTA ══════ */}
      <section className="py-24 bg-white relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bento-card bg-coral p-10 md:p-16 flex flex-col items-center justify-center relative overflow-hidden text-center min-h-[350px]">
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#FFF083 2px, transparent 2px)",
                backgroundSize: "30px 30px",
              }}
            />
            <svg className="absolute top-10 left-10 w-24 h-24 text-yellow" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={6} strokeLinecap="round">
              <path d="M10 50 Q 25 10 50 50 T 90 50" />
            </svg>

            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl md:text-[4rem] font-black text-white leading-[1.1] mb-4 font-display">
                Siap belajar<br />
                <span className="text-yellow">lebih pintar?</span>
              </h2>
              <p className="text-white/80 text-lg font-medium mb-8">
                Upload materi pertamamu dan biarkan AI yang ajarin.
              </p>
              <label className="btn-editorial inline-flex bg-white text-text px-10 py-4 rounded-full text-lg cursor-pointer">
                <Upload className="w-5 h-5" />
                Upload PDF Sekarang
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileInput}
                  className="hidden"
                  disabled={loading}
                />
              </label>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
