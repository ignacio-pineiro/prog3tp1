import React from 'react'
import Link from 'next/link'

export default async function page({ params }) {
  const { id } = await params
const equipos = [
    { id: "1", name: "Los Tigres", neighborhood: "Centro", color: "Rojo", captain: "Juan García", founded: "2021" },
    { id: "2", name: "Los Halcones", neighborhood: "Norte", color: "Azul", captain: "Pedro López", founded: "2020" },
    { id: "3", name: "Los Cóndores", neighborhood: "Sur", color: "Verde", captain: "Marcos Díaz", founded: "2022" },
  ]
  
  const equipo = equipos.find((e) => e.id === id)

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col py-32 px-16 bg-white dark:bg-black">
        <Link href="/teams" className="mb-8 text-zinc-500 hover:text-white transition-colors">
          &larr; Volver a Equipos
        </Link>

        <div className="flex flex-col gap-2 mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {equipo.name}
          </h1>
          <p className="text-zinc-400">Barrio {equipo.neighborhood}</p>
        </div>

        {/* Info del equipo */}
        <section className="w-full p-6 rounded-lg flex flex-col gap-4 bg-zinc-800 text-white">
          <p className="text-lg font-semibold">Ficha del equipo</p>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-zinc-400">Color</p>
              <p className="font-medium">{equipo.color}</p>
            </div>
            <div>
              <p className="text-zinc-400">Capitán</p>
              <p className="font-medium">{equipo.captain}</p>
            </div>
            <div>
              <p className="text-zinc-400">Fundado</p>
              <p className="font-medium">{equipo.founded}</p>
            </div>
            <div>
              <p className="text-zinc-400">ID</p>
              <p className="font-medium">#{equipo.id}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}