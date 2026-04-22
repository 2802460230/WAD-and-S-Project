"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Step {
  step: number;
  explanation: string;
  result: string;
}

interface Solution {
  topic: string;
  steps: Step[];
}

export default function ResultsPage() {
  const router = useRouter();
  const [solution, setSolution] = useState<Solution | null>(null);
  const [problem, setProblem] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const [practice, setPractice] = useState<{ id: number; problem: string }[]>([]);
  const [loadingHints, setLoadingHints] = useState(false);
  const [loadingPractice, setLoadingPractice] = useState(false);
  const [error, setError] = useState("");

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

  const handleHints = async () => {
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
      }
    } catch {
      setError("Failed to load hints");
    } finally {
      setLoadingHints(false);
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
      }
    } catch {
      setError("Failed to load practice problems");
    } finally {
      setLoadingPractice(false);
    }
  };

  if (!solution) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen p-8">
      <nav className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">MathMentor</h1>
        <div className="flex gap-4 text-sm">
          <Link href="/history" className="underline">History</Link>
          <Link href="/bookmarks" className="underline">Bookmarks</Link>
          <Link href="/profile" className="underline">Profile</Link>
        </div>
      </nav>

      <div className="max-w-xl mx-auto">
        <p className="text-sm text-gray-500 mb-1">Topic: {solution.topic}</p>
        <h2 className="text-xl font-bold mb-6">{problem}</h2>

        <div className="flex flex-col gap-4 mb-8">
          {solution.steps.map((s) => (
            <div key={s.step} className="border border-gray-200 rounded p-4">
              <p className="text-sm text-gray-500 mb-1">Step {s.step}</p>
              <p className="text-sm mb-2">{s.explanation}</p>
              <p className="font-mono font-bold">{s.result}</p>
            </div>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {hints.length > 0 && (
          <div className="border border-gray-200 rounded p-4 mb-4">
            <h3 className="font-bold mb-2">Hints</h3>
            {hints.map((hint, i) => (
              <p key={i} className="text-sm mb-1">• {hint}</p>
            ))}
          </div>
        )}

        {practice.length > 0 && (
          <div className="border border-gray-200 rounded p-4 mb-4">
            <h3 className="font-bold mb-2">Practice Problems</h3>
            {practice.map((p) => (
              <p key={p.id} className="text-sm mb-1">• {p.problem}</p>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleHints}
            disabled={loadingHints}
            className="w-full border border-gray-900 py-2 rounded disabled:opacity-50"
          >
            {loadingHints ? "Loading hints..." : "View Hints"}
          </button>
          <button
            onClick={handlePractice}
            disabled={loadingPractice}
            className="w-full border border-gray-900 py-2 rounded disabled:opacity-50"
          >
            {loadingPractice ? "Loading..." : "View Practice Problems"}
          </button>
          <button
            onClick={handleBookmark}
            disabled={bookmarked}
            className="w-full border border-gray-900 py-2 rounded disabled:opacity-50"
          >
            {bookmarked ? "Bookmarked ✓" : "Bookmark"}
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-gray-900 text-white py-2 rounded"
          >
            Solve Another Problem
          </button>
        </div>
      </div>
    </main>
  );
}