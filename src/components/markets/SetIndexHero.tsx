"use client";
import { useState, useEffect } from "react";
import { Chip } from "@/components/ui/Chip";
import { SparklineChart } from "@/components/charts/SparklineChart";

const RANGES = ["1D", "5D", "6M", "1Y", "5Y"] as const;
type Range = typeof RANGES[number];

interface IndexCardProps {
  label: string;
  indexKey: "SET" | "SET50" | "SET100";
  value: number;
  change: number;
  pct: number;
  cardWidth?: number;
}

function IndexCard({ label, indexKey, value, change, pct, cardWidth = 300 }: IndexCardProps) {
  const [range, setRange] = useState<Range>("6M");
  const [sparkline, setSparkline] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const isUp = pct >= 0;
  const accentColor = isUp ? "var(--color-up)" : "var(--color-down)";

  useEffect(() => {
    setLoading(true);
    fetch(`/api/market/index-history?index=${indexKey}&range=${range}`)
      .then((r) => r.json())
      .then((d) => setSparkline((d.data ?? []).map((p: { close: number }) => p.close)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [indexKey, range]);

  const chartWidth = cardWidth - 36;

  return (
    <div style={{
      width: cardWidth,
      flexShrink: 0,
      background: "var(--color-panel)",
      borderRadius: 16,
      border: "1px solid var(--color-hairline)",
      padding: "16px 18px 14px",
    }}>
      {/* Label + change */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--color-muted)", fontWeight: 600, letterSpacing: 0.6 }}>
            {label}
          </div>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 26, fontWeight: 700,
            marginTop: 2, letterSpacing: -0.5, color: "var(--color-ink)",
          }}>
            {value.toFixed(2)}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <Chip label={`${isUp ? "+" : ""}${pct.toFixed(2)}%`} variant={isUp ? "up" : "down"} />
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600,
            color: accentColor, marginTop: 4,
          }}>
            {isUp ? "+" : ""}{change.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Range selector */}
      <div style={{ display: "flex", gap: 4, margin: "10px 0 8px" }}>
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            style={{
              padding: "3px 8px",
              borderRadius: 7,
              border: "none",
              cursor: "pointer",
              fontSize: 10,
              fontWeight: 600,
              background: range === r ? "var(--color-ai)" : "var(--color-chip)",
              color: range === r ? "#fff" : "var(--color-muted)",
              transition: "background 0.15s",
            }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Chart — color always matches today's chip */}
      <div style={{ opacity: loading ? 0.4 : 1, transition: "opacity 0.25s", minHeight: 52 }}>
        {sparkline.length >= 2 ? (
          <SparklineChart
            data={sparkline}
            width={chartWidth}
            height={52}
            color={accentColor}
            fill
          />
        ) : (
          <div style={{ height: 52, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 11, color: "var(--color-muted)" }}>Loading…</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Carousel of SET, SET50, SET100 index cards
interface SetIndexHeroProps {
  value: number;
  change: number;
  pct: number;
  set50Value?: number;
  set50Change?: number;
  set50Pct?: number;
  set100Value?: number;
  set100Change?: number;
  set100Pct?: number;
}

export function SetIndexHero({
  value, change, pct,
  set50Value = 0, set50Change = 0, set50Pct = 0,
  set100Value = 0, set100Change = 0, set100Pct = 0,
}: SetIndexHeroProps) {
  return (
    <div
      style={{ display: "flex", gap: 10, overflowX: "auto", padding: "14px 16px 0" }}
      className="no-scrollbar"
    >
      <IndexCard label="SET INDEX" indexKey="SET"    value={value}      change={change}      pct={pct}      />
      <IndexCard label="SET 50"    indexKey="SET50"  value={set50Value}  change={set50Change}  pct={set50Pct}  />
      <IndexCard label="SET 100"  indexKey="SET100" value={set100Value} change={set100Change} pct={set100Pct} />
    </div>
  );
}
