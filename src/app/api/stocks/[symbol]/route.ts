import { NextResponse } from "next/server";
import { getStockDetail } from "@/lib/api/stocks-api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const data = await getStockDetail(symbol.toUpperCase());
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}
