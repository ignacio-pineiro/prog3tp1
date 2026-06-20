import Link from 'next/link'
import { notFound } from 'next/navigation'

async function obtenerGrupos() {
  const res = await fetch(
    'https://v2.football.sportsapipro.com/api/world-cup-2026/groups',
    {
      headers: { 'x-api-key': process.env.SPORTS_API_KEY },
      next: { revalidate: 300 },
    }
  )

  if (!res.ok) {
    throw new Error(`Error al obtener grupos: ${res.status}`)
  }

  return res.json()
}

async function obtenerPartidosPorRonda(roundId) {
  const res = await fetch(
    `https://v2.football.sportsapipro.com/api/world-cup-2026/matches/round/${roundId}`,
    {
      headers: { 'x-api-key': process.env.SPORTS_API_KEY },
      next: { revalidate: 300 },
    }
  )

  if (!res.ok) {
    return []
  }

  const data = await res.json()

  return (
    data.data?.events ??
    data.events ??
    data.data?.matches ??
    data.matches ??
    []
  )
}

async function obtenerPartidos() {
  const rondas = [1, 2, 3, 6, 25, 27, 28, 50, 29]

  const respuestas = await Promise.all(
    rondas.map((ronda) => obtenerPartidosPorRonda(ronda))
  )

  const partidos = respuestas.flat()

  const partidosUnicos = new Map()

  partidos.forEach((partido) => {
    const id = partido.id ?? partido.eventId

    if (id) {
      partidosUnicos.set(id, partido)
    }
  })

  return Array.from(partidosUnicos.values())
}

