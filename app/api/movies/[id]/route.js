// app/api/movies/[id]/route.js
import { cookies } from 'next/headers'

const API_BASE = process.env.API_BASE ?? 'https://movie-api-decs.onrender.com/api'

export async function GET(_request, { params }) {
  const isAuthed = Boolean(cookies().get('auth_token'))
  const fetchOpts = isAuthed
    ? { headers: { Accept: 'application/json' }, cache: 'no-store' }
    : { headers: { Accept: 'application/json' }, next: { revalidate: 60 } }

  const upstream = await fetch(`${API_BASE}/movies/${params.id}`, fetchOpts)
  const body = await upstream.text()

  const headers = new Headers({ 'Content-Type': 'application/json' })
  if (!isAuthed) headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')

  return new Response(body, { status: upstream.status, headers })
}
