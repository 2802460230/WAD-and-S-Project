"use client";

import { useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  // Temporary placeholder data (real data from API in Week 8)
  const [name, setName] = useState("Jack J. Jackson");
  const [email, setEmail] = useState("jack@email.com");
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
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

    // Temporary: just close edit mode (real save in Week 8)
    setIsEditing(false);
    setSuccess("Profile updated successfully");
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
              <p className="font-medium">{name}</p>
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
              onClick={() => {}}
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
              className="w-full bg-gray-900 text-white py-2 rounded"
            >
              Save Changes
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