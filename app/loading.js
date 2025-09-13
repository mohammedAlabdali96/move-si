import SkeletonCard from '@/components/SkeletonCard'

export default function Loading() {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="h-7 bg-gray-200 w-48 animate-pulse rounded" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </>
  )
}
