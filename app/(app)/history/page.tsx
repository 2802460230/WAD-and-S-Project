"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Problem {
  id: string;
  content: string;
  topic: string;
  createdAt: string;
  solution?: {
    steps: { step: number; explanation: string; result: string }[];
    topic: string;
  };
}

const FILTERS = ["All", "Algebra", "Calculus", "Geometry", "Statistics"];

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/history");
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to load history");
          return;
        }

        setHistory(data);
      } catch {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleProblemClick = (problem: Problem) => {
    if (problem.solution) {
      sessionStorage.setItem("solution", JSON.stringify(problem.solution));
      sessionStorage.setItem("problem", problem.content);
      router.push("/results");
    }
  };

  const rows =
    filter === "All"
      ? history
      : history.filter((h) => (h.topic || "").toLowerCase() === filter.toLowerCase());

  return (
    <>
      {/* Top bar */}
      <header className="flex items-center justify-between gap-4 border-b border-line bg-topbar px-6 py-5 md:px-10">
        <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">History</h1>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-mint px-4 py-2 text-sm font-semibold text-mint-ink">
            Step-by-step
          </span>
          {/* Visual only — no export endpoint wired yet */}
          <button className="rounded-full bg-surface px-5 py-2 text-sm font-semibold text-ink ring-1 ring-line transition hover:ring-brand">
            Export
          </button>
          <span className="relative grid size-10 place-items-center rounded-full text-ink/70">
            <Bell className="size-5" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500" />
          </span>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-4xl">
          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-3">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  filter === f
                    ? "bg-ink text-bg"
                    : "bg-surface text-ink ring-1 ring-line hover:ring-brand"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {loading && <p className="text-muted">Loading history…</p>}

          {error && (
            <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-300">
              {error}
            </p>
          )}

          {!loading && !error && history.length === 0 && (
            <p className="text-muted">No problems solved yet.</p>
          )}

          {!loading && !error && history.length > 0 && rows.length === 0 && (
            <p className="text-muted">No problems in this category.</p>
          )}

          {!loading && rows.length > 0 && (
            <div className="space-y-4">
              {rows.map((item) => {
                const s = topicStyle(item.topic);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleProblemClick(item)}
                    className="flex cursor-pointer items-center gap-4 rounded-2xl bg-surface px-5 py-4 ring-1 ring-line transition hover:ring-brand"
                  >
                    <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${s.tile}`}>
                      <s.Icon className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-bold uppercase tracking-wide ${s.label}`}>
                        {item.topic}
                      </p>
                      <p className="truncate font-mono text-[15px] text-ink">{item.content}</p>
                    </div>
                    <span className="hidden shrink-0 text-sm text-muted sm:block">
                      {formatDate(item.createdAt)}
                    </span>
                    <ChevronRight className="size-4 shrink-0 text-muted" />
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
    : d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
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
function ChevronRight({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><path d="M9 6l6 6-6 6" /></svg>);
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