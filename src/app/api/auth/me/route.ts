import { NextResponse } from "next/server";
import { fetchHF, isHFAvailable } from "@/lib/api/hf-client";

export async function GET(request: Request) {
  if (!isHFAvailable()) {
    return NextResponse.json({ detail: "Not configured" }, { status: 503 });
  }
  const auth = request.headers.get("Authorization") ?? "";
  const res = await fetchHF("/auth/me", { headers: { Authorization: auth } });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
