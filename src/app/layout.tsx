import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const siteUrl = "https://rangkumify.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rangkumify — Upload Materi, AI yang Rangkum & Ajarin!",
    template: "%s | Rangkumify",
  },
  description:
    "Rangkumify adalah platform belajar AI gratis. Upload PDF materi dari guru, AI akan merangkum, menjelaskan, membuat latihan soal, dan menjawab pertanyaanmu secara otomatis. Belajar jadi lebih cepat dan efektif!",
  keywords: [
    "Rangkumify",
    "rangkum materi AI",
    "aplikasi belajar AI",
    "ringkasan materi otomatis",
    "latihan soal AI",
    "chatbot belajar",
    "upload PDF belajar",
    "rangkuman otomatis",
    "belajar dengan AI",
    "aplikasi belajar gratis",
    "kisi kisi AI",
    "AI untuk pelajar",
    "asisten belajar AI",
    "generator soal AI",
  ],
  authors: [{ name: "Nafil Habibi Mulyadi", url: siteUrl }],
  creator: "Nafil Habibi Mulyadi",
  publisher: "Nafil Habibi Mulyadi",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "Rangkumify",
    title: "Rangkumify — Upload Materi, AI yang Rangkum & Ajarin!",
    description:
      "Platform belajar AI gratis. Upload PDF, AI rangkum, bikin soal latihan, dan jawab pertanyaanmu. Belajar jadi lebih cepat!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rangkumify — Asisten Belajar AI",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@rangkumify",
    creator: "@rangkumify",
    title: "Rangkumify — Upload Materi, AI yang Rangkum & Ajarin!",
    description:
      "Platform belajar AI gratis. Upload PDF, AI rangkum, bikin soal latihan, dan jawab pertanyaanmu.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "education",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: "4omiwFtUdBD4Nm-jwNqa49vITBKd-iJwDTlUk0jWVFU", // Isi dengan Google Search Console verification code jika sudah punya
  },
  other: {
    "theme-color": "#4CE0B3",
  },
};

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/materi", label: "Materi" },
  { href: "/tentang", label: "Tentang" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-full flex flex-col font-sans bg-bg text-text antialiased selection:bg-mint/30 selection:text-text">

        {/* ── NAVBAR ── */}
        <nav className="w-full bg-white/70 backdrop-blur-lg border-b-2 border-border sticky top-0 z-50 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center hover:scale-105 transition-transform origin-left font-display">
              <span className="text-2xl md:text-3xl font-black tracking-tighter uppercase">
                Rangkumify<span className="text-mint">.</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8 text-[15px] font-bold text-text font-display">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-coral transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-coral transition-all group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <Link
                href="/materi"
                className="hidden sm:inline-flex btn-editorial bg-mint text-text px-6 py-2.5 rounded-full text-[15px]"
              >
                Materi Saya
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              {/* Hamburger */}
              <button className="md:hidden flex items-center text-text focus:outline-none ml-2">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* ── MAIN ── */}
        <main className="flex-1">{children}</main>

        {/* ── FOOTER ── */}
        <footer className="bg-bg-dark text-white pt-20 pb-10 border-t-[6px] border-mint">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-3xl font-black tracking-tighter uppercase font-display mb-6">
                Rangkumify<span className="text-mint">.</span>
              </h2>
              <p className="text-slate-400 text-base leading-relaxed max-w-sm mb-6 font-medium">
                Upload materi dari guru, AI yang ajarin. Rangkuman otomatis, chatbot interaktif, dan latihan soal adaptif. 100% gratis.
              </p>
              <div className="bg-white/10 border border-white/20 p-4 rounded-xl inline-block">
                <p className="text-sm text-white font-bold flex items-center gap-2">
                  <svg className="w-5 h-5 text-mint" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  100% gratis. Tanpa paywall, tanpa batasan premium.
                </p>
              </div>
            </div>

            {/* Menu */}
            <div>
              <h4 className="text-mint font-bold mb-6 text-lg font-display tracking-wide uppercase">
                Navigasi
              </h4>
              <ul className="space-y-4 text-base text-slate-400 font-medium">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-white transition-colors flex items-center gap-2">
                      <span className="w-2 h-2 bg-slate-600 rounded-full" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-mint font-bold mb-6 text-lg font-display tracking-wide uppercase">
                Newsletter
              </h4>
              <p className="text-base text-slate-400 mb-4 font-medium">
                Dapatkan tips belajar dan update fitur terbaru langsung ke inbox.
              </p>
              <div className="flex border-2 border-white/20 rounded-xl overflow-hidden focus-within:border-mint transition-colors">
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 bg-transparent px-4 py-3 text-sm outline-none text-white"
                />
                <button className="px-4 font-bold text-sm bg-mint text-bg-dark hover:bg-mint/80 transition-colors">
                  Submit
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm font-medium">
              &copy; {new Date().getFullYear()} Rangkumify. Dibuat oleh anak muda, untuk anak muda.
            </p>
            <div className="flex gap-6 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
