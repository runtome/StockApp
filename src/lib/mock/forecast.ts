import type { ForecastResponse } from "@/lib/types/forecast";

export function generateMockForecast(symbol: string, model: string): ForecastResponse {
  const base = 58.75;
  const today = new Date();
  const predictions = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i + 1);
    const price = base * (1 + (i + 1) * 0.002);
    return {
      date: d.toISOString().split("T")[0],
      price: Math.round(price * 100) / 100,
      lower: Math.round((price * 0.985) * 100) / 100,
      upper: Math.round((price * 1.015) * 100) / 100,
    };
  });
  return {
    symbol,
    model,
    direction: "Slight Up",
    confidence: 68,
    predictions,
    reasons: ["Price above MA20", "RSI neutral (52)", "Volume increasing"],
    risk_score: "medium",
    disclaimer:
      "This forecast is for educational and analytical purposes only. It is not financial advice. Results are based on historical data and may be inaccurate. Invest at your own risk. / การพยากรณ์นี้มีวัตถุประสงค์เพื่อการศึกษาและวิเคราะห์เท่านั้น ไม่ใช่คำแนะนำทางการเงิน",
  };
}
