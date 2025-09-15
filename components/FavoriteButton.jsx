'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

export default function FavoriteButton({
  movieId,
  initialFavorite,
  isAuthed = false,
  redirectPath = '/'
}) {
  // Not logged in → show prompt
  if (!isAuthed) {
    const next = encodeURIComponent(redirectPath)
    return (
      <p className="mt-2 text-sm text-gray-600">
        To save favorites, please{' '}
        <Link href={`/login?next=${next}`} className="underline">log in</Link>
        {' '}(or sign up).
      </p>
    )
  }

  // Pure optimistic UI
  const [fav, setFav] = useState(Boolean(initialFavorite))
  const inflight = useRef(false) // prevent rapid double taps without showing any loader

  async function onSubmit(e) {
    e.preventDefault()
    if (inflight.current) return

    const target = !fav
    setFav(target)           // optimistic flip
    inflight.current = true

    try {
      const url = `/api/movies/${movieId}/favorite${target ? '' : '?method=delete'}`
      const res = await fetch(url, { method: 'POST' })
      if (!res.ok) throw new Error('toggle failed')
      // success: keep optimistic state
    } catch {
      setFav(!target)        // rollback on failure
    } finally {
      inflight.current = false
    }
  }

  const qs = new URLSearchParams()
  if (fav) qs.set('method', 'delete')
  qs.set('redirect', redirectPath)
  const action = `/api/movies/${movieId}/favorite?${qs.toString()}`

  return (
    <form method="post" action={action} onSubmit={onSubmit} className="mt-2">
      <button
        className="text-sm underline"
        aria-pressed={fav}
      >
        {fav ? 'Remove from favorites' : 'Add to favorites'}
      </button>
    </form>
  )
}
