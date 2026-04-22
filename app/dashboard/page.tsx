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
  const [loading, setLoading] = useState(false);

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

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <main className="min-h-screen p-8">
      <nav className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">MathMentor</h1>
        <div className="flex gap-4 text-sm">
          <Link href="/history" className="underline">History</Link>
          <Link href="/bookmarks" className="underline">Bookmarks</Link>
          <Link href="/profile" className="underline">Profile</Link>
          <button onClick={handleLogout} className="underline">Logout</button>
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
              <label htmlFor="image-upload" className="block text-sm mb-1">Upload Image</label>
              <input
                id="image-upload"
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
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Solving..." : "Solve"}
          </button>
        </form>
      </div>
    </main>
  );
}