const API_BASE = process.env.API_BASE ?? 'https://movie-api-decs.onrender.com/api'

export async function GET(_request, { params }) {
  const id = params.id
  const res = await fetch(`${API_BASE}/movies/${id}`, {
    headers: { 'Accept': 'application/json' },
    cache: 'no-store'
  })

  const body = await res.text()
  return new Response(body, {
    status: res.status,
    headers: { 'Content-Type': 'application/json' }
  })
}
