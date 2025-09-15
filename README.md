# 🎬 Movie Discovery

Small **Next.js (App Router)** app to browse movies, see details, log in, and save favorites.  
Server-first, clean UI, and fast.

---

## Getting Started

```bash
npm install
npm run dev
# open http://localhost:3000

Pages

/ — movie list with pagination

/movies/[id-slug] — movie detail

/login — login form

/favorites — your favorite movies (client pagination)

How It Works

BFF layer: pages call our own routes in app/api/*.
The BFF talks to the real API and adds Authorization: Bearer <token> from cookies.

SSR first: list and detail render on the server for fast first load.

Favorites: optimistic toggle button → POST /api/movies/:id/favorite (add/remove).

Caching: guests get s-maxage=60, stale-while-revalidate=300; logged-in users get no-store.

SEO

Pretty URLs like /movies/123-the-godfather

Wrong slug → redirect to the canonical one

