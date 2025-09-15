import Link from 'next/link'
import { headers, cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import FavoritesGrid from '@/components/FavoritesGrid'

export const metadata = {
  title: 'My Favorites · Movie Discovery',
  robots: { index: false, follow: false }
}

// Build absolute URL to our BFF + forward cookies
async function bffFetchJson(path) {
  const h = await headers()
  const host = h.get('host')
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const url = `${protocol}://${host}${path}`
  const res = await fetch(url, {
    cache: 'no-store',
    headers: { cookie: h.get('cookie') ?? '' } // forward auth cookie
  })
  if (!res.ok) throw new Error(`BFF ${path} failed ${res.status}`)
  return res.json()
}

export default async function FavoritesPage() {
  const jar = await cookies()
  if (!jar.get('auth_token')) redirect('/login?next=/favorites')

  // Get page 1 to learn total pages
  const first = await bffFetchJson('/api/movies?page=1&limit=8')
  const totalPages = Math.max(1, Number(first?.pagination?.totalPages || 1))

  // Fetch the rest in parallel
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) =>
      bffFetchJson(`/api/movies?page=${i + 2}&limit=8`)
    )
  )

  const allMovies = [first, ...rest].flatMap(d => d?.movies || [])
  const favorites = allMovies.filter(m => m.favorite)


  const isAuthed = true

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">My Favorites</h1>
      </div>

      {!favorites.length ? (
        <p>No favorites yet.</p>
      ) : (
        <FavoritesGrid movies={favorites} isAuthed={isAuthed} pageSize={8} redirectPath="/favorites" />
      )}
    </>
  )
}
