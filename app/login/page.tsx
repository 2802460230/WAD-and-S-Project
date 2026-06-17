"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Store token in cookie
      document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Strict`;

      // Store user info in localStorage for frontend use
      localStorage.setItem("user", JSON.stringify({ email: data.email, role: data.role }));

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mm-canvas relative flex min-h-screen items-center justify-center overflow-hidden p-6">
      <GlyphField />

      <div className="relative z-10 mx-auto w-full max-w-xl rounded-[2rem] bg-[var(--auth-card)] p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl md:p-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <LogoBadge />
          <h1 className="mt-6 font-display text-4xl font-bold italic text-[var(--auth-card-ink)]">
            Welcome back!
          </h1>
          <p className="mt-1 text-[var(--auth-card-ink)]/60">Log in to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className={labelClass}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              autoComplete="off"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              autoComplete="new-password"
              className={fieldClass}
            />
          </div>

          {error && (
            <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-brand py-4 text-lg font-bold text-brand-ink shadow-lg shadow-emerald-900/20 transition hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in\u2026" : "Log In"}
          </button>

          <p className="text-center text-sm text-[var(--auth-card-ink)]/70">
            No Account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[var(--auth-card-ink)] underline underline-offset-2"
            >
              Register
            </Link>
          </p>

          <p className="text-center text-sm text-[var(--auth-card-ink)]/50">
            <Link href="/forgot-password" className="hover:text-[var(--auth-card-ink)]/80 transition">
              Forgot your password?
            </Link>
          </p>
        </form>
      </div>

      <ThemeToggle />
    </main>
  );
}

/* ---------- shared field styles ---------- */
const fieldClass =
  "w-full rounded-2xl bg-auth-field px-5 py-4 font-mono text-[15px] text-[var(--auth-card-ink)] placeholder:text-[var(--auth-card-ink)]/40 outline-none ring-1 ring-black/5 transition focus:ring-2 focus:ring-brand";

const labelClass = "mb-2 block text-[15px] font-semibold text-[var(--auth-card-ink)]";

/* ---------- inlined visuals (no external deps) ---------- */
function LogoBadge() {
  return (
    <div className="relative grid size-20 place-items-center rounded-3xl bg-[#0e1f26] shadow-lg">
      <span className="font-display text-4xl font-bold italic text-white">M</span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#00c897"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute right-3 top-3 size-7"
      >
        <path d="M4 20L20 4" />
        <path d="M13 4h7v7" />
      </svg>
    </div>
  );
}

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

function GlyphField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {GLYPHS.map((g, i) => (
        <span key={i} className="mm-glyph" style={{ top: g.top, left: g.left, fontSize: g.size }}>
          {g.c}
        </span>
      ))}
    </div>
  );
}

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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-4 text-amber-500">
        {dark ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
          </>
        ) : (
          <path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z" />
        )}
      </svg>
      {dark ? "Light" : "Dark"}
    </button>
  );
}