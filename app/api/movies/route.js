import { cookies } from 'next/headers'
const API_BASE = process.env.API_BASE ?? 'https://movie-api-decs.onrender.com/api'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') ?? '1'
  const limit = searchParams.get('limit') ?? '8'

  // Next 15: cookies() is async
  const token = (await cookies()).get('auth_token')?.value
  const isAuthed = Boolean(token)

  const hdrs = {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }

  const fetchOpts = isAuthed
    ? { headers: hdrs, cache: 'no-store' }
    : { headers: hdrs, next: { revalidate: 60 } }

  const upstream = await fetch(`${API_BASE}/movies?page=${page}&limit=${limit}`, fetchOpts)
  const body = await upstream.text()

  const out = new Headers({ 'Content-Type': 'application/json' })
  // Help caches keep variants separate
  out.set('Vary', 'Cookie')
  if (!isAuthed) {
    out.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
  }

  return new Response(body, { status: upstream.status, headers: out })
}
