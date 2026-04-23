import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <section className="flex p-20 justify-center items-center w-full">
      <form className="flex flex-col flex-1 p-6 rounded-lg bg-zinc-800 font-sans">
        <Link href="/players" className="self-start mb-4 text-white font-semibold">
          &larr; Volver a Jugadores
        </Link>
        <p className="text-white text-lg font-semibold mb-4">Registrar Jugador</p>

        <label className="text-zinc-400 text-sm mb-1">Nombre del Jugador</label>
        <input
          type="text"
          placeholder="Ej: Juan Perez"
          className="p-2 border border-zinc-600 rounded-md my-2 bg-zinc-700 text-white"
        />

        <label className="text-zinc-400 text-sm mb-1">Posición</label>
        <input
          type="text"
          placeholder="Ej: Delantero, Defensor..."
          className="p-2 border border-zinc-600 rounded-md my-2 bg-zinc-700 text-white"
        />

        <label className="text-zinc-400 text-sm mb-1">Equipo</label>
        <input
          type="text"
          placeholder="Ej: Los Cóndores.."
          className="p-2 border border-zinc-600 rounded-md my-2 bg-zinc-700 text-white"
        />

        <label className="text-zinc-400 text-sm mb-1">Estatura</label>
        <input
          type="text"
          inputMode="decimal"
          placeholder="Estatura del Jugador"
          className="p-2 border border-zinc-600 rounded-md my-2 bg-zinc-700 text-white"
        />

        <button className="bg-blue-500 text-white p-2 rounded-md mt-4 hover:bg-blue-600 transition-colors">
          Guardar Jugador
        </button>
      </form>
    </section>
  )
}

export default page