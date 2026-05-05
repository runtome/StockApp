import Link from "next/link";
import { SparklineChart } from "@/components/charts/SparklineChart";
import type { SectorData } from "@/lib/types/market";

const IG_COLOR: Record<string, string> = {
  AGRO:    "#84cc16",
  CONSUMP: "#ec4899",
  FINCIAL: "#3b82f6",
  INDUS:   "#64748b",
  PROPCON: "#f97316",
  RESOURC: "#f59e0b",
  SERVICE: "#10b981",
  TECH:    "#8b5cf6",
};

export function SectorHeatmap({ sectors }: { sectors: SectorData[] }) {
  return (
    <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }} className="no-scrollbar">
      {sectors.map((s) => {
        const igCode = s.industry_group_code || "OTHER";
        const color = IG_COLOR[igCode] ?? "#8A9099";
        const isUp = s.pct >= 0;
        const accentColor = isUp ? "#4ade80" : "#f87171";
        const accentAlpha = Math.round((0.18 + Math.min(Math.abs(s.pct) / 3, 1) * 0.4) * 255)
          .toString(16).padStart(2, "0");
        const accentBg = `${accentColor}${accentAlpha}`;

        return (
          <Link
            key={s.name}
            href={`/sectors/${encodeURIComponent(s.name)}`}
            style={{ textDecoration: "none", flexShrink: 0 }}
          >
            <div style={{
              width: 158,
              borderRadius: 14,
              padding: "12px 12px 10px",
              background: "var(--color-panel)",
              border: "1px solid var(--color-hairline)",
              display: "flex",
              flexDirection: "column",
              gap: 7,
            }}>
              {/* Industry group badge + sector code */}
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{
                  fontSize: 8, fontWeight: 700, letterSpacing: 0.7,
                  background: color, color: "#fff",
                  padding: "1px 5px", borderRadius: 3,
                }}>
                  {igCode}
                </span>
                <span style={{
                  fontSize: 8, fontWeight: 700, letterSpacing: 0.6,
                  background: `${color}22`, color,
                  border: `1px solid ${color}55`,
                  padding: "1px 5px", borderRadius: 3,
                }}>
                  {s.code}
                </span>
              </div>

              {/* Sector name */}
              <div style={{
                fontSize: 12, fontWeight: 700, color: "var(--color-ink)",
                lineHeight: 1.3,
                display: "-webkit-box", WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical", overflow: "hidden",
                minHeight: 32,
              }}>
                {s.name}
              </div>

              {/* Change % pill */}
              <div style={{
                display: "inline-flex", alignItems: "center",
                background: accentBg, borderRadius: 7,
                padding: "4px 8px", alignSelf: "flex-start",
              }}>
                <span style={{
                  fontSize: 15, fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                  color: accentColor,
                }}>
                  {isUp ? "+" : ""}{s.pct.toFixed(2)}%
                </span>
              </div>

              {/* Stock count + SET badges */}
              <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                <span style={{ fontSize: 10, color: "var(--color-muted)" }}>
                  {s.count} {s.count === 1 ? "stock" : "stocks"}
                </span>
                {s.set50_count > 0 && (
                  <span style={{
                    fontSize: 8, fontWeight: 700,
                    background: "#f59e0b22", color: "#f59e0b",
                    border: "1px solid #f59e0b55",
                    borderRadius: 3, padding: "1px 4px",
                  }}>
                    S50:{s.set50_count}
                  </span>
                )}
                {s.set100_count > 0 && (
                  <span style={{
                    fontSize: 8, fontWeight: 700,
                    background: "#3b82f622", color: "#3b82f6",
                    border: "1px solid #3b82f655",
                    borderRadius: 3, padding: "1px 4px",
                  }}>
                    S100:{s.set100_count}
                  </span>
                )}
              </div>

              {/* 1M sector sparkline */}
              <SparklineChart
                data={s.sparkline ?? []}
                width={134}
                height={34}
                color={accentColor}
                fill
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
