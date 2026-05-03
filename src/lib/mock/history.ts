import type { OHLCV } from "@/lib/types/stock";

function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

export function generateMockHistory(symbol: string, days: number): OHLCV[] {
  const seed = symbol.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rng = seededRandom(seed);
  const basePrice = 50 + (seed % 200);
  const records: OHLCV[] = [];
  let price = basePrice;

  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;

    const open = price;
    const change = (rng() - 0.5) * 0.03 * price;
    const close = Math.max(0.01, price + change);
    const high = Math.max(open, close) * (1 + rng() * 0.01);
    const low = Math.min(open, close) * (1 - rng() * 0.01);
    const volume = Math.floor(1_000_000 + rng() * 50_000_000);

    records.push({
      date: d.toISOString().split("T")[0],
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume,
    });
    price = close;
  }
  return records.slice(-days);
}
