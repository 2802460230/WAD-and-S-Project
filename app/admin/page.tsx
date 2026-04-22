"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
}

interface AILog {
  id: string;
  user: string;
  type: string;
  createdAt: string;
}

interface SystemLog {
  id: string;
  user: string;
  action: string;
  createdAt: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [aiLogs, setAiLogs] = useState<AILog[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [activeTab, setActiveTab] = useState<"users" | "ai" | "logs">("users");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin/users");
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to load admin data");
          return;
        }

        setUsers(data.users || []);
        setAiLogs(data.aiLogs || []);
        setSystemLogs(data.systemLogs || []);
      } catch {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && activeTab === "users" && (
          <div className="flex flex-col gap-3">
            {users.length === 0 && <p className="text-gray-500">No users found.</p>}
            {users.map((user) => (
              <div key={user.id} className="border border-gray-200 rounded p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{user.name || user.email}</p>
                  <p className="text-xs text-gray-400">{user.email} · {user.role} · joined {new Date(user.createdAt).toLocaleDateString()}</p>
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

        {!loading && activeTab === "ai" && (
          <div className="flex flex-col gap-3">
            {aiLogs.length === 0 && <p className="text-gray-500">No AI usage logs found.</p>}
            {aiLogs.map((log) => (
              <div key={log.id} className="border border-gray-200 rounded p-4">
                <p className="text-xs text-gray-400 mb-1">{new Date(log.createdAt).toLocaleString()}</p>
                <p className="text-sm font-medium">{log.user}</p>
                <p className="text-xs text-gray-500">Type: {log.type}</p>
              </div>
            ))}
          </div>
        )}

        {!loading && activeTab === "logs" && (
          <div className="flex flex-col gap-3">
            {systemLogs.length === 0 && <p className="text-gray-500">No system logs found.</p>}
            {systemLogs.map((log) => (
              <div key={log.id} className="border border-gray-200 rounded p-4">
                <p className="text-xs text-gray-400 mb-1">{new Date(log.createdAt).toLocaleString()}</p>
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