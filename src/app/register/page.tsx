"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { useAuth } from "@/lib/context/AuthContext";
import { apiRegister } from "@/lib/api/auth-api";

const input: React.CSSProperties = {
  width: "100%", padding: "12px 14px", borderRadius: 12, fontSize: 14,
  background: "var(--color-panel)", border: "1px solid var(--color-hairline)",
  color: "var(--color-ink)", outline: "none", boxSizing: "border-box",
};

function Checkbox({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
      <div onClick={() => onChange(!checked)}
        style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${checked ? "var(--color-ai)" : "var(--color-muted2)"}`, background: checked ? "var(--color-ai)" : "transparent", flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
        {checked && <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><polyline points="1.5,6 5,9.5 10.5,2.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
      <span style={{ fontSize: 12, color: "var(--color-muted)", lineHeight: 1.5 }}>{children}</span>
    </label>
  );
}

export default function RegisterPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [cookies, setCookies] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) router.replace("/markets"); }, [user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (!terms) { setError("You must accept the terms of use"); return; }
    setLoading(true);
    try {
      const data = await apiRegister({ name, email, password, accepted_terms: terms, accepted_cookies: cookies });
      login(data.token, { name: data.name, email: data.email });
      router.replace("/markets");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const eyeIcon = (open: boolean) => open
    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;

  return (
    <PhoneFrame>
      <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", padding: "0 24px", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ paddingTop: 48, paddingBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--color-ai)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
              <path d="M12 2 14.39 8.25 21 9.27l-4.78 4.66L17.27 21 12 17.77 6.73 21l1.05-7.07L3 9.27l6.61-1.02z" />
            </svg>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-ink)", letterSpacing: -0.5 }}>Create account</div>
          <div style={{ fontSize: 13, color: "var(--color-muted)", marginTop: 4 }}>สมัครสมาชิก Thai Stock AI</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 32 }}>
          {/* Name */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-muted)", marginBottom: 6 }}>FULL NAME · ชื่อ</div>
            <input style={input} type="text" placeholder="Your name" value={name}
              onChange={(e) => setName(e.target.value)} required autoComplete="name" />
          </div>

          {/* Email */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-muted)", marginBottom: 6 }}>EMAIL · อีเมล</div>
            <input style={input} type="email" placeholder="you@example.com" value={email}
              onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>

          {/* Password */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-muted)", marginBottom: 6 }}>PASSWORD · รหัสผ่าน <span style={{ fontWeight: 400 }}>(min 8 chars)</span></div>
            <div style={{ position: "relative" }}>
              <input style={{ ...input, paddingRight: 44 }} type={showPw ? "text" : "password"}
                placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-muted)", padding: 4 }}>
                {eyeIcon(showPw)}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-muted)", marginBottom: 6 }}>RE-TYPE PASSWORD · ยืนยันรหัสผ่าน</div>
            <input style={{ ...input, borderColor: confirm && confirm !== password ? "var(--color-down)" : undefined }}
              type="password" placeholder="••••••••" value={confirm}
              onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" />
            {confirm && confirm !== password && (
              <div style={{ fontSize: 11, color: "var(--color-down)", marginTop: 4 }}>Passwords do not match</div>
            )}
          </div>

          {/* Checkboxes */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "4px 0" }}>
            <Checkbox checked={terms} onChange={setTerms}>
              I have read and agree to the{" "}
              <span style={{ color: "var(--color-ai)", fontWeight: 600 }}>Terms of Use</span>
              {" "}and{" "}
              <span style={{ color: "var(--color-ai)", fontWeight: 600 }}>Privacy Policy</span>
              {" "}· ฉันยอมรับข้อกำหนดการใช้งาน <span style={{ color: "var(--color-down)" }}>*</span>
            </Checkbox>
            <Checkbox checked={cookies} onChange={setCookies}>
              I accept cookies for analytics and personalisation · ฉันยอมรับการใช้คุกกี้เพื่อวิเคราะห์และปรับแต่งประสบการณ์
            </Checkbox>
          </div>

          {error && (
            <div style={{ padding: "10px 14px", background: "var(--color-down-bg)", borderRadius: 10, fontSize: 13, color: "var(--color-down)", fontWeight: 500 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{ marginTop: 4, padding: "14px", background: loading ? "var(--color-muted2)" : "var(--color-ai)", borderRadius: 14, border: "none", cursor: loading ? "not-allowed" : "pointer", fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: 0.2 }}>
            {loading ? "Creating account..." : "Create Account · สมัครสมาชิก"}
          </button>

          <div style={{ textAlign: "center", fontSize: 13, color: "var(--color-muted)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--color-ai)", fontWeight: 600, textDecoration: "none" }}>
              Sign In · เข้าสู่ระบบ
            </Link>
          </div>
        </form>
      </div>
    </PhoneFrame>
  );
}
