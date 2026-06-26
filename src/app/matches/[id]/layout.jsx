"use client"

import { useMatches } from "../MatchesContext";
import { useParams } from "next/navigation";

import MatchHeader from "@/app/components/matches/MatchHeader";
import Prediction from "@/app/components/Prediction";

export default function MatchDetailLayout({ children }) {
  const { id } = useParams();

  const { getMatchById } = useMatches()
  const match = getMatchById(id)

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-100 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center py-4 px-16 bg-white dark:bg-black sm:items-start">

        <MatchHeader match={match} />

        {(match.status.code === 0) ? (
          <Prediction match={match} />
        ) : (
          <span className="flex justify-around items-center w-full py-2 ">
            No se puede hacer una predicción una vez que el partido ha comenzado
          </span>
        )}

        <div className="w-full flex gap-4 justify-center rounded-t-xl bg-blue-500 py-2">
          <span className="text-white">Resumen</span>
        </div>

        {children}

      </main>
    </div>
  )
}