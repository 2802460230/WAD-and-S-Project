"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [inputType, setInputType] = useState<"text" | "image">("text");
  const [problem, setProblem] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
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

    // Temporary: navigate to results (backend wired in Week 5)
    router.push("/results");
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
        <h2 className="text-2xl font-bold mb-6">Submit a Problem</h2>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => { setInputType("text"); setError(""); }}
            className={`px-4 py-2 border rounded ${inputType === "text" ? "bg-gray-900 text-white" : ""}`}
          >
            Text
          </button>
          <button
            onClick={() => { setInputType("image"); setError(""); }}
            className={`px-4 py-2 border rounded ${inputType === "image" ? "bg-gray-900 text-white" : ""}`}
          >
            Image
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {inputType === "text" ? (
            <div>
              <label className="block text-sm mb-1">Math Problem</label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 h-32"
                placeholder="e.g. Solve x² + 5x + 6 = 0"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm mb-1">Upload Image</label>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              {image && <p className="text-sm text-gray-500 mt-1">{image.name}</p>}
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2 rounded"
          >
            Solve
          </button>
        </form>
      </div>
    </main>
  );
}