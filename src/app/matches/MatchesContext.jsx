import { createContext, useContext, useState, useEffect } from "react";
// APImatches despues se remplaza por fetch a la API
import APImatches from '@/lib/matches.json'
// fetch /api/world-cup-2026/matches/rounds
import APIrounds from '@/lib/rounds.json'

const MatchesContext = createContext()

export function MatchesProvider({ children }) {
  const [matches, setMatches] = useState([])
  const [rounds, setRounds] = useState({})

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const cachedMatches = window.localStorage.getItem('matches')
    const cachedRounds = window.localStorage.getItem('rounds')

    if (cachedMatches) {
      setMatches(JSON.parse(cachedMatches))
    } else {
      fetchMatchesByRound(1)
    }

    if (cachedRounds) {
      setRounds(JSON.parse(cachedRounds))
    } else {
      fetchRounds()
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
  const fetchMatchesByRound = (roundId) => {
    // fetch /api/world-cup-2026/matches/round/:roundId
    // axios.GET()

    if (matches.length === 0) {
      saveMatches(APImatches.data.result.data.events)
    } else {
      addMatches(APImatches.data.result.data.events)
    }
  }

  const fetchMatches = () => {
    // clear old match info
    saveMatches([])

    rounds.rounds.forEach(round => {
      if (round.round <= rounds.currentRound.round || (round.round <= 3)) {
        // fetch /api/world-cup-2026/matches/round/:roundId


        if (round.round === 1) {
          console.log(`callAPI save ${round.round}`);
          // saveMatches()
        } else {
          console.log(`callAPI add ${round.round}`);
          // addMatches(APImatches.data.result.data.events)
        }
      }
    })

    saveMatches(APImatches.data.result.data.events)
  }

  const getMatchById = (id) => matches.find((match) => String(match.id) === String(id))

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

  const fetchRounds = () => {
    // fetch /api/world-cup-2026/matches/rounds
    // APIrounds = axios.GET()

    setRounds(APIrounds)
    if (typeof window !== "undefined") {
      window.localStorage.setItem("rounds", JSON.stringify(APIrounds));
    }
    console.log(rounds);
    
  }

  if (!isMounted) return null;

  return (
    <MatchesContext.Provider value={{
      matches,
      rounds,
      addMatches,
      fetchMatches,
      fetchMatchesByRound,
      getMatchById,
      getMatchesByRound,
      convertTimestamp,
      fetchRounds
    }}>
      {children}
    </MatchesContext.Provider>
  )
}

export const useMatches = () => useContext(MatchesContext)
