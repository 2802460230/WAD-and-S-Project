"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminPage() {
  // Temporary placeholder data (real data from API in Week 8)
  const [users] = useState([
    { id: 1, name: "Jack J. Jackson", email: "jack@email.com", role: "student", problems: 12 },
    { id: 2, name: "Sarah Lee", email: "sarah@email.com", role: "student", problems: 8 },
    { id: 3, name: "Ahmad Rizki", email: "ahmad@email.com", role: "student", problems: 23 },
  ]);

  const [logs] = useState([
    { id: 1, user: "jack@email.com", action: "Solved problem", timestamp: "2026-04-18 09:12" },
    { id: 2, user: "sarah@email.com", action: "Viewed hints", timestamp: "2026-04-18 08:45" },
    { id: 3, user: "ahmad@email.com", action: "Bookmarked problem", timestamp: "2026-04-18 08:30" },
  ]);

  const [aiLogs] = useState([
    { id: 1, user: "jack@email.com", type: "Solve", tokens: 320, timestamp: "2026-04-18 09:12" },
    { id: 2, user: "sarah@email.com", type: "Hints", tokens: 180, timestamp: "2026-04-18 08:45" },
    { id: 3, user: "ahmad@email.com", type: "OCR", tokens: 210, timestamp: "2026-04-18 08:30" },
  ]);

  const [activeTab, setActiveTab] = useState<"users" | "ai" | "logs">("users");

  return (
    <main className="min-h-screen p-8">
      <nav className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">MathMentor — Admin</h1>
        <Link href="/dashboard" className="text-sm underline">
          Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["users", "ai", "logs"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 border rounded capitalize ${
                activeTab === tab ? "bg-gray-900 text-white" : ""
              }`}
            >
              {tab === "ai" ? "AI Usage" : tab === "logs" ? "System Logs" : "Users"}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="flex flex-col gap-3">
            {users.map((user) => (
              <div key={user.id} className="border border-gray-200 rounded p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email} · {user.problems} problems solved</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-sm border border-gray-300 px-3 py-1 rounded">
                    Ban
                  </button>
                  <button className="text-sm border border-red-300 text-red-600 px-3 py-1 rounded">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Usage Tab */}
        {activeTab === "ai" && (
          <div className="flex flex-col gap-3">
            {aiLogs.map((log) => (
              <div key={log.id} className="border border-gray-200 rounded p-4">
                <p className="text-xs text-gray-400 mb-1">{log.timestamp}</p>
                <p className="text-sm font-medium">{log.user}</p>
                <p className="text-xs text-gray-500">Type: {log.type} · Tokens: {log.tokens}</p>
              </div>
            ))}
          </div>
        )}

        {/* System Logs Tab */}
        {activeTab === "logs" && (
          <div className="flex flex-col gap-3">
            {logs.map((log) => (
              <div key={log.id} className="border border-gray-200 rounded p-4">
                <p className="text-xs text-gray-400 mb-1">{log.timestamp}</p>
                <p className="text-sm font-medium">{log.user}</p>
                <p className="text-xs text-gray-500">{log.action}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}