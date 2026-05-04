"use client";
import { useEffect, useState } from "react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie_consent")) setVisible(true);
  }, []);

  function accept(all: boolean) {
    localStorage.setItem("cookie_consent", all ? "all" : "necessary");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "min(390px, 100vw)", zIndex: 9999,
      padding: "16px 20px 24px",
      background: "var(--color-panel)",
      borderTop: "1px solid var(--color-hairline)",
      boxShadow: "0 -8px 32px rgba(0,0,0,0.4)",
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ink)", marginBottom: 6 }}>
        🍪 Cookie Notice · การแจ้งเตือนคุกกี้
      </div>
      <div style={{ fontSize: 12, color: "var(--color-muted)", lineHeight: 1.6, marginBottom: 14 }}>
        We use cookies to improve your experience and analyse usage.
        Necessary cookies are always active.
        คุกกี้จำเป็นจะถูกใช้งานเสมอ คุกกี้เพิ่มเติมช่วยให้เราปรับปรุงบริการ
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => accept(false)}
          style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid var(--color-hairline)", background: "transparent", color: "var(--color-ink2)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          Necessary only
        </button>
        <button onClick={() => accept(true)}
          style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: "var(--color-ai)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          Accept All · ยอมรับทั้งหมด
        </button>
      </div>
    </div>
  );
}
