"use client"

import { useMatches } from "@/app/matches/MatchesContext";
import { usePredictions } from "../PredictionsContext";

import MatchList from "../components/matches/MatchList";

export default function page() {
  const { matches, fetchRoundData, clearMatches } = useMatches()
  const { score, updateScore } = usePredictions()

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-100 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-start py-4 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex justify-between items-center gap-6 text-center sm:text-left w-full">
          <div>
            <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              Partidos
            </h1>
            <h1>Puntaje: {score}</h1>
          </div>
          <div>
            <button
              className="border p-1 cursor-pointer"
              onClick={fetchRoundData}
            >
              Update Rounds
            </button>
            {(matches.length !== 0) && (
              <button
                className="border p-1 cursor-pointer"
                onClick={clearMatches}
              >
                Clear Matches
              </button>
            )}
            <button
              className="border p-1 cursor-pointer"
              onClick={updateScore}
            >
              Update Score
            </button>
          </div>
        </div>

        <MatchList />

      </main>
    </div>
  )
}
