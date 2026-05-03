import type { ForecastRequest, ForecastResponse } from "@/lib/types/forecast";
import { generateMockForecast } from "@/lib/mock/forecast";
import { isHFAvailable } from "./hf-client";

export async function runForecast(req: ForecastRequest): Promise<ForecastResponse> {
  if (!isHFAvailable()) return generateMockForecast(req.symbol, req.model);
  try {
    const res = await fetch("/hf/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (!res.ok) return generateMockForecast(req.symbol, req.model);
    return res.json();
  } catch {
    return generateMockForecast(req.symbol, req.model);
  }
}
