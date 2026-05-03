"use client";
import Link from "next/link";
import { useTheme } from "@/lib/context/ThemeContext";

interface TopBarProps {
  title?: string;
  subtitle?: string;
  backHref?: string;
  rightSlot?: React.ReactNode;
  showThemeToggle?: boolean;
}

export function TopBar({ title, subtitle, backHref, rightSlot, showThemeToggle }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className="flex items-center px-4 py-3 gap-3"
      style={{
        background: "var(--color-panel)",
        borderBottom: "1px solid var(--color-hairline)",
        minHeight: 56,
      }}
    >
      {backHref && (
        <Link href={backHref} className="flex items-center justify-center w-8 h-8 -ml-1" style={{ color: "var(--color-ai)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
      )}
      <div className="flex-1 min-w-0">
        {title && <div style={{ fontSize: 16, fontWeight: 600, color: "var(--color-ink)" }} className="truncate">{title}</div>}
        {subtitle && <div style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 1 }}>{subtitle}</div>}
      </div>
      {showThemeToggle && (
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-full"
          style={{ background: "var(--color-chip)", color: "var(--color-muted)" }}
          title={theme === "dark" ? "Switch to light" : "Switch to dark"}
        >
          {theme === "dark" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
        </button>
      )}
      {rightSlot}
    </div>
  );
}
