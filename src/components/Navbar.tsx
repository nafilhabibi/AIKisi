"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/materi", label: "Materi" },
  { href: "/tentang", label: "Tentang" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      {/* ── NAVBAR BAR ── */}
      <nav className="w-full bg-white/70 backdrop-blur-lg border-b-2 border-border sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-5 h-16 md:h-20 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center hover:scale-105 transition-transform origin-left font-display flex-shrink-0"
          >
            <span className="text-xl md:text-3xl font-black tracking-tighter uppercase">
              Rangkumify<span className="text-mint">.</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8 text-[15px] font-bold text-text font-display">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-coral transition-colors relative group ${
                  pathname === link.href ? "text-coral" : ""
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-coral transition-all ${
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            {/* Desktop CTA */}
            <Link
              href="/materi"
              className="hidden md:inline-flex btn-editorial bg-mint text-text px-6 py-2.5 rounded-full text-[15px]"
            >
              Materi Saya
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            {/* Hamburger button — mobile only */}
            <button
              id="mobile-menu-toggle"
              onClick={toggle}
              aria-label={isOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={isOpen}
              className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-xl border-2 border-bg-dark bg-white shadow-[2px_2px_0px_#1A1A2E] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all focus:outline-none"
            >
              <span
                className={`block w-5 h-[2.5px] bg-bg-dark rounded-full transition-all duration-300 origin-center ${
                  isOpen ? "rotate-45 translate-y-[7.5px]" : ""
                }`}
              />
              <span
                className={`block w-5 h-[2.5px] bg-bg-dark rounded-full transition-all duration-300 ${
                  isOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block w-5 h-[2.5px] bg-bg-dark rounded-full transition-all duration-300 origin-center ${
                  isOpen ? "-rotate-45 -translate-y-[7.5px]" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER OVERLAY ── */}
      <div
        onClick={close}
        className={`fixed inset-0 z-40 bg-bg-dark/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* ── MOBILE DRAWER PANEL ── */}
      <div
        className={`fixed top-0 right-0 h-full w-[80vw] max-w-[320px] z-50 md:hidden
          bg-white border-l-2 border-bg-dark shadow-[-8px_0_0_#1A1A2E]
          flex flex-col
          transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 h-16 border-b-2 border-border flex-shrink-0">
          <span className="text-lg font-black tracking-tighter uppercase font-display">
            Rangkumify<span className="text-mint">.</span>
          </span>
          <button
            onClick={close}
            aria-label="Tutup menu"
            className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-bg-dark bg-bg shadow-[2px_2px_0px_#1A1A2E] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-5 py-8 flex flex-col gap-2 overflow-y-auto">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              style={{ animationDelay: isOpen ? `${i * 60 + 80}ms` : "0ms" }}
              className={`flex items-center gap-4 px-4 py-4 rounded-xl font-display font-bold text-lg transition-all
                border-2 group
                ${
                  pathname === link.href
                    ? "bg-mint border-bg-dark shadow-[3px_3px_0px_#1A1A2E] text-bg-dark"
                    : "border-transparent hover:border-bg-dark hover:bg-bg hover:shadow-[3px_3px_0px_#1A1A2E] text-text"
                }
                ${isOpen ? "anim-up" : ""}
              `}
            >
              {/* Active indicator dot */}
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
                  pathname === link.href ? "bg-bg-dark" : "bg-border group-hover:bg-coral"
                }`}
              />
              {link.label}
              {pathname === link.href && (
                <svg className="ml-auto w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </Link>
          ))}
        </nav>

        {/* Drawer CTA */}
        <div className="px-5 pb-8 pt-4 border-t-2 border-border flex-shrink-0">
          <Link
            href="/materi"
            onClick={close}
            className="btn-editorial w-full bg-mint text-text px-6 py-4 rounded-xl text-base font-display justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Materi Saya
          </Link>

          <p className="text-center text-xs text-muted mt-4 font-medium">
            🎓 Platform belajar AI · 100% gratis
          </p>
        </div>
      </div>
    </>
  );
}
