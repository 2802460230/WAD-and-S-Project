"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import katex from "katex";
import "katex/dist/katex.min.css";

interface Step {
  step: number;
  explanation: string;
  result: string;
}

interface Solution {
  topic: string;
  steps: Step[];
}

function Math({ expr, block = false }: { expr: string; block?: boolean }) {
  try {
    const html = katex.renderToString(expr, {
      throwOnError: false,
      displayMode: block,
      output: "html",
    });
    return (
      <span
        className={block ? "block overflow-x-auto py-1" : "inline"}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return <span>{expr}</span>;
  }
}

// Render a string that may contain LaTeX mixed with plain text.
// Delimiters: $$...$$ (block) and $...$ (inline). If no delimiters but
// the string looks like raw LaTeX, render it as a block expression.
function MathText({ text, className = "" }: { text: string; className?: string }) {
  const hasDelimiters = /\$/.test(text);
  const looksLikeLaTeX = /\\[a-zA-Z{]/.test(text);

  if (!hasDelimiters && looksLikeLaTeX) {
    // Whole string is raw LaTeX — render as a display block
    return (
      <span className={className}>
        <Math expr={text} block />
      </span>
    );
  }

  if (!hasDelimiters) {
    return <span className={className}>{text}</span>;
  }

  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  const combined = /(\$\$[\s\S]+?\$\$|\$(?:[^$]|\\.)+?\$)/g;
  while ((m = combined.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("$$")) {
      parts.push(<Math key={m.index} expr={token.slice(2, -2)} block />);
    } else {
      parts.push(<Math key={m.index} expr={token.slice(1, -1)} />);
    }
    last = m.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));

  return <span className={className}>{parts}</span>;
}

export default function ResultsPage() {
  const router = useRouter();
  const [solution, setSolution] = useState<Solution | null>(null);
  const [problem, setProblem] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [practice, setPractice] = useState<{ id: number; problem: string }[]>([]);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [loadingPractice, setLoadingPractice] = useState(false);
  const [error, setError] = useState("");
  const practiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedSolution = sessionStorage.getItem("solution");
    const storedProblem = sessionStorage.getItem("problem");

    if (!storedSolution) {
      router.push("/dashboard");
      return;
    }

    setSolution(JSON.parse(storedSolution));
    setProblem(storedProblem || "");
  }, [router]);

  const handleBookmark = async () => {
    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId: JSON.parse(sessionStorage.getItem("solution") || "{}").problemId }),
      });

      if (response.ok) {
        setBookmarked(true);
      }
    } catch {
      setError("Failed to bookmark");
    }
  };

  const handlePractice = async () => {
    setLoadingPractice(true);
    try {
      const response = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: solution?.topic }),
      });

      const data = await response.json();
      if (response.ok) {
        setPractice(data.problems);
        setPracticeIndex(0);
        setTimeout(() => practiceRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }
    } catch {
      setError("Failed to load practice problems");
    } finally {
      setLoadingPractice(false);
    }
  };

  const handleCantSolve = () => {
    const current = practice[practiceIndex];
    if (current) {
      sessionStorage.setItem("importProblem", current.problem);
    }
    router.push("/dashboard");
  };

  const handleNextQuestion = () => {
    if (practice.length === 0) return;
    setPracticeIndex((i) => (i + 1) % practice.length);
  };

  if (!solution) {
    return (
      <div className="flex flex-1 items-center justify-center p-10 text-muted">
        Loading…
      </div>
    );
  }

  const finalAnswer = solution.steps[solution.steps.length - 1]?.result;
  const currentPractice = practice[practiceIndex];

  return (
    <>
      {/* Top bar */}
      <header className="flex items-center justify-between gap-4 border-b border-line bg-topbar px-6 py-5 md:px-10">
        <h1 className="flex items-center gap-3 font-display text-2xl font-bold text-ink md:text-3xl">
          <Link
            href="/dashboard"
            aria-label="Back to dashboard"
            className="grid size-9 place-items-center rounded-full text-ink/70 transition hover:bg-black/5 dark:hover:bg-white/5"
          >
            <ArrowLeft className="size-5" />
          </Link>
          Solution
        </h1>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-mint px-4 py-2 text-sm font-semibold text-mint-ink">
            Step-by-step
          </span>
          <span className="relative grid size-10 place-items-center rounded-full text-ink/70">
            <Bell className="size-5" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500" />
          </span>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Solution column */}
          <div className="min-w-0">
            <nav className="mb-4 flex items-center gap-2 text-sm text-muted">
              <Link href="/dashboard" className="hover:text-ink">Dashboard</Link>
              <span>›</span>
              <span className="font-semibold text-ink">Solution</span>
            </nav>

            <span className="inline-flex items-center gap-2 rounded-full bg-mint px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-mint-ink">
              <Fx className="size-4" /> {solution.topic}
            </span>

            <h2 className="mt-3 font-mono text-2xl font-semibold text-ink">
              <MathText text={problem} />
            </h2>

            <ol className="mt-6 space-y-4">
              {solution.steps.map((s) => (
                <li key={s.step} className="overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
                  <div className="flex items-center gap-3 border-b border-line px-5 py-4">
                    <span className="grid size-7 place-items-center rounded-full bg-brand text-sm font-bold text-brand-ink">
                      {s.step}
                    </span>
                    <span className="text-sm font-bold uppercase tracking-wide text-ink">
                      Step {s.step}
                    </span>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-[15px] text-muted">{s.explanation}</p>
                    <div className="mt-3 w-full overflow-x-auto rounded-xl bg-surface-2 px-4 py-3 font-mono text-[15px] font-bold text-ink">
                      <MathText text={s.result} />
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            {/* Final answer */}
            {finalAnswer && (
              <div className="mm-answer mt-4 flex items-center justify-between rounded-2xl px-6 py-5 text-white">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#5ff0c9]">
                    Final answer
                  </p>
                  <div className="mt-1 overflow-x-auto font-mono text-xl">
                    <MathText text={finalAnswer} />
                  </div>
                </div>
                <span className="ml-4 grid size-9 shrink-0 place-items-center rounded-full text-[#5ff0c9] ring-2 ring-[#5ff0c9]">
                  <Check className="size-5" />
                </span>
              </div>
            )}

            {error && (
              <p className="mt-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-300">
                {error}
              </p>
            )}

            {currentPractice && (
              <div ref={practiceRef} className="mt-4 rounded-2xl bg-surface p-5 ring-1 ring-line">
                <h3 className="flex items-center gap-2 font-bold text-ink">
                  <Pencil className="size-4 text-brand" /> Practice problem
                </h3>
                <div className="mt-3 overflow-x-auto rounded-xl bg-surface-2 px-4 py-3 font-mono text-[15px] text-ink">
                  <MathText text={currentPractice.problem} />
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleCantSolve}
                    className="flex-1 rounded-xl border border-line bg-surface-2 px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface"
                  >
                    Can&apos;t solve it?
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    className="flex-1 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-ink transition hover:bg-brand-strong"
                  >
                    Next question
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Actions sidebar */}
          <aside className="space-y-4">
            <div className="rounded-2xl bg-surface p-3 ring-1 ring-line">
              <p className="px-2 pb-2 pt-1 text-xs font-bold uppercase tracking-wide text-muted">
                Actions
              </p>
              <div className="space-y-1">
                <ActionButton onClick={handlePractice} disabled={loadingPractice} Icon={Pencil}>
                  {loadingPractice ? "Loading…" : "Practice"}
                </ActionButton>
                <ActionButton onClick={handleBookmark} disabled={bookmarked} Icon={Bookmark}>
                  {bookmarked ? "Bookmarked ✓" : "Bookmark"}
                </ActionButton>
                <ActionButton onClick={() => router.push("/dashboard")} Icon={Plus}>
                  New problem
                </ActionButton>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

/* ---- Action row button ---- */
function ActionButton({
  onClick,
  disabled,
  Icon,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  Icon: (p: { className?: string }) => React.JSX.Element;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[15px] font-medium text-ink transition hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-mint text-mint-ink">
        <Icon className="size-4" />
      </span>
      {children}
    </button>
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
function ArrowLeft({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>);
}
function Bell({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5 1.5 5h-15S6 13 6 9z" /><path d="M10 18a2 2 0 0 0 4 0" /></svg>);
}
function Fx({ className = "" }: Icn) {
  return (<svg {...sv} strokeWidth={1.6} className={className}><path d="M5 7c0-1.5 1-2.5 2.5-2.5M4.5 12h5M5 19V9" /><path d="M13 9l6 6M19 9l-6 6" /></svg>);
}
function Pencil({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><path d="M16 4l4 4L8 20H4v-4z" /><path d="M13.5 6.5l4 4" /></svg>);
}
function Bookmark({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><path d="M6 4h12v17l-6-4-6 4z" /></svg>);
}
function Check({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><path d="M5 13l4 4 10-11" /></svg>);
}
function Plus({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><path d="M12 5v14M5 12h14" /></svg>);
}
