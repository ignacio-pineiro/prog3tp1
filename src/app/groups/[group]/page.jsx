import Link from 'next/link'
import { notFound } from 'next/navigation'

const GRUPOS_VALIDOS = new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'])

async function obtenerTodosLosGrupos() {
    const res = await fetch(
      'https://v2.football.sportsapipro.com/api/world-cup-2026/groups',
      {
        headers: { 'x-api-key': process.env.SPORTS_API_KEY },
        next: { revalidate: 300 },
      }
    )
    if (!res.ok) throw new Error('No se pudieron obtener los grupos')
    const data = await res.json()
    return data
  }

async function obtenerPartidosPorFecha(round) {
  try {
    const res = await fetch(
      `https://v2.football.sportsapipro.com/api/world-cup-2026/matches/round/${round}`,
      {
        headers: { 'x-api-key': process.env.SPORTS_API_KEY },
        next: { revalidate: 60 },
      }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.data?.events ?? data.events ?? []
  } catch {
    return []
  }
}

function formatearFecha(timestamp) {
  if (!timestamp) return 'Fecha por confirmar'
  return new Date(timestamp * 1000).toLocaleString('es-AR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Argentina/Buenos_Aires',
  })
}

function PartidoCard({ partido }) {
  const finalizado = partido.status?.type === 'finished'
  const enVivo = partido.status?.type === 'inprogress'

  return (
    <Link
      href={`/matches/${partido.id}`}
      className="block bg-zinc-700/50 rounded-lg p-3 hover:bg-zinc-600/50 hover:border-zinc-500 border border-transparent transition-all"
    >
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-zinc-400">{formatearFecha(partido.startTimestamp)}</p>
        {enVivo && (
          <span className="text-xs text-red-400 font-semibold animate-pulse">● EN VIVO</span>
        )}
        {finalizado && (
          <span className="text-xs text-green-400">Finalizado</span>
        )}
        {!finalizado && !enVivo && (
          <span className="text-xs text-zinc-500">Programado</span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 mt-1">
        <span className="flex-1 text-right text-sm font-medium">
          {partido.homeTeam?.name}
        </span>
        <div className="min-w-[70px] text-center">
          {finalizado || enVivo ? (
            <span className="font-bold text-lg">
              {partido.homeScore?.current ?? 0} - {partido.awayScore?.current ?? 0}
            </span>
          ) : (
            <span className="text-zinc-500 text-sm font-medium">-</span>
          )}
        </div>
        <span className="flex-1 text-left text-sm font-medium">
          {partido.awayTeam?.name}
        </span>
      </div>
    </Link>
  )
}

export default async function GrupoDetallePage({ params }) {
  const { group } = await params
  const letra = group.toUpperCase()

  if (!GRUPOS_VALIDOS.has(letra)) {
    notFound()
  }

  const [dataGrupos, partidos1, partidos2, partidos3] = await Promise.all([
    obtenerTodosLosGrupos(),
    obtenerPartidosPorFecha(1),
    obtenerPartidosPorFecha(2),
    obtenerPartidosPorFecha(3),
  ])

  const grupos = dataGrupos.data?.standings ?? dataGrupos.standings ?? dataGrupos.groups ?? []

  const grupoInfo = grupos.find((g) => {
    const nombre = g.tournament?.name ?? g.name ?? ''
    return nombre.includes(`Group ${letra}`)
  })

  if (!grupoInfo) {
    notFound()
  }

  const rows = grupoInfo.standings?.[0]?.rows ?? grupoInfo.rows ?? []

  const equipoIds = new Set(rows.map((r) => r.team.id))
  const todosLosPartidos = [...partidos1, ...partidos2, ...partidos3]
  const partidosDelGrupo = todosLosPartidos.filter(
    (p) => equipoIds.has(p.homeTeam?.id) && equipoIds.has(p.awayTeam?.id)
  )

  const enVivo = partidosDelGrupo.filter((p) => p.status?.type === 'inprogress')
  const programados = partidosDelGrupo.filter(
    (p) => p.status?.type !== 'finished' && p.status?.type !== 'inprogress'
  )
  const finalizados = partidosDelGrupo.filter((p) => p.status?.type === 'finished')

  return (
    <main className="min-h-screen bg-zinc-900 text-white px-4 py-8">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/groups"
            className="text-zinc-400 hover:text-white transition-colors text-sm"
          >
            ← Todos los grupos
          </Link>
          <span className="text-zinc-600">|</span>
          <h1 className="text-2xl font-bold">Grupo {letra}</h1>
        </div>

        <section className="bg-zinc-800 rounded-xl p-5 mb-5 border border-zinc-700">
          <h2 className="font-semibold text-blue-400 mb-4">Tabla de Posiciones</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-zinc-400 border-b border-zinc-700 text-xs uppercase">
                  <th className="text-left pb-2 w-6">#</th>
                  <th className="text-left pb-2">Equipo</th>
                  <th className="text-center pb-2">PJ</th>
                  <th className="text-center pb-2">G</th>
                  <th className="text-center pb-2">E</th>
                  <th className="text-center pb-2">P</th>
                  <th className="text-center pb-2">GF</th>
                  <th className="text-center pb-2">GC</th>
                  <th className="text-center pb-2">DG</th>
                  <th className="text-center pb-2 text-white">PTS</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.team.id}
                    className={`border-b border-zinc-700/40 ${
                      i < 2 ? 'text-white' : 'text-zinc-400'
                    }`}
                  >
                    <td className="py-2 text-zinc-500 text-xs">{row.position}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        {row.team.name}
                        {i < 2 && (
                          <span className="text-[10px] bg-green-900/60 text-green-400 border border-green-800 px-1 rounded leading-4">
                            Clasifica
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 text-center">{row.matches}</td>
                    <td className="py-2 text-center">{row.wins}</td>
                    <td className="py-2 text-center">{row.draws}</td>
                    <td className="py-2 text-center">{row.losses}</td>
                    <td className="py-2 text-center">{row.scoresFor ?? '-'}</td>
                    <td className="py-2 text-center">{row.scoresAgainst ?? '-'}</td>
                    <td className="py-2 text-center">
                      {row.goalDifference ?? (row.scoresFor - row.scoresAgainst)}
                    </td>
                    <td className="py-2 text-center font-bold text-blue-400">
                      {row.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-500 mt-3">
            Los 2 primeros de cada grupo clasifican a la siguiente fase.
          </p>
        </section>

        {enVivo.length > 0 && (
          <section className="bg-zinc-800 rounded-xl p-5 mb-5 border border-red-800">
            <h2 className="font-semibold text-red-400 mb-4">🔴 En Vivo</h2>
            <div className="space-y-3">
              {enVivo.map((p) => (
                <PartidoCard key={p.id} partido={p} />
              ))}
            </div>
          </section>
        )}

        {programados.length > 0 && (
          <section className="bg-zinc-800 rounded-xl p-5 mb-5 border border-zinc-700">
            <h2 className="font-semibold text-blue-400 mb-4">Próximos Partidos</h2>
            <div className="space-y-3">
              {programados.map((p) => (
                <PartidoCard key={p.id} partido={p} />
              ))}
            </div>
          </section>
        )}

        {finalizados.length > 0 && (
          <section className="bg-zinc-800 rounded-xl p-5 border border-zinc-700">
            <h2 className="font-semibold text-zinc-400 mb-4">Partidos Jugados</h2>
            <div className="space-y-3">
              {finalizados.map((p) => (
                <PartidoCard key={p.id} partido={p} />
              ))}
            </div>
          </section>
        )}

        {partidosDelGrupo.length === 0 && (
          <div className="text-center text-zinc-500 py-8 bg-zinc-800 rounded-xl border border-zinc-700">
            No se encontraron partidos para este grupo todavía.
          </div>
        )}
      </div>
    </main>
  )
}