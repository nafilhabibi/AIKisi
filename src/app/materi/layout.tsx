import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Materi Saya \u2014 Semua Rangkuman PDF yang Sudah Diproses AI",
  description:
    "Lihat semua materi PDF yang sudah kamu upload dan dirangkum oleh AI Rangkumify. Akses rangkuman, chatbot, dan latihan soal kapan saja.",
  alternates: {
    canonical: "https://rangkumify.vercel.app/materi",
  },
  openGraph: {
    title: "Materi Saya \u2014 Rangkumify",
    description:
      "Semua materi PDF yang sudah dirangkum AI tersimpan di sini. Buka, diskusikan, dan latihan soal kapan saja.",
    url: "https://rangkumify.vercel.app/materi",
  },
  robots: {
    index: false, // Halaman materi bersifat personal/lokal, tidak perlu diindeks
    follow: true,
  },
};

export default function MateriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
