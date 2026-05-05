import type { Stock } from "@/lib/types/stock";

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generateSparkline(seed: number, length = 20, basePrice = 50): number[] {
  const rng = seededRandom(seed);
  const data: number[] = [basePrice];
  for (let i = 1; i < length; i++) {
    const change = (rng() - 0.5) * 0.02 * data[i - 1];
    data.push(Math.max(0.01, data[i - 1] + change));
  }
  return data.map((v) => Math.round(v * 100) / 100);
}

export const MOCK_STOCKS: Stock[] = [
  { symbol: "PTT", name: "PTT Public Company", name_th: "ปตท.", sector: "Energy & Utilities", price: 35.25, open: 34.75, high: 35.50, low: 34.50, close: 35.25, volume: 42100000, change: 0.50, change_pct: 1.44, ai_direction: "up", ai_confidence: 68, sparkline: generateSparkline(80, 20, 35) },
  { symbol: "AOT", name: "Airports of Thailand", name_th: "ทอท.", sector: "Transportation & Logistics", price: 58.75, open: 57.50, high: 59.25, low: 57.25, close: 58.75, volume: 28400000, change: 1.25, change_pct: 2.17, ai_direction: "up", ai_confidence: 72, sparkline: generateSparkline(65, 20, 58) },
  { symbol: "CPALL", name: "CP All", name_th: "ซีพี ออลล์", sector: "Commerce", price: 62.50, open: 63.25, high: 63.50, low: 62.25, close: 62.50, volume: 19800000, change: -0.75, change_pct: -1.19, ai_direction: "side", ai_confidence: 54, sparkline: generateSparkline(67, 20, 63) },
  { symbol: "KBANK", name: "Kasikornbank", name_th: "กสิกรไทย", sector: "Banking", price: 142.50, open: 140.50, high: 143.00, low: 140.00, close: 142.50, volume: 11200000, change: 2.00, change_pct: 1.42, ai_direction: "up", ai_confidence: 64, sparkline: generateSparkline(75, 20, 142) },
  { symbol: "ADVANC", name: "Advanced Info Service", name_th: "เอไอเอส", sector: "ICT & Telecom", price: 218.00, open: 221.00, high: 221.50, low: 217.50, close: 218.00, volume: 6700000, change: -3.00, change_pct: -1.36, ai_direction: "down", ai_confidence: 59, sparkline: generateSparkline(65, 20, 221) },
  { symbol: "SCB", name: "SCBX", name_th: "เอสซีบี เอกซ์", sector: "Banking", price: 108.50, open: 108.00, high: 109.00, low: 107.50, close: 108.50, volume: 8900000, change: 0.50, change_pct: 0.46, ai_direction: "up", ai_confidence: 61, sparkline: generateSparkline(83, 20, 108) },
  { symbol: "BDMS", name: "Bangkok Dusit Medical", name_th: "บีดีเอ็มเอส", sector: "Health Care Services", price: 27.75, open: 28.00, high: 28.25, low: 27.50, close: 27.75, volume: 15300000, change: -0.25, change_pct: -0.89, ai_direction: "side", ai_confidence: 51, sparkline: generateSparkline(66, 20, 28) },
  { symbol: "GULF", name: "Gulf Energy Development", name_th: "กัลฟ์", sector: "Energy & Utilities", price: 51.25, open: 50.25, high: 51.75, low: 50.00, close: 51.25, volume: 22600000, change: 1.00, change_pct: 1.99, ai_direction: "up", ai_confidence: 66, sparkline: generateSparkline(71, 20, 51) },
];

export function searchMockStocks(q: string, sector = ""): Stock[] {
  let results = MOCK_STOCKS;
  if (sector) results = results.filter((s) => s.sector === sector);
  if (!q) return results;
  const ql = q.toLowerCase();
  return results.filter(
    (s) =>
      s.symbol.toLowerCase().includes(ql) ||
      s.name.toLowerCase().includes(ql) ||
      s.name_th.includes(ql)
  );
}

export function getMockStock(symbol: string): Stock | undefined {
  return MOCK_STOCKS.find((s) => s.symbol === symbol.toUpperCase());
}
