"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import katex from "katex";
import "katex/dist/katex.min.css";

const EXAMPLES = ["x² + 5x + 6 = 0", "∫ 2x dx", "Simplify (2x+3)(x-1)", "d/dx [x³+2x]"];
const TOPICS = ["Auto-detect", "Algebra", "Calculus", "Geometry"];

export default function DashboardPage() {
  const router = useRouter();
  const [inputType, setInputType] = useState<"text" | "image">("text");
  const [problem, setProblem] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("Auto-detect");
  const [hints, setHints] = useState<string[]>([]);
  const [loadingHints, setLoadingHints] = useState(false);
  const hintsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const imported = sessionStorage.getItem("importProblem");
    if (imported) {
      setProblem(imported);
      sessionStorage.removeItem("importProblem");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (inputType === "text" && !problem.trim()) {
      setError("Please enter a math problem");
      return;
    }
    if (inputType === "image" && !image) {
      setError("Please upload an image");
      return;
    }

    setLoading(true);

    try {
      let problemText = problem;

      // If image input, run OCR first
      if (inputType === "image" && image) {
        const formData = new FormData();
        formData.append("image", image);

        const ocrResponse = await fetch("/api/ocr", {
          method: "POST",
          body: formData,
        });

        const ocrData = await ocrResponse.json();

        if (!ocrResponse.ok) {
          setError(ocrData.error || "Failed to extract text from image");
          return;
        }

        problemText = ocrData.extractedText;
      }

      // Send to solve
      const solveResponse = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: problemText }),
      });

      const solveData = await solveResponse.json();

      if (!solveResponse.ok) {
        setError(solveData.error || "Failed to solve problem");
        return;
      }

      // Store solution in sessionStorage for results page
      sessionStorage.setItem("solution", JSON.stringify(solveData));
      sessionStorage.setItem("problem", problemText);

      router.push("/results");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleHints = async () => {
    if (!problem.trim()) {
      setError("Please enter a math problem first");
      return;
    }
    setError("");
    setLoadingHints(true);
    try {
      const response = await fetch("/api/hints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem }),
      });
      const data = await response.json();
      if (response.ok) {
        setHints(data.hints);
        setTimeout(() => hintsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      } else {
        setError(data.error || "Failed to load hints");
      }
    } catch {
      setError("Failed to load hints");
    } finally {
      setLoadingHints(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setError("Only JPG and PNG images are allowed");
      return;
    }
    setImage(file);
    setError("");
  };

  return (
    <>
      {/* Top bar */}
      <header className="flex items-center justify-between gap-4 border-b border-line bg-topbar px-6 py-5 md:px-10">
        <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">Submit a problem</h1>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-mint px-4 py-2 text-sm font-semibold text-mint-ink">
            AI-powered
          </span>
          <span className="relative grid size-10 place-items-center rounded-full text-ink/70">
            <Bell className="size-5" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500" />
          </span>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-4xl">
          {/* Text / Image toggle */}
          <div className="inline-flex rounded-2xl bg-surface-2 p-1.5 ring-1 ring-line">
            <button
              type="button"
              onClick={() => { setInputType("text"); setError(""); }}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[15px] font-medium transition ${
                inputType === "text" ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              <Pencil className="size-4" /> Text
            </button>
            <button
              type="button"
              onClick={() => { setInputType("image"); setError(""); }}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[15px] font-medium transition ${
                inputType === "image" ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              <Camera className="size-4" /> Image
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {inputType === "text" ? (
              <>
                <h2 className="mb-3 mt-6 text-lg font-semibold text-ink">Math problem</h2>
                <textarea
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="e.g.  Solve x² + 5x + 6 = 0"
                  rows={5}
                  maxLength={500}
                  className="w-full resize-none rounded-2xl bg-surface px-6 py-5 font-mono text-[15px] text-ink placeholder:text-muted/70 outline-none ring-1 ring-line transition focus:ring-2 focus:ring-brand"
                />
                <p className={`mt-1.5 text-right text-xs ${problem.length >= 450 ? "text-rose-500" : "text-muted"}`}>
                  {problem.length}/500
                </p>

                <p className="mb-3 mt-6 text-sm text-muted">Try an example:</p>
                <div className="flex flex-wrap gap-3">
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      type="button"
                      onClick={() => setProblem(ex)}
                      className="rounded-xl bg-surface px-4 py-2.5 font-mono text-sm text-ink ring-1 ring-line transition hover:ring-brand"
                    >
                      {ex}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="text-sm text-muted">Topic:</span>
                  {TOPICS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTopic(t)}
                      className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                        topic === t
                          ? "bg-ink text-bg"
                          : "bg-surface text-ink ring-1 ring-line hover:ring-brand"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <label
                  htmlFor="image-upload"
                  className="mt-6 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-line bg-surface-2/60 px-6 py-16 text-center transition hover:border-brand"
                >
                  <ImageUp className="size-9 text-muted" />
                  <p className="text-lg font-semibold text-ink">Drop your image here</p>
                  <p className="text-sm text-muted">PNG, JPG — max 10 MB</p>
                  <span className="mt-2 rounded-full bg-surface px-5 py-2.5 text-sm font-semibold text-ink ring-1 ring-line">
                    Browse files
                  </span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {image && <p className="mt-2 text-sm text-muted">{image.name}</p>}

                <div className="mt-5 rounded-2xl bg-mint/60 px-5 py-4 ring-1 ring-brand/20">
                  <p className="flex items-center gap-2 font-semibold text-mint-ink">
                    <Lightbulb className="size-4" /> Photo tips for best results
                  </p>
                  <p className="mt-1 text-sm text-mint-ink/80">
                    Good lighting, centred problem, no shadows. Handwritten or printed both work well.
                  </p>
                </div>
              </>
            )}

            {error && (
              <p className="mt-5 rounded-xl bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-5 text-lg font-bold text-brand-ink shadow-lg shadow-emerald-900/20 transition hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Sparkles className="size-5" /> {loading ? "Solving…" : "Solve Problem"}
            </button>

            <button
              type="button"
              onClick={handleHints}
              disabled={loadingHints}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-4 text-[15px] font-semibold text-ink transition hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Lightbulb className="size-5" /> {loadingHints ? "Loading hints…" : "Get hints"}
            </button>
          </form>

          {hints.length > 0 && (
            <div ref={hintsRef} className="mt-6 rounded-2xl bg-surface p-5 ring-1 ring-line">
              <h3 className="flex items-center gap-2 font-bold text-ink">
                <Lightbulb className="size-4 text-brand" /> Hints
              </h3>
              <ul className="mt-2 space-y-1.5">
                {hints.map((hint, i) => (
                  <li key={i} className="text-[15px] text-muted">• <MathText text={hint} /></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

/* ---- Math rendering ---- */
function MathSpan({ expr, block = false }: { expr: string; block?: boolean }) {
  try {
    const html = katex.renderToString(expr, { throwOnError: false, displayMode: block, output: "html" });
    return <span className={block ? "block overflow-x-auto py-1" : "inline"} dangerouslySetInnerHTML={{ __html: html }} />;
  } catch {
    return <span>{expr}</span>;
  }
}

function MathText({ text, className = "" }: { text: string; className?: string }) {
  const looksLikeLaTeX = /\\[a-zA-Z{]/.test(text);
  if (!/\$/.test(text) && looksLikeLaTeX) {
    return <span className={className}><MathSpan expr={text} block /></span>;
  }
  if (!/\$/.test(text)) return <span className={className}>{text}</span>;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  const re = /(\$\$[\s\S]+?\$\$|\$(?:[^$]|\\.)+?\$)/g;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("$$")) parts.push(<MathSpan key={m.index} expr={token.slice(2, -2)} block />);
    else parts.push(<MathSpan key={m.index} expr={token.slice(1, -1)} />);
    last = m.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <span className={className}>{parts}</span>;
}

/* ---- icons used by this page (sidebar/logout/toggle live in the layout) ---- */
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
function Pencil({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><path d="M16 4l4 4L8 20H4v-4z" /><path d="M13.5 6.5l4 4" /></svg>);
}
function Camera({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><path d="M3 8h3l2-2.5h8L18 8h3v11H3z" /><circle cx="12" cy="13" r="3.2" /></svg>);
}
function ImageUp({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><rect x="3" y="4" width="18" height="16" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M5 19l5-5 3 3" /><path d="M14 14l2-2 3 3" /></svg>);
}
function Lightbulb({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z" /></svg>);
}
function Sparkles({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z" /><path d="M18 15l.7 1.8L20.5 17.5l-1.8.7L18 20l-.7-1.8L15.5 17.5l1.8-.7z" /></svg>);
}