import { NextRequest, NextResponse } from "next/server";

const HF = process.env.HF_SPACE_URL;

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const auth = req.headers.get("authorization") ?? "";
  if (!HF) return NextResponse.json({ ok: true });
  const res = await fetch(`${HF}/portfolio/positions/${symbol}`, {
    method: "DELETE",
    headers: { authorization: auth },
    cache: "no-store",
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
