import { fetchHF, isHFAvailable } from "./hf-client";
import { searchMockStocks, getMockStock } from "@/lib/mock/stocks";
import { generateMockHistory } from "@/lib/mock/history";
import { MOCK_MARKET_SUMMARY } from "@/lib/mock/market-summary";
import type { MarketSummary } from "@/lib/types/market";

// Empty fallback returned when the backend is configured but unreachable.
// Mock data is ONLY used when HF_SPACE_URL is unset (dev/local mode).
const EMPTY_MARKET_SUMMARY: MarketSummary = {
  set_index: { value: 0, change: 0, pct: 0 },
  advancers: 0,
  decliners: 0,
  unchanged: 0,
  total_stocks: 0,
  total_volume: 0,
  top_gainers: [],
  top_losers: [],
  sectors: [],
};

export async function getStocks(q = "") {
  if (!isHFAvailable()) return searchMockStocks(q);
  try {
    const res = await fetchHF(`/stocks${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getStockDetail(symbol: string) {
  if (!isHFAvailable()) return getMockStock(symbol) ?? null;
  try {
    const res = await fetchHF(`/stocks/${symbol}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getStockHistory(symbol: string, days = 90) {
  if (!isHFAvailable()) return { symbol, days, data: generateMockHistory(symbol, days) };
  try {
    const res = await fetchHF(`/stocks/${symbol}/history?days=${days}`);
    if (!res.ok) return { symbol, days, data: [] };
    return res.json();
  } catch {
    return { symbol, days, data: [] };
  }
}

export async function getStockIndicators(symbol: string, days = 90) {
  if (!isHFAvailable()) {
    const history = generateMockHistory(symbol, days + 60);
    return { symbol, records: history.slice(-days), signals: [] };
  }
  try {
    const res = await fetchHF(`/stocks/${symbol}/indicators?days=${days}`);
    if (!res.ok) return { symbol, records: [], signals: [] };
    return res.json();
  } catch {
    return { symbol, records: [], signals: [] };
  }
}

export async function getMarketSummary() {
  if (!isHFAvailable()) return MOCK_MARKET_SUMMARY;
  try {
    const res = await fetchHF("/market/summary");
    if (!res.ok) return EMPTY_MARKET_SUMMARY;
    return res.json();
  } catch {
    return EMPTY_MARKET_SUMMARY;
  }
}
