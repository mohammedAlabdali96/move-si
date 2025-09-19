// components/MovieCard.jsx
"use client";
import Link from "next/link";
import { slugify } from "@/lib/slugify";
import FavoriteButton from "@/components/FavoriteButton";

export default function MovieCard({ movie, redirectPath = "/", isAuthed }) {
  const href = `/movies/${movie.id}-${slugify(movie.title)}`;

  return (
    <article className="group h-full flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md">
      <Link href={href} className="block">
        <div className="relative w-full aspect-[2/3] overflow-hidden">
          <img
            src={movie.poster}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="flex grow flex-col p-4 gap-2">
        <Link
          href={href}
          className="block font-semibold tracking-tight text-neutral-900 hover:text-neutral-700"
        >
          {movie.title}
        </Link>

        <p className="text-sm text-neutral-600">
          {movie.year} · {movie.genre} · Dir. {movie.director}
        </p>

        <div className="text-sm text-neutral-800">⭐ {movie.rating}</div>

        <p className="text-sm text-neutral-700 line-clamp-3">
          {movie.description}
        </p>

        <div className="mt-auto pt-3">
          <FavoriteButton
            movieId={movie.id}
            isAuthed={isAuthed}
            initialFavorite={movie.favorite}
            redirectPath={redirectPath}
          />
        </div>
      </div>
    </article>
  );
}
