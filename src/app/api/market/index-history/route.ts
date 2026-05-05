import { NextResponse } from "next/server";

const RANGE_DAYS: Record<string, number> = {
  "1D": 5, "5D": 10, "6M": 180, "1Y": 365, "5Y": 1825,
};

const INDEX_MOCK_BASE: Record<string, number> = {
  SET: 1493.69, SET50: 972.45, SET100: 1234.56,
};

function seededRand(seed: number) {
  let s = seed | 0;
  return () => { s = Math.imul(1664525, s) + 1013904223; return (s >>> 0) / 0x100000000; };
}

function syntheticHistory(days: number, base: number): { date: string; close: number }[] {
  const today = new Date();
  const seed = parseInt(today.toISOString().slice(0, 10).replace(/-/g, "")) * 1000 + days;
  const rand = seededRand(seed);
  const values = [base];
  for (let i = 0; i < days; i++) {
    const r = (rand() - 0.5) * 0.018;
    values.push(Math.round((values[values.length - 1] / (1 + r)) * 100) / 100);
  }
  values.reverse();
  values[values.length - 1] = base;
  return values.map((close, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - i));
    return { date: d.toISOString().slice(0, 10), close };
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const index = (searchParams.get("index") ?? "SET").toUpperCase();
  const range = (searchParams.get("range") ?? "6M").toUpperCase();
  const days = RANGE_DAYS[range] ?? 180;

  const hfUrl = process.env.HF_SPACE_URL;
  if (hfUrl) {
    try {
      const headers: Record<string, string> = {};
      if (process.env.HF_SPACE_TOKEN) headers["Authorization"] = `Bearer ${process.env.HF_SPACE_TOKEN}`;
      const res = await fetch(`${hfUrl}/market/index-history?index=${index}&range=${range}`, {
        headers,
        next: { revalidate: 3600 },
      });
      if (res.ok) return NextResponse.json(await res.json());
    } catch {}
  }

  const base = INDEX_MOCK_BASE[index] ?? 1493.69;
  return NextResponse.json({ index, range, data: syntheticHistory(days, base) });
}
