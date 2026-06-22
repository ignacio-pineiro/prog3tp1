import Link from "next/link";

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-slate-950">
      <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl"></div>
      <div className="absolute right-10 top-60 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl"></div>

      <section className="relative mx-auto grid min-h-[80vh] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-200">
            Aplicación de fútbol - Mundial 2026
          </div>

          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-white md:text-6xl">
            Organizá partidos, equipos y eliminatorias en una sola plataforma
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Consultá equipos, jugadores, partidos y el cuadro de eliminatorias
            del torneo. La aplicación está preparada para consumir datos desde
            una API externa.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/knockout"
              className="rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
            >
              Ver eliminatorias
            </Link>

            <Link
              href="/matches"
              className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Ver partidos
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div className="rounded-2xl bg-slate-900 p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Próxima sección</p>
                <h2 className="text-2xl font-bold text-white">
                  Eliminatorias
                </h2>
              </div>

              <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-sm text-indigo-200">
                Bracket
              </span>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-slate-800 p-4">
                <p className="text-sm text-slate-400">16avos</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold text-white">2A</span>
                  <span className="text-slate-400">vs</span>
                  <span className="font-semibold text-white">2B</span>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-800 p-4">
                <p className="text-sm text-slate-400">Octavos</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold text-white">Ganador 73</span>
                  <span className="text-slate-400">vs</span>
                  <span className="font-semibold text-white">Ganador 75</span>
                </div>
              </div>

              <div className="rounded-xl border border-indigo-400/40 bg-indigo-500/10 p-4">
                <p className="text-sm text-indigo-200">Final</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold text-white">Ganador 101</span>
                  <span className="text-slate-400">vs</span>
                  <span className="font-semibold text-white">Ganador 102</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto grid max-w-7xl gap-5 px-6 pb-20 md:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-3xl font-bold text-indigo-300">Equipos</p>
          <p className="mt-3 text-slate-400">
            Sección para consultar selecciones participantes.
          </p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-3xl font-bold text-indigo-300">Partidos</p>
          <p className="mt-3 text-slate-400">
            Listado de encuentros, fechas, horarios y resultados.
          </p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-3xl font-bold text-indigo-300">API</p>
          <p className="mt-3 text-slate-400">
            Datos preparados para integrarse con SportsAPIPro.
          </p>
        </article>
      </section>
    </main>
  );
}