import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { SparklineChart } from "@/components/charts/SparklineChart";
import { SectorHeatmap } from "@/components/charts/SectorHeatmap";
import { SetIndexHero } from "@/components/markets/SetIndexHero";
import { getMarketSummary } from "@/lib/api/stocks-api";
import { getStocks } from "@/lib/api/stocks-api";
import { formatVolume, formatPercent } from "@/lib/utils/format";
import type { Stock } from "@/lib/types/stock";
import Link from "next/link";

export const revalidate = 60;

const TZ = "Asia/Bangkok";

function greeting() {
  const h = parseInt(
    new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", hour12: false }).format(new Date()),
    10,
  ) % 24;
  if (h < 12) return "อรุณสวัสดิ์";
  if (h < 17) return "สวัสดีตอนบ่าย";
  return "สวัสดีตอนเย็น";
}

function dateLabel() {
  return new Date().toLocaleDateString("en-US", {
    timeZone: TZ,
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function AiOutlookBanner() {
  return (
    <div style={{ margin: "14px 16px 0", padding: "12px 14px", background: "var(--color-ai-bg)", borderRadius: 12, border: "1px solid var(--color-hairline)", display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--color-ai)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M12 2 14.39 8.25 21 9.27l-4.78 4.66L17.27 21 12 17.77 6.73 21l1.05-7.07L3 9.27l6.61-1.02z" /></svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-ai-ink)" }}>Today&apos;s AI Outlook · การคาดการณ์วันนี้</div>
        <div style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 2 }}>Market shows moderate upside bias. Energy and Transport lead gains.</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ai)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
    </div>
  );
}

function StockRow({ stock }: { stock: Stock }) {
  const price = stock.price ?? 0;
  const changePct = stock.change_pct ?? 0;
  const isUp = changePct >= 0;
  return (
    <Link href={`/stocks/${stock.symbol}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", textDecoration: "none" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>{stock.symbol}</div>
        <div style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 1 }}>{stock.sector}</div>
      </div>
      <SparklineChart data={stock.sparkline ?? []} width={56} height={24} color={isUp ? "var(--color-up)" : "var(--color-down)"} />
      <div style={{ textAlign: "right", minWidth: 64 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 600, color: "var(--color-ink)" }}>{price.toFixed(2)}</div>
        <Chip label={`${isUp ? "+" : ""}${changePct.toFixed(2)}%`} variant={isUp ? "up" : "down"} />
      </div>
    </Link>
  );
}

export default async function MarketsPage() {
  const [summary, stocks] = await Promise.all([getMarketSummary(), getStocks("")]);
  const { set_index, advancers, decliners, total_volume, sectors } = summary;
  const validStocks = (stocks as Stock[]).filter((s) => s && typeof s.price === "number" && typeof s.change_pct === "number");
  const topMovers = [...validStocks].sort((a, b) => Math.abs(b.change_pct) - Math.abs(a.change_pct)).slice(0, 6);

  return (
    <AppShell>
      <TopBar showThemeToggle />
      <div style={{ paddingBottom: 16 }}>
        {/* Greeting */}
        <div style={{ padding: "12px 20px 4px" }}>
          <div style={{ fontSize: 12, color: "var(--color-muted)", letterSpacing: 0.2 }}>{greeting()} · {dateLabel()}</div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5, marginTop: 2, color: "var(--color-ink)" }}>Markets · ตลาด</div>
        </div>

        {/* SET Index Hero */}
        <SetIndexHero
          value={set_index?.value ?? 0}
          change={set_index?.change ?? 0}
          pct={set_index?.pct ?? 0}
        />

        {/* Quick Stats */}
        <div style={{ display: "flex", gap: 8, padding: "12px 16px 0" }}>
          {[
            { label: "Volume", value: "฿" + formatVolume(total_volume), col: null },
            { label: "Advancers", value: advancers.toString(), col: "var(--color-up)" },
            { label: "Decliners", value: decliners.toString(), col: "var(--color-down)" },
          ].map((s) => (
            <div key={s.label} style={{ flex: 1, background: "var(--color-panel)", borderRadius: 10, padding: "10px 12px", border: "1px solid var(--color-hairline)" }}>
              <div style={{ fontSize: 10, color: "var(--color-muted)", fontWeight: 600, letterSpacing: 0.4 }}>{s.label.toUpperCase()}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, color: s.col ?? "var(--color-ink)", marginTop: 2 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* AI Banner */}
        <AiOutlookBanner />

        {/* Top Movers */}
        <div style={{ padding: "16px 16px 0" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ink)", marginBottom: 10 }}>Top Movers · หุ้นเด่น</div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }} className="no-scrollbar">
            {topMovers.map((s) => {
              const isUp = s.change_pct >= 0;
              return (
                <Link key={s.symbol} href={`/stocks/${s.symbol}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: "var(--color-panel)", borderRadius: 10, padding: "10px 12px", border: "1px solid var(--color-hairline)", minWidth: 100, flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ink)" }}>{s.symbol}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-ink2)", marginTop: 2 }}>{(s.price ?? 0).toFixed(2)}</div>
                    <Chip label={`${isUp ? "+" : ""}${(s.change_pct ?? 0).toFixed(2)}%`} variant={isUp ? "up" : "down"} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sector Heatmap */}
        <div style={{ padding: "16px 16px 0" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ink)", marginBottom: 10 }}>Sectors · หมวดหมู่</div>
          <SectorHeatmap sectors={sectors} />
        </div>

        {/* All Stocks */}
        <div style={{ padding: "16px 0 0" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ink)", padding: "0 16px 8px" }}>All Stocks</div>
          <div style={{ background: "var(--color-panel)", borderRadius: 14, margin: "0 16px", border: "1px solid var(--color-hairline)", overflow: "hidden" }}>
            {validStocks.map((s, i) => (
              <div key={s.symbol}>
                {i > 0 && <div style={{ height: 1, background: "var(--color-hairline2)", margin: "0 16px" }} />}
                <StockRow stock={s} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
