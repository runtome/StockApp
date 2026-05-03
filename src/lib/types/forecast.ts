export type ModelType = "XGBoost" | "LSTM" | "Random Forest" | "Prophet" | "ARIMA";
export type Direction = "Up" | "Slight Up" | "Sideways" | "Slight Down" | "Down";
export type RiskTolerance = "low" | "medium" | "high";

export interface ForecastRequest {
  symbol: string;
  model: ModelType;
  horizon: number;
  training_days: number;
  features: string[];
  risk_tolerance: RiskTolerance;
}

export interface PredictionPoint {
  date: string;
  price: number;
  lower: number;
  upper: number;
}

export interface ForecastResponse {
  symbol: string;
  model: string;
  direction: Direction;
  confidence: number;
  predictions: PredictionPoint[];
  reasons: string[];
  risk_score: string;
  disclaimer: string;
}

export interface ForecastSettings {
  selectedStocks: string[];
  model: ModelType;
  horizon: number;
  trainingDays: number;
  features: string[];
  riskTolerance: RiskTolerance;
}
