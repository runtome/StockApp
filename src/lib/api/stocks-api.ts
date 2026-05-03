import { fetchHF, isHFAvailable } from "./hf-client";
import { MOCK_STOCKS, searchMockStocks, getMockStock } from "@/lib/mock/stocks";
import { generateMockHistory } from "@/lib/mock/history";
import { MOCK_MARKET_SUMMARY } from "@/lib/mock/market-summary";

export async function getStocks(q = "") {
  if (!isHFAvailable()) return searchMockStocks(q);
  try {
    const res = await fetchHF(`/stocks${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    if (!res.ok) return searchMockStocks(q);
    return res.json();
  } catch {
    return searchMockStocks(q);
  }
}

export async function getStockDetail(symbol: string) {
  if (!isHFAvailable()) return getMockStock(symbol) ?? null;
  try {
    const res = await fetchHF(`/stocks/${symbol}`);
    if (!res.ok) return getMockStock(symbol) ?? null;
    return res.json();
  } catch {
    return getMockStock(symbol) ?? null;
  }
}

export async function getStockHistory(symbol: string, days = 90) {
  if (!isHFAvailable()) return { symbol, days, data: generateMockHistory(symbol, days) };
  try {
    const res = await fetchHF(`/stocks/${symbol}/history?days=${days}`);
    if (!res.ok) return { symbol, days, data: generateMockHistory(symbol, days) };
    return res.json();
  } catch {
    return { symbol, days, data: generateMockHistory(symbol, days) };
  }
}

export async function getStockIndicators(symbol: string, days = 90) {
  if (!isHFAvailable()) {
    const history = generateMockHistory(symbol, days + 60);
    return { symbol, records: history.slice(-days), signals: [] };
  }
  try {
    const res = await fetchHF(`/stocks/${symbol}/indicators?days=${days}`);
    if (!res.ok) {
      const history = generateMockHistory(symbol, days);
      return { symbol, records: history, signals: [] };
    }
    return res.json();
  } catch {
    const history = generateMockHistory(symbol, days);
    return { symbol, records: history, signals: [] };
  }
}

export async function getMarketSummary() {
  if (!isHFAvailable()) return MOCK_MARKET_SUMMARY;
  try {
    const res = await fetchHF("/market/summary");
    if (!res.ok) return MOCK_MARKET_SUMMARY;
    return res.json();
  } catch {
    return MOCK_MARKET_SUMMARY;
  }
}
