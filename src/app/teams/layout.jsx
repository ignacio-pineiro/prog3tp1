import Link from "next/link"

export default function TeamsLayout({ children }) {
  const equipos = [
    { id: 1, name: "Los Tigres" },
    { id: 2, name: "Los Halcones" },
    { id: 3, name: "Los Cóndores" },
  ]

  return (
    <div className="flex min-h-screen bg-zinc-900">
      <aside className="w-72 py-8 px-6 border-r border-zinc-700">
        <div>
          <h1 className="text-4xl font-bold text-white">Equipos</h1>
          <p className="text-zinc-400 mt-1">Equipos de la liga</p>
        </div>
        <div className="space-y-4 mt-8">
          {equipos.map((equipo) => (
            <div key={equipo.id} className="border-b pb-4 border-zinc-700">
              <Link
                href={`/teams/${equipo.id}`}
                className="text-white text-lg hover:text-blue-400 transition-colors"
              >
                {equipo.name}
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/teams/create"
            className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nuevo Equipo
          </Link>
        </div>
      </aside>
      {children}
    </div>
  )
}