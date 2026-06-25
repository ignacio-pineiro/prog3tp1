"use client"

import { useMatches } from "@/app/matches/MatchesContext";

import Link from "next/link";
import CountryFlag from "../CountryFlag";

export default function MatchCard({ match }) {
  const { convertTimestamp } = useMatches()
  const horario = convertTimestamp(match.startTimestamp, true)

  return (
    <>
      <Link
        href={`/matches/${match.id}`}
        className="flex items-center justify-between gap-4 rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 transition-all hover:border-blue-500 hover:bg-zinc-700"
      >
        <div className="font-mono flex items-stretch w-full">
          <div className="flex items-center">
            <span>{horario}</span>
          </div>

          <div className="grow ms-2">
            <div className="flex gap-1">
              <CountryFlag countryCode={(match.homeTeam.country.alpha2).toLowerCase()} />
              <span>{match.homeTeam.name}</span>
            </div>

            <div className="flex gap-1">
              <CountryFlag countryCode={(match.awayTeam.country.alpha2).toLowerCase()} />
              <span>{match.awayTeam.name}</span>
            </div>
          </div>

          <div className="flex flex-col self-end">
            <span>{match.homeScore.display}</span>
            <span>{match.awayScore.display}</span>
          </div>
        </div>
      </Link>
    </>
  )
}