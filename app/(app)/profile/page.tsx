"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const MATH_TOPICS = new Set(["algebra", "calculus", "geometry", "statistics"]);

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [problemCount, setProblemCount] = useState<number | null>(null);
  const [bookmarkCount, setBookmarkCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to load profile");
          return;
        }

        setEmail(data.email);
        setName(data.name || "");
      } catch {
        setError("Something went wrong");
      }
    };

    const fetchCounts = async () => {
      const [histRes, bmRes] = await Promise.all([
        fetch("/api/history"),
        fetch("/api/bookmarks"),
      ]);
      if (histRes.ok) {
        const hist: { topic: string }[] = await histRes.json();
        setProblemCount(
          hist.filter((p) => MATH_TOPICS.has((p.topic || "").toLowerCase())).length
        );
      }
      if (bmRes.ok) {
        const bm: unknown[] = await bmRes.json();
        setBookmarkCount(bm.length);
      }
    };

    fetchProfile();
    fetchCounts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update profile");
        return;
      }

      setIsEditing(false);
      setSuccess("Profile updated successfully");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    localStorage.removeItem("user");
    router.push("/login");
  };

  const initials =
    name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <>
      {/* Top bar */}
      <header className="flex items-center justify-between gap-4 border-b border-line bg-topbar px-6 py-5 md:px-10">
        <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">Profile</h1>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-mint px-4 py-2 text-sm font-semibold text-mint-ink">
            Free Plan
          </span>
          <span className="relative grid size-10 place-items-center rounded-full text-ink/70">
            <Bell className="size-5" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500" />
          </span>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-4xl">
          {/* Identity row */}
          <div className="flex flex-wrap items-center gap-5">
            <span className="grid size-20 place-items-center rounded-full bg-brand/10 font-display text-2xl font-bold text-brand ring-2 ring-brand">
              {initials}
            </span>
            <div className="flex-1">
              <h2 className="font-display text-3xl text-ink">{name}</h2>
              <p className="text-muted">{email}</p>
              <span className="mt-2 inline-block rounded-full bg-mint px-3 py-1 text-xs font-bold uppercase tracking-wide text-mint-ink">
                Free Plan
              </span>
            </div>
          </div>

          <hr className="my-7 border-line" />

          {!isEditing ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: problemCount, label: "Problems Solved" },
                  { value: bookmarkCount, label: "Bookmarks" },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl bg-surface px-4 py-6 text-center ring-1 ring-line">
                    <p className="font-display text-3xl font-bold text-brand">
                      {s.value === null ? "—" : s.value}
                    </p>
                    <p className="mt-1 text-sm text-muted">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Detail fields */}
              <div className="mt-6 space-y-4">
                <Field label="Email Address" value={email} />
              </div>

              {success && (
                <p className="mt-4 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  {success}
                </p>
              )}

              {/* Account actions */}
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                {/* Visual only — no change-password endpoint wired yet */}
                <button className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-7 py-3.5 text-sm font-semibold text-ink ring-1 ring-line transition hover:ring-brand">
                  <Lock className="size-4" /> Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full bg-coral px-7 py-3.5 text-sm font-semibold text-coral-ink transition hover:brightness-95"
                >
                  <LogOut className="size-4" /> Log Out
                </button>
              </div>
            </>
          ) : (
            /* Edit mode */
            <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-[15px] font-semibold text-ink">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl bg-surface px-5 py-4 text-[15px] text-ink outline-none ring-1 ring-line transition focus:ring-2 focus:ring-brand"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-[15px] font-semibold text-ink">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl bg-surface px-5 py-4 text-[15px] text-ink outline-none ring-1 ring-line transition focus:ring-2 focus:ring-brand"
                />
              </div>

              {error && (
                <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-300">
                  {error}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-brand-ink transition hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Saving…" : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => { setIsEditing(false); setError(""); }}
                  className="rounded-full bg-surface-2 px-7 py-3.5 text-sm font-semibold text-ink ring-1 ring-line transition hover:ring-brand"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface px-5 py-4 ring-1 ring-line">
      <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-[15px] text-ink">{value}</p>
    </div>
  );
}

/* ---- icons ---- */
type Icn = { className?: string };
const sv = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};
function Bell({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5 1.5 5h-15S6 13 6 9z" /><path d="M10 18a2 2 0 0 0 4 0" /></svg>);
}
function Edit({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="M13.5 6.5l4 4" /></svg>);
}
function Lock({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>);
}
function LogOut({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><path d="M14 4H6v16h8" /><path d="M11 12h9M17 8l4 4-4 4" /></svg>);
}