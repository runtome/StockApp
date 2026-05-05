import { SparklineChart } from "@/components/charts/SparklineChart";
import { Chip } from "@/components/ui/Chip";
import type { Stock } from "@/lib/types/stock";
import Link from "next/link";

export function StockRow({ stock }: { stock: Stock }) {
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
