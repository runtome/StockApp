import { NextResponse } from "next/server";
import type { ForecastRequest } from "@/lib/types/forecast";
import { generateMockForecast } from "@/lib/mock/forecast";
import { fetchHF, isHFAvailable } from "@/lib/api/hf-client";

export async function POST(request: Request) {
  const body: ForecastRequest = await request.json();

  // Dev mode (no backend configured) — return mock with clear label
  if (!isHFAvailable()) {
    return NextResponse.json({ ...generateMockForecast(body.symbol, body.model), _mock: true });
  }

  try {
    // Use fetchHF so HF_SPACE_TOKEN is applied consistently
    const res = await fetchHF("/predict", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Backend returned ${res.status}` },
        { status: res.status },
      );
    }
    return NextResponse.json(await res.json());
  } catch (err) {
    return NextResponse.json({ error: "Forecast service unavailable" }, { status: 502 });
  }
}
