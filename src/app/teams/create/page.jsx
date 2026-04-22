import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <section className="flex p-20 justify-center items-center w-full">
      <form className="flex flex-col flex-1 p-6 rounded-lg bg-zinc-800 font-sans">
        <Link href="/teams" className="self-start mb-4 text-white font-semibold">
          &larr; Volver a Equipos
        </Link>
        <p className="text-white text-lg font-semibold mb-4">Registrar Equipo</p>

        <label className="text-zinc-400 text-sm mb-1">Nombre del equipo</label>
        <input
          type="text"
          placeholder="Ej: Los Tigres"
          className="p-2 border border-zinc-600 rounded-md my-2 bg-zinc-700 text-white"
        />

        <label className="text-zinc-400 text-sm mb-1">Barrio</label>
        <input
          type="text"
          placeholder="Ej: Centro, Norte, Sur..."
          className="p-2 border border-zinc-600 rounded-md my-2 bg-zinc-700 text-white"
        />

        <label className="text-zinc-400 text-sm mb-1">Color</label>
        <input
          type="text"
          placeholder="Ej: Rojo y blanco"
          className="p-2 border border-zinc-600 rounded-md my-2 bg-zinc-700 text-white"
        />

        <label className="text-zinc-400 text-sm mb-1">Capitán</label>
        <input
          type="text"
          placeholder="Nombre del capitán"
          className="p-2 border border-zinc-600 rounded-md my-2 bg-zinc-700 text-white"
        />

        <label className="text-zinc-400 text-sm mb-1">Año de fundación</label>
        <input
          type="number"
          placeholder="Ej: 2021"
          className="p-2 border border-zinc-600 rounded-md my-2 bg-zinc-700 text-white"
        />

        <button className="bg-blue-500 text-white p-2 rounded-md mt-4 hover:bg-blue-600 transition-colors">
          Guardar Equipo
        </button>
      </form>
    </section>
  )
}

export default page