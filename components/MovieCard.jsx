import Link from 'next/link'
import { slugify } from '@/lib/slugify'

export default function MovieCard({ movie }) {
  const href = `/movies/${movie.id}-${slugify(movie.title)}`
  return (
    <article className="border rounded overflow-hidden">
      <Link href={href}>
        <img src={movie.poster} alt={movie.title} className="w-full aspect-[2/3] object-cover" loading="lazy" />
      </Link>
      <div className="p-3 space-y-1">
        <Link href={href} className="font-semibold hover:underline">{movie.title}</Link>
        <p className="text-sm text-gray-600">
          {movie.year} · {movie.genre} · Dir. {movie.director}
        </p>
        <p className="text-sm">⭐ {movie.rating}</p>
        <p className="text-sm">{movie.description}</p>
      </div>
    </article>
  )
}
