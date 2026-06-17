"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email is required");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to reset password");
        return;
      }

      setSuccess("Password reset successfully. You can now log in.");
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mm-canvas relative flex min-h-screen items-center justify-center overflow-hidden p-6">
      <div className="relative z-10 mx-auto w-full max-w-xl rounded-[2rem] bg-[var(--auth-card)] p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl md:p-12">
        <div className="flex flex-col items-center text-center">
          <h1 className="font-display text-4xl font-bold italic text-[var(--auth-card-ink)]">
            Reset your password
          </h1>
          <p className="mt-1 text-[var(--auth-card-ink)]/60">
            Enter your email and choose a new password
          </p>
        </div>

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
            <label htmlFor="newPassword" className={labelClass}>
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className={labelClass}>
              Re-enter New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className={fieldClass}
            />
          </div>

          {error && (
            <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-300">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-brand py-4 text-lg font-bold text-brand-ink shadow-lg shadow-emerald-900/20 transition hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Resetting…" : "Reset Password"}
          </button>

          <p className="text-center text-sm text-[var(--auth-card-ink)]/70">
            <Link
              href="/login"
              className="font-semibold text-[var(--auth-card-ink)] underline underline-offset-2"
            >
              Back to Log In
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

const fieldClass =
  "w-full rounded-2xl bg-auth-field px-5 py-4 font-mono text-[15px] text-[var(--auth-card-ink)] placeholder:text-[var(--auth-card-ink)]/40 outline-none ring-1 ring-black/5 transition focus:ring-2 focus:ring-brand";

const labelClass = "mb-2 block text-[15px] font-semibold text-[var(--auth-card-ink)]";
