export default function Loading() {
  return (
    <main className="min-h-screen bg-zinc-900 px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl animate-pulse">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-4 w-32 rounded bg-zinc-700" />
          <div className="h-6 w-48 rounded bg-zinc-700" />
        </div>

        <div className="mb-5 rounded-xl border border-zinc-700 bg-zinc-800 p-5">
          <div className="mb-4 h-4 w-56 rounded bg-zinc-700" />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 rounded-lg bg-zinc-700/50" />
            ))}
          </div>
        </div>

        {[...Array(3)].map((_, sectionIndex) => (
          <div
            key={sectionIndex}
            className="mb-5 rounded-xl border border-zinc-700 bg-zinc-800 p-5"
          >
            <div className="mb-4 h-5 w-36 rounded bg-zinc-700" />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 rounded-lg bg-zinc-700/50" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}