import { createContext, useContext, useState, useEffect } from "react";
// APImatches despues se remplaza por fetch a la API
import APImatches from '@/lib/matches.json'
// fetch /api/world-cup-2026/matches/rounds
const roundsAPI = [
  { id: 1, 'round': 'Fase de Grupos - Fecha 1', },
  { id: 2, 'round': 'Fase de Grupos - Fecha 2', },
  { id: 3, 'round': 'Fase de Grupos - Fecha 3', },
  { id: 6, 'round': 'Dieciseisavos de Final' },
  { id: 25, 'round': 'Octavos de Final' },
  { id: 27, 'round': 'Cuartos de Final' },
  { id: 28, 'round': 'Semifinales' },
  { id: 50, 'round': 'Tercer Puesto' },
  { id: 29, 'round': 'Final' },
]

const MatchesContext = createContext()

export function MatchesProvider({ children }) {
  const [matches, setMatches] = useState([])
  const [rounds, setRounds] = useState([])

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const cachedMatches = window.localStorage.getItem('matches')
    const cachedRounds = window.localStorage.getItem('rounds')

    if (cachedMatches) {
      setMatches(JSON.parse(cachedMatches))
    } else {
      fetchMatches(0)
    }

    if (cachedRounds) {
      setRounds(JSON.parse(cachedRounds))
    } else {
      window.localStorage.setItem("rounds", JSON.stringify(roundsAPI));
      setRounds(roundsAPI)
    }
  }, [])

  const saveMatches = (newMatches) => {
    setMatches(newMatches);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("matches", JSON.stringify(newMatches));
    }
  }

  const addMatches = (addedMatches) => {
    const newMatches = [...matches, addedMatches]
    saveMatches(newMatches)
  }

  // llamar a la api de nuevo para actualizar la info - limitar las 100 llamadas
  const fetchMatches = (roundId) => {
    // fetch /api/world-cup-2026/matches/round/:roundId
    if (matches.length === 0) {
      saveMatches(APImatches.data.result.data.events)
    } else {
      addMatches(APImatches.data.result.data.events)
    }
  }

  const getMatchById = (id) => matches.find((match) => match.customId === id)

  const getMatchesByRound = (roundId) => matches.filter(match => match.roundInfo.round === roundId)

  const convertTimestamp = (timestamp, deleteCurrentYear = false) => {
    const currentYear = new Date().getFullYear()

    var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
      yyyy = d.getFullYear(),
      mm = ('0' + (d.getMonth() + 1)).slice(-2),  // Months are zero based. Add leading 0.
      dd = ('0' + d.getDate()).slice(-2),         // Add leading 0.
      hh = ('0' + d.getHours()).slice(-2),         // Add leading 0.
      min = ('0' + d.getMinutes()).slice(-2),     // Add leading 0.
      time;


    if (deleteCurrentYear && currentYear === yyyy) {
      time = dd + '/' + mm + ' ' + hh + ':' + min;
    } else {
      time = dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + min;
    }

    return time;
  }

  if (!isMounted) return null;

  return (
    <MatchesContext.Provider value={{
      matches,
      rounds,
      addMatches,
      fetchMatches,
      getMatchById,
      getMatchesByRound,
      convertTimestamp
    }}>
      {children}
    </MatchesContext.Provider>
  )
}

export const useMatches = () => useContext(MatchesContext)
