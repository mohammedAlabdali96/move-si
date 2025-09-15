'use client'

import { useMemo, useState } from 'react'
import MovieCard from '@/components/MovieCard'

export default function FavoritesGrid({ movies, isAuthed = false, pageSize = 8, redirectPath = '/favorites' }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(movies.length / pageSize))

  const current = useMemo(() => {
    const start = (page - 1) * pageSize
    return movies.slice(start, start + pageSize)
  }, [movies, page, pageSize])

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {current.map((m) => (
          <MovieCard key={m.id} movie={m} isAuthed={isAuthed} redirectPath={redirectPath} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="underline disabled:opacity-50"
          >
            Prev
          </button>
          <span>Page {page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="underline disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      )}
    </>
  )
}
