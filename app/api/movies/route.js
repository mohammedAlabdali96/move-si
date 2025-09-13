// app/api/movies/route.js
const API_BASE = process.env.API_BASE ?? 'https://movie-api-decs.onrender.com/api'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') ?? '1'
  const limit = searchParams.get('limit') ?? '8'

  const res = await fetch(`${API_BASE}/movies?page=${page}&limit=${limit}`, {
    headers: { 'Accept': 'application/json' },
    cache: 'no-store'
  })

  const body = await res.text()
  return new Response(body, {
    status: res.status,
    headers: { 'Content-Type': 'application/json' }
  })
}