function crearSlug(nombre) {
  return String(nombre)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizarNombre(nombre) {
  return String(nombre)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function slugCoincide(nombreEquipo, teamSlug) {
  const slugApi = crearSlug(nombreEquipo)
  const aliasCostaMarfil = {
    'ivory-coast': ['ivory-coast', 'cote-d-ivoire', 'cote-divoire'],
  }
  const posiblesSlugs = aliasCostaMarfil[teamSlug] ?? [teamSlug]
  return posiblesSlugs.includes(slugApi)
}

function formatearGrupo(nombre) {
  if (!nombre) return 'Sin grupo'

  return String(nombre).replace('Group', 'Grupo')
}

function extraerGrupos(data) {
  return (
    data.data?.standings ??
    data.data?.groups ??
    data.standings ??
    data.groups ??
    []
  )
}

function extraerRows(grupo) {
  return grupo.standings?.[0]?.rows ?? grupo.rows ?? []
}

function nombreGrupo(grupo) {
  return grupo.tournament?.name ?? grupo.name ?? grupo.group?.name ?? ''
}

function obtenerEquipoDeRow(row) {
  return row.team ?? row.competitor ?? {}
}

function obtenerBandera(nombre) {
  const banderas = {
    Mexico: '🇲🇽',
    'South Africa': '🇿🇦',
    'South Korea': '🇰🇷',
    Czechia: '🇨🇿',

    Canada: '🇨🇦',
    'Bosnia and Herzegovina': '🇧🇦',
    Qatar: '🇶🇦',
    Switzerland: '🇨🇭',

    Brazil: '🇧🇷',
    Morocco: '🇲🇦',
    Haiti: '🇭🇹',
    Scotland: '🏴',

    USA: '🇺🇸',
    Paraguay: '🇵🇾',
    Australia: '🇦🇺',
    Turkey: '🇹🇷',

    Germany: '🇩🇪',
    Curacao: '🇨🇼',
    'Ivory Coast': '🇨🇮',
    Ecuador: '🇪🇨',

    Netherlands: '🇳🇱',
    Japan: '🇯🇵',
    Sweden: '🇸🇪',
    Tunisia: '🇹🇳',

    Belgium: '🇧🇪',
    Egypt: '🇪🇬',
    Iran: '🇮🇷',
    'New Zealand': '🇳🇿',

    Spain: '🇪🇸',
    'Cape Verde': '🇨🇻',
    'Saudi Arabia': '🇸🇦',
    Uruguay: '🇺🇾',

    France: '🇫🇷',
    Senegal: '🇸🇳',
    Iraq: '🇮🇶',
    Norway: '🇳🇴',

    Argentina: '🇦🇷',
    Algeria: '🇩🇿',
    Austria: '🇦🇹',
    Jordan: '🇯🇴',

    Portugal: '🇵🇹',
    'DR Congo': '🇨🇩',
    Uzbekistan: '🇺🇿',
    Colombia: '🇨🇴',

    England: '🏴',
    Croatia: '🇭🇷',
    Ghana: '🇬🇭',
    Panama: '🇵🇦',
  }

  return banderas[nombre] ?? '🏳️'
}

function buscarEquipoEnGrupos(dataGrupos, teamSlug) {
  const grupos = extraerGrupos(dataGrupos)

  for (const grupo of grupos) {
    const rows = extraerRows(grupo)

    const rowEquipo = rows.find((row) => {
      const equipo = obtenerEquipoDeRow(row)
      return slugCoincide(equipo.name, teamSlug)
    })

    if (rowEquipo) {
      const equipo = obtenerEquipoDeRow(rowEquipo)
      const nombre = equipo.name ?? 'Equipo sin nombre'
      const grupoApi = rowEquipo.group?.name ?? nombreGrupo(grupo)

      return {
        id: equipo.id,
        nombre,
        slug: crearSlug(nombre),
        bandera: obtenerBandera(nombre),
        grupo: formatearGrupo(grupoApi),
        posicion: rowEquipo.position ?? rowEquipo.rank ?? rowEquipo.place ?? '-',
        puntos: Number(rowEquipo.points ?? rowEquipo.pts ?? 0),
        partidos: Number(
          rowEquipo.matches ?? rowEquipo.gamePlayed ?? rowEquipo.played ?? 0
        ),
      }
    }
  }

  return null
}

function formatearFecha(fecha) {
  if (!fecha) return 'Fecha por confirmar'

  const fechaFinal =
    typeof fecha === 'number'
      ? new Date(fecha * 1000)
      : new Date(fecha)

  return fechaFinal.toLocaleString('es-AR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Argentina/Buenos_Aires',
  })
}

function partidoFinalizado(partido) {
  return (
    partido.statusText === 'Ended' ||
    partido.statusGroup === 4 ||
    partido.status?.type === 'finished' ||
    partido.status?.description === 'Ended'
  )
}

function partidoEnVivo(partido) {
  return (
    partido.statusText === 'Live' ||
    partido.statusGroup === 3 ||
    partido.status?.type === 'inprogress' ||
    partido.status?.type === 'live' ||
    partido.status?.description === 'Live'
  )
}

function obtenerEstadoPartido(partido) {
  if (partidoEnVivo(partido)) return 'En vivo'
  if (partidoFinalizado(partido)) return 'Finalizado'

  return (
    partido.statusText ??
    partido.status?.description ??
    partido.status?.type ??
    'Programado'
  )
}

function obtenerScore(score) {
  const valor =
    score?.current ??
    score?.display ??
    score?.period1 ??
    score?.normaltime ??
    score

  const numero = Number(valor)

  return Number.isNaN(numero) ? 0 : numero
}

function obtenerPartidosDelEquipo(partidos, equipoInfo) {
  const nombreEquipo = normalizarNombre(equipoInfo.nombre)
  const equipoId = Number(equipoInfo.id)

  return partidos
    .filter((partido) => {
      const local = partido.homeTeam ?? partido.homeCompetitor
      const visitante = partido.awayTeam ?? partido.awayCompetitor

      const localId = Number(local?.id)
      const visitanteId = Number(visitante?.id)

      const localNombre = normalizarNombre(local?.name)
      const visitanteNombre = normalizarNombre(visitante?.name)

      return (
        localId === equipoId ||
        visitanteId === equipoId ||
        localNombre === nombreEquipo ||
        visitanteNombre === nombreEquipo
      )
    })
    .sort((a, b) => {
      const fechaA = a.startTimestamp
        ? a.startTimestamp * 1000
        : new Date(a.startTime ?? 0).getTime()

      const fechaB = b.startTimestamp
        ? b.startTimestamp * 1000
        : new Date(b.startTime ?? 0).getTime()

      return fechaA - fechaB
    })
}

function PartidoEquipoCard({ partido }) {
  const local = partido.homeTeam ?? partido.homeCompetitor
  const visitante = partido.awayTeam ?? partido.awayCompetitor

  const finalizado = partidoFinalizado(partido)
  const enVivo = partidoEnVivo(partido)
  const mostrarMarcador = finalizado || enVivo

  const golesLocal = obtenerScore(partido.homeScore ?? local?.score)
  const golesVisitante = obtenerScore(partido.awayScore ?? visitante?.score)

  return (
    <article className="bg-zinc-700/50 rounded-lg p-3 border border-transparent">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-zinc-400">
          {formatearFecha(partido.startTimestamp ?? partido.startTime)}
        </p>

        <span
          className={
            enVivo
              ? 'text-xs text-red-400 font-semibold'
              : 'text-xs text-zinc-500'
          }
        >
          {obtenerEstadoPartido(partido)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="flex-1 text-right text-sm font-medium">
          {local?.name ?? 'Equipo local'}
        </span>

        <div className="min-w-[70px] text-center">
          {mostrarMarcador ? (
            <span
              className={
                enVivo
                  ? 'font-bold text-lg text-red-400'
                  : 'font-bold text-lg'
              }
            >
              {golesLocal} - {golesVisitante}
            </span>
          ) : (
            <span className="text-zinc-500 text-sm font-medium">vs</span>
          )}
        </div>

        <span className="flex-1 text-left text-sm font-medium">
          {visitante?.name ?? 'Equipo visitante'}
        </span>
      </div>
    </article>
  )
}

export default async function EquipoDetallePage({ params }) {
  const { team } = await params

  const [dataGrupos, partidos] = await Promise.all([
    obtenerGrupos(),
    obtenerPartidos(),
  ])

  const equipoInfo = buscarEquipoEnGrupos(dataGrupos, team)

  if (!equipoInfo) {
    notFound()
  }

  const partidosDelEquipo = obtenerPartidosDelEquipo(partidos, equipoInfo)

  return (
    <main className="min-h-screen bg-zinc-900 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/teams"
            className="text-zinc-400 hover:text-white transition-colors text-sm"
          >
            ← Todos los equipos
          </Link>

          <span className="text-zinc-600">|</span>

          <h1 className="text-2xl font-bold">{equipoInfo.nombre}</h1>
        </div>

        <section className="bg-zinc-800 rounded-xl p-5 mb-5 border border-zinc-700">
          <div className="flex items-center gap-4 mb-5">
            <span className="text-6xl">{equipoInfo.bandera}</span>

            <div>
              <h2 className="text-2xl font-bold">{equipoInfo.nombre}</h2>
              <p className="text-blue-400 text-sm">{equipoInfo.grupo}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center text-sm">
            <div className="bg-zinc-900 rounded-lg p-3">
              <p className="text-zinc-500 text-xs">Grupo</p>
              <p className="font-bold">{equipoInfo.grupo}</p>
            </div>

            <div className="bg-zinc-900 rounded-lg p-3">
              <p className="text-zinc-500 text-xs">Posición</p>
              <p className="font-bold">#{equipoInfo.posicion}</p>
            </div>

            <div className="bg-zinc-900 rounded-lg p-3">
              <p className="text-zinc-500 text-xs">Puntos</p>
              <p className="font-bold text-blue-400">{equipoInfo.puntos}</p>
            </div>
          </div>

          <Link
            href={`/teams/${equipoInfo.slug}/players`}
            className="inline-block mt-5 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm transition-colors"
          >
            Ver jugadores
          </Link>
        </section>

        <section className="bg-zinc-800 rounded-xl p-5 border border-zinc-700">
          <h2 className="font-semibold text-blue-400 mb-4">
            Partidos del equipo
          </h2>

          <div className="space-y-3">
            {partidosDelEquipo.map((partido) => (
              <PartidoEquipoCard
                key={partido.id ?? partido.eventId}
                partido={partido}
              />
            ))}
          </div>

          {partidosDelEquipo.length === 0 && (
            <p className="text-center text-zinc-500 py-6">
              No se encontraron partidos para este equipo.
            </p>
          )}
        </section>
      </div>
    </main>
  )
}