"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/* ---- Inline icons (no external deps) ---- */
function LogoArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#00c897"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 20L20 4" />
      <path d="M13 4h7v7" />
    </svg>
  );
}

function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Sun({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
    </svg>
  );
}

function Moon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z" />
    </svg>
  );
}

/* ---- Dark / Light pill ---- */
function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("mm-theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed bottom-6 right-6 z-20 inline-flex items-center gap-2 rounded-full bg-surface/90 px-4 py-2 text-sm font-medium text-ink shadow-md ring-1 ring-line backdrop-blur transition hover:bg-surface"
    >
      {dark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-amber-500" />}
      {dark ? "Light" : "Dark"}
    </button>
  );
}

/* ---- Floating math glyphs ---- */
const GLYPHS = [
  { c: "\u2211", top: "12%", left: "12%", size: "120px" },
  { c: "\u222B", top: "8%", left: "82%", size: "90px" },
  { c: "\u221A", top: "48%", left: "6%", size: "84px" },
  { c: "\u221E", top: "70%", left: "40%", size: "110px" },
  { c: "0", top: "78%", left: "10%", size: "150px" },
  { c: "y", top: "60%", left: "82%", size: "120px" },
  { c: "\u2713", top: "30%", left: "70%", size: "70px" },
  { c: "\u03C0", top: "85%", left: "70%", size: "90px" },
];

const STATS = [
  { value: "50K+", label: "Problems Solved" },
  { value: "12+", label: "Main Topics" },
  { value: "4.9\u2605", label: "Student Rating" },
];

export default function LandingPage() {
  return (
    <main className="mm-canvas relative flex min-h-screen items-center justify-center overflow-hidden p-6">
      {/* ambient glyphs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {GLYPHS.map((g, i) => (
          <span key={i} className="mm-glyph" style={{ top: g.top, left: g.left, fontSize: g.size }}>
            {g.c}
          </span>
        ))}
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center text-white">
        {/* Logo lockup */}
        <div className="flex items-end gap-1">
          <LogoArrow className="mb-3 size-12 md:size-16" />
          <h1 className="font-display text-6xl font-bold italic leading-[0.85] text-white drop-shadow md:text-8xl">
            <span className="block text-right">Math</span>
            <span className="block">Mentor</span>
          </h1>
        </div>

        <p className="mt-8 text-lg text-white/75 md:text-xl">
          An AI-powered math problem solver.
          <br />
          Step-by-step solutions instantly.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="rounded-full bg-white/10 px-10 py-4 text-lg font-bold text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/15"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-10 py-4 text-lg font-bold text-brand-ink shadow-lg shadow-emerald-900/30 transition hover:bg-brand-strong"
          >
            Register
            <ArrowRight className="size-5" />
          </Link>
        </div>

        {/* Stats */}
        <dl className="mt-16 flex items-center gap-8 md:gap-12">
          {STATS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-8 md:gap-12">
              {i > 0 && <span className="h-10 w-px bg-white/20" />}
              <div>
                <dt className="font-display text-2xl font-bold italic text-white md:text-3xl">
                  {s.value}
                </dt>
                <dd className="mt-1 text-sm text-white/60">{s.label}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>

      <ThemeToggle />
    </main>
  );
}