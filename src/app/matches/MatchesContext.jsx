import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const MatchesContext = createContext()

export function MatchesProvider({ children }) {
  const [matches, setMatches] = useState([])
  const [roundData, setRoundData] = useState({})
  const [resumen, setResumen] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingRoundData, setLoadingRoundData] = useState(false)
  const [error, setError] = useState(null)

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const cachedMatches = window.localStorage.getItem('matches')
    const cachedRoundData = window.localStorage.getItem('roundData')

    if (cachedRoundData) {
      setRoundData(JSON.parse(cachedRoundData))
    } else {
      fetchRoundData()
    }

    if (cachedMatches) {
      setMatches(JSON.parse(cachedMatches))
    } else {
      fetchMatchesByRound(1)
    }
  }, [])

  const saveMatches = (newMatches) => {
    setMatches(newMatches);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("matches", JSON.stringify(newMatches));
    }
  }

  const addMatches = (addedMatches) => {
    const newMatches = [...matches, ...addedMatches]
    saveMatches(newMatches)
  }

  // llamar a la api de nuevo para actualizar la info - limitar las 100 llamadas
  const fetchMatchesByRound = async (roundId) => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post('/api/match', {
        round: roundId
      })

      if (matches.length === 0) {
        saveMatches(response.data.result)
      } else {
        addMatches(response.data.result)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al conectar con la API')
    } finally {
      setLoading(false)
    }
  }

  const clearMatches = () => {
    const oldMatches = matches.filter(match => (match.roundInfo.round < roundData.currentRound.round))

    saveMatches(oldMatches)
  }

  const getMatchById = (id) => matches.find((match) => String(match.id) === String(id))

  const getMatchesByRound = (roundId) => matches.filter(match => match.roundInfo?.round === roundId)

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

  const saveRoundData = (newRoundData) => {
    setRoundData(newRoundData)
    if (typeof window !== "undefined") {
      window.localStorage.setItem("roundData", JSON.stringify(newRoundData));
    }
  }

  const fetchRoundData = async () => {
    setLoadingRoundData(true)
    setError(null)

    try {
      const response = await axios.get('/api/rounds')

      saveRoundData(response.data.result)

    } catch (err) {
      setError(err.response?.data?.error || 'Error al conectar con la API')
    } finally {
      setLoadingRoundData(false)
    }
  }

  if (!isMounted) return null;

  return (
    <MatchesContext.Provider value={{
      matches,
      roundData,
      resumen,
      loading,
      loadingRoundData,
      error,
      addMatches,
      fetchMatchesByRound,
      clearMatches,
      getMatchById,
      getMatchesByRound,
      convertTimestamp,
      fetchRoundData
    }}>
      {children}
    </MatchesContext.Provider>
  )
}

export const useMatches = () => useContext(MatchesContext)
