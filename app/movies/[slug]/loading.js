export default function Loading() {
  return (
    <main className="max-w-4xl mx-auto p-4">
      <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <div className="w-full aspect-[2/3] bg-gray-200 animate-pulse" />
        <div className="space-y-3">
          <div className="h-6 w-2/3 bg-gray-200 animate-pulse" />
          <div className="h-4 w-1/2 bg-gray-200 animate-pulse" />
          <div className="h-4 w-1/3 bg-gray-200 animate-pulse" />
        </div>
      </div>
    </main>
  );
}
