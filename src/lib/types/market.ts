export interface SetIndex {
  value: number;
  change: number;
  pct: number;
}

export interface SectorData {
  name: string;
  code: string;
  pct: number;
  count: number;
  set50_count: number;
  set100_count: number;
  sparkline: number[];
  industry_group: string;
  industry_group_code: string;
}

export interface MarketSummary {
  set_index: SetIndex;
  advancers: number;
  decliners: number;
  unchanged: number;
  total_stocks: number;
  total_volume: number;
  top_gainers: import("./stock").Stock[];
  top_losers: import("./stock").Stock[];
  sectors: SectorData[];
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  time: string;
  url?: string;
}
