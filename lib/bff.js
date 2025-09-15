import { headers } from "next/headers";
import { ApiError } from "@/lib/errors";

export async function apiFetch(path, init = {}) {
  if (typeof window === "undefined") {
    const h = await headers();
    const host = h.get("host");
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const url = `${protocol}://${host}${path}`;
    const cookie = h.get("cookie") ?? "";
    return fetch(url, {
      ...init,
      headers: { ...(init.headers || {}), cookie },
    });
  }
  return fetch(path, init);
}

export async function apiGetJson(path, init) {
  const res = await apiFetch(path, init);
  let body = null;
  try {
    body = await res.json();
  } catch {}

  if (!res.ok) {
    const msg =
      body?.message || body?.error || `Request failed (${res.status})`;
    throw new ApiError(res.status, msg, { retryAfter: body?.retryAfter });
  }
  return body;
}
