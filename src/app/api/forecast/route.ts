import { NextResponse } from "next/server";
import type { ForecastRequest } from "@/lib/types/forecast";
import { generateMockForecast } from "@/lib/mock/forecast";
import { isHFAvailable } from "@/lib/api/hf-client";

export async function POST(request: Request) {
  const body: ForecastRequest = await request.json();
  if (!isHFAvailable()) {
    return NextResponse.json(generateMockForecast(body.symbol, body.model));
  }
  try {
    const res = await fetch(`${process.env.HF_SPACE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return NextResponse.json(generateMockForecast(body.symbol, body.model));
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json(generateMockForecast(body.symbol, body.model));
  }
}
