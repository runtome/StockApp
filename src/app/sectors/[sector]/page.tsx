import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { StockRow } from "@/components/markets/StockRow";
import { getStocks } from "@/lib/api/stocks-api";
import type { Stock } from "@/lib/types/stock";

export const revalidate = 60;

export default async function SectorPage({ params }: { params: Promise<{ sector: string }> }) {
  const { sector } = await params;
  const sectorName = decodeURIComponent(sector);
  const stocks = await getStocks("", sectorName);
  const validStocks = (stocks as Stock[]).filter((s) => s && typeof s.price === "number");

  return (
    <AppShell>
      <TopBar title={sectorName} backHref="/markets" />
      <div style={{ padding: "16px 0 0" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ink)", padding: "0 16px 8px" }}>
          {sectorName} · {validStocks.length} stocks
        </div>
        <div style={{ background: "var(--color-panel)", borderRadius: 14, margin: "0 16px", border: "1px solid var(--color-hairline)", overflow: "hidden" }}>
          {validStocks.length === 0 && (
            <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--color-muted)", fontSize: 14 }}>
              No stocks found in this sector
            </div>
          )}
          {validStocks.map((s, i) => (
            <div key={s.symbol}>
              {i > 0 && <div style={{ height: 1, background: "var(--color-hairline2)", margin: "0 16px" }} />}
              <StockRow stock={s} />
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
