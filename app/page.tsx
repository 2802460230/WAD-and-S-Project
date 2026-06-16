"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/* ---- Icons ---- */
function LogoArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#00c897" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 20L20 4" /><path d="M13 4h7v7" />
    </svg>
  );
}
function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
function Sun({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
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
function IconCamera({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 8h3l2-2.5h8L18 8h3v11H3z" /><circle cx="12" cy="13" r="3.2" />
    </svg>
  );
}
function IconSparkles({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z" /><path d="M18 15l.7 1.8L20.5 17.5l-1.8.7L18 20l-.7-1.8L15.5 17.5l1.8-.7z" />
    </svg>
  );
}
function IconLightbulb({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z" />
    </svg>
  );
}
function IconPencil({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 4l4 4L8 20H4v-4z" /><path d="M13.5 6.5l4 4" />
    </svg>
  );
}
function IconCheck({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 13l4 4 10-11" />
    </svg>
  );
}

/* ---- Theme toggle ---- */
function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => { setDark(document.documentElement.classList.contains("dark")); }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("mm-theme", next ? "dark" : "light"); } catch {}
  };
  return (
    <button onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed bottom-6 right-6 z-20 inline-flex items-center gap-2 rounded-full bg-surface/90 px-4 py-2 text-sm font-medium text-ink shadow-md ring-1 ring-line backdrop-blur transition hover:bg-surface">
      {dark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-amber-500" />}
      {dark ? "Light" : "Dark"}
    </button>
  );
}

/* ---- Floating glyphs ---- */
const GLYPHS = [
  { c: "∑", top: "12%", left: "12%", size: "120px" },
  { c: "∫", top: "8%", left: "82%", size: "90px" },
  { c: "√", top: "48%", left: "6%", size: "84px" },
  { c: "∞", top: "70%", left: "40%", size: "110px" },
  { c: "0", top: "78%", left: "10%", size: "150px" },
  { c: "y", top: "60%", left: "82%", size: "120px" },
  { c: "✓", top: "30%", left: "70%", size: "70px" },
  { c: "π", top: "85%", left: "70%", size: "90px" },
];

/* ---- Data ---- */
const STATS = [
  { value: "50K+", label: "Problems Solved" },
  { value: "4", label: "AI Features" },
  { value: "4.9★", label: "Student Rating" },
];

const FEATURES = [
  {
    Icon: IconSparkles,
    title: "AI Problem Solving",
    desc: "Submit any math problem — algebra, calculus, geometry — and receive a clear step-by-step solution with plain English explanations.",
    badge: "NLP",
  },
  {
    Icon: IconCamera,
    title: "OCR Image Upload",
    desc: "Take a photo of your handwritten or printed math problem. Our AI vision model extracts and solves it instantly.",
    badge: "OCR",
  },
  {
    Icon: IconLightbulb,
    title: "Hint Generation",
    desc: "Not ready for the full answer? Get guided hints that point you in the right direction without giving it away.",
    badge: "NLP",
  },
  {
    Icon: IconPencil,
    title: "Practice Problems",
    desc: "After solving, generate similar practice problems on the same topic to reinforce your understanding.",
    badge: "AI",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Submit your problem",
    desc: "Type your math problem or upload a photo of your handwritten work. Supports algebra, calculus, geometry, statistics and more.",
  },
  {
    n: "02",
    title: "AI solves it instantly",
    desc: "Our Groq-powered AI model analyzes your problem and generates a structured solution in seconds.",
  },
  {
    n: "03",
    title: "Learn step by step",
    desc: "Every solution comes with numbered steps and plain English explanations — so you understand the reasoning, not just the answer.",
  },
];

const TOPICS = ["Algebra", "Calculus", "Geometry", "Statistics", "Trigonometry", "Linear Algebra"];

