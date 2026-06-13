"use client";

import { useEffect, useState } from "react";

interface Stats {
  pdfsUploaded: number;
  questionsGenerated: number;
  chatSessions: number;
}

export default function StatsCounter() {
  const [stats, setStats] = useState<Stats>({
    pdfsUploaded: 2448, // Default fallback
    questionsGenerated: 150000,
    chatSessions: 8500,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats({
            pdfsUploaded: data.pdfsUploaded || 0,
            questionsGenerated: data.questionsGenerated || 0,
            chatSessions: data.chatSessions || 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    }
    fetchStats();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M+";
    if (num >= 1000) return (num / 1000).toFixed(1).replace(".0", "") + "K+";
    return num.toString() + "+";
  };

  const statItems = [
    { value: formatNumber(stats.chatSessions), label: "Siswa Aktif (Chat)", color: "text-coral" },
    { value: formatNumber(stats.pdfsUploaded), label: "PDF Diupload", color: "text-mint" },
    { value: formatNumber(stats.questionsGenerated), label: "Soal Generated", color: "text-yellow" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b-2 border-bg-dark pb-16 mb-16">
      {statItems.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className={`text-[3.5rem] md:text-[4.5rem] font-black font-display leading-none mb-2 ${stat.color}`}>
            {stat.value}
          </div>
          <div className="text-lg text-muted font-medium uppercase tracking-widest">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
