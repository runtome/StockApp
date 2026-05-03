import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import type { Portfolio } from "@/lib/types/portfolio";

const MOCK_PORTFOLIO: Portfolio = {
  total_value: 285_420.50,
  total_cost: 262_000.00,
  total_gain_loss: 23_420.50,
  total_gain_loss_pct: 8.94,
  positions: [
    { symbol: "AOT", name: "Airports of Thailand", shares: 1000, avg_cost: 52.50, current_price: 58.75, value: 58750, gain_loss: 6250, gain_loss_pct: 11.90, allocation_pct: 20.6 },
    { symbol: "PTT", name: "PTT Public Company", shares: 2000, avg_cost: 33.00, current_price: 35.25, value: 70500, gain_loss: 4500, gain_loss_pct: 6.82, allocation_pct: 24.7 },
    { symbol: "KBANK", name: "Kasikornbank", shares: 500, avg_cost: 138.00, current_price: 142.50, value: 71250, gain_loss: 2250, gain_loss_pct: 3.26, allocation_pct: 25.0 },
    { symbol: "ADVANC", name: "Advanced Info Service", shares: 400, avg_cost: 225.00, current_price: 218.00, value: 87200, gain_loss: -2800, gain_loss_pct: -3.11, allocation_pct: 30.5 },
  ],
};

function AllocationBar({ positions }: { positions: typeof MOCK_PORTFOLIO.positions }) {
  const colors = ["var(--color-ai)", "var(--color-up)", "var(--color-warn)", "var(--color-down)"];
  return (
    <div style={{ height: 8, borderRadius: 4, overflow: "hidden", display: "flex", gap: 1 }}>
      {positions.map((p, i) => (
        <div key={p.symbol} style={{ flex: p.allocation_pct, background: colors[i % colors.length], borderRadius: 2 }} />
      ))}
    </div>
  );
}

export default function PortfolioPage() {
  const p = MOCK_PORTFOLIO;
  const isUp = p.total_gain_loss >= 0;

  return (
    <AppShell>
      <TopBar title="Portfolio · พอร์ต" showThemeToggle />
      <div style={{ padding: 16 }}>
        {/* Summary card */}
        <Card style={{ padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "var(--color-muted)", fontWeight: 600, letterSpacing: 0.5 }}>TOTAL VALUE</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 700, color: "var(--color-ink)", marginTop: 4, letterSpacing: -0.5 }}>
            ฿{p.total_value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
            <Chip label={`${isUp ? "+" : ""}฿${Math.abs(p.total_gain_loss).toLocaleString("en-US", { minimumFractionDigits: 2 })}`} variant={isUp ? "up" : "down"} />
            <Chip label={`${isUp ? "+" : ""}${p.total_gain_loss_pct.toFixed(2)}%`} variant={isUp ? "up" : "down"} />
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, color: "var(--color-muted)", marginBottom: 6 }}>Allocation</div>
            <AllocationBar positions={p.positions} />
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              {p.positions.map((pos, i) => {
                const colors = ["var(--color-ai)", "var(--color-up)", "var(--color-warn)", "var(--color-down)"];
                return (
                  <div key={pos.symbol} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: colors[i % colors.length] }} />
                    <span style={{ fontSize: 10, color: "var(--color-muted)" }}>{pos.symbol} {pos.allocation_pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Positions */}
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ink)", marginBottom: 10 }}>Positions · รายการ</div>
        <Card style={{ overflow: "hidden" }}>
          {p.positions.map((pos, i) => {
            const isGain = pos.gain_loss >= 0;
            return (
              <div key={pos.symbol}>
                {i > 0 && <div style={{ height: 1, background: "var(--color-hairline2)", margin: "0 16px" }} />}
                <div style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>{pos.symbol}</div>
                      <div style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 1 }}>{pos.shares.toLocaleString()} shares @ {pos.avg_cost.toFixed(2)}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 600, color: "var(--color-ink)" }}>
                        ฿{pos.value.toLocaleString("en-US")}
                      </div>
                      <Chip label={`${isGain ? "+" : ""}${pos.gain_loss_pct.toFixed(2)}%`} variant={isGain ? "up" : "down"} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Card>

        <div style={{ marginTop: 24, padding: "12px 16px", background: "var(--color-panel-alt)", borderRadius: 10, fontSize: 11, color: "var(--color-muted)", lineHeight: 1.5 }}>
          Portfolio data is for demonstration purposes only. Past performance is not indicative of future results.
        </div>
      </div>
    </AppShell>
  );
}
