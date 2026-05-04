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

export default function TermsPage() {
  return (
    <AppShell>
      <TopBar title="Terms of Use · ข้อกำหนดการใช้งาน" backHref="/register" showThemeToggle />
      <div style={{ padding: "20px 20px 0" }}>

        {/* Header */}
        <div style={{ marginBottom: 24, padding: "16px 0", borderBottom: "1px solid var(--color-hairline)" }}>
          <div style={{ fontSize: 11, color: "var(--color-muted)", marginBottom: 4 }}>Effective date · มีผลบังคับใช้</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-ink)" }}>1 May 2026</div>
          <div style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 8, lineHeight: 1.7 }}>
            Please read these terms carefully before using Thai Stock AI.
            การใช้งานบริการถือว่าคุณยอมรับข้อกำหนดเหล่านี้
          </div>
        </div>

        <Section title="1. Acceptance of Terms" titleTh="การยอมรับข้อกำหนด">
          By creating an account or using Thai Stock AI ("the Service"), you agree to be bound by these Terms of Use. If you do not agree, do not use the Service.
          {"\n\n"}หากคุณไม่ยอมรับข้อกำหนดเหล่านี้ กรุณาหยุดใช้บริการทันที
        </Section>

        <Section title="2. Description of Service" titleTh="คำอธิบายบริการ">
          Thai Stock AI is an analytical platform providing Thai SET market data, technical indicators, and AI-assisted price forecasting. The Service is operated for educational and informational purposes only.
          {"\n\n"}ไทยสต็อค เอไอ คือแพลตฟอร์มการวิเคราะห์ข้อมูลตลาดหลักทรัพย์ไทย (SET) ตัวชี้วัดทางเทคนิค และการพยากรณ์ราคาด้วย AI เพื่อวัตถุประสงค์ทางการศึกษาและข้อมูลเท่านั้น
        </Section>

        <Section title="3. Not Financial Advice" titleTh="ไม่ใช่คำแนะนำทางการเงิน">
          All content, forecasts, signals, and analysis provided by Thai Stock AI are for <strong style={{ color: "var(--color-ink)" }}>informational and educational purposes only</strong>. Nothing on this platform constitutes financial, investment, trading, or legal advice. Past performance of any stock or model does not guarantee future results.
          {"\n\n"}Always consult a licensed financial advisor before making investment decisions. You are solely responsible for any trades or investments you make.
          {"\n\n"}ข้อมูลทั้งหมดในแพลตฟอร์มนี้ไม่ถือเป็นคำแนะนำทางการเงินหรือการลงทุน กรุณาปรึกษาที่ปรึกษาทางการเงินที่ได้รับใบอนุญาตก่อนตัดสินใจลงทุน
        </Section>

        <Section title="4. User Accounts" titleTh="บัญชีผู้ใช้">
          You must provide accurate and complete information when registering. You are responsible for maintaining the confidentiality of your password and for all activity under your account. Notify us immediately at{" "}
          <Link href="mailto:support@thaistokai.app" style={{ color: "var(--color-ai)", textDecoration: "none" }}>
            support@thaistokai.app
          </Link>{" "}
          if you suspect unauthorised access.
          {"\n\n"}คุณต้องรับผิดชอบในการรักษาความปลอดภัยของรหัสผ่านและกิจกรรมทั้งหมดในบัญชีของคุณ
        </Section>

        <Section title="5. Acceptable Use" titleTh="การใช้งานที่ยอมรับได้">
          You agree not to:{"\n"}
          • Scrape, crawl, or automate access to the Service{"\n"}
          • Attempt to reverse-engineer or compromise the platform{"\n"}
          • Use the Service to distribute spam or malicious content{"\n"}
          • Share your account credentials with third parties{"\n"}
          • Use the Service in any way that violates applicable law
          {"\n\n"}คุณตกลงที่จะไม่ใช้บริการในทางที่ผิดกฎหมายหรือละเมิดสิทธิ์ของผู้อื่น
        </Section>

        <Section title="6. Portfolio Data" titleTh="ข้อมูลพอร์ตโฟลิโอ">
          Portfolio positions you add are stored in your account and are visible only to you. We do not share, sell, or use your portfolio data for commercial purposes. You may delete your positions at any time.
          {"\n\n"}ข้อมูลพอร์ตโฟลิโอของคุณถูกเก็บไว้ในบัญชีและมองเห็นได้เฉพาะคุณเท่านั้น
        </Section>

        <Section title="7. Intellectual Property" titleTh="ทรัพย์สินทางปัญญา">
          All design, code, branding, and original content of Thai Stock AI are the property of the Service operator. Market data is sourced from publicly available feeds (Yahoo Finance) and remains the property of the respective data providers.
          {"\n\n"}ข้อมูลตลาดมาจาก Yahoo Finance และยังคงเป็นทรัพย์สินของผู้ให้บริการข้อมูลนั้น
        </Section>

        <Section title="8. Limitation of Liability" titleTh="การจำกัดความรับผิด">
          To the maximum extent permitted by law, Thai Stock AI and its operators shall not be liable for any direct, indirect, incidental, or consequential loss or damage arising from your use of the Service, reliance on any forecast or signal, or any interruption of service.
          {"\n\n"}ผู้ให้บริการไม่รับผิดชอบต่อความสูญเสียหรือความเสียหายใด ๆ ที่เกิดจากการใช้บริการ
        </Section>

        <Section title="9. Service Availability" titleTh="ความพร้อมใช้งานของบริการ">
          We aim to maintain high availability but do not guarantee uninterrupted access. The Service may be temporarily unavailable for maintenance or due to issues outside our control (including third-party data providers).
          {"\n\n"}เราพยายามให้บริการอย่างต่อเนื่อง แต่ไม่รับประกันว่าจะไม่มีการหยุดชะงัก
        </Section>

        <Section title="10. Changes to Terms" titleTh="การเปลี่ยนแปลงข้อกำหนด">
          We may update these Terms at any time. Continued use of the Service after changes are published constitutes acceptance of the new Terms. We will indicate the effective date at the top of this page.
          {"\n\n"}เราอาจแก้ไขข้อกำหนดเหล่านี้ได้ทุกเมื่อ การใช้บริการต่อไปหลังจากการเปลี่ยนแปลงถือว่าคุณยอมรับข้อกำหนดใหม่
        </Section>

        <Section title="11. Governing Law" titleTh="กฎหมายที่บังคับใช้">
          These Terms are governed by the laws of the Kingdom of Thailand. Any disputes arising from the use of the Service shall be subject to the jurisdiction of Thai courts.
          {"\n\n"}ข้อกำหนดเหล่านี้อยู่ภายใต้กฎหมายของราชอาณาจักรไทย
        </Section>

        <Section title="12. Contact" titleTh="ติดต่อเรา">
          If you have questions about these Terms, contact us at:{"\n"}
          <Link href="mailto:support@thaistokai.app" style={{ color: "var(--color-ai)", textDecoration: "none" }}>
            support@thaistokai.app
          </Link>
        </Section>

        <div style={{ marginBottom: 24, padding: "14px 16px", background: "var(--color-panel)", borderRadius: 10, border: "1px solid var(--color-hairline)", fontSize: 11, color: "var(--color-muted)", lineHeight: 1.7 }}>
          By using Thai Stock AI you confirm that you have read, understood, and agree to these Terms of Use. · การใช้งาน Thai Stock AI ถือว่าคุณได้อ่าน เข้าใจ และยอมรับข้อกำหนดเหล่านี้แล้ว
        </div>

      </div>
    </AppShell>
  );
}
