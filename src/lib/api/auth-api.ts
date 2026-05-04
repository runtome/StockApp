interface AuthResponse { token: string; name: string; email: string; }

async function call(path: string, body: object): Promise<AuthResponse> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? "Request failed");
  return data;
}

export async function apiRegister(payload: {
  name: string;
  email: string;
  password: string;
  accepted_terms: boolean;
  accepted_cookies: boolean;
}): Promise<AuthResponse> {
  return call("/api/auth/register", payload);
}

export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  return call("/api/auth/login", { email, password });
}
