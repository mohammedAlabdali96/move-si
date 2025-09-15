import Link from "next/link";
import { cookies } from "next/headers";

export default async function Header() {
  const jar = await cookies();
  const isAuthed = !!jar.get("auth_token")?.value;
  const username = jar.get("username")?.value;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold tracking-tight text-neutral-900 hover:opacity-80"
        >
          🎬 Movie Discovery
        </Link>

        {isAuthed ? (
          <div className="flex items-center gap-4">
            <Link
              href="/favorites"
              className="text-sm text-neutral-700 hover:text-neutral-900 underline underline-offset-2"
            >
              My Favorites
            </Link>
            <span className="text-sm text-neutral-700">Hi, {username}</span>
            <form method="post" action="/api/auth/logout?redirect=/">
              <button className="text-sm rounded-full border px-3 py-1.5 text-neutral-800 hover:bg-neutral-50">
                Logout
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-sm rounded-full border px-3 py-1.5 hover:bg-neutral-50"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
