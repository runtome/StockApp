const HF_BASE = process.env.HF_SPACE_URL;

export async function fetchHF(path: string, options?: RequestInit): Promise<Response> {
  const base = HF_BASE ?? "/hf";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (process.env.HF_SPACE_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.HF_SPACE_TOKEN}`;
  }
  return fetch(`${base}${path}`, {
    ...options,
    headers: { ...headers, ...(options?.headers as Record<string, string> ?? {}) },
    next: { revalidate: 60 },
  });
}

export function isHFAvailable(): boolean {
  return !!HF_BASE;
}
