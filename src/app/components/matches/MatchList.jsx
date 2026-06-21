"use client"

import { useMatches } from "@/app/matches/MatchesContext";
import { useState } from "react";

import MatchCard from "./MatchCard";

export default function RoundSelector() {
  const { rounds, getMatchesByRound, fetchMatchesByRound } = useMatches()

  const [round, setRound] = useState(0);

  var matches = getMatchesByRound(rounds.rounds[round].round)

  const handleRoundChange = (newRound) => {
    setRound(newRound)
    matches = getMatchesByRound(rounds.rounds[newRound].round)
    if (matches.length === 0) {
      console.log('callAPI');
      // fetchMatchesByRound(rounds[newRound].round) // falta implementar API para actualizar partidos
    }
  }

  return (
    <>
      <div className="flex justify-between w-full text-center sm:items-start sm:text-left py-4">
        <button
          onClick={() => handleRoundChange(round - 1)}
          className="hover:text-green-500 border px-4 cursor-pointer disabled:text-gray-500"
          disabled={round === 0}
        >
          &lt;
        </button>

        <p className="">{(rounds.rounds[round].name) ? (
          rounds.rounds[round].name
        ) : (
          `Fase de Grupos - Fecha ${rounds.rounds[round].round}`
        )}</p>

        <button
          onClick={() => handleRoundChange(round + 1)}
          className="hover:text-green-500 border px-4 cursor-pointer disabled:text-gray-500"
          disabled={round === rounds.length - 1}
        >
          &gt;
        </button>
      </div>

      {matches.map((match, key) => (
        <MatchCard key={key} match={match} />
      ))}
    </>
  )
}