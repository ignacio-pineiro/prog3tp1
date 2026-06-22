"use client";

import { useEffect, useState } from "react";
import KnockoutBracket from "@/components/KnockoutBracket";

export default function KnockoutPage() {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getKnockout() {
      try {
        const res = await fetch("/api/knockout");
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Error al cargar eliminatorias");
          return;
        }

        setPartidos(data.partidos || []);
      } catch (error) {
        setError("No se pudieron cargar las eliminatorias");
      } finally {
        setLoading(false);
      }
    }

    getKnockout();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <p>Cargando eliminatorias...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <h1 className="mb-4 text-3xl font-bold">Eliminatorias Mundial 2026</h1>
        <p className="text-red-400">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">
          FIFA World Cup 2026
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Eliminatorias Mundial 2026
        </h1>

        <p className="mt-3 max-w-2xl text-slate-400">
          Cuadro de fase eliminatoria con 16avos, octavos, cuartos,
          semifinales, tercer puesto y final.
        </p>
      </section>

      <KnockoutBracket partidos={partidos} />
    </main>
  );
}