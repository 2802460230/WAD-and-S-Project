"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

        {loading && <p className="text-gray-500">Loading history...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && history.length === 0 && (
          <p className="text-gray-500">No problems solved yet.</p>
        )}

        {!loading && history.length > 0 && (
          <div className="flex flex-col gap-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => handleProblemClick(item)}
              >
                <p className="text-xs text-gray-400 mb-1">
                  {new Date(item.createdAt).toLocaleDateString()} · {item.topic}
                </p>
                <p className="text-sm font-medium">{item.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}