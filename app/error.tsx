"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Application error:", error.digest);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-gray-500 mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2 bg-gray-900 text-white rounded"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 border border-gray-900 rounded"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </main>
  );
}