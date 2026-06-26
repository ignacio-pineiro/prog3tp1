export default function Loading() {
  return (
    <main className="min-h-screen bg-zinc-900 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto animate-pulse">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-4 w-32 bg-zinc-700 rounded" />
          <div className="h-6 w-40 bg-zinc-700 rounded" />
        </div>

        <div className="bg-zinc-800 rounded-xl p-5 mb-5 border border-zinc-700">
          <div className="h-5 w-44 bg-zinc-700 rounded mb-4" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-zinc-700/50 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="bg-zinc-800 rounded-xl p-5 border border-zinc-700">
          <div className="h-5 w-36 bg-zinc-700 rounded mb-4" />

          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-zinc-700/50 rounded-lg mb-3" />
          ))}
        </div>
      </div>
    </main>
  )
}