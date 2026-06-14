"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Solve a problem", Icon: Calculator },
  { href: "/history", label: "History", Icon: Clock },
  { href: "/bookmarks", label: "Bookmarks", Icon: Bookmark },
  { href: "/profile", label: "Profile", Icon: UserCircle },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => { if (d.email) setEmail(d.email); })
      .catch(() => {});
  }, []);

  const emailInitials = email
    ? email.split("@")[0].slice(0, 2).toUpperCase()
    : "??";

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar — rendered once, persists across navigation */}
      <aside className="mm-sidebar hidden w-72 shrink-0 flex-col px-4 py-6 text-white/90 md:flex">
        <Link href="/" className="mb-8 flex items-center gap-1 px-2">
          <LogoArrow className="size-6" />
          <span className="font-display text-2xl italic tracking-tight text-white">MathMentor</span>
        </Link>

        <p className="px-3 pb-3 font-display text-lg italic text-white/45">Menu</p>

        <nav className="flex flex-col gap-1.5">
          {NAV.map(({ href, label, Icon }) => {
            const active =
              pathname === href ||
              (href === "/dashboard" && pathname.startsWith("/results"));
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] transition ${
                  active
                    ? "bg-[#0a5849]/70 font-semibold text-[#4ff0c7] ring-1 ring-[#1fae8b]/40"
                    : "text-white/65 hover:bg-white/5 hover:text-white"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-7 -translate-y-1/2 rounded-full border-l-[3px] border-[#00c897]" />
                )}
                <Icon className="size-5" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex items-center gap-3 rounded-2xl px-2 pt-6">
          <span className="grid size-10 place-items-center rounded-full bg-[#00c897]/15 font-semibold text-[#4ff0c7] ring-1 ring-[#00c897]/40">
            {emailInitials}
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold text-white">{email}</p>
            <p className="text-xs text-white/50">Free Plan</p>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="grid size-9 place-items-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </aside>

      {/* Content column — each page renders its own <header> + <main> */}
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>

      <ThemeToggle />
    </div>
  );
}

/* ===================== Inlined icons / theme toggle ===================== */
type Icn = { className?: string };
const sv = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

function LogoArrow({ className = "" }: Icn) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#00c897" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 20L20 4" /><path d="M13 4h7v7" />
    </svg>
  );
}
function Calculator({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><rect x="4" y="3" width="16" height="18" rx="2.5" /><path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v2M8 19h4" /></svg>);
}
function Clock({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><path d="M3 9a9 9 0 1 0 3-4.5" /><path d="M3 4v4h4" /><path d="M12 8v4l3 2" /></svg>);
}
function Bookmark({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><path d="M6 4h12v17l-6-4-6 4z" /></svg>);
}
function UserCircle({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="10" r="3" /><path d="M6.5 19a6 6 0 0 1 11 0" /></svg>);
}
function LogOut({ className = "" }: Icn) {
  return (<svg {...sv} className={className}><path d="M14 4H6v16h8" /><path d="M11 12h9M17 8l4 4-4 4" /></svg>);
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => { setDark(document.documentElement.classList.contains("dark")); }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("mm-theme", next ? "dark" : "light"); } catch {}
  };
  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed bottom-6 right-6 z-20 inline-flex items-center gap-2 rounded-full bg-surface/90 px-4 py-2 text-sm font-medium text-ink shadow-md ring-1 ring-line backdrop-blur transition hover:bg-surface"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-4 text-amber-500">
        {dark ? (<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" /></>) : (<path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z" />)}
      </svg>
      {dark ? "Light" : "Dark"}
    </button>
  );
}