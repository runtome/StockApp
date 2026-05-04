import type { MarketSummary } from "@/lib/types/market";
import { MOCK_STOCKS } from "./stocks";

export const MOCK_MARKET_SUMMARY: MarketSummary = {
  set_index: { value: 1493.69, change: 3.21, pct: 0.22 },
  advancers: 482,
  decliners: 241,
  unchanged: 60,
  total_stocks: 783,
  total_volume: 38_200_000_000,
  top_gainers: MOCK_STOCKS.filter((s) => s.change_pct > 0).slice(0, 3),
  top_losers: MOCK_STOCKS.filter((s) => s.change_pct < 0).slice(0, 3),
  sectors: [
    { name: "Energy", pct: 1.42 },
    { name: "Banking", pct: 0.92 },
    { name: "Transport", pct: 2.05 },
    { name: "ICT", pct: -0.84 },
    { name: "Commerce", pct: -0.61 },
    { name: "Health", pct: -0.18 },
    { name: "Property", pct: 0.35 },
    { name: "Food", pct: 0.74 },
  ],
};
