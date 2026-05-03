export interface Position {
  symbol: string;
  name: string;
  shares: number;
  avg_cost: number;
  current_price: number;
  value: number;
  gain_loss: number;
  gain_loss_pct: number;
  allocation_pct: number;
}

export interface Portfolio {
  total_value: number;
  total_cost: number;
  total_gain_loss: number;
  total_gain_loss_pct: number;
  positions: Position[];
}
