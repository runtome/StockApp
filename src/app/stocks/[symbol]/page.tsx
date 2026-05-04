import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Chip } from "@/components/ui/Chip";
import { StockCharts } from "@/components/stock-detail/StockCharts";
import { getStockDetail, getStockHistory, getStockIndicators } from "@/lib/api/stocks-api";
import type { Stock, IndicatorsResponse, OHLCV, IndicatorRecord } from "@/lib/types/stock";
import Link from "next/link";

export const revalidate = 60;

interface Props {
  params: Promise<{ symbol: string }>;
}

export default async function StockDetailPage({ params }: Props) {
  const { symbol } = await params;
  const sym = symbol.toUpperCase();

  const [stock, historyData, indicatorData] = await Promise.all([
    getStockDetail(sym),
    getStockHistory(sym, 90),
    getStockIndicators(sym, 90),
  ]);

  if (!stock) notFound();

  const history: OHLCV[] = historyData.data ?? [];
  const indicators = indicatorData as IndicatorsResponse;
  const records: IndicatorRecord[] = (indicators.records ?? history) as IndicatorRecord[];

  const s = stock as Stock;
  const isUp = (s.change_pct ?? 0) >= 0;

  return (
    <AppShell>
      <TopBar
        backHref="/markets"
        rightSlot={
          <Link
            href={`/stocks/${sym}/forecast`}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 10px", background: "var(--color-ai-bg)", borderRadius: 8, textDecoration: "none" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-ai)">
              <path d="M12 2 14.39 8.25 21 9.27l-4.78 4.66L17.27 21 12 17.77 6.73 21l1.05-7.07L3 9.27l6.61-1.02z" />
            </svg>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-ai)" }}>Forecast</span>
          </Link>
        }
      />

      {/* Stock header */}
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid var(--color-hairline)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5, color: "var(--color-ink)" }}>{s.symbol}</div>
            <div style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 2 }}>{s.name} · {s.name_th}</div>
            <Chip label={s.sector} style={{ marginTop: 6 }} />
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 26, fontWeight: 700, color: "var(--color-ink)", letterSpacing: -0.5 }}>
              {(s.price ?? 0).toFixed(2)}
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", marginTop: 4 }}>
              <Chip label={`${isUp ? "+" : ""}${(s.change ?? 0).toFixed(2)}`} variant={isUp ? "up" : "down"} />
              <Chip label={`${isUp ? "+" : ""}${(s.change_pct ?? 0).toFixed(2)}%`} variant={isUp ? "up" : "down"} />
            </div>
          </div>
        </div>

        {/* OHLC row */}
        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          {[{ l: "O", v: s.open }, { l: "H", v: s.high }, { l: "L", v: s.low }, { l: "C", v: s.close }].map((item) => (
            <div key={item.l}>
              <div style={{ fontSize: 10, color: "var(--color-muted)", fontWeight: 600 }}>{item.l}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 500, color: "var(--color-ink2)" }}>{(item.v ?? 0).toFixed(2)}</div>
            </div>
          ))}
          <div style={{ marginLeft: "auto" }}>
            <div style={{ fontSize: 10, color: "var(--color-muted)", fontWeight: 600 }}>VOL</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 500, color: "var(--color-ink2)" }}>{((s.volume ?? 0) / 1_000_000).toFixed(1)}M</div>
          </div>
        </div>
      </div>

      {/* Charts — client component wrapper handles SSR-unsafe dynamic imports */}
      <StockCharts history={history} records={records} />

      {/* Technical signals */}
      {indicators.signals && indicators.signals.length > 0 && (
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ink)", marginBottom: 10 }}>Technical Signals · สัญญาณ</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {indicators.signals.map((sig, i) => {
              const color = sig.color === "up" ? "var(--color-up)" : sig.color === "down" ? "var(--color-down)" : sig.color === "warn" ? "var(--color-warn)" : "var(--color-muted)";
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "var(--color-panel)", borderRadius: 10, border: "1px solid var(--color-hairline)" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-muted)", minWidth: 48 }}>{sig.indicator}</span>
                  <span style={{ fontSize: 13, color, fontWeight: 600 }}>{sig.signal}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Forecast CTA */}
      <div style={{ padding: "0 16px 16px" }}>
        <Link href={`/stocks/${sym}/forecast`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", background: "var(--color-ai)", borderRadius: 14, textDecoration: "none" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-bg)">
            <path d="M12 2 14.39 8.25 21 9.27l-4.78 4.66L17.27 21 12 17.77 6.73 21l1.05-7.07L3 9.27l6.61-1.02z" />
          </svg>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-bg)" }}>View AI Forecast · ดูการคาดการณ์</span>
        </Link>
      </div>
    </AppShell>
  );
}
