import Link from "next/link";
import { cookies } from "next/headers";
import { apiGetJson } from "@/lib/bff";

import MovieCard from "@/components/MovieCard";

async function getMovies(searchParams) {
  const page = Number(searchParams?.page ?? 1);
  const limit = 8;
  return apiGetJson(`/api/movies?page=${page}&limit=${limit}`, {
    cache: "no-store",
  });
}

export default async function Home({ searchParams }) {
  const sp = await searchParams;
  const data = await getMovies(sp);
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
