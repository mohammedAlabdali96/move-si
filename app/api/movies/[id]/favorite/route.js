// app/api/movies/[id]/favorite/route.js
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE = process.env.API_BASE ?? 'https://movie-api-decs.onrender.com/api'

export async function POST(request, { params }) {
  const token = cookies().get('auth_token')?.value
  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const url = new URL(request.url)
  const method = url.searchParams.get('method') === 'delete' ? 'DELETE' : 'POST'

  const upstream = await fetch(`${API_BASE}/movies/${params.id}/favorite`, {
    method,
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
  })

  const body = await upstream.text()
  const redirectTo = url.searchParams.get('redirect')
  if (redirectTo) {
    return NextResponse.redirect(new URL(redirectTo, request.url), { status: 302 })
  }

  return new Response(body, {
    status: upstream.status,
    headers: { 'Content-Type': 'application/json' }
  })
}
