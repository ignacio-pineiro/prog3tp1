/*export const runtime = "nodejs";

import { promises as fs } from "fs";
import path from "path";

const API_BASE_URL = "https://v2.football.sportsapipro.com";
const CACHE_DIR = path.join(process.cwd(), ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "knockout.json");
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 horas

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

const RONDAS_VALIDAS = [
  "16avos",
  "Octavos",
  "Cuartos",
  "Semifinal",
  "Tercer puesto",
  "Final",
];

const TEAM_TRANSLATIONS = {
  Germany: "Alemania",
  Mexico: "México",
  USA: "EE. UU.",
};

const STATUS_TRANSLATIONS = {
  "Not started": "No iniciado",
  Scheduled: "Programado",
};

function translateTeam(name) {
  return TEAM_TRANSLATIONS[name] || name;
}

function translateStatus(status) {
  return STATUS_TRANSLATIONS[status] || status;
}

function getMatchDate(timestamp) {
  if (!timestamp) return "";

  return new Date(timestamp * 1000).toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });
}

function getRoundByDate(timestamp) {
  const date = getMatchDate(timestamp);

  if (date >= "2026-06-28" && date <= "2026-07-03") return "16avos";
  if (date >= "2026-07-04" && date <= "2026-07-07") return "Octavos";
  if (date >= "2026-07-09" && date <= "2026-07-11") return "Cuartos";
  if (date >= "2026-07-14" && date <= "2026-07-15") return "Semifinal";
  if (date === "2026-07-18") return "Tercer puesto";
  if (date === "2026-07-19") return "Final";

  return "Eliminatorias";
}

function fixResponse(response) {
  const partidos = (response.partidos || []).map((partido) => ({
    ...partido,
    ronda: getRoundByDate(partido.fechaInicio),
    equipoLocal: translateTeam(partido.equipoLocal),
    equipoVisitante: translateTeam(partido.equipoVisitante),
    estado: translateStatus(partido.estado),
  }));

  return {
    ...response,
    total: partidos.length,
    partidos,
  };
}

async function readCache() {
  try {
    const raw = await fs.readFile(CACHE_FILE, "utf-8");
    const cached = JSON.parse(raw);

    if (Date.now() - cached.createdAt < CACHE_DURATION) {
      return fixResponse(cached.response);
    }

    return null;
  } catch {
    return null;
  }
}

async function saveCache(response) {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(
    CACHE_FILE,
    JSON.stringify(
      {
        createdAt: Date.now(),
        response,
      },
      null,
      2
    )
  );
}

function objectToText(value) {
  if (!value) return "";

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(objectToText).join(" ");
  }

  if (typeof value === "object") {
    return Object.values(value).map(objectToText).join(" ");
  }

  return "";
}

function extractEvents(data) {
  const events = [];
  const seen = new Set();

  function walk(value) {
    if (!value) return;

    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }

    if (typeof value === "object") {
      if (value.id && value.homeTeam && value.awayTeam && !seen.has(value.id)) {
        seen.add(value.id);
        events.push(value);
      }

      Object.values(value).forEach(walk);
    }
  }

  walk(data);
  return events;
}

function getTeamName(team) {
  if (!team) return "Por definir";
  if (typeof team === "string") return translateTeam(team);

  const name =
    team.name || team.shortName || team.nameCode || team.slug || "Por definir";

  return translateTeam(name);
}

function getVenueName(match) {
  return (
    match.venue?.name ||
    match.venue?.stadium?.name ||
    match.stadium?.name ||
    match.location ||
    "Sede por confirmar"
  );
}

function getRoundName(match) {
  const rondaPorFecha = getRoundByDate(match.startTimestamp);

  if (rondaPorFecha !== "Eliminatorias") {
    return rondaPorFecha;
  }

  const text = objectToText({
    roundInfo: match.roundInfo,
    round: match.round,
    stage: match.stage,
    phase: match.phase,
  }).toLowerCase();

  if (text.includes("round of 32")) return "16avos";
  if (text.includes("round of 16")) return "Octavos";
  if (text.includes("quarter")) return "Cuartos";
  if (text.includes("semi")) return "Semifinal";
  if (text.includes("third")) return "Tercer puesto";
  if (text.includes("final")) return "Final";

  return "Eliminatorias";
}

function normalizeMatch(match) {
  return {
    id: match.id,
    ronda: getRoundName(match),
    equipoLocal: getTeamName(match.homeTeam),
    equipoVisitante: getTeamName(match.awayTeam),
    marcadorLocal: match.homeScore?.current ?? null,
    marcadorVisitante: match.awayScore?.current ?? null,
    estado: translateStatus(
      match.status?.description || match.status?.type || "No iniciado"
    ),
    fechaInicio: match.startTimestamp || null,
    sede: getVenueName(match),
  };
}

async function fetchSchedule(date) {
  const res = await fetch(`${API_BASE_URL}/api/schedule/${date}`, {
    headers: {
      "x-api-key": process.env.SPORTS_API_KEY,
    },
    cache: "no-store",
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(
      `Error en fecha ${date}. Status: ${res.status}. Detalle: ${text}`
    );
  }

  const data = JSON.parse(text);
  return extractEvents(data);
}

export async function GET(request) {
  try {
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

    const partidosPorId = new Map();

    for (const date of DATES) {
      const events = await fetchSchedule(date);

      for (const event of events) {
        const textoCompleto = objectToText(event).toLowerCase();

        const esMundial =
          textoCompleto.includes("copa mundial") ||
          textoCompleto.includes("world cup") ||
          textoCompleto.includes("world championship") ||
          textoCompleto.includes("fifa");

        const esGrupo =
          textoCompleto.includes("grupo ") || textoCompleto.includes("group ");

        const partido = normalizeMatch(event);

        if (
          esMundial &&
          !esGrupo &&
          RONDAS_VALIDAS.includes(partido.ronda)
        ) {
          partidosPorId.set(partido.id, partido);
        }
      }
    }

    const partidos = Array.from(partidosPorId.values()).sort(
      (a, b) => a.fechaInicio - b.fechaInicio
    );

    const response = {
      total: partidos.length,
      partidos,
      fuente: "sportsapipro",
    };

    await saveCache(response);

    return Response.json(response);
  } catch (error) {
    return Response.json(
      {
        error: "Error al obtener eliminatorias desde SportsAPIPro",
        detalle: error.message,
      },
      { status: 500 }
    );
  }
}
*/
export const runtime = "nodejs";

