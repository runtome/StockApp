import { NextRequest, NextResponse } from "next/server";

const HF = process.env.HF_SPACE_URL;

function hfHeaders(userAuth: string): Record<string, string> {
  const h: Record<string, string> = {};
  // HF Space access token (for private spaces)
  if (process.env.HF_SPACE_TOKEN) h["X-HF-Authorization"] = `Bearer ${process.env.HF_SPACE_TOKEN}`;
  // User JWT forwarded as-is
  if (userAuth) h["authorization"] = userAuth;
  return h;
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  if (!HF) {
    return NextResponse.json({ total_value: 0, total_cost: 0, total_gain_loss: 0, total_gain_loss_pct: 0, positions: [] });
  }
  const res = await fetch(`${HF}/portfolio`, {
    headers: hfHeaders(auth),
    cache: "no-store",
  });
  return NextResponse.json(await res.json(), { status: res.status });
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  if (!HF) {
    return NextResponse.json(
      { error: "Portfolio backend is not configured — positions cannot be saved" },
      { status: 503 },
    );
  }
  const body = await req.json();
  const res = await fetch(`${HF}/portfolio/positions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...hfHeaders(auth) },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return NextResponse.json(await res.json(), { status: res.status });
}
