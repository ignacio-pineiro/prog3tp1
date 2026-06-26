import Link from "next/link";

function formatDate(timestamp) {
  if (!timestamp) return "Fecha por confirmar";

  return new Date(timestamp * 1000).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MatchCard({ partido }) {
  return (
    <article className="w-64 rounded-xl border border-indigo-500/40 bg-slate-900 p-4 shadow-lg">
      <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
        <span>{formatDate(partido.fechaInicio)}</span>
        <span>{partido.estado}</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-2">
          <span className="font-medium text-white">{partido.equipoLocal}</span>
          <span className="text-slate-300">
            {partido.marcadorLocal ?? "-"}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-2">
          <span className="font-medium text-white">
            {partido.equipoVisitante}
          </span>
          <span className="text-slate-300">
            {partido.marcadorVisitante ?? "-"}
          </span>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400">{partido.sede}</p>

      <Link
        href={`/matches/${partido.id}`}
        className="mt-4 inline-block text-sm font-semibold text-indigo-300 hover:text-indigo-100"
      >
        Ver detalle
      </Link>
    </article>
  );
}