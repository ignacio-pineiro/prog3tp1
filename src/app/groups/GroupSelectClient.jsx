'use client'

import { useRouter } from 'next/navigation'

const GRUPOS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export default function GroupSelectClient() {
  const router = useRouter()

  function handleChange(e) {
    const grupo = e.target.value
    if (grupo) router.push(`/groups/${grupo}`)
  }

  return (
    <div className="flex justify-center my-6">
      <div className="flex items-center gap-3 bg-zinc-800 p-4 rounded-lg border border-zinc-700">
        <label htmlFor="grupo" className="text-zinc-300 font-medium text-sm">
          Ver grupo:
        </label>
        <select
          id="grupo"
          defaultValue=""
          onChange={handleChange}
          className="bg-zinc-700 border border-zinc-600 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="" disabled>
            Seleccioná un grupo
          </option>
          {GRUPOS.map((g) => (
            <option key={g} value={g}>
              Grupo {g}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}