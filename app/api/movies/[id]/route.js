import { cookies } from 'next/headers'
const API_BASE = process.env.API_BASE ?? 'https://movie-api-decs.onrender.com/api'

export async function GET(_request, { params }) {
  const token = (await cookies()).get('auth_token')?.value
  const isAuthed = Boolean(token)
  const headers = { Accept: 'application/json',...(token ? { Authorization: `Bearer ${token}` } : {})  }

  const fetchOpts = isAuthed
    ? { headers, cache: 'no-store' }
    : { headers, next: { revalidate: 60 } }

  const upstream = await fetch(`${API_BASE}/movies/${params.id}`, fetchOpts)
  const body = await upstream.text()

  const out = new Headers({ 'Content-Type': 'application/json' })
  if (!isAuthed) out.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')

  return new Response(body, { status: upstream.status, headers: out })
}
