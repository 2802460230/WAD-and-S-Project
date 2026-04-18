import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">MathMentor</h1>
      <p className="text-lg text-gray-600 mb-8">
        AI-powered math problem solver. Step-by-step solutions instantly.
      </p>
      <div className="flex gap-4">
        <Link href="/login">
          <button className="px-6 py-3 border border-gray-900 rounded">
            Login
          </button>
        </Link>
        <Link href="/register">
          <button className="px-6 py-3 bg-gray-900 text-white rounded">
            Register
          </button>
        </Link>
      </div>
    </main>
  );
}