import Link from 'next/link'
import EquipoSearchClient from './TeamSelectClient'

async function obtenerStandings() {
  const res = await fetch(
    'https://v1.football.sportsapipro.com/api/v1/world-cup/standings',
    {
      headers: { 'x-api-key': process.env.SPORTS_API_KEY },
      next: { revalidate: 300 },
    }
  )

  if (!res.ok) {
    throw new Error(`Error al obtener equipos: ${res.status}`)
  }

  return res.json()
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

const GRUPOS_POR_EQUIPO = {
  mexico: 'Grupo A',
  'south africa': 'Grupo A',
  'south korea': 'Grupo A',
  czechia: 'Grupo A',

  canada: 'Grupo B',
  'bosnia and herzegovina': 'Grupo B',
  qatar: 'Grupo B',
  switzerland: 'Grupo B',

  brazil: 'Grupo C',
  morocco: 'Grupo C',
  haiti: 'Grupo C',
  scotland: 'Grupo C',

  'united states': 'Grupo D',
  usa: 'Grupo D',
  paraguay: 'Grupo D',
  australia: 'Grupo D',
  turkey: 'Grupo D',
  turkiye: 'Grupo D',

  germany: 'Grupo E',
  curacao: 'Grupo E',
  'ivory coast': 'Grupo E',
  'cote d ivoire': 'Grupo E',
  ecuador: 'Grupo E',

  netherlands: 'Grupo F',
  japan: 'Grupo F',
  sweden: 'Grupo F',
  tunisia: 'Grupo F',

  belgium: 'Grupo G',
  egypt: 'Grupo G',
  iran: 'Grupo G',
  'new zealand': 'Grupo G',

  spain: 'Grupo H',
  'cape verde': 'Grupo H',
  'cabo verde': 'Grupo H',
  'saudi arabia': 'Grupo H',
  uruguay: 'Grupo H',

  france: 'Grupo I',
  senegal: 'Grupo I',
  iraq: 'Grupo I',
  norway: 'Grupo I',

  argentina: 'Grupo J',
  algeria: 'Grupo J',
  austria: 'Grupo J',
  jordan: 'Grupo J',

  portugal: 'Grupo K',
  'dr congo': 'Grupo K',
  'democratic republic of the congo': 'Grupo K',
  uzbekistan: 'Grupo K',
  colombia: 'Grupo K',

  england: 'Grupo L',
  croatia: 'Grupo L',
  ghana: 'Grupo L',
  panama: 'Grupo L',
}

function obtenerGrupo(nombreEquipo, grupoApi) {
  if (grupoApi) {
    return String(grupoApi).replace('Group', 'Grupo')
  }

  return GRUPOS_POR_EQUIPO[normalizarNombre(nombreEquipo)] ?? 'Sin grupo'
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

    'United States': '🇺🇸',
    USA: '🇺🇸',
    Paraguay: '🇵🇾',
    Australia: '🇦🇺',
    Turkey: '🇹🇷',
    Türkiye: '🇹🇷',

    Germany: '🇩🇪',
    Curacao: '🇨🇼',
    Curaçao: '🇨🇼',
    'Ivory Coast': '🇨🇮',
    "Côte d'Ivoire": '🇨🇮',
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
    'Cabo Verde': '🇨🇻',
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

function obtenerPuntos(row) {
  const puntos = row.points ?? row.pts ?? 0

  return Number(puntos) || 0
}

function extraerEquipos(data) {
  const standings = data.data?.standings ?? data.standings ?? []

  return standings.flatMap((grupo) => {
    const rows = grupo.rows ?? grupo.standings?.[0]?.rows ?? []

    return rows.map((row) => {
      const equipo = row.competitor ?? row.team ?? {}
      const nombreEquipo = equipo.name ?? 'Equipo sin nombre'

      return {
        id: equipo.id ?? nombreEquipo,
        nombre: nombreEquipo,
        slug: crearSlug(nombreEquipo),
        bandera: obtenerBandera(nombreEquipo),
        grupo: obtenerGrupo(nombreEquipo, row.group?.name),
        puntos: obtenerPuntos(row),
      }
    })
  })
}

export default async function EquiposPage() {
  const data = await obtenerStandings()
  const equipos = extraerEquipos(data)

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <main className="mx-auto flex w-full max-w-6xl flex-col px-4 py-10">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Equipos Mundial 2026
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Selecciones participantes
          </p>
        </div>

        <EquipoSearchClient equipos={equipos} />

        <section className="mt-6 grid grid-cols-1 gap-3">
          {equipos.map((equipo) => (
            <Link
              key={equipo.id}
              href={`/teams/${equipo.slug}`}
              className="flex items-center justify-between gap-4 rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 transition-all hover:border-blue-500 hover:bg-zinc-700"
            >
              <div className="flex min-w-0 items-center gap-4">
                <span className="text-4xl">{equipo.bandera}</span>

                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold text-white">
                    {equipo.nombre}
                  </h2>

                  <p className="text-sm text-blue-400">
                    {equipo.grupo}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3 text-center text-xs">
                <div className="min-w-20 rounded-lg bg-blue-600/20 px-4 py-2">
                  <p className="text-blue-300">PTS</p>
                  <p className="text-lg font-bold text-blue-400">
                    {equipo.puntos}
                  </p>
                </div>

                <span className="hidden pl-3 text-xs text-zinc-500 sm:block">
                  Ver equipo →
                </span>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  )
}