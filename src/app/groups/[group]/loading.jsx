export default function Loading() {
    return (
      <main className="min-h-screen bg-zinc-900 text-white px-4 py-8">
        <div className="max-w-2xl mx-auto animate-pulse">
  
          {/* Header skeleton */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-4 w-32 bg-zinc-700 rounded" />
            <div className="h-6 w-24 bg-zinc-700 rounded" />
          </div>
  
          {/* Tabla skeleton */}
          <div className="bg-zinc-800 rounded-xl p-5 mb-5 border border-zinc-700">
            <div className="h-4 w-40 bg-zinc-700 rounded mb-4" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-9 bg-zinc-700/50 rounded mb-2" />
            ))}
          </div>
  
          {/* Partidos skeleton */}
          <div className="bg-zinc-800 rounded-xl p-5 border border-zinc-700">
            <div className="h-4 w-36 bg-zinc-700 rounded mb-4" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-zinc-700/50 rounded mb-3" />
            ))}
          </div>
  
        </div>
      </main>
    )
  }