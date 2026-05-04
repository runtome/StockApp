import { NextRequest, NextResponse } from "next/server";

const HF = process.env.HF_SPACE_URL;

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  if (!HF) {
    return NextResponse.json({ total_value: 0, total_cost: 0, total_gain_loss: 0, total_gain_loss_pct: 0, positions: [] });
  }
  const res = await fetch(`${HF}/portfolio`, {
    headers: { authorization: auth },
    cache: "no-store",
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  if (!HF) return NextResponse.json({ ok: true });
  const body = await req.json();
  const res = await fetch(`${HF}/portfolio/positions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", authorization: auth },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
