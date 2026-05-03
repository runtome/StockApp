"use client";
import { createContext, useContext, useState } from "react";
import type { ForecastSettings, ModelType, RiskTolerance } from "@/lib/types/forecast";

const DEFAULTS: ForecastSettings = {
  selectedStocks: ["AOT"],
  model: "XGBoost",
  horizon: 7,
  trainingDays: 365,
  features: ["MA", "RSI", "MACD", "Bollinger", "Volume"],
  riskTolerance: "medium",
};

interface ForecastContextValue {
  settings: ForecastSettings;
  setSettings: (s: ForecastSettings) => void;
  updateSetting: <K extends keyof ForecastSettings>(key: K, val: ForecastSettings[K]) => void;
}

const ForecastContext = createContext<ForecastContextValue>({
  settings: DEFAULTS,
  setSettings: () => {},
  updateSetting: () => {},
});

export function ForecastProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ForecastSettings>(DEFAULTS);
  const updateSetting = <K extends keyof ForecastSettings>(
    key: K,
    val: ForecastSettings[K]
  ) => setSettings((prev) => ({ ...prev, [key]: val }));
  return (
    <ForecastContext.Provider value={{ settings, setSettings, updateSetting }}>
      {children}
    </ForecastContext.Provider>
  );
}

export const useForecast = () => useContext(ForecastContext);
