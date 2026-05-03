import type { SectorData } from "@/lib/types/market";

interface SectorHeatmapProps {
  sectors: SectorData[];
}

export function SectorHeatmap({ sectors }: SectorHeatmapProps) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {sectors.map((s) => {
        const isUp = s.pct >= 0;
        const intensity = Math.min(Math.abs(s.pct) / 2.5, 1);
        const base = isUp ? "var(--color-up)" : "var(--color-down)";
        const opacity = 0.2 + intensity * 0.6;
        return (
          <div
            key={s.name}
            className="rounded-lg p-2 flex flex-col justify-between"
            style={{
              background: base,
              opacity,
              minHeight: 52,
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 600, color: "#fff", letterSpacing: 0.2 }}>
              {s.name}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "#fff" }}>
              {s.pct >= 0 ? "+" : ""}{s.pct.toFixed(2)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
