import type { MarketSummary } from "@/lib/types/market";
import { MOCK_STOCKS } from "./stocks";

function seededSparkline(seed: number, length = 20): number[] {
  let s = seed;
  const lcg = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
  const data = [100.0];
  for (let i = 1; i < length; i++) {
    data.push(Math.round((data[i - 1] + (lcg() - 0.5) * 2.4) * 1000) / 1000);
  }
  return data;
}

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
    { name: "Food & Beverage",                          code: "FOOD",    pct:  0.93, count: 1, set50_count: 1, set100_count: 1, sparkline: seededSparkline(201), industry_group: "Agro & Food Industry",    industry_group_code: "AGRO"    },
    { name: "Banking",                                  code: "BANK",    pct:  0.89, count: 4, set50_count: 4, set100_count: 4, sparkline: seededSparkline(202), industry_group: "Financials",              industry_group_code: "FINCIAL" },
    { name: "Construction Materials",                   code: "CONMAT",  pct:  1.79, count: 1, set50_count: 1, set100_count: 1, sparkline: seededSparkline(203), industry_group: "Property & Construction", industry_group_code: "PROPCON" },
    { name: "Energy & Utilities",                       code: "ENERG",   pct:  1.09, count: 2, set50_count: 2, set100_count: 2, sparkline: seededSparkline(204), industry_group: "Resources",               industry_group_code: "RESOURC" },
    { name: "Commerce",                                 code: "COMM",    pct: -1.19, count: 1, set50_count: 1, set100_count: 1, sparkline: seededSparkline(205), industry_group: "Services",                industry_group_code: "SERVICE" },
    { name: "Health Care Services",                     code: "HELTH",   pct: -0.89, count: 1, set50_count: 1, set100_count: 1, sparkline: seededSparkline(206), industry_group: "Services",                industry_group_code: "SERVICE" },
    { name: "Tourism & Leisure",                        code: "TOURISM", pct: -1.47, count: 1, set50_count: 1, set100_count: 1, sparkline: seededSparkline(207), industry_group: "Services",                industry_group_code: "SERVICE" },
    { name: "Transportation & Logistics",               code: "TRANS",   pct:  2.17, count: 1, set50_count: 1, set100_count: 1, sparkline: seededSparkline(208), industry_group: "Services",                industry_group_code: "SERVICE" },
    { name: "Electronic Components",                    code: "ETRON",   pct: -1.45, count: 1, set50_count: 1, set100_count: 1, sparkline: seededSparkline(209), industry_group: "Technology",              industry_group_code: "TECH"    },
    { name: "Information & Communication Technology",   code: "ICT",     pct: -1.36, count: 2, set50_count: 1, set100_count: 2, sparkline: seededSparkline(210), industry_group: "Technology",              industry_group_code: "TECH"    },
  ],
};
