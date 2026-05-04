"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { SparklineChart } from "@/components/charts/SparklineChart";

const RANGES = ["1D", "5D", "6M", "1Y", "5Y"] as const;
type Range = typeof RANGES[number];

interface Props {
  value: number;
  change: number;
  pct: number;
}

export function SetIndexHero({ value, change, pct }: Props) {
  const [range, setRange] = useState<Range>("6M");
  const [sparkline, setSparkline] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/market/set-history?range=${range}`)
      .then((r) => r.json())
      .then((d) => setSparkline((d.data ?? []).map((p: { close: number }) => p.close)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [range]);

  const isUp = pct >= 0;

  return (
    <div style={{ margin: "14px 16px 0" }}>
      <Card style={{ padding: 18 }}>
        {/* Value + change */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--color-muted)", fontWeight: 600, letterSpacing: 0.6 }}>SET INDEX</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 700, marginTop: 2, letterSpacing: -0.5, color: "var(--color-ink)" }}>
              {value.toFixed(2)}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Chip label={`${isUp ? "+" : ""}${pct.toFixed(2)}%`} variant={isUp ? "up" : "down"} />
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: isUp ? "var(--color-up)" : "var(--color-down)", fontWeight: 600, marginTop: 4 }}>
              {isUp ? "+" : ""}{change.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Range selector */}
        <div style={{ display: "flex", gap: 4, margin: "12px 0 10px" }}>
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                padding: "4px 10px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontSize: 11,
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

        {/* Chart */}
        <div style={{ opacity: loading ? 0.4 : 1, transition: "opacity 0.25s", minHeight: 56 }}>
          {sparkline.length >= 2 ? (
            <SparklineChart data={sparkline} width={326} height={56} fill />
          ) : (
            <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 11, color: "var(--color-muted)" }}>Loading…</div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
