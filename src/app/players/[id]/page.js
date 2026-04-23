import React from 'react'
import Link from 'next/link'

export default async function page({ params }) {
  const { id } = await params
const jugadores = [
    { id: "1", name: "Juan García", position: "Delantero", team: "Los Tigres", height: "1.78"},
    { id: "2", name: "Pedro López", position: "Mediocampo", team: "Los Halcones", height: "1.75"},
    { id: "3", name: "Marcos Díaz", position: "Arquero", team: "Los Cóndores", height: "1.91"},
  ]
  
  const jugador = jugadores.find((e) => e.id === id)

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col py-32 px-16 bg-white dark:bg-black">
        <Link href="/players" className="mb-8 text-zinc-500 hover:text-white transition-colors">
          &larr; Volver a Jugadores
        </Link>

        <div className="flex flex-col gap-2 mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {jugador.name}
          </h1>
          <p className="text-zinc-400">Posición {jugador.position}</p>
        </div>

        {/* Info del jugador */}
        <section className="w-full p-6 rounded-lg flex flex-col gap-4 bg-zinc-800 text-white">
          <p className="text-lg font-semibold">Ficha del jugador</p>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-zinc-400">Equipo</p>
              <p className="font-medium">{jugador.team}</p>
            </div>
            <div>
              <p className="text-zinc-400">Estatura</p>
              <p className="font-medium">{jugador.height}</p>
            </div>
            <div>
              <p className="text-zinc-400">ID</p>
              <p className="font-medium">#{jugador.id}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}