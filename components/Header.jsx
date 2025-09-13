import Link from 'next/link'
import { cookies } from 'next/headers'

export default function Header() {
  const jar = cookies()
  const isAuthed = !!jar.get('auth_token')?.value
  const username = jar.get('username')?.value

  return (
    <header className="px-4 py-3 border-b flex items-center justify-between bg-white">
      <Link href="/" className="font-semibold">🎬 Movie Discovery</Link>

      {isAuthed ? (
        <div className="flex items-center gap-3">
          <span className="text-sm">Hi, {username}</span>
          <form method="post" action="/api/auth/logout?redirect=/">
            <button className="underline">Logout</button>
          </form>
        </div>
      ) : (
        <Link href="/login" className="underline">Login</Link>
      )}
    </header>
  )
}
