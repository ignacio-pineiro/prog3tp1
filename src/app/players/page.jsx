import Link from 'next/link'
import React from 'react'

export default function page() {
  // funcion fetch jugadores => me trae un array de jugadores
  // [{id: 1, name: "Los Tigres", neighborhood: "Centro", color: "Rojo"}]
  const jugadores = [
    { id: "1", name: "Juan García", position: "Delantero", team: "Los Tigres", height: "1.78"},
    { id: "2", name: "Pedro López", position: "Mediocampo", team: "Los Halcones", height: "1.75"},
    { id: "3", name: "Marcos Díaz", position: "Arquero", team: "Los Cóndores", height: "1.91"},
  ]

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Jugadores
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Todos los jugadores que participan en la liga. Podés ver el detalle de cada uno o registrar uno nuevo.
          </p>
          <Link
            href="/players/create"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
          >
            Nuevo Jugador
          </Link>
        </div>

        {jugadores.map((jugador) => (
          <section
            key={jugador.id}
            className="w-full h-40 my-8 p-6 rounded-lg flex flex-col bg-zinc-800 text-white justify-between"
          >
            <div>
              <h2 className="font-semibold text-lg">{jugador.name}</h2>
              <p className="text-zinc-400">Posición: {jugador.position} · Equipo: {jugador.team} · Estatura: {jugador.height}</p>
            </div>
            <Link href={`/players/${jugador.id}`} className="text-sm text-blue-500 hover:underline">
              Ver Jugador
            </Link>
          </section>
        ))}
      </main>
    </div>
  )
}