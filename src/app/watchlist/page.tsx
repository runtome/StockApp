"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { useWatchlist } from "@/lib/hooks/useWatchlist";
import type { Stock } from "@/lib/types/stock";
import Link from "next/link";

function DirectionIcon({ dir }: { dir?: string }) {
  if (dir === "up") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-up)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>;
  if (dir === "down") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-down)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>;
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-warn)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 12 19 12" /></svg>;
}

export default function WatchlistPage() {
  const { symbols, remove } = useWatchlist();
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    if (!symbols.length) { setStocks([]); return; }
    Promise.all(symbols.map((s) => fetch(`/api/stocks/${s}`).then((r) => r.json()).catch(() => null)))
      .then((data) => setStocks(data.filter(Boolean)));
  }, [symbols]);

  return (
    <AppShell>
      <TopBar title="Watchlist · ติดตาม" showThemeToggle />
      <div style={{ padding: "16px" }}>
        {stocks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 16px", color: "var(--color-muted)" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: "0 auto 12px", display: "block", opacity: 0.4 }}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
            <div style={{ fontSize: 14 }}>Your watchlist is empty</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Add stocks from the detail page</div>
          </div>
        ) : (
          <Card style={{ overflow: "hidden" }}>
            {stocks.map((s, i) => {
              const isUp = s.change_pct >= 0;
              return (
                <div key={s.symbol}>
                  {i > 0 && <div style={{ height: 1, background: "var(--color-hairline2)", margin: "0 16px" }} />}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px" }}>
                    <Link href={`/stocks/${s.symbol}`} style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                      <div>
                        <DirectionIcon dir={s.ai_direction} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>{s.symbol}</div>
                        <div style={{ fontSize: 11, color: "var(--color-muted)" }}>{s.name}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 600, color: "var(--color-ink)" }}>{s.price.toFixed(2)}</div>
                        <Chip label={`${isUp ? "+" : ""}${s.change_pct.toFixed(2)}%`} variant={isUp ? "up" : "down"} />
                      </div>
                    </Link>
                    <button onClick={() => remove(s.symbol)} style={{ background: "none", border: "none", color: "var(--color-muted2)", cursor: "pointer", padding: 4 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </Card>
        )}
      </div>
    </AppShell>
  );
}