/* ---- Page ---- */
export default function LandingPage() {
  const smoothScroll = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 md:px-12"
        style={{ background: "rgba(14,27,24,0.7)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2">
          <LogoArrow className="size-6" />
          <span className="font-display text-xl font-bold italic text-white">MathMentor</span>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <button onClick={() => smoothScroll("features")} className="text-sm font-medium text-white/70 transition hover:text-white">Features</button>
          <button onClick={() => smoothScroll("how-it-works")} className="text-sm font-medium text-white/70 transition hover:text-white">How it works</button>
          <button onClick={() => smoothScroll("topics")} className="text-sm font-medium text-white/70 transition hover:text-white">Topics</button>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="rounded-full px-5 py-2 text-sm font-semibold text-white/80 ring-1 ring-white/20 transition hover:bg-white/10">
            Login
          </Link>
          <Link href="/register" className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-brand-ink transition hover:bg-brand-strong">
            Get started
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="mm-canvas relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {GLYPHS.map((g, i) => (
            <span key={i} className="mm-glyph" style={{ top: g.top, left: g.left, fontSize: g.size }}>{g.c}</span>
          ))}
        </div>

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center text-white">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand/20 px-4 py-1.5 text-sm font-semibold text-brand ring-1 ring-brand/30">
            <IconSparkles className="size-4" /> AI-powered math tutor
          </div>

          <div className="flex items-end gap-1">
            <LogoArrow className="mb-3 size-12 md:size-16" />
            <h1 className="font-display text-6xl font-bold italic leading-[0.85] text-white drop-shadow md:text-8xl">
              <span className="block text-right">Math</span>
              <span className="block">Mentor</span>
            </h1>
          </div>

          <p className="mt-8 max-w-xl text-lg text-white/75 md:text-xl">
            Struggling with math? Submit any problem by text or image and get instant step-by-step AI solutions — designed to help you learn, not just get answers.
          </p>

          <dl className="mt-16 flex items-center gap-8 md:gap-12">
            {STATS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-8 md:gap-12">
                {i > 0 && <span className="h-10 w-px bg-white/20" />}
                <div>
                  <dt className="font-display text-2xl font-bold italic text-white md:text-3xl">{s.value}</dt>
                  <dd className="mt-1 text-sm text-white/60">{s.label}</dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-12 animate-bounce text-white/40">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-6 mx-auto">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="bg-bg px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full bg-mint px-4 py-1.5 text-sm font-bold text-mint-ink">Features</span>
            <h2 className="mt-4 font-display text-4xl font-bold italic text-ink md:text-5xl">
              Everything you need to master math
            </h2>
            <p className="mt-4 text-lg text-muted">
              Four AI-powered features designed to support every stage of your learning journey.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ Icon, title, desc, badge }) => (
              <div key={title} className="group rounded-3xl bg-surface p-6 ring-1 ring-line transition hover:ring-brand">
                <div className="mb-4 flex items-center justify-between">
                  <div className="grid size-12 place-items-center rounded-2xl bg-mint text-mint-ink">
                    <Icon className="size-6" />
                  </div>
                  <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-bold text-muted">{badge}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="bg-surface-2 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full bg-mint px-4 py-1.5 text-sm font-bold text-mint-ink">How it works</span>
            <h2 className="mt-4 font-display text-4xl font-bold italic text-ink md:text-5xl">
              Three steps to your solution
            </h2>
            <p className="mt-4 text-lg text-muted">
              From problem to understanding in seconds.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.n} className="relative rounded-3xl bg-surface p-8 ring-1 ring-line">
                {i < STEPS.length - 1 && (
                  <div className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 md:block">
                    <ArrowRight className="size-6 text-muted" />
                  </div>
                )}
                <div className="font-display text-5xl font-bold italic text-brand opacity-30">{step.n}</div>
                <h3 className="mt-4 font-display text-xl font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOPICS ── */}
      <section id="topics" className="bg-bg px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full bg-mint px-4 py-1.5 text-sm font-bold text-mint-ink">Topics</span>
            <h2 className="mt-4 font-display text-4xl font-bold italic text-ink md:text-5xl">
              Covers every math topic
            </h2>
            <p className="mt-4 text-lg text-muted">
              From high school algebra to university-level calculus — MathMentor handles it all.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {TOPICS.map((topic) => (
              <span key={topic} className="rounded-full bg-surface px-6 py-3 font-mono text-sm font-semibold text-ink ring-1 ring-line transition hover:ring-brand">
                {topic}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="mm-canvas relative overflow-hidden px-6 py-24 md:px-12">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {GLYPHS.slice(0, 4).map((g, i) => (
            <span key={i} className="mm-glyph" style={{ top: g.top, left: g.left, fontSize: g.size }}>{g.c}</span>
          ))}
        </div>
        <div className="relative z-10 mx-auto max-w-2xl text-center text-white">
          <h2 className="font-display text-4xl font-bold italic md:text-5xl">
            Start solving smarter today
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Free to use. No credit card required. Powered by state-of-the-art AI.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-brand px-10 py-4 text-lg font-bold text-brand-ink shadow-lg transition hover:bg-brand-strong">
              Create free account <ArrowRight className="size-5" />
            </Link>
            <Link href="/login" className="rounded-full bg-white/10 px-10 py-4 text-lg font-bold text-white ring-1 ring-white/20 transition hover:bg-white/15">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-surface border-t border-line px-6 py-5 md:px-12">
        <div className="mx-auto max-w-6xl flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-1.5">
            <LogoArrow className="size-4" />
            <span className="font-display text-base font-bold italic text-ink">MathMentor</span>
          </div>
          <p className="text-xs text-muted">© 2026 MathMentor — COMP6703001 Web Application Development and Security · BINUS University International</p>
        </div>
      </footer>

      <ThemeToggle />
    </div>
  );
}