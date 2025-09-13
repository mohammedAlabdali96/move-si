import Link from 'next/link'
import { headers } from 'next/headers'
import { permanentRedirect } from 'next/navigation'
import { slugify } from '@/lib/slugify'

// Build absolute URL to our own API (works on the server)
function internalUrl(path) {
  const host = headers().get('host')
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  return `${protocol}://${host}${path}`
}

async function getMovie(id) {
  const res = await fetch(internalUrl(`/api/movies/${id}`), { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

// Dynamic SEO
export async function generateMetadata({ params }) {
  const raw = params.slug
  const id = raw.split('-')[0]
  const movie = await getMovie(id)
  if (!movie) return { title: 'Movie not found' }

  const canonicalSlug = `${movie.id}-${slugify(movie.title)}`
  const canonical = `/movies/${canonicalSlug}`

  return {
    title: movie.title,
    description: movie.description,
    alternates: { canonical },
    openGraph: {
      type: 'video.movie',
      title: movie.title,
      description: movie.description,
      images: movie.poster ? [movie.poster] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: movie.title,
      description: movie.description,
      images: movie.poster ? [movie.poster] : []
    }
  }
}

export default async function MoviePage({ params }) {
  const raw = params.slug
  const id = raw.split('-')[0]
  const movie = await getMovie(id)

  if (!movie) return <main className="max-w-4xl mx-auto p-4">Movie not found.</main>

  // Canonicalize slug (SEO)
  const canonicalSlug = `${movie.id}-${slugify(movie.title)}`
  if (raw !== canonicalSlug) {
    permanentRedirect(`/movies/${canonicalSlug}`)
  }

  return (
    <main className="max-w-4xl mx-auto p-4">
      <Link href="/" className="underline text-sm">← Back to list</Link>

      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <img src={movie.poster} alt={movie.title} className="w-full aspect-[2/3] object-cover" />
        <div>
          <h1 className="text-2xl font-semibold">{movie.title}</h1>
          <p className="text-gray-600">{movie.year} · {movie.genre} · Dir. {movie.director}</p>
          <p className="mt-3">⭐ {movie.rating}</p>
          <p className="mt-3">{movie.description}</p>
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Movie',
            name: movie.title,
            image: movie.poster,
            datePublished: movie.year,
            director: { '@type': 'Person', name: movie.director },
            aggregateRating: { '@type': 'AggregateRating', ratingValue: movie.rating, ratingCount: 1000 }
          })
        }}
      />
    </main>
  )
}
