import { upstream } from "@/lib/upstream";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request, ctx) {
  const token = (await cookies()).get("auth_token")?.value;
  if (!token)
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  const { id } = await ctx.params;

  const url = new URL(request.url);
  const method =
    url.searchParams.get("method") === "delete" ? "DELETE" : "POST";

  const res = await upstream(`/movies/${id}/favorite`, { method });
  const body = await res.text();

  const redirectTo = url.searchParams.get("redirect");
  if (redirectTo)
    return NextResponse.redirect(new URL(redirectTo, request.url), {
      status: 302,
    });

  return new Response(body, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
