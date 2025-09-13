// app/api/auth/login/route.js
import { NextResponse } from 'next/server'

const API_BASE = process.env.API_BASE ?? 'https://movie-api-decs.onrender.com/api'

export async function POST(request) {
  let username = '', password = ''
  if ((request.headers.get('content-type') || '').includes('application/json')) {
    const body = await request.json()
    username = body?.username || ''
    password = body?.password || ''
  } else {
    const fd = await request.formData()
    username = String(fd.get('username') || '')
    password = String(fd.get('password') || '')
  }

  const upstream = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ username, password })
  })

  const data = await upstream.json()
  if (!upstream.ok) {
    return NextResponse.json(data, { status: upstream.status })
  }

  const url = new URL(request.url)
  const redirectTo = url.searchParams.get('redirect')

  const res = redirectTo
    ? NextResponse.redirect(new URL(redirectTo, request.url), { status: 302 })
    : NextResponse.json(data, { status: 200 })

  // set auth cookies
  res.cookies.set('auth_token', data.token, { httpOnly: true, path: '/', sameSite: 'lax' })
  res.cookies.set('username', data.user?.username || username, { path: '/', sameSite: 'lax' })
  return res
}
