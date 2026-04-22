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

  const handleBookmarkClick = (bookmark: BookmarkedProblem) => {
    if (bookmark.problem?.solution) {
      sessionStorage.setItem("solution", JSON.stringify(bookmark.problem.solution));
      sessionStorage.setItem("problem", bookmark.problem.content);
      router.push("/results");
    }
  };

  return (
    <main className="min-h-screen p-8">
      <nav className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">MathMentor</h1>
        <div className="flex gap-4 text-sm">
          <Link href="/dashboard" className="underline">Dashboard</Link>
          <Link href="/history" className="underline">History</Link>
          <Link href="/profile" className="underline">Profile</Link>
        </div>
      </nav>

      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Bookmarks</h2>

        {loading && <p className="text-gray-500">Loading bookmarks...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && bookmarks.length === 0 && (
          <p className="text-gray-500">No bookmarks yet.</p>
        )}

        {!loading && bookmarks.length > 0 && (
          <div className="flex flex-col gap-3">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="border border-gray-200 rounded p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => handleBookmarkClick(bookmark)}
              >
                <p className="text-xs text-gray-400 mb-1">
                  {new Date(bookmark.problem.createdAt).toLocaleDateString()} · {bookmark.problem.topic}
                </p>
                <p className="text-sm font-medium">{bookmark.problem.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}