function toTimestamp(date) {
  return Math.floor(new Date(date).getTime() / 1000);
}

const MOCK_PARTIDOS = [
  // 16avos
  {
    id: "mock-16avos-1",
    ronda: "16avos",
    equipoLocal: "Argentina",
    equipoVisitante: "México",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-06-28T16:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-16avos-2",
    ronda: "16avos",
    equipoLocal: "Brasil",
    equipoVisitante: "Estados Unidos",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-06-28T19:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-16avos-3",
    ronda: "16avos",
    equipoLocal: "Francia",
    equipoVisitante: "Japón",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-06-29T16:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-16avos-4",
    ronda: "16avos",
    equipoLocal: "España",
    equipoVisitante: "Marruecos",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-06-29T19:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-16avos-5",
    ronda: "16avos",
    equipoLocal: "Inglaterra",
    equipoVisitante: "Corea del Sur",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-06-30T16:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-16avos-6",
    ronda: "16avos",
    equipoLocal: "Alemania",
    equipoVisitante: "Canadá",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-06-30T19:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-16avos-7",
    ronda: "16avos",
    equipoLocal: "Portugal",
    equipoVisitante: "Uruguay",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-01T16:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-16avos-8",
    ronda: "16avos",
    equipoLocal: "Italia",
    equipoVisitante: "Colombia",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-01T19:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-16avos-9",
    ronda: "16avos",
    equipoLocal: "Países Bajos",
    equipoVisitante: "Chile",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-02T16:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-16avos-10",
    ronda: "16avos",
    equipoLocal: "Bélgica",
    equipoVisitante: "Senegal",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-02T19:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-16avos-11",
    ronda: "16avos",
    equipoLocal: "Croacia",
    equipoVisitante: "Australia",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-03T13:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-16avos-12",
    ronda: "16avos",
    equipoLocal: "Suiza",
    equipoVisitante: "Ecuador",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-03T16:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-16avos-13",
    ronda: "16avos",
    equipoLocal: "Dinamarca",
    equipoVisitante: "Ghana",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-03T19:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-16avos-14",
    ronda: "16avos",
    equipoLocal: "Polonia",
    equipoVisitante: "Costa Rica",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-03T22:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-16avos-15",
    ronda: "16avos",
    equipoLocal: "Serbia",
    equipoVisitante: "Túnez",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-03T23:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-16avos-16",
    ronda: "16avos",
    equipoLocal: "Noruega",
    equipoVisitante: "Egipto",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-03T23:30:00"),
    sede: "Sede por confirmar",
  },

  // Octavos
  {
    id: "mock-octavos-1",
    ronda: "Octavos",
    equipoLocal: "Ganador 16avos 1",
    equipoVisitante: "Ganador 16avos 2",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-04T16:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-octavos-2",
    ronda: "Octavos",
    equipoLocal: "Ganador 16avos 3",
    equipoVisitante: "Ganador 16avos 4",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-04T19:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-octavos-3",
    ronda: "Octavos",
    equipoLocal: "Ganador 16avos 5",
    equipoVisitante: "Ganador 16avos 6",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-05T16:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-octavos-4",
    ronda: "Octavos",
    equipoLocal: "Ganador 16avos 7",
    equipoVisitante: "Ganador 16avos 8",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-05T19:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-octavos-5",
    ronda: "Octavos",
    equipoLocal: "Ganador 16avos 9",
    equipoVisitante: "Ganador 16avos 10",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-06T16:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-octavos-6",
    ronda: "Octavos",
    equipoLocal: "Ganador 16avos 11",
    equipoVisitante: "Ganador 16avos 12",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-06T19:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-octavos-7",
    ronda: "Octavos",
    equipoLocal: "Ganador 16avos 13",
    equipoVisitante: "Ganador 16avos 14",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-07T16:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-octavos-8",
    ronda: "Octavos",
    equipoLocal: "Ganador 16avos 15",
    equipoVisitante: "Ganador 16avos 16",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-07T19:00:00"),
    sede: "Sede por confirmar",
  },

  // Cuartos
  {
    id: "mock-cuartos-1",
    ronda: "Cuartos",
    equipoLocal: "Ganador Octavos 1",
    equipoVisitante: "Ganador Octavos 2",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-09T16:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-cuartos-2",
    ronda: "Cuartos",
    equipoLocal: "Ganador Octavos 3",
    equipoVisitante: "Ganador Octavos 4",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-10T16:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-cuartos-3",
    ronda: "Cuartos",
    equipoLocal: "Ganador Octavos 5",
    equipoVisitante: "Ganador Octavos 6",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-10T19:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-cuartos-4",
    ronda: "Cuartos",
    equipoLocal: "Ganador Octavos 7",
    equipoVisitante: "Ganador Octavos 8",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-11T19:00:00"),
    sede: "Sede por confirmar",
  },

  // Semifinales
  {
    id: "mock-semifinal-1",
    ronda: "Semifinal",
    equipoLocal: "Ganador Cuartos 1",
    equipoVisitante: "Ganador Cuartos 2",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-14T19:00:00"),
    sede: "Sede por confirmar",
  },
  {
    id: "mock-semifinal-2",
    ronda: "Semifinal",
    equipoLocal: "Ganador Cuartos 3",
    equipoVisitante: "Ganador Cuartos 4",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-15T19:00:00"),
    sede: "Sede por confirmar",
  },

  // Tercer puesto
  {
    id: "mock-tercer-puesto",
    ronda: "Tercer puesto",
    equipoLocal: "Perdedor Semifinal 1",
    equipoVisitante: "Perdedor Semifinal 2",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-18T19:00:00"),
    sede: "Sede por confirmar",
  },

  // Final
  {
    id: "mock-final",
    ronda: "Final",
    equipoLocal: "Ganador Semifinal 1",
    equipoVisitante: "Ganador Semifinal 2",
    marcadorLocal: null,
    marcadorVisitante: null,
    estado: "Programado",
    fechaInicio: toTimestamp("2026-07-19T19:00:00"),
    sede: "Sede por confirmar",
  },
];

export async function GET() {
  return Response.json({
    total: MOCK_PARTIDOS.length,
    partidos: MOCK_PARTIDOS,
    fuente: "mock",
  });
}