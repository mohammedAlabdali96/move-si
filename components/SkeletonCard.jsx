export default function SkeletonCard() {
  return (
    <div className="border rounded overflow-hidden animate-pulse">
      <div className="w-full aspect-[2/3] bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 w-2/3" />
        <div className="h-3 bg-gray-200 w-1/2" />
        <div className="h-3 bg-gray-200 w-1/3" />
      </div>
    </div>
  )
}
