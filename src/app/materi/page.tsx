"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Trash2, Sparkles, Upload, BookOpen } from "lucide-react";
import { getMaterials, deleteMaterial, type MaterialData } from "@/lib/storage";

export default function MateriPage() {
  const [materials, setMaterials] = useState<MaterialData[]>([]);

  useEffect(() => {
    const data = getMaterials();
    setTimeout(() => {
      setMaterials(data);
    }, 0);
  }, []);

  const handleDelete = (id: string) => {
    deleteMaterial(id);
    setMaterials(getMaterials());
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 hand-drawn-border-mint px-4 py-1.5 mb-6 bg-white transform -rotate-1">
          <BookOpen className="w-4 h-4 text-coral" />
          <span className="text-sm font-bold text-coral uppercase tracking-wider font-display">
            Koleksi Materi
          </span>
        </div>
        <h1 className="display-heading font-display text-text">
          Materi{" "}
          <span className="font-cursive text-mint">kamu</span>
        </h1>
        <p className="text-lg text-muted font-medium mt-4 max-w-xl">
          Semua materi yang sudah kamu upload dan dirangkum AI.
        </p>
      </div>

      {/* Empty state */}
      {materials.length === 0 && (
        <div className="bento-card bg-white p-16 text-center">
          <div className="w-20 h-20 bg-yellow rounded-2xl border-2 border-bg-dark shadow-[4px_4px_0px_#1A1A2E] flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-text" />
          </div>
          <h2 className="text-2xl font-black font-display text-text mb-3">
            Belum ada materi
          </h2>
          <p className="text-muted font-medium mb-8 max-w-sm mx-auto">
            Upload PDF pertamamu dan AI akan langsung merangkumnya.
          </p>
          <Link
            href="/"
            className="btn-editorial bg-coral text-white px-8 py-3 rounded-full text-lg"
          >
            <Upload className="w-5 h-5" />
            Upload Materi
          </Link>
        </div>
      )}

      {/* Materials grid */}
      {materials.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((m) => (
            <div key={m.id} className="bento-card bg-white p-6 flex flex-col group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 bg-mint rounded-xl border-2 border-bg-dark flex-shrink-0 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-text" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold font-display text-text truncate">{m.title}</h3>
                    <p className="text-xs text-muted font-medium">
                      {m.pageCount ? `${m.pageCount} halaman · ` : ""}
                      {new Date(m.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-2 text-muted/40 hover:text-coral hover:bg-coral/10 rounded-lg transition-colors"
                  title="Hapus materi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-muted line-clamp-3 flex-1 mb-4 leading-relaxed">
                {m.summary}
              </p>

              {m.keyPoints.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {m.keyPoints.slice(0, 3).map((kp, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-bold bg-bg px-2 py-1 rounded-full text-muted border border-border"
                    >
                      {kp.length > 30 ? kp.slice(0, 30) + "..." : kp}
                    </span>
                  ))}
                  {m.keyPoints.length > 3 && (
                    <span className="text-[11px] font-bold text-muted px-2 py-1">
                      +{m.keyPoints.length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Link
                  href={`/rangkuman/${m.id}`}
                  className="btn-editorial flex-1 bg-mint text-text px-4 py-2.5 rounded-full text-sm justify-center"
                >
                  <Sparkles className="w-4 h-4" />
                  Rangkuman
                </Link>
                <Link
                  href={`/latihan/${m.id}`}
                  className="btn-editorial flex-1 bg-coral text-white px-4 py-2.5 rounded-full text-sm justify-center"
                >
                  Latihan
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
