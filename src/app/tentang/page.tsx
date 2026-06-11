import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Tentang - AIKisi",
};

export default function TentangPage() {
  return (
    <div className="bg-bg min-h-screen">

      {/* ══════ HERO ══════ */}
      <section className="border-b-2 border-bg-dark bg-bg-card">
        <div className="px-6 py-24 md:py-32 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 hand-drawn-border-mint px-4 py-1.5 mb-8 bg-white transform -rotate-1">
            <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />
            <span className="text-sm font-bold text-coral uppercase tracking-wider font-display">
              The Manifesto
            </span>
          </div>
          <h1 className="display-heading text-text mx-auto max-w-5xl font-display">
            Education should be a{" "}
            <span className="scribble-underline-coral text-coral">Right</span>,
            <br />
            not a{" "}
            <span className="font-cursive text-mint text-[4rem] md:text-[6rem] inline-block transform -rotate-2">
              Privilege.
            </span>
          </h1>
        </div>
      </section>

      {/* ══════ STATEMENT ══════ */}
      <section className="border-b-2 border-bg-dark bg-bg-dark text-white">
        <div className="max-w-[1000px] mx-auto px-6 py-24 md:py-32 text-center">
          <p className="text-2xl md:text-4xl font-light leading-snug tracking-tight">
            AIKisi didirikan dengan keyakinan bahwa setiap siswa berhak mendapat bimbingan terbaik. Cukup upload materi dari guru, AI kami akan merangkum, menjelaskan, dan membuat latihan soal — memastikan setiap siswa benar-benar paham.
          </p>
        </div>
      </section>

      {/* ══════ STATS ══════ */}
      <section className="py-24 bg-bg relative z-10 border-b-2 border-bg-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b-2 border-bg-dark pb-16 mb-16">
            {[
              { value: "12,400+", label: "Siswa Aktif", color: "text-coral" },
              { value: "8,500+", label: "Modul AI", color: "text-mint" },
              { value: "150K+", label: "Soal Generated", color: "text-yellow" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={`text-[3.5rem] md:text-[4.5rem] font-black font-display leading-none mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-lg text-muted font-medium uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mb-16">
            <h2 className="text-[3rem] md:text-[4rem] font-black text-text leading-tight max-w-2xl font-display">
              Nilai yang kami{" "}
              <span className="scribble-underline text-coral">pegang</span>
            </h2>
          </div>

          {/* Bento values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[250px]">
            {[
              {
                num: "01",
                title: "Accessibility",
                desc: "Sepenuhnya gratis. Tanpa paywall, tanpa batasan premium. AI memungkinkan pengetahuan bukan lagi komoditas eksklusif.",
                bg: "bg-coral",
                text: "text-white",
                span: "md:col-span-2",
              },
              {
                num: "02",
                title: "AI-Powered",
                desc: "Upload PDF materi, AI langsung merangkum dan menjelaskan. Chatbot interaktif siap menjawab pertanyaanmu kapan saja.",
                bg: "bg-yellow",
                text: "text-text",
                span: "md:col-span-1",
              },
              {
                num: "03",
                title: "Logical Depth",
                desc: "Kami membongkar setiap pertanyaan sampai ke akarnya. Mendorong pemahaman logika, bukan sekadar hafalan buta.",
                bg: "bg-white",
                text: "text-text",
                span: "md:col-span-1",
              },
              {
                num: "",
                title: "",
                desc: "",
                bg: "bg-[#D4F5E9]",
                text: "text-text",
                span: "md:col-span-2",
                decorative: true,
              },
            ].map((val, i) => (
              <div
                key={i}
                className={`bento-card ${val.span} ${val.bg} ${val.text} p-8 md:p-10 flex flex-col justify-between relative overflow-hidden group`}
              >
                {val.decorative ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="font-cursive text-[4rem] text-mint leading-none transform -rotate-6">
                        No Rote Learning!
                      </div>
                      <div className="font-bold text-text font-display uppercase tracking-widest mt-2">
                        Fokus Paham Konsep
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      {val.num && (
                        <div className="text-[12px] font-mono opacity-60 mb-6">{val.num}</div>
                      )}
                      <h3 className="text-3xl md:text-4xl font-black font-display mb-3">{val.title}</h3>
                      <p className={`font-medium text-lg max-w-md ${val.text} opacity-80`}>{val.desc}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ TEAM ══════ */}
      <section className="border-b-2 border-bg-dark bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12">
          <div className="md:col-span-4 p-10 md:p-16 border-b-2 md:border-b-0 md:border-r-2 border-bg-dark">
            <div className="section-num mb-6 font-display">The People</div>
            <h2 className="section-heading font-display">
              Behind
              <br />
              <span className="font-cursive text-coral text-[3rem]">the Curtains.</span>
            </h2>
          </div>
          <div className="md:col-span-8 p-10 md:p-16 flex items-center">
            <p className="text-xl leading-relaxed text-text font-medium">
              Kami adalah kolektif yang terdiri dari AI engineers, desainer, dan pendidik berpengalaman. Kami merancang ulang cara belajar dengan teknologi AI — cukup upload materi, biarkan AI yang mengajar.
            </p>
          </div>
        </div>
      </section>

      {/* ══════ BOTTOM CTA ══════ */}
      <section className="py-24 bg-white relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bento-card bg-mint p-10 md:p-16 flex flex-col items-center justify-center relative overflow-hidden text-center min-h-[400px]">
            {/* Dot pattern */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#1A1A2E 2px, transparent 2px)",
                backgroundSize: "30px 30px",
              }}
            />

            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl md:text-[4rem] font-black text-text leading-[1.1] mb-8 font-display">
                Join the
                <br />
                <span className="font-cursive text-coral text-[5rem]">Movement.</span>
              </h2>
              <Link
                href="/"
                className="btn-editorial inline-flex bg-bg-dark text-white px-10 py-4 rounded-full text-lg hover-lift"
              >
                Upload Materi Pertamamu
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
