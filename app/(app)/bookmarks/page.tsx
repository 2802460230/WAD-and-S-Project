"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BookmarkedProblem {
  id: string;
  problemId: string;
  problem: {
    id: string;
    content: string;
    topic: string;
    createdAt: string;
    solution?: {
      steps: { step: number; explanation: string; result: string }[];
      topic: string;
    };
  };
}

export default function BookmarksPage() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<BookmarkedProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch("/api/bookmarks");
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to load bookmarks");
          return;
        }

        setBookmarks(data);
      } catch {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleDelete = async (e: React.MouseEvent, bookmarkId: string) => {
    e.stopPropagation();
    setDeletingId(bookmarkId);
    try {
      const response = await fetch(`/api/bookmarks/${bookmarkId}`, { method: "DELETE" });
      if (response.ok) {
        setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete bookmark");
      }
    } catch {
      setError("Failed to delete bookmark");
    } finally {
      setDeletingId(null);
    }
  };

  const handleBookmarkClick = (bookmark: BookmarkedProblem) => {
    if (bookmark.problem?.solution) {
      sessionStorage.setItem("solution", JSON.stringify(bookmark.problem.solution));
      sessionStorage.setItem("problem", bookmark.problem.content);
      router.push("/results");
    }
  };

  return (
    <>
      {/* Top bar */}
      <header className="flex items-center justify-between gap-4 border-b border-line bg-topbar px-6 py-5 md:px-10">
        <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">Bookmarks</h1>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-mint px-4 py-2 text-sm font-semibold text-mint-ink">
            {bookmarks.length} Saved
          </span>
          <span className="relative grid size-10 place-items-center rounded-full text-ink/70">
            <Bell className="size-5" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500" />
          </span>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-4xl">
          {loading && <p className="text-muted">Loading bookmarks…</p>}

          {error && (
            <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-300">
              {error}
            </p>
          )}

          {!loading && !error && bookmarks.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-line bg-surface-2/50 px-6 py-20 text-center">
              <Bookmark className="size-8 text-muted" />
              <p className="text-lg font-semibold text-ink">No bookmarks yet</p>
              <p className="text-sm text-muted">Solve a problem and bookmark it to save it here</p>
              <Link
                href="/dashboard"
                className="mt-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-brand-ink transition hover:bg-brand-strong"
              >
                Start Solving
              </Link>
            </div>
          )}

          {!loading && bookmarks.length > 0 && (
            <div className="space-y-4">
              {bookmarks.map((bookmark) => {
                const s = topicStyle(bookmark.problem.topic);
                return (
                  <div
                    key={bookmark.id}
                    onClick={() => handleBookmarkClick(bookmark)}
                    className="flex cursor-pointer items-center gap-4 rounded-2xl bg-surface px-5 py-4 ring-1 ring-line transition hover:ring-brand"
                  >
                    <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${s.tile}`}>
                      <s.Icon className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-bold uppercase tracking-wide ${s.label}`}>
                        {bookmark.problem.topic}
                      </p>
                      <p className="truncate font-mono text-[15px] text-ink">
                        {bookmark.problem.content}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm text-muted">
                      {formatDate(bookmark.problem.createdAt)}
                    </span>
                    <button
                      onClick={(e) => handleDelete(e, bookmark.id)}
                      disabled={deletingId === bookmark.id}
                      aria-label="Remove bookmark"
                      className="ml-1 grid size-8 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-rose-500/10 hover:text-rose-500 disabled:opacity-40"
                    >
                      <Trash className="size-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/* ---- topic → icon + colour ---- */
type Icn = { className?: string };
function topicStyle(topic: string): { tile: string; label: string; Icon: (p: Icn) => React.JSX.Element } {
  switch ((topic || "").toLowerCase()) {
    case "algebra":
      return { tile: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300", label: "text-blue-600 dark:text-blue-300", Icon: Fx };
    case "calculus":
      return { tile: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300", label: "text-violet-600 dark:text-violet-300", Icon: InfinityIcon };
    case "geometry":
      return { tile: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300", label: "text-emerald-600 dark:text-emerald-300", Icon: Triangle };
    case "statistics":
      return { tile: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300", label: "text-amber-600 dark:text-amber-300", Icon: Chart };
    default:
      return { tile: "bg-surface-2 text-muted", label: "text-muted", Icon: Fx };
  }
}

/* ---- icons ---- */
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
function Bookmark({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><path d="M6 4h12v17l-6-4-6 4z" /></svg>);
}
function Fx({ className = "" }: Icn) {
  return (<svg {...sv} strokeWidth={1.6} className={className}><path d="M5 7c0-1.5 1-2.5 2.5-2.5M4.5 12h5M5 19V9" /><path d="M13 9l6 6M19 9l-6 6" /></svg>);
}
function InfinityIcon({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><path d="M7 9a3 3 0 1 0 0 6c2 0 3-3 5-3s3 3 5 3a3 3 0 1 0 0-6c-2 0-3 3-5 3s-3-3-5-3z" /></svg>);
}
function Triangle({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><path d="M12 4l9 16H3z" /></svg>);
}
function Chart({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><path d="M5 21V10M12 21V4M19 21v-7" /></svg>);
}
function Trash({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>);
}