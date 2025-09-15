import Link from "next/link";
import { headers, cookies } from "next/headers";
import { permanentRedirect } from "next/navigation";
import { slugify } from "@/lib/slugify";
import FavoriteButton from "@/components/FavoriteButton";

// ⬇️ async + await headers()
async function internalUrl(path) {
  const h = await headers();
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${host}${path}`;
}

async function getMovie(id) {
  const h = await headers();
  const res = await fetch(
    await internalUrl(`/api/movies/${id}`),
    { cache: "no-store", headers: { cookie: h.get("cookie") ?? "" } }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function MoviePage({ params }) {
  const raw = params.slug;
  const id = raw.split("-")[0];
  const movie = await getMovie(id);
  if (!movie)
    return <main className="max-w-4xl mx-auto p-4">Movie not found.</main>;

  const canonicalSlug = `${movie.id}-${slugify(movie.title)}`;
  if (raw !== canonicalSlug) permanentRedirect(`/movies/${canonicalSlug}`);

  const isAuthed = !!(await cookies()).get("auth_token")?.value;

  return (
    <main className="max-w-4xl mx-auto p-4">

      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover"
        />
        <div>
          <h1 className="text-2xl font-semibold">{movie.title}</h1>
          <p className="text-gray-600">
            {movie.year} · {movie.genre} · Dir. {movie.director}
          </p>
          <p className="mt-3">⭐ {movie.rating}</p>
          <p className="mt-3">{movie.description}</p>
          <FavoriteButton
            movieId={movie.id}
            initialFavorite={movie.favorite}
            redirectPath={`/movies/${canonicalSlug}`}
            isAuthed={isAuthed}
          />
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Movie",
            name: movie.title,
            image: movie.poster,
            datePublished: movie.year,
            director: { "@type": "Person", name: movie.director },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: movie.rating,
              ratingCount: 1000,
            },
          }),
        }}
      />
    </main>
  );
}
