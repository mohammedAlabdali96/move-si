import { upstreamText } from "@/lib/upstream";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "8";

  const { res, body } = await upstreamText(
    `/movies?page=${page}&limit=${limit}`
  );

  const headers = new Headers({
    "Content-Type": "application/json",
    Vary: "Cookie",
  });
  if (res.status === 200 && !res.headers.get("authorization")) {
    headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );
  }

  return new Response(body, { status: res.status, headers });
}
