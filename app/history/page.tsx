"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();

  // Temporary placeholder data (real data from API in Week 5)
  const history = [
    { id: 1, problem: "Solve x² + 5x + 6 = 0", topic: "Algebra", date: "2026-04-18" },
    { id: 2, problem: "Find the derivative of x³ + 2x", topic: "Calculus", date: "2026-04-17" },
    { id: 3, problem: "Simplify (2x + 3)(x - 1)", topic: "Algebra", date: "2026-04-16" },
  ];

  return (
    <main className="min-h-screen p-8">
      <nav className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">MathMentor</h1>
        <div className="flex gap-4 text-sm">
          <Link href="/dashboard" className="underline">Dashboard</Link>
          <Link href="/bookmarks" className="underline">Bookmarks</Link>
          <Link href="/profile" className="underline">Profile</Link>
        </div>
      </nav>

      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Problem History</h2>

        {history.length === 0 ? (
          <p className="text-gray-500">No problems solved yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => router.push("/results")}
              >
                <p className="text-xs text-gray-400 mb-1">{item.date} · {item.topic}</p>
                <p className="text-sm font-medium">{item.problem}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}