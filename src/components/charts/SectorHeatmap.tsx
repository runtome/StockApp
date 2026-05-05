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
  // Group sectors by industry group, preserving order
  const groupOrder: string[] = [];
  const groups: Record<string, { name: string; code: string; sectors: SectorData[] }> = {};
  for (const s of sectors) {
    const code = s.industry_group_code || "OTHER";
    if (!groups[code]) {
      groupOrder.push(code);
      groups[code] = { name: s.industry_group || "Other", code, sectors: [] };
    }
    groups[code].sectors.push(s);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {groupOrder.map((igCode) => {
        const group = groups[igCode];
        const color = IG_COLOR[igCode] ?? "#8A9099";
        return (
          <div key={igCode}>
            {/* Industry group header */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, paddingLeft: 2 }}>
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: 0.8,
                background: color, color: "#fff",
                padding: "2px 6px", borderRadius: 4,
              }}>
                {igCode}
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-muted)", letterSpacing: 0.1 }}>
                {group.name}
              </span>
            </div>

            {/* Horizontal scroll row */}
            <div
              style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}
              className="no-scrollbar"
            >
              {group.sectors.map((s) => {
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
                      width: 162,
                      borderRadius: 14,
                      padding: "12px 12px 10px",
                      background: "var(--color-panel)",
                      border: "1px solid var(--color-hairline)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 7,
                    }}>
                      {/* Sector code badge + name */}
                      <div>
                        <span style={{
                          fontSize: 9, fontWeight: 700, letterSpacing: 0.7,
                          background: `${color}22`, color: color,
                          border: `1px solid ${color}55`,
                          padding: "1px 5px", borderRadius: 4,
                        }}>
                          {s.code}
                        </span>
                        <div style={{
                          fontSize: 12, fontWeight: 700, color: "var(--color-ink)",
                          marginTop: 5, lineHeight: 1.3,
                          display: "-webkit-box", WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical", overflow: "hidden",
                        }}>
                          {s.name}
                        </div>
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
                        width={138}
                        height={34}
                        color={accentColor}
                        fill
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
