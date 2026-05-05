import { NextResponse } from "next/server";
import { getStocks } from "@/lib/api/stocks-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const sector = searchParams.get("sector") ?? "";
  const data = await getStocks(q, sector);
  return NextResponse.json(data);
}
