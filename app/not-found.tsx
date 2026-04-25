import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">404 — Page Not Found</h1>
        <p className="text-gray-500 mb-8">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/dashboard"
          className="px-6 py-2 bg-gray-900 text-white rounded"
        >
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}