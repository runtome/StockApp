"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/context/AuthContext";
import { apiLogin } from "@/lib/api/auth-api";

const input: React.CSSProperties = {
  width: "100%", padding: "12px 14px", borderRadius: 12, fontSize: 14,
  background: "var(--color-panel)", border: "1px solid var(--color-hairline)",
  color: "var(--color-ink)", outline: "none", boxSizing: "border-box",
};

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => { if (user) router.replace("/markets"); }, [user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiLogin(email, password);
      login(data.token, { name: data.name, email: data.email });
      router.replace("/markets");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ paddingTop: 56, paddingBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--color-ai)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
              <path d="M12 2 14.39 8.25 21 9.27l-4.78 4.66L17.27 21 12 17.77 6.73 21l1.05-7.07L3 9.27l6.61-1.02z" />
            </svg>
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "var(--color-ink)", letterSpacing: -0.5 }}>Sign in</div>
          <div style={{ fontSize: 13, color: "var(--color-muted)", marginTop: 4 }}>เข้าสู่ระบบ Thai Stock AI</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-muted)", marginBottom: 6 }}>EMAIL · อีเมล</div>
            <input style={input} type="email" placeholder="you@example.com" value={email}
              onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-muted)", marginBottom: 6 }}>PASSWORD · รหัสผ่าน</div>
            <div style={{ position: "relative" }}>
              <input style={{ ...input, paddingRight: 44 }} type={showPw ? "text" : "password"}
                placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-muted)", padding: 4 }}>
                {showPw
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                }
              </button>
            </div>
          </div>

          {error && (
            <div style={{ padding: "10px 14px", background: "var(--color-down-bg)", borderRadius: 10, fontSize: 13, color: "var(--color-down)", fontWeight: 500 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{ marginTop: 8, padding: "14px", background: loading ? "var(--color-muted2)" : "var(--color-ai)", borderRadius: 14, border: "none", cursor: loading ? "not-allowed" : "pointer", fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: 0.2 }}>
            {loading ? "Signing in..." : "Sign In · เข้าสู่ระบบ"}
          </button>

          <div style={{ textAlign: "center", fontSize: 13, color: "var(--color-muted)", marginTop: 4 }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={{ color: "var(--color-ai)", fontWeight: 600, textDecoration: "none" }}>
              Register · สมัครสมาชิก
            </Link>
          </div>

          <div style={{ textAlign: "center", marginTop: "auto", paddingBottom: 32 }}>
            <Link href="/markets" style={{ fontSize: 12, color: "var(--color-muted2)", textDecoration: "none" }}>
              Continue without account · ดำเนินการโดยไม่ลงทะเบียน
            </Link>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
