import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import Link from "next/link";

function Section({ title, titleTh, children }: { title: string; titleTh: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ink)", marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-ai)", marginBottom: 10 }}>{titleTh}</div>
      <div style={{ fontSize: 12, color: "var(--color-muted)", lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--color-hairline)" }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-ink2)", minWidth: 120 }}>{label}</div>
      <div style={{ fontSize: 11, color: "var(--color-muted)", flex: 1 }}>{value}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <AppShell>
      <TopBar title="Privacy Policy · นโยบายความเป็นส่วนตัว" backHref="/register" showThemeToggle />
      <div style={{ padding: "20px 20px 0" }}>

        {/* Header */}
        <div style={{ marginBottom: 24, padding: "16px 0", borderBottom: "1px solid var(--color-hairline)" }}>
          <div style={{ fontSize: 11, color: "var(--color-muted)", marginBottom: 4 }}>Effective date · มีผลบังคับใช้</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-ink)" }}>1 May 2026</div>
          <div style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 8, lineHeight: 1.7 }}>
            Thai Stock AI respects your privacy. This policy explains what data we collect, how we use it, and your rights.
            {"\n"}Thai Stock AI เคารพความเป็นส่วนตัวของคุณ นโยบายนี้อธิบายข้อมูลที่เราเก็บรวบรวม วิธีใช้ และสิทธิ์ของคุณ
          </div>
        </div>

        <Section title="1. Information We Collect" titleTh="ข้อมูลที่เราเก็บรวบรวม">
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 600, color: "var(--color-ink2)", marginBottom: 6 }}>Account data (when you register)</div>
            <DataRow label="Full name" value="Used to personalise your experience" />
            <DataRow label="Email address" value="Used for account identification and login" />
            <DataRow label="Password" value="Stored as a bcrypt hash (never in plain text)" />
            <DataRow label="Terms acceptance" value="Recorded timestamp of your acceptance" />
            <DataRow label="Cookie preference" value="Stored to respect your consent choice" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 600, color: "var(--color-ink2)", marginBottom: 6 }}>Portfolio data (optional)</div>
            <DataRow label="Stock positions" value="Symbol, shares, average cost you manually enter" />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: "var(--color-ink2)", marginBottom: 6 }}>Usage data (automatic)</div>
            <DataRow label="Browser / device" value="Collected anonymously for error monitoring" />
            <DataRow label="Pages visited" value="Collected only if you accept analytics cookies" />
          </div>
        </Section>

        <Section title="2. How We Use Your Information" titleTh="วิธีที่เราใช้ข้อมูลของคุณ">
          We use your data to:{"\n"}
          • Authenticate your account and keep sessions secure{"\n"}
          • Store and display your portfolio positions{"\n"}
          • Personalise the interface (e.g. your name in the header){"\n"}
          • Improve the Service through aggregated, anonymous analytics{"\n"}
          • Respond to support requests
          {"\n\n"}เราไม่ขายหรือให้เช่าข้อมูลส่วนตัวของคุณแก่บุคคลที่สาม
          {"\n"}We do <strong style={{ color: "var(--color-ink)" }}>not</strong> sell, rent, or share your personal data with third parties for commercial purposes.
        </Section>

        <Section title="3. Data Storage & Security" titleTh="การจัดเก็บและความปลอดภัยของข้อมูล">
          Your account data is stored in <strong style={{ color: "var(--color-ink2)" }}>MongoDB Atlas</strong> (cloud database, Singapore region). Passwords are hashed using <strong style={{ color: "var(--color-ink2)" }}>bcrypt</strong> with 12 rounds before storage — we cannot retrieve your plain-text password.
          {"\n\n"}API sessions are secured with signed <strong style={{ color: "var(--color-ink2)" }}>JWT tokens</strong> (HS256, 7-day expiry) stored in your browser's localStorage.
          {"\n\n"}ข้อมูลบัญชีของคุณจัดเก็บใน MongoDB Atlas รหัสผ่านถูกเข้ารหัสด้วย bcrypt ก่อนจัดเก็บ เราไม่สามารถเรียกคืนรหัสผ่านของคุณได้
        </Section>

        <Section title="4. Cookies" titleTh="คุกกี้">
          We use two categories of cookies:{"\n\n"}
          <strong style={{ color: "var(--color-ink2)" }}>Necessary cookies (always active)</strong>{"\n"}
          • Authentication token (localStorage) — keeps you signed in{"\n"}
          • Theme preference — remembers dark/light mode{"\n"}
          • Watchlist data — your saved stocks{"\n"}
          • Cookie consent record — remembers your choice{"\n\n"}
          <strong style={{ color: "var(--color-ink2)" }}>Analytics cookies (optional, requires your consent)</strong>{"\n"}
          • Anonymous usage statistics to help us improve the Service
          {"\n\n"}You can withdraw consent at any time by clearing your browser's localStorage.
          {"\n"}คุณสามารถถอนความยินยอมได้ทุกเมื่อโดยล้าง localStorage ของเบราว์เซอร์
        </Section>

        <Section title="5. Third-Party Services" titleTh="บริการของบุคคลที่สาม">
          Thai Stock AI uses the following third-party services to operate:
          <div style={{ marginTop: 8 }}>
            <DataRow label="Yahoo Finance (yfinance)" value="Market data source — no personal data sent" />
            <DataRow label="MongoDB Atlas" value="Database — stores account & portfolio data" />
            <DataRow label="Hugging Face Spaces" value="Backend hosting — no personal data logged" />
            <DataRow label="Vercel" value="Frontend hosting — anonymous access logs only" />
          </div>
          {"\n"}Each provider has its own privacy policy. We do not pass your personal information to these services beyond what is necessary for the Service to function.
        </Section>

        <Section title="6. Data Retention" titleTh="การเก็บรักษาข้อมูล">
          Your account and portfolio data are retained for as long as your account is active. If you wish to delete your data, contact us at{" "}
          <Link href="mailto:support@thaistokai.app" style={{ color: "var(--color-ai)", textDecoration: "none" }}>
            support@thaistokai.app
          </Link>{" "}
          and we will remove it within 30 days.
          {"\n\n"}หากต้องการลบข้อมูลของคุณ ติดต่อเราและเราจะดำเนินการภายใน 30 วัน
        </Section>

        <Section title="7. Your Rights" titleTh="สิทธิ์ของคุณ">
          You have the right to:{"\n"}
          • <strong style={{ color: "var(--color-ink2)" }}>Access</strong> — request a copy of the personal data we hold about you{"\n"}
          • <strong style={{ color: "var(--color-ink2)" }}>Rectification</strong> — ask us to correct inaccurate data{"\n"}
          • <strong style={{ color: "var(--color-ink2)" }}>Erasure</strong> — request deletion of your account and all associated data{"\n"}
          • <strong style={{ color: "var(--color-ink2)" }}>Portability</strong> — receive your portfolio data in a machine-readable format{"\n"}
          • <strong style={{ color: "var(--color-ink2)" }}>Withdraw consent</strong> — opt out of analytics cookies at any time
          {"\n\n"}คุณมีสิทธิ์เข้าถึง แก้ไข ลบ และส่งออกข้อมูลส่วนตัวของคุณ
        </Section>

        <Section title="8. Children's Privacy" titleTh="ความเป็นส่วนตัวของเด็ก">
          Thai Stock AI is not directed at persons under the age of 18. We do not knowingly collect personal information from minors. If we become aware that a minor has registered, we will delete the account promptly.
          {"\n\n"}บริการนี้ไม่ได้มุ่งเป้าไปที่ผู้ที่มีอายุต่ำกว่า 18 ปี
        </Section>

        <Section title="9. Changes to This Policy" titleTh="การเปลี่ยนแปลงนโยบายนี้">
          We may update this Privacy Policy from time to time. We will notify you of material changes by updating the effective date at the top of this page. Continued use of the Service constitutes acceptance of the updated policy.
          {"\n\n"}เราอาจอัปเดตนโยบายนี้เป็นระยะ การใช้บริการต่อไปถือว่าคุณยอมรับนโยบายที่อัปเดต
        </Section>

        <Section title="10. Contact" titleTh="ติดต่อเรา">
          For any privacy-related questions, requests, or complaints:{"\n"}
          <Link href="mailto:support@thaistokai.app" style={{ color: "var(--color-ai)", textDecoration: "none" }}>
            support@thaistokai.app
          </Link>
          {"\n\n"}We aim to respond to all requests within 7 business days.
          {"\n"}เราตั้งเป้าตอบกลับคำขอทั้งหมดภายใน 7 วันทำการ
        </Section>

        <div style={{ marginBottom: 24, padding: "14px 16px", background: "var(--color-panel)", borderRadius: 10, border: "1px solid var(--color-hairline)", fontSize: 11, color: "var(--color-muted)", lineHeight: 1.7 }}>
          This policy applies to the Thai Stock AI web application at stock-app-runtome.vercel.app and the backend at huggingface.co/spaces/suphot/thai-stock-ai-backend.
        </div>

      </div>
    </AppShell>
  );
}
