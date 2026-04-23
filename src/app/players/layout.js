import Link from "next/link"

export default function PlayersLayout({ children }) {
  const jugadores = [
    { id: 1, name: "Juan García" },
    { id: 2, name: "Pedro López" },
    { id: 3, name: "Marcos Díaz" },
  ]

  return (
    <div className="flex min-h-screen bg-zinc-900">
      <aside className="w-72 py-8 px-6 border-r border-zinc-700">
        <div>
          <h1 className="text-4xl font-bold text-white">Jugadores</h1>
          <p className="text-zinc-400 mt-1">Jugadores de la liga</p>
        </div>
        <div className="space-y-4 mt-8">
          {jugadores.map((jugador) => (
            <div key={jugador.id} className="border-b pb-4 border-zinc-700">
              <Link
                href={`/players/${jugador.id}`}
                className="text-white text-lg hover:text-blue-400 transition-colors"
              >
                {jugador.name}
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/players/create"
            className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nuevo Jugador
          </Link>
        </div>
      </aside>
      {children}
    </div>
  )
}