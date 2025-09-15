import { NextResponse } from "next/server";

export async function POST(request) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect");

  const res = redirectTo
    ? NextResponse.redirect(new URL(redirectTo, request.url), { status: 302 })
    : NextResponse.json({ ok: true });

  res.cookies.set("auth_token", "", { path: "/", maxAge: 0 });
  res.cookies.set("username", "", { path: "/", maxAge: 0 });
  return res;
}
