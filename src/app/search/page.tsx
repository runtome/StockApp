"use client";
import { useState, useEffect, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { SparklineChart } from "@/components/charts/SparklineChart";
import type { Stock } from "@/lib/types/stock";
import Link from "next/link";

const SECTORS = [
  "Energy & Utilities",
  "Banking",
  "Transportation & Logistics",
  "ICT & Telecom",
  "Commerce",
  "Health Care Services",
  "Construction Materials",
  "Food and Beverage",
  "Electronic Components",
  "Hotels, Restaurants & Tourism",
];

function StockRow({ stock }: { stock: Stock }) {
  const price = stock.price ?? 0;
  const changePct = stock.change_pct ?? 0;
  const isUp = changePct >= 0;
  return (
    <Link href={`/stocks/${stock.symbol}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", textDecoration: "none" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>{stock.symbol}</div>
        <div style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 1 }}>{stock.name}</div>
      </div>
      <SparklineChart data={stock.sparkline ?? []} width={52} height={22} />
      <div style={{ textAlign: "right" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, color: "var(--color-ink)" }}>{price.toFixed(2)}</div>
        <Chip label={`${isUp ? "+" : ""}${changePct.toFixed(2)}%`} variant={isUp ? "up" : "down"} />
      </div>
    </Link>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/stocks${query ? `?q=${encodeURIComponent(query)}` : ""}`);
        const json = await res.json();
        setResults(Array.isArray(json) ? json.filter((s) => s && typeof s.price === "number") : []);
      } catch {}
      setLoading(false);
    }, 300);
  }, [query]);

  return (
    <AppShell>
      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: "var(--color-ink)", marginBottom: 12 }}>
          Search · ค้นหา
        </div>

        {/* Search input */}
        <div style={{ position: "relative", marginBottom: 16 }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-muted)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </div>
          <input
            type="text"
            placeholder="Search symbol or name... (e.g. PTT)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px 10px 36px",
              background: "var(--color-panel)",
              border: "1px solid var(--color-hairline)",
              borderRadius: 12,
              color: "var(--color-ink)",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Sector chips */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {SECTORS.map((s) => (
            <Link key={s} href={`/sectors/${encodeURIComponent(s)}`} style={{ textDecoration: "none" }}>
              <Chip label={s} />
            </Link>
          ))}
        </div>
      </div>

      {/* Results */}
      <div style={{ margin: "0 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-muted)", letterSpacing: 0.5, marginBottom: 8 }}>
          {loading ? "Searching..." : query ? `Results for "${query}"` : "All Stocks · ทุกหุ้น"}
        </div>
        <Card style={{ overflow: "hidden" }}>
          {results.map((s, i) => (
            <div key={s.symbol}>
              {i > 0 && <div style={{ height: 1, background: "var(--color-hairline2)", margin: "0 16px" }} />}
              <StockRow stock={s} />
            </div>
          ))}
          {results.length === 0 && !loading && (
            <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--color-muted)", fontSize: 14 }}>
              No stocks found
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
