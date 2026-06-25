// Server Component — no directiva "use client"
import Link from 'next/link'
import GroupSelectClient from './GroupSelectClient'

const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

async function obtenerGrupos() {
  const res = await fetch(
    'https://v2.football.sportsapipro.com/api/world-cup-2026/groups',
    {
      headers: { 'x-api-key': process.env.SPORTS_API_KEY },
      next: { revalidate: 300 }, // revalida cada 5 minutos
    }
  )

  if (!res.ok) {
    throw new Error(`Error al obtener grupos: ${res.status}`)
  }

  return res.json()
}

// La API puede devolver la data en distintas formas, manejamos ambas
function extraerGrupos(data) {
  return data.standings ?? data.groups ?? []
}

function extraerRows(grupo) {
  return grupo.standings?.[0]?.rows ?? grupo.rows ?? []
}

function nombreGrupo(grupo) {
  return grupo.tournament?.name ?? grupo.name ?? ''
}

export default async function GruposPage() {
  const data = await obtenerGrupos()
  const grupos = extraerGrupos(data)

  return (
    <main className="min-h-screen bg-zinc-900 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-1">🏆 Mundial 2026</h1>
        <p className="text-center text-zinc-400 text-sm mb-2">
          Fase de Grupos — 12 grupos, 48 equipos
        </p>

        {/* Componente cliente con el select */}
        <GroupSelectClient />

        {/* Grid con todos los grupos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {grupos.map((grupo) => {
            const rows = extraerRows(grupo)
            const nombre = nombreGrupo(grupo)
            // Extraemos la letra: "Group A" → "A"
            const letra = nombre.replace('Group ', '').trim()

            return (
              <Link
                key={nombre}
                href={`/groups/${letra}`}
                className="block bg-zinc-800 rounded-xl p-4 border border-zinc-700 hover:border-blue-500 hover:bg-zinc-700 transition-all"
              >
                <h2 className="text-sm font-semibold mb-3 text-blue-400">
                  {nombre}
                </h2>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-zinc-500 border-b border-zinc-700 text-[11px] uppercase">
                      <th className="text-left pb-1">#</th>
                      <th className="text-left pb-1">Equipo</th>
                      <th className="text-center pb-1">PJ</th>
                      <th className="text-center pb-1">DG</th>
                      <th className="text-center pb-1 text-white">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.team.id} className="border-b border-zinc-700/30">
                        <td className="py-1 text-zinc-500">{row.position}</td>
                        <td className="py-1 truncate max-w-[110px]">{row.team.name}</td>
                        <td className="py-1 text-center text-zinc-400">{row.matches}</td>
                        <td className="py-1 text-center text-zinc-400">
                          {row.goalDifference ?? (row.scoresFor - row.scoresAgainst)}
                        </td>
                        <td className="py-1 text-center font-bold text-blue-400">
                          {row.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-[10px] text-zinc-500 mt-2 text-right">
                  Ver detalles →
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}