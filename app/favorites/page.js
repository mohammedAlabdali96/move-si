// app/favorites/page.js
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FavoritesGrid from "@/components/FavoritesGrid";
import { apiGetJson } from "@/lib/bff"; // builds absolute URL + forwards cookies

export const metadata = {
  title: "My Favorites · Movie Discovery",
  robots: { index: false, follow: false },
};

const PAGE_SIZE = 8;

export default async function FavoritesPage() {
  // require login
  if (!(await cookies()).get("auth_token")) {
    redirect("/login?next=/favorites");
  }

  // 1) first page → learn total pages
  const first = await apiGetJson(`/api/movies?page=1&limit=${PAGE_SIZE}`, {
    cache: "no-store",
  });
  const totalPages = Math.max(1, Number(first?.pagination?.totalPages || 1));

  // 2) fetch remaining pages (simple & safe)
  const results = [first];
  for (let p = 2; p <= totalPages; p++) {
    results.push(
      await apiGetJson(`/api/movies?page=${p}&limit=${PAGE_SIZE}`, {
        cache: "no-store",
      })
    );
  }

  // 3) keep only favorites
  const favorites = results
    .flatMap((d) => d?.movies || [])
    .filter((m) => m.favorite);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">My Favorites</h1>
      </div>

      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <FavoritesGrid
          movies={favorites}
          isAuthed={true}
          pageSize={PAGE_SIZE}
          redirectPath="/favorites"
        />
      )}
    </>
  );
}
