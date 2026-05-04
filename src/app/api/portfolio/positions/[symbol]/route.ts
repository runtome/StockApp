import { NextRequest, NextResponse } from "next/server";

const HF = process.env.HF_SPACE_URL;

function hfHeaders(userAuth: string): Record<string, string> {
  const h: Record<string, string> = {};
  if (process.env.HF_SPACE_TOKEN) h["X-HF-Authorization"] = `Bearer ${process.env.HF_SPACE_TOKEN}`;
  if (userAuth) h["authorization"] = userAuth;
  return h;
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const auth = req.headers.get("authorization") ?? "";
  if (!HF) {
    return NextResponse.json(
      { error: "Portfolio backend is not configured — positions cannot be deleted" },
      { status: 503 },
    );
  }
  const res = await fetch(`${HF}/portfolio/positions/${symbol}`, {
    method: "DELETE",
    headers: hfHeaders(auth),
    cache: "no-store",
  });
  return NextResponse.json(await res.json(), { status: res.status });
}
