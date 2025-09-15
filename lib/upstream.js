import { cookies } from "next/headers";
import { API_BASE } from "@/lib/env";

export async function upstream(path, init = {}) {
  const token = (await cookies()).get("auth_token")?.value;
  const authed = Boolean(token);

  const hdrs = {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers || {}),
  };

  const opts = authed
    ? { ...init, headers: hdrs, cache: "no-store" }
    : { ...init, headers: hdrs, next: { revalidate: 60 } };

  return fetch(`${API_BASE}${path}`, opts);
}

export async function upstreamText(path, init) {
  const res = await upstream(path, init);
  const body = await res.text();
  return { res, body };
}
export async function upstreamJson(path, init) {
  const res = await upstream(path, init);
  const json = await res.json().catch(() => null);
  return { res, json };
}
