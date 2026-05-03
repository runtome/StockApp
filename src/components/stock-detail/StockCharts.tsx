"use client";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";
import type { OHLCV, IndicatorRecord } from "@/lib/types/stock";

const CandlestickChart = dynamic(
  () => import("@/components/charts/CandlestickChart").then((m) => m.CandlestickChart),
  { ssr: false, loading: () => <Skeleton height={200} borderRadius={0} /> }
);

const VolumeChart = dynamic(
  () => import("@/components/charts/VolumeChart").then((m) => m.VolumeChart),
  { ssr: false, loading: () => <Skeleton height={70} borderRadius={0} /> }
);

const RSIChart = dynamic(
  () => import("@/components/charts/RSIChart").then((m) => m.RSIChart),
  { ssr: false, loading: () => <Skeleton height={72} borderRadius={0} /> }
);

const MACDChart = dynamic(
  () => import("@/components/charts/MACDChart").then((m) => m.MACDChart),
  { ssr: false, loading: () => <Skeleton height={72} borderRadius={0} /> }
);

interface StockChartsProps {
  history: OHLCV[];
  records: IndicatorRecord[];
}

export function StockCharts({ history, records }: StockChartsProps) {
  const ma20 = records.map((r) => r.sma20 ?? 0);
  const ma50 = records.map((r) => r.sma50 ?? 0);
  const rsiData = records.map((r) => ({ date: r.date, rsi: r.rsi ?? null }));
  const macdData = records.map((r) => ({
    date: r.date,
    macd: r.macd ?? null,
    macd_signal: r.macd_signal ?? null,
    macd_hist: r.macd_hist ?? null,
  }));

  const chartData = history.length ? history : records;

  return (
    <>
      {/* Candlestick */}
      <div style={{ background: "var(--color-panel)", padding: "12px 12px 4px" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 20, height: 2, background: "rgba(251,191,36,0.8)", borderRadius: 1 }} />
            <span style={{ fontSize: 10, color: "var(--color-muted)" }}>MA20</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 20, height: 2, background: "rgba(167,139,250,0.8)", borderRadius: 1 }} />
            <span style={{ fontSize: 10, color: "var(--color-muted)" }}>MA50</span>
          </div>
        </div>
        <CandlestickChart data={chartData} ma20={ma20} ma50={ma50} height={200} />
      </div>

      {/* Volume */}
      <div style={{ background: "var(--color-panel)", padding: "4px 12px 8px", borderBottom: "1px solid var(--color-hairline)" }}>
        <div style={{ fontSize: 9, color: "var(--color-muted)", fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>VOLUME</div>
        <VolumeChart data={chartData} height={70} />
      </div>

      {/* RSI */}
      <div style={{ background: "var(--color-panel)", padding: "12px 12px 8px", borderBottom: "1px solid var(--color-hairline)" }}>
        <RSIChart data={rsiData} height={72} />
      </div>

      {/* MACD */}
      <div style={{ background: "var(--color-panel)", padding: "12px 12px 8px", borderBottom: "1px solid var(--color-hairline)" }}>
        <MACDChart data={macdData} height={72} />
      </div>
    </>
  );
}
