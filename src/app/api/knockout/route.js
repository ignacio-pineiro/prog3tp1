export const runtime = "nodejs";

import { promises as fs } from "fs";
import path from "path";

const API_BASE_URL = "https://api.sportsapipro.com/v2/football";

const CACHE_DIR = path.join(process.cwd(), ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "knockout.json");
const CACHE_TIME = 1000 * 60 * 60 * 24; // 24 horas

const DATES = [
  "2026-06-28",
  "2026-06-29",
  "2026-06-30",
  "2026-07-01",
  "2026-07-02",
  "2026-07-03",
  "2026-07-04",
  "2026-07-05",
  "2026-07-06",
  "2026-07-07",
  "2026-07-09",
  "2026-07-10",
  "2026-07-11",
  "2026-07-14",
  "2026-07-15",
  "2026-07-18",
  "2026-07-19",
];

const RONDAS = [
  { nombre: "16avos", cantidad: 16 },
  { nombre: "Octavos", cantidad: 8 },
  { nombre: "Cuartos", cantidad: 4 },
  { nombre: "Semifinal", cantidad: 2 },
  { nombre: "Tercer puesto", cantidad: 1 },
  { nombre: "Final", cantidad: 1 },
];

function getDateFromTimestamp(timestamp) {
  if (!timestamp) return "";

  return new Date(timestamp * 1000).toLocaleDateString("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

function getRondaPorFecha(fecha) {
  if (fecha >= "2026-06-28" && fecha <= "2026-07-03") return "16avos";
  if (fecha >= "2026-07-04" && fecha <= "2026-07-07") return "Octavos";
  if (fecha >= "2026-07-09" && fecha <= "2026-07-11") return "Cuartos";
  if (fecha >= "2026-07-14" && fecha <= "2026-07-15") return "Semifinal";
  if (fecha === "2026-07-18") return "Tercer puesto";
  if (fecha === "2026-07-19") return "Final";

  return null;
}

function getTeamName(team) {
  if (!team) return "Por definir";
  if (typeof team === "string") return team;

  return team.name || team.shortName || team.nameCode || "Por definir";
}

function getScore(score) {
  return score?.current ?? score?.display ?? null;
}

function getStatus(status) {
  const value = status?.description || status?.type || "Programado";

  const STATUS = {
    Ended: "Finalizado",
    finished: "Finalizado",
    Scheduled: "Programado",
    "Not started": "Programado",
    postponed: "Postergado",
    Postponed: "Postergado",
    AP: "Penales",
  };

  return STATUS[value] || value;
}

function getVenue(match) {
  const venue = match.venue;

  return (
    venue?.name ||
    venue?.stadium?.name ||
    match.stadium?.name ||
    match.location ||
    "Sede por confirmar"
  );
}

function isWorldCup(match) {
  const text = [
    match.tournament?.name,
    match.tournament?.slug,
    match.tournament?.uniqueTournament?.name,
    match.tournament?.uniqueTournament?.slug,
    match.season?.name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    text.includes("world cup") ||
    text.includes("fifa world cup") ||
    text.includes("copa mundial") ||
    text.includes("mundial 2026")
  );
}

function normalizeMatch(match) {
  const fecha = getDateFromTimestamp(match.startTimestamp);
  const ronda = getRondaPorFecha(fecha);

  return {
    id: match.id,
    ronda,

    equipoLocal: getTeamName(match.homeTeam),
    equipoVisitante: getTeamName(match.awayTeam),

    marcadorLocal: getScore(match.homeScore),
    marcadorVisitante: getScore(match.awayScore),

    estado: getStatus(match.status),
    fechaInicio: match.startTimestamp || null,
    fecha,
    sede: getVenue(match),
    esPlaceholder: false,
  };
}

function crearPlaceholder(ronda, orden) {
  let equipoLocal = "Por definir";
  let equipoVisitante = "Por definir";

  if (ronda === "Octavos") {
    const n = (orden - 1) * 2 + 1;
    equipoLocal = `Ganador 16avos ${n}`;
    equipoVisitante = `Ganador 16avos ${n + 1}`;
  }

  if (ronda === "Cuartos") {
    const n = (orden - 1) * 2 + 1;
    equipoLocal = `Ganador Octavos ${n}`;
    equipoVisitante = `Ganador Octavos ${n + 1}`;
  }

  if (ronda === "Semifinal") {
    const n = (orden - 1) * 2 + 1;
    equipoLocal = `Ganador Cuartos ${n}`;
    equipoVisitante = `Ganador Cuartos ${n + 1}`;
  }

  if (ronda === "Tercer puesto") {
    equipoLocal = "Perdedor Semifinal 1";
    equipoVisitante = "Perdedor Semifinal 2";
  }

  if (ronda === "Final") {
    equipoLocal = "Ganador Semifinal 1";
    equipoVisitante = "Ganador Semifinal 2";
  }

  const rondaId = ronda.toLowerCase().replaceAll(" ", "-");

  return {
    id: `placeholder-${rondaId}-${orden}`,
    ronda,
    orden,

    equipoLocal,
    equipoVisitante,

    marcadorLocal: null,
    marcadorVisitante: null,

    estado: "Programado",
    fechaInicio: null,
    fecha: null,
    sede: "Sede por confirmar",
    esPlaceholder: true,
  };
}

function agregarOrdenPorRonda(partidos) {
  const contadorPorRonda = {};

  return partidos.map((partido) => {
    contadorPorRonda[partido.ronda] = (contadorPorRonda[partido.ronda] || 0) + 1;

    return {
      ...partido,
      orden: contadorPorRonda[partido.ronda],
    };
  });
}

function completarBracket(partidosReales) {
  const realesConOrden = agregarOrdenPorRonda(partidosReales);

  const realesPorClave = new Map();

  for (const partido of realesConOrden) {
    realesPorClave.set(`${partido.ronda}-${partido.orden}`, partido);
  }

  const partidosCompletos = [];

  for (const ronda of RONDAS) {
    for (let i = 1; i <= ronda.cantidad; i++) {
      const clave = `${ronda.nombre}-${i}`;

      partidosCompletos.push(
        realesPorClave.get(clave) || crearPlaceholder(ronda.nombre, i)
      );
    }
  }

  return partidosCompletos;
}

async function readCache() {
  try {
    const raw = await fs.readFile(CACHE_FILE, "utf-8");
    const cache = JSON.parse(raw);

    if (Date.now() - cache.createdAt < CACHE_TIME) {
      return cache.data;
    }

    return null;
  } catch {
    return null;
  }
}

async function saveCache(data) {
  await fs.mkdir(CACHE_DIR, { recursive: true });

  await fs.writeFile(
    CACHE_FILE,
    JSON.stringify(
      {
        createdAt: Date.now(),
        data,
      },
      null,
      2
    )
  );
}

async function fetchDate(date) {
  const res = await fetch(`${API_BASE_URL}/schedule/${date}`, {
    headers: {
      "x-api-key": process.env.SPORTS_API_KEY,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error en fecha ${date}. Status ${res.status}. ${text}`);
  }

  const data = await res.json();

  const events = data.events || [];

  return events.filter(isWorldCup).map(normalizeMatch);
}

export async function GET(request) {
  try {
    if (!process.env.SPORTS_API_KEY) {
      throw new Error("Falta SPORTS_API_KEY en .env.local");
    }

    const { searchParams } = new URL(request.url);
    const refresh = searchParams.get("refresh") === "true";

    if (!refresh) {
      const cached = await readCache();

      if (cached) {
        return Response.json({
          ...cached,
          fuente: "cache",
        });
      }
    }

    const results = await Promise.all(DATES.map(fetchDate));

    const partidosSinLimpiar = results.flat();

    const partidosPorId = new Map();

    for (const partido of partidosSinLimpiar) {
      if (!partido.ronda) continue;

      if (!partidosPorId.has(partido.id)) {
        partidosPorId.set(partido.id, partido);
      }
    }

    const partidosReales = Array.from(partidosPorId.values()).sort(
      (a, b) => (a.fechaInicio || 0) - (b.fechaInicio || 0)
    );

    const partidos = completarBracket(partidosReales);

    const resumen = {};
    const reales = partidos.filter((partido) => !partido.esPlaceholder).length;
    const placeholders = partidos.filter((partido) => partido.esPlaceholder).length;

    for (const partido of partidos) {
      resumen[partido.ronda] = (resumen[partido.ronda] || 0) + 1;
    }

    const response = {
      total: partidos.length,
      reales,
      placeholders,
      resumen,
      partidos,
      fuente: "sportsapipro schedule + placeholders",
    };

    await saveCache(response);

    return Response.json(response);
  } catch (error) {
    return Response.json(
      {
        error: "Error al obtener eliminatorias",
        detalle: error.message,
      },
      { status: 500 }
    );
  }
}