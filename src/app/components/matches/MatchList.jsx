"use client"

import { useMatches } from "@/app/matches/MatchesContext";
import { useState, useEffect } from "react";

import MatchCard from "./MatchCard";

export default function RoundSelector() {
  const {
    loading,
    error,
    getMatchesByRound,
    fetchMatchesByRound,
    roundData,
    loadingRoundData,
    fetchRoundData
  } = useMatches()

  useEffect(() => {
    if (roundData.length === 0) {
      fetchRoundData()
    }
  }, [])

  const [round, setRound] = useState(0);

  var matches = getMatchesByRound(1)

  const handleRoundChange = (newRound) => {
    setRound(newRound)
    matches = getMatchesByRound(roundData.rounds[newRound].round)
    if (matches.length === 0) {
      fetchMatchesByRound(roundData.rounds[newRound].round)
    }
  }

  return (
    <>
      <div className="flex justify-between w-full text-center sm:items-start sm:text-left py-4">
        <button
          onClick={() => handleRoundChange(round - 1)}
          className="hover:text-green-500 border px-4 cursor-pointer 
          disabled:text-gray-500 disabled:cursor-default"
          disabled={(round === 0) || loadingRoundData}
        >
          &lt;
        </button>

        {loadingRoundData ? (
          <svg aria-hidden="true" role="img" width="32" height="32" viewBox="0 0 24 24" className="self-center animate-spin">
            <path fill="none" stroke="currentColor" strokeLinecap="square" strokeWidth="2" d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2"></path>
          </svg>
        ) : (
          <p className="">{(roundData.rounds[round].name) ? (
            roundData.rounds[round].name
          ) : (
            `Fase de Grupos - Fecha ${roundData.rounds[round].round}`
          )}</p>
        )}

        <button
          onClick={() => handleRoundChange(round + 1)}
          className="hover:text-green-500 border px-4 cursor-pointer 
          disabled:text-gray-500 disabled:cursor-default"
          disabled={(roundData.rounds[round].round === roundData.currentRound.round) || loadingRoundData}
        >
          &gt;
        </button>
      </div>

      {matches.map((match, key) => (
        <MatchCard key={key} match={match} />
      ))}

      {loading && (
        <svg aria-hidden="true" role="img" width="32" height="32" viewBox="0 0 24 24" className="self-center animate-spin">
          <path fill="none" stroke="currentColor" strokeLinecap="square" strokeWidth="2" d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2"></path>
        </svg>
      )}

      {error && <p className="self-center text-red-600 text-2xl">{error}</p>}
    </>
  )
}