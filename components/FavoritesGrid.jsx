"use client";

import { useMemo, useState } from "react";
import MovieCard from "@/components/MovieCard";

export default function FavoritesGrid({
  movies,
  isAuthed = false,
  pageSize = 8,
  redirectPath = "/favorites",
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(movies.length / pageSize));

  const current = useMemo(() => {
    const start = (page - 1) * pageSize;
    return movies.slice(start, start + pageSize);
  }, [movies, page, pageSize]);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {current.map((m) => (
          <MovieCard
            key={m.id}
            movie={m}
            isAuthed={isAuthed}
            redirectPath={redirectPath}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-full border px-3 py-1.5 text-sm transition hover:bg-neutral-50 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-neutral-600">
            Page <span className="font-medium text-neutral-900">{page}</span> /{" "}
            {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-full border px-3 py-1.5 text-sm transition hover:bg-neutral-50 disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      )}
    </>
  );
}
