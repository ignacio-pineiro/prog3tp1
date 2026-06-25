"use client"

import IncidentData from '@/lib/match-id-incidents.json'

import Incident from '@/app/components/matches/Incident';
import axios from "axios";
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function MatchDetailPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [resumen, setResumen] = useState([])

  const { id } = useParams();

  useEffect(() => {
    setLoading(true)
    setError(null)

    try {
      async function fetchSummary() {
        const response = await axios.post('/api/incidents', {
          matchId: id
        })

        setResumen(response.data.result)
      }
      fetchSummary()

      // setResumen(IncidentData.data.result.data.incidents)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al conectar con la API')
    } finally {
      setLoading(false)
    }
  }, [])



  return (
    <div className="rounded-b-xl bg-zinc-800 w-full pb-2">
      <p>{error}</p>

      {loading && (
        <div className='flex justify-center'>
          <svg aria-hidden="true" role="img" width="32" height="32" viewBox="0 0 24 24" className="animate-spin">
            <path fill="none" stroke="currentColor" strokeLinecap="square" strokeWidth="2" d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2"></path>
          </svg>
        </div>
      )}


      {resumen.map((incident, key) =>
        <Incident incident={incident} key={key} />
      )}
    </div>
  )
}