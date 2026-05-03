import { NextResponse } from "next/server";
import { getMarketSummary } from "@/lib/api/stocks-api";

export async function GET() {
  const data = await getMarketSummary();
  return NextResponse.json(data);
}
