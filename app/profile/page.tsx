"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to load profile");
          return;
        }

        setEmail(data.email);
        setName(data.name || "");
      } catch {
        setError("Something went wrong");
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update profile");
        return;
      }

      setIsEditing(false);
      setSuccess("Profile updated successfully");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
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
          <Link href="/dashboard" className="underline">Dashboard</Link>
          <Link href="/history" className="underline">History</Link>
          <Link href="/bookmarks" className="underline">Bookmarks</Link>
        </div>
      </nav>

      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Profile</h2>

        {!isEditing ? (
          <div className="flex flex-col gap-4">
            <div className="border border-gray-200 rounded p-4">
              <p className="text-xs text-gray-400 mb-1">Name</p>
              <p className="font-medium">{name || "Not set"}</p>
            </div>
            <div className="border border-gray-200 rounded p-4">
              <p className="text-xs text-gray-400 mb-1">Email</p>
              <p className="font-medium">{email}</p>
            </div>
            {success && <p className="text-green-600 text-sm">{success}</p>}
            <button
              onClick={() => setIsEditing(true)}
              className="w-full border border-gray-900 py-2 rounded"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-gray-900 text-white py-2 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-2 rounded disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="w-full border border-gray-300 py-2 rounded"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </main>
  );
}