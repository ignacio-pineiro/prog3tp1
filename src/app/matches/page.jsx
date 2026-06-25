"use client"

import { useMatches } from "@/app/matches/MatchesContext";
import { usePredictions } from "../PredictionsContext";

import MatchList from "../components/matches/MatchList";

export default function page() {
  const { matches, fetchRoundData, clearMatches } = useMatches()
  const { score, updateScore } = usePredictions()

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <main className="mx-auto flex w-full max-w-6xl flex-col px-4 py-10">
        <div className="flex justify-between items-center gap-6 text-center sm:text-left w-full">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Partidos
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Puntaje: {score}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              className="rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 transition-all hover:border-blue-500 hover:bg-zinc-700 cursor-pointer"
              onClick={fetchRoundData}
            >
              Update Rounds
            </button>
            {(matches.length !== 0) && (
              <button
                className="rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 transition-all hover:border-blue-500 hover:bg-zinc-700 cursor-pointer"
                onClick={clearMatches}
              >
                Clear Matches
              </button>
            )}
            <button
              className="rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 transition-all hover:border-blue-500 hover:bg-zinc-700 cursor-pointer"
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
