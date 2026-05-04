"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

const tabs = [
  {
    id: "markets",
    href: "/markets",
    label: "Markets",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: "search",
    href: "/search",
    label: "Search",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    id: "forecast",
    href: "/stocks/AOT/forecast",
    label: "Forecast",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: "watchlist",
    href: "/watchlist",
    label: "Watchlist",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
  },
  {
    id: "portfolio",
    href: "/portfolio",
    label: "Portfolio",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
];

export function BottomTabBar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (tab: typeof tabs[0]) => {
    if (tab.id === "forecast") return pathname.includes("/forecast");
    if (tab.id === "markets") return pathname === "/markets" || pathname === "/";
    if (tab.id === "search") return pathname === "/search";
    return pathname.startsWith(tab.href);
  };

  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex items-center justify-around"
      style={{
        height: 72,
        background: "var(--color-panel)",
        borderTop: "1px solid var(--color-hairline)",
        paddingBottom: 8,
      }}
    >
      {/* Auth indicator — top-right corner of the tab bar */}
      <Link href={user ? "/markets" : "/login"}
        style={{ position: "absolute", top: 8, right: 10, display: "flex", alignItems: "center", gap: 5, textDecoration: "none" }}>
        {user ? (
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--color-ai)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
        ) : (
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-muted)", background: "var(--color-chip)", padding: "3px 8px", borderRadius: 20 }}>
            Sign in
          </div>
        )}
      </Link>

      {tabs.map((tab) => {
        const active = isActive(tab);
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className="flex flex-col items-center gap-1 px-3 py-2"
            style={{
              color: active ? "var(--color-ai)" : "var(--color-muted)",
              transition: "color 0.15s",
              minWidth: 56,
            }}
          >
            {tab.icon}
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, letterSpacing: 0.3 }}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
