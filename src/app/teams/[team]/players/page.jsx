import Link from 'next/link'
import { notFound } from 'next/navigation'

async function obtenerEquiposMundial() {
  if (!process.env.SPORTS_API_KEY) {
    throw new Error('Falta SPORTS_API_KEY en el archivo .env.local')
  }

  const res = await fetch(
    'https://v2.football.sportsapipro.com/api/world-cup-2026/teams',
    {
      headers: {
        'x-api-key': process.env.SPORTS_API_KEY,
      },
      next: { revalidate: 300 },
    }
  )

  if (!res.ok) {
    throw new Error(`Error al consultar los equipos: ${res.status}`)
  }

  return res.json()
}

async function obtenerJugadoresPorEquipo(teamId) {
  if (!process.env.SPORTS_API_KEY) {
    throw new Error('Falta SPORTS_API_KEY en el archivo .env.local')
  }

  const res = await fetch(
    `https://v2.football.sportsapipro.com/api/teams/${teamId}/players`,
    {
      headers: {
        'x-api-key': process.env.SPORTS_API_KEY,
      },
      next: { revalidate: 300 },
    }
  )
  if (!res.ok) {
    throw new Error(`Error al consultar los jugadores: ${res.status}`)
  }

  return res.json()
}

function crearSlug(nombre) {
  return String(nombre ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const ALIAS_SLUGS = {
  'ivory-coast': ['ivory-coast', 'cote-d-ivoire', 'cote-divoire'],
}

function extraerArrayEquipos(data) {
  return (
    data.data?.teams ??
    data.teams ??
    data.data?.competitors ??
    data.competitors ??
    data.data?.events ??
    data.events ??
    []
  )
}

function normalizarEquipo(raw) {
  const equipo = raw.team ?? raw.competitor ?? raw
  const nombre = equipo.name ?? equipo.shortName ?? raw.name ?? raw.shortName

  return {
    id: equipo.id ?? raw.id ?? raw.teamId ?? raw.competitorId,
    nombre,
    slug: crearSlug(nombre),
    slugApi: crearSlug(
      equipo.slug ?? equipo.nameForURL ?? raw.slug ?? raw.nameForURL
    ),
  }
}

function slugCoincide(equipo, teamSlug) {
  const posiblesSlugs = ALIAS_SLUGS[teamSlug] ?? [teamSlug]
  const slugsEquipo = [equipo.slug, equipo.slugApi].filter(Boolean)

  return slugsEquipo.some((slug) => posiblesSlugs.includes(slug))
}

function buscarEquipo(dataEquipos, teamSlug) {
  const equipos = extraerArrayEquipos(dataEquipos).map(normalizarEquipo)

  return equipos.find((equipo) => equipo.id && slugCoincide(equipo, teamSlug))
}

function extraerArrayJugadores(data) {
  return (
    data.data?.players ??
    data.data?.team?.players ??
    data.data?.squad?.players ??
    data.data?.squad?.athletes ??
    data.players ??
    data.squad?.players ??
    data.squad?.athletes ??
    data.squads?.[0]?.athletes ??
    data.athletes ??
    []
  )
}

function obtenerTextoPosicion(jugador, raw) {
  const posicion =
    jugador.position?.name ??
    jugador.position?.abbreviation ??
    jugador.position?.shortName ??
    raw.position?.name ??
    raw.position?.abbreviation ??
    raw.position?.shortName ??
    jugador.position ??
    raw.position ??
    jugador.formationPosition?.name ??
    jugador.formationPosition?.abbreviation ??
    raw.formationPosition?.name ??
    raw.formationPosition?.abbreviation ??
    ''

  return String(posicion).trim()
}

function normalizarPosicion(posicion) {
  const valor = String(posicion ?? '').trim()
  const valorMinuscula = valor.toLowerCase()

  if (
    valorMinuscula === 'g' ||
    valorMinuscula === 'gk' ||
    valorMinuscula.includes('goalkeeper') ||
    valorMinuscula.includes('keeper') ||
    valorMinuscula.includes('arquero') ||
    valorMinuscula.includes('portero')
  ) {
    return {
      posicion: 'Arquero',
      categoria: 'Arqueros',
    }
  }

  if (
    valorMinuscula === 'd' ||
    valorMinuscula === 'df' ||
    valorMinuscula.includes('defender') ||
    valorMinuscula.includes('defensor') ||
    valorMinuscula.includes('back')
  ) {
    return {
      posicion: 'Defensor',
      categoria: 'Defensores',
    }
  }

  if (
    valorMinuscula === 'm' ||
    valorMinuscula === 'mf' ||
    valorMinuscula.includes('midfielder') ||
    valorMinuscula.includes('mediocampista') ||
    valorMinuscula.includes('midfield')
  ) {
    return {
      posicion: 'Mediocampista',
      categoria: 'Mediocampistas',
    }
  }

  if (
    valorMinuscula === 'a' ||
    valorMinuscula === 'f' ||
    valorMinuscula === 'fw' ||
    valorMinuscula === 'st' ||
    valorMinuscula.includes('attacker') ||
    valorMinuscula.includes('forward') ||
    valorMinuscula.includes('striker') ||
    valorMinuscula.includes('delantero') ||
    valorMinuscula.includes('atacante')
  ) {
    return {
      posicion: 'Delantero',
      categoria: 'Delanteros',
    }
  }


  return {
    posicion: valor || 'Sin posición',
    categoria: 'Otros',
  }
}

function calcularEdadDesdeFecha(fechaNacimiento) {
  if (!fechaNacimiento) return null

  const fecha = new Date(fechaNacimiento)

  if (Number.isNaN(fecha.getTime())) return null

  const hoy = new Date()

  let edad = hoy.getFullYear() - fecha.getFullYear()
  const mes = hoy.getMonth() - fecha.getMonth()

  if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
    edad--
  }

  return edad
}

function obtenerEdad(jugador, raw) {
  const edadDirecta =
    jugador.age ??
    raw.age ??
    jugador.playerAge ??
    raw.playerAge

  if (edadDirecta) {
    return edadDirecta
  }

  const fechaNacimiento =
    jugador.dateOfBirth ??
    raw.dateOfBirth ??
    jugador.birthDate ??
    raw.birthDate ??
    jugador.birthday ??
    raw.birthday

  const edadCalculada = calcularEdadDesdeFecha(fechaNacimiento)

  if (edadCalculada) {
    return edadCalculada
  }

  const timestampNacimiento =
    jugador.dateOfBirthTimestamp ??
    raw.dateOfBirthTimestamp ??
    jugador.birthTimestamp ??
    raw.birthTimestamp

  if (timestampNacimiento) {
    const timestamp =
      timestampNacimiento.toString().length === 10
        ? timestampNacimiento * 1000
        : timestampNacimiento

    return calcularEdadDesdeFecha(timestamp)
  }

  return null
}

function normalizarJugador(raw) {
  const jugador = raw.player ?? raw.athlete ?? raw

  const textoPosicion = obtenerTextoPosicion(jugador, raw)
  const posicionNormalizada = normalizarPosicion(textoPosicion)

  return {
    id: jugador.id ?? raw.id,
    nombre: jugador.name ?? raw.name ?? 'Jugador sin nombre',
    nombreCorto: jugador.shortName ?? raw.shortName,
    edad: obtenerEdad(jugador, raw),
    altura: jugador.height ?? raw.height,
    posicion: posicionNormalizada.posicion,
    categoria: posicionNormalizada.categoria,
  }
}

function ordenarJugadores(a, b) {
  const ordenCategorias = {
    Arqueros: 1,
    Defensores: 2,
    Mediocampistas: 3,
    Delanteros: 4,
  }

  const ordenA = ordenCategorias[a.categoria] ?? 99
  const ordenB = ordenCategorias[b.categoria] ?? 99

  if (ordenA !== ordenB) return ordenA - ordenB

  return a.nombre.localeCompare(b.nombre)
}

function agruparJugadores(jugadores) {
  return jugadores.reduce((acc, jugador) => {
    if (!acc[jugador.categoria]) acc[jugador.categoria] = []
    acc[jugador.categoria].push(jugador)
    return acc
  }, {})
}

function contarPorCategoria(jugadores, categoria) {
  return jugadores.filter((jugador) => jugador.categoria === categoria).length
}

function JugadorCard({ jugador }) {
  return (
    <article className="rounded-lg border border-zinc-700 bg-zinc-900 p-4">
      <div>
        <h3 className="font-semibold text-white">{jugador.nombre}</h3>

        <p className="mt-1 text-sm text-blue-400">
          {jugador.posicion}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-zinc-400">
        <p>
          <span className="block text-zinc-500">Edad</span>
          <span className="text-zinc-200">
            {jugador.edad ?? '-'}
          </span>
        </p>

        <p>
          <span className="block text-zinc-500">Altura</span>
          <span className="text-zinc-200">
            {jugador.altura ? `${jugador.altura} cm` : '-'}
          </span>
        </p>
      </div>
    </article>
  )
}

export default async function JugadoresEquipoPage({ params }) {
  const { team } = await params

  const dataEquipos = await obtenerEquiposMundial()
  const equipo = buscarEquipo(dataEquipos, team)

  if (!equipo) {
    notFound()
  }

  const dataJugadores = await obtenerJugadoresPorEquipo(equipo.id)

  const jugadores = extraerArrayJugadores(dataJugadores)
    .map(normalizarJugador)
    .filter((jugador) => jugador.id || jugador.nombre !== 'Jugador sin nombre')
    .sort(ordenarJugadores)

  const jugadoresAgrupados = agruparJugadores(jugadores)

  const ordenSecciones = [
    'Arqueros',
    'Defensores',
    'Mediocampistas',
    'Delanteros',
  ]

  return (
    <main className="min-h-screen bg-zinc-900 px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href={`/teams/${team}`}
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            ← Volver al equipo
          </Link>

          <span className="text-zinc-600">|</span>

          <h1 className="text-2xl font-bold">
            Plantel de {equipo.nombre}
          </h1>
        </div>

        <section className="mb-5 rounded-xl border border-zinc-700 bg-zinc-800 p-5">
          <p className="text-sm text-zinc-400">
            Lista de jugadores
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm sm:grid-cols-5">
            <div className="rounded-lg bg-zinc-900 p-3">
              <p className="text-xs text-zinc-500">Total</p>
              <p className="font-bold text-blue-400">
                {jugadores.length}
              </p>
            </div>

            <div className="rounded-lg bg-zinc-900 p-3">
              <p className="text-xs text-zinc-500">Arqueros</p>
              <p className="font-bold">
                {contarPorCategoria(jugadores, 'Arqueros')}
              </p>
            </div>

            <div className="rounded-lg bg-zinc-900 p-3">
              <p className="text-xs text-zinc-500">Defensores</p>
              <p className="font-bold">
                {contarPorCategoria(jugadores, 'Defensores')}
              </p>
            </div>

            <div className="rounded-lg bg-zinc-900 p-3">
              <p className="text-xs text-zinc-500">Mediocampistas</p>
              <p className="font-bold">
                {contarPorCategoria(jugadores, 'Mediocampistas')}
              </p>
            </div>

            <div className="rounded-lg bg-zinc-900 p-3">
              <p className="text-xs text-zinc-500">Delanteros</p>
              <p className="font-bold">
                {contarPorCategoria(jugadores, 'Delanteros')}
              </p>
            </div>
          </div>
        </section>

        {jugadores.length === 0 ? (
          <section className="rounded-xl border border-zinc-700 bg-zinc-800 p-8 text-center">
            <p className="text-zinc-400">
              No se encontraron jugadores para este equipo todavía.
            </p>
          </section>
        ) : (
          <div className="space-y-5">
            {ordenSecciones.map((categoria) => {
              const jugadoresDeCategoria = jugadoresAgrupados[categoria] ?? []

              if (jugadoresDeCategoria.length === 0) return null

              return (
                <section
                  key={categoria}
                  className="rounded-xl border border-zinc-700 bg-zinc-800 p-5"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="font-semibold text-blue-400">
                      {categoria}
                    </h2>

                    <span className="text-sm text-zinc-500">
                      {jugadoresDeCategoria.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {jugadoresDeCategoria.map((jugador) => (
                      <JugadorCard
                        key={jugador.id ?? jugador.nombre}
                        jugador={jugador}
                      />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}