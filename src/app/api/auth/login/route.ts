import { NextResponse } from "next/server";
import { fetchHF, isHFAvailable } from "@/lib/api/hf-client";

export async function POST(request: Request) {
  if (!isHFAvailable()) {
    return NextResponse.json({ detail: "Auth service unavailable — backend not configured" }, { status: 503 });
  }
  const body = await request.json();
  const res = await fetchHF("/auth/login", { method: "POST", body: JSON.stringify(body) });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
