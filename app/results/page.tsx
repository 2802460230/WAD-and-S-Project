"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResultsPage() {
  const router = useRouter();

  // Temporary placeholder solution (real data comes from API in Week 5)
  const solution = {
    problem: "Solve x² + 5x + 6 = 0",
    topic: "Algebra",
    steps: [
      {
        step: 1,
        explanation: "Factor the quadratic expression",
        result: "(x + 2)(x + 3) = 0",
      },
      {
        step: 2,
        explanation: "Set each factor equal to zero",
        result: "x + 2 = 0 or x + 3 = 0",
      },
      {
        step: 3,
        explanation: "Solve for x in each equation",
        result: "x = -2 or x = -3",
      },
    ],
  };

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
        <h2 className="text-xl font-bold mb-6">{solution.problem}</h2>

        <div className="flex flex-col gap-4 mb-8">
          {solution.steps.map((s) => (
            <div key={s.step} className="border border-gray-200 rounded p-4">
              <p className="text-sm text-gray-500 mb-1">Step {s.step}</p>
              <p className="text-sm mb-2">{s.explanation}</p>
              <p className="font-mono font-bold">{s.result}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <button className="w-full border border-gray-900 py-2 rounded">
            View Hints
          </button>
          <button className="w-full border border-gray-900 py-2 rounded">
            View Practice Problems
          </button>
          <button className="w-full border border-gray-900 py-2 rounded">
            Bookmark
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