'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function EquipoSearchClient({ equipos }) {
  const router = useRouter()
  const [busqueda, setBusqueda] = useState('')

  const equiposFiltrados = equipos.filter((equipo) =>
    equipo.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  function irAlEquipo(e) {
    const slug = e.target.value
    if (slug) router.push(`/teams/${slug}`)
  }

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-3 my-6">
      <input
        type="text"
        placeholder="Buscar equipo..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="bg-zinc-800 border border-zinc-700 text-white rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        defaultValue=""
        onChange={irAlEquipo}
        className="bg-zinc-800 border border-zinc-700 text-white rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <option value="" disabled>
          Ir a un equipo
        </option>

        {equiposFiltrados.map((equipo) => (
          <option key={equipo.id} value={equipo.slug}>
            {equipo.nombre}
          </option>
        ))}
      </select>
    </div>
  )
}