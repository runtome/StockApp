export interface Stock {
  symbol: string;
  name: string;
  name_th: string;
  sector: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  change: number;
  change_pct: number;
  ai_direction?: "up" | "down" | "side";
  ai_confidence?: number;
  sparkline?: number[];
}

export interface OHLCV {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IndicatorRecord extends OHLCV {
  sma5: number | null;
  sma20: number | null;
  sma50: number | null;
  sma200: number | null;
  rsi: number | null;
  macd: number | null;
  macd_signal: number | null;
  macd_hist: number | null;
  bb_lower: number | null;
  bb_mid: number | null;
  bb_upper: number | null;
}

export interface Signal {
  indicator: string;
  signal: string;
  color: "up" | "down" | "muted" | "warn";
}

export interface IndicatorsResponse {
  symbol: string;
  records: IndicatorRecord[];
  signals: Signal[];
}
