import Link from "next/link";
import { headers, cookies } from "next/headers";

import MovieCard from "@/components/MovieCard";

async function internalUrl(path) {
  const h = await headers();
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${host}${path}`;
}

async function getMovies(searchParams) {
  const page = Number(searchParams?.page ?? 1);
  const limit = 8;
  const h = await headers();
  const res = await fetch(
    await internalUrl(`/api/movies?page=${page}&limit=${limit}`),
    { cache: "no-store", headers: { cookie: h.get("cookie") ?? "" } }
  );
  if (!res.ok) return { error: `Failed to load movies (status ${res.status})` };
  return res.json();
}

export default async function Home({ searchParams }) {
  const data = await getMovies(searchParams);
  const movies = data?.movies ?? [];
  const pg = data?.pagination ?? {
    page: 1,
    totalPages: 1,
    hasPrev: false,
    hasNext: false,
  };
  const linkFor = (p) => `/?page=${p}`;
  const redirectPath = linkFor(pg.page);
  const isAuthed = !!(await cookies()).get("auth_token")?.value;

  console.log(movies);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Top Movies</h1>
      </div>

      {data?.error && <div className="text-red-600 mb-4">{data.error}</div>}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {movies.map((m) => (
          <MovieCard
            key={m.id}
            movie={m}
            redirectPath={redirectPath}
            isAuthed={isAuthed}
          />
        ))}
      </div>

      <nav className="flex items-center justify-center gap-2 mt-6">
        {pg.hasPrev ? (
          <Link href={linkFor(pg.page - 1)} className="underline">
            Prev
          </Link>
        ) : null}
        <span>
          Page {pg.page} / {pg.totalPages}
        </span>
        {pg.hasNext ? (
          <Link href={linkFor(pg.page + 1)} className="underline">
            Next
          </Link>
        ) : null}
      </nav>
    </>
  );
}
