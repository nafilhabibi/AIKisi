"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight, ArrowLeft, Loader2, CheckCircle2, XCircle,
  Trophy, RefreshCw, Sparkles, ClipboardList, MessageCircle,
} from "lucide-react";
import { getMaterial, type MaterialData } from "@/lib/storage";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function LatihanPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [material, setMaterial] = useState<MaterialData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState("");

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

  const fetchQuiz = useCallback(async () => {
    if (!material) return;
    setLoading(true);
    setError("");
    setQuestions([]);
    setCurrentQ(0);
    setSelected(null);
    setShowExplanation(false);
    setAnswers([]);
    setFinished(false);

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: material.text, count: 10 }),
      });
      if (!res.ok) throw new Error("Gagal generate soal");
      const data = await res.json();
      if (!data.questions || data.questions.length === 0) {
        throw new Error("AI tidak berhasil membuat soal. Coba lagi.");
      }
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(null));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [material]);

  useEffect(() => {
    if (material && questions.length === 0 && !loading) {
      setTimeout(() => {
        fetchQuiz();
      }, 0);
    }
  }, [material, questions.length, loading, fetchQuiz]);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  };

  const prevQuestion = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      const prev = answers[currentQ - 1];
      setSelected(prev);
      setShowExplanation(prev !== null);
    }
  };

  const score = answers.reduce<number>(
    (acc, ans, i) => acc + (ans === questions[i]?.correctIndex ? 1 : 0),
    0
  );

  if (!material) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-coral" />
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-coral mx-auto mb-6" />
        <h2 className="text-2xl font-black font-display text-text mb-2">
          AI sedang membuat soal...
        </h2>
        <p className="text-muted font-medium">
          Menggenerate 10 soal dari materi &ldquo;{material.title}&rdquo;
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <div className="bento-card bg-white p-10">
          <XCircle className="w-16 h-16 text-coral mx-auto mb-4" />
          <h2 className="text-2xl font-black font-display text-text mb-3">Oops!</h2>
          <p className="text-muted font-medium mb-6">{error}</p>
          <button
            onClick={fetchQuiz}
            className="btn-editorial bg-coral text-white px-8 py-3 rounded-full text-lg"
          >
            <RefreshCw className="w-5 h-5" />
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Finished state
  if (finished) {
    const percentage = Math.round((Number(score) / questions.length) * 100);
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="bento-card bg-white p-10 text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-yellow border-4 border-bg-dark flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_#1A1A2E]">
            <Trophy className="w-12 h-12 text-text" />
          </div>
          <h1 className="text-4xl font-black font-display text-text mb-2">
            {percentage >= 70 ? "Keren!" : "Semangat!"}
          </h1>
          <p className="text-lg text-muted font-medium mb-6">
            Skor kamu:
          </p>
          <div className={`text-6xl font-black font-display mb-2 ${percentage >= 70 ? "text-mint" : "text-coral"}`}>
            {score}/{questions.length}
          </div>
          <p className="text-muted font-medium mb-8">
            {percentage >= 70
              ? "Pemahaman materimu sudah bagus!"
              : "Coba baca ulang rangkumannya ya!"}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={fetchQuiz}
              className="btn-editorial bg-coral text-white px-6 py-3 rounded-full"
            >
              <RefreshCw className="w-5 h-5" />
              Ulangi Latihan
            </button>
            <Link
              href={`/rangkuman/${material.id}`}
              className="btn-editorial bg-mint text-text px-6 py-3 rounded-full"
            >
              <MessageCircle className="w-5 h-5" />
              Baca Rangkuman
            </Link>
          </div>
        </div>

        {/* Review */}
        <h2 className="section-heading font-display text-text mb-6">Review Jawaban</h2>
        <div className="space-y-4">
          {questions.map((q, i) => {
            const isCorrect = answers[i] === q.correctIndex;
            return (
              <div
                key={i}
                className={`bento-card p-6 ${isCorrect ? "bg-[#D4F5E9]" : "bg-coral/10"}`}
              >
                <div className="flex items-start gap-3 mb-2">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-coral mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <div className="font-bold text-text text-sm prose prose-sm max-w-none prose-p:my-0">
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]}>
                        {`${i + 1}. ${q.question.replace(/\\\(/g, '$').replace(/\\\)/g, '$').replace(/\\\[/g, '$$$').replace(/\\\]/g, '$$$')}`}
                      </ReactMarkdown>
                    </div>
                    {!isCorrect && (
                      <div className="text-sm text-muted mt-1 prose prose-sm max-w-none prose-p:my-0">
                        <span className="mr-1">Jawaban kamu:</span>
                        <span className="font-bold text-coral inline-block">
                          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]}>
                            {q.options[answers[i]!].replace(/\\\(/g, '$').replace(/\\\)/g, '$').replace(/\\\[/g, '$$$').replace(/\\\]/g, '$$$')}
                          </ReactMarkdown>
                        </span>
                        <br />
                        <span className="mr-1">Jawaban benar:</span>
                        <span className="font-bold text-green-600 inline-block">
                          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]}>
                            {q.options[q.correctIndex].replace(/\\\(/g, '$').replace(/\\\)/g, '$').replace(/\\\[/g, '$$$').replace(/\\\]/g, '$$$')}
                          </ReactMarkdown>
                        </span>
                      </div>
                    )}
                    <div className="text-sm text-muted mt-2 italic prose prose-sm max-w-none prose-p:my-0">
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]}>
                        {q.explanation.replace(/\\\(/g, '$').replace(/\\\)/g, '$').replace(/\\\[/g, '$$$').replace(/\\\]/g, '$$$')}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Quiz state
  if (questions.length === 0) return null;
  const q = questions[currentQ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/rangkuman/${material.id}`}
          className="text-sm font-bold text-muted hover:text-coral transition-colors font-display flex items-center gap-1 mb-4"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Kembali ke rangkuman
        </Link>
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 hand-drawn-border-mint px-4 py-1.5 bg-white transform -rotate-1">
            <ClipboardList className="w-4 h-4 text-coral" />
            <span className="text-sm font-bold text-coral uppercase tracking-wider font-display">
              Latihan Soal
            </span>
          </div>
          <span className="text-sm font-bold text-muted font-display">
            {currentQ + 1} / {questions.length}
          </span>
        </div>
        <h1 className="text-2xl font-black font-display text-text mt-4 truncate">
          {material.title}
        </h1>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-border rounded-full h-3 mb-8 border border-bg-dark">
        <div
          className="bg-mint h-full rounded-full transition-all duration-500"
          style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bento-card bg-white p-8 mb-6">
        <div className="text-xl font-bold font-display text-text mb-6 leading-relaxed prose prose-xl max-w-none prose-p:my-0">
          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]}>
            {q.question.replace(/\\\(/g, '$').replace(/\\\)/g, '$').replace(/\\\[/g, '$$$').replace(/\\\]/g, '$$$')}
          </ReactMarkdown>
        </div>

        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            let style = "bg-bg hover:bg-mint/20 border-2 border-border";
            if (selected !== null) {
              if (idx === q.correctIndex) {
                style = "bg-[#D4F5E9] border-2 border-green-600";
              } else if (idx === selected && idx !== q.correctIndex) {
                style = "bg-coral/10 border-2 border-coral";
              }
            }
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={selected !== null}
                className={`w-full text-left px-5 py-4 rounded-xl font-medium transition-all ${style} ${selected === null ? "cursor-pointer" : "cursor-default"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-white border-2 border-bg-dark flex items-center justify-center font-bold text-sm font-display flex-shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="text-text/80 prose prose-sm max-w-none prose-p:my-0 flex-1">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]}>
                      {opt.replace(/^[A-D][.\)]\s*/, "").replace(/\\\(/g, '$').replace(/\\\)/g, '$').replace(/\\\[/g, '$$$').replace(/\\\]/g, '$$$')}
                    </ReactMarkdown>
                  </div>
                  {selected !== null && idx === q.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto flex-shrink-0" />
                  )}
                  {selected === idx && idx !== q.correctIndex && (
                    <XCircle className="w-5 h-5 text-coral ml-auto flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="bento-card bg-yellow p-6 mb-6 anim-up">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-text" />
            <h3 className="font-bold font-display text-text">Pembahasan</h3>
          </div>
          <div className="text-text/80 leading-relaxed prose prose-sm max-w-none prose-p:my-0">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]}>
              {q.explanation.replace(/\\\(/g, '$').replace(/\\\)/g, '$').replace(/\\\[/g, '$$').replace(/\\\]/g, '$$')}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevQuestion}
          disabled={currentQ === 0}
          className="btn-editorial bg-white text-text px-5 py-3 rounded-full text-sm disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          Sebelumnya
        </button>

        {selected !== null ? (
          <button
            onClick={nextQuestion}
            className="btn-editorial bg-coral text-white px-6 py-3 rounded-full"
          >
            {currentQ === questions.length - 1 ? "Lihat Hasil" : "Selanjutnya"}
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="text-sm text-muted font-medium">Pilih jawaban terlebih dahulu</div>
        )}
      </div>
    </div>
  );
}
