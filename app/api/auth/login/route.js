import { NextResponse } from "next/server";
import { upstreamJson } from "@/lib/upstream";

export async function POST(request) {
  let username = "",
    password = "";
  if (
    (request.headers.get("content-type") || "").includes("application/json")
  ) {
    const body = await request.json();
    username = body?.username || "";
    password = body?.password || "";
  } else {
    const fd = await request.formData();
    username = String(fd.get("username") || "");
    password = String(fd.get("password") || "");
  }

  const { res, json } = await upstreamJson("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) return NextResponse.json(json, { status: res.status });

  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect");
  const out = redirectTo
    ? NextResponse.redirect(new URL(redirectTo, request.url), { status: 302 })
    : NextResponse.json(json, { status: 200 });

  out.cookies.set("auth_token", json.token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });
  out.cookies.set("username", json.user?.username || username, {
    path: "/",
    sameSite: "lax",
  });
  return out;
}
