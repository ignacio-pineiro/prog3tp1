export const runtime = "nodejs";

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