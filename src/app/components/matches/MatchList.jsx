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
      <div className="flex justify-between w-full text-center py-4">

        {loadingRoundData ? (
          <>
            <button
              onClick={() => handleRoundChange(round - 1)}
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-3"
              disabled={true}
            >
              &lt;
            </button>

            <svg aria-hidden="true" role="img" width="32" height="32" viewBox="0 0 24 24" className="self-center animate-spin">
              <path fill="none" stroke="currentColor" strokeLinecap="square" strokeWidth="2" d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2"></path>
            </svg>
            <button
              onClick={() => handleRoundChange(round + 1)}
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-3"
              disabled={true}
            >
              &gt;
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handleRoundChange(round - 1)}
              className="rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 transition-all 
          hover:border-blue-500 hover:bg-zinc-700 cursor-pointer
          disabled:bg-zinc-950 disabled:hover:border-zinc-700 disabled:cursor-default"
              disabled={round === 0}
            >
              &lt;
            </button>
            <p className="self-center">{(roundData.rounds[round].name) ? (
              roundData.rounds[round].name
            ) : (
              `Fase de Grupos - Fecha ${roundData.rounds[round].round}`
            )}</p>
            <button
              onClick={() => handleRoundChange(round + 1)}
              className="rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 transition-all 
          hover:border-blue-500 hover:bg-zinc-700 cursor-pointer 
          disabled:bg-zinc-950 disabled:hover:border-zinc-700 disabled:cursor-default"
              disabled={roundData.rounds[round].round === roundData.currentRound.round}
            >
              &gt;
            </button>
          </>
        )}

      </div>

      <section className="mt-6 flex flex-col gap-3">
        {matches.map((match, key) => (
          <MatchCard key={key} match={match} />
        ))}
      </section>

      {loading && (
        <svg aria-hidden="true" role="img" width="32" height="32" viewBox="0 0 24 24" className="self-center animate-spin">
          <path fill="none" stroke="currentColor" strokeLinecap="square" strokeWidth="2" d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2"></path>
        </svg>
      )}

      {error && <p className="self-center text-red-600 text-2xl">{error}</p>}
    </>
  )
}