import { NextResponse } from "next/server";
import { getStockIndicators } from "@/lib/api/stocks-api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") ?? "90", 10);
  const data = await getStockIndicators(symbol.toUpperCase(), days);
  return NextResponse.json(data);
}
