"use client"

import { useMatches } from "@/app/matches/MatchesContext";

import Link from "next/link";
import CountryFlag from "../CountryFlag";

export default function MatchCard({ match }) {
  const { convertTimestamp } = useMatches()
  const horario = convertTimestamp(match.startTimestamp, true)

  return (
    <section className="border-b w-full hover:bg-slate-300 py-1">
      <Link
        href={`/matches/${match.id}`}
        className=""
      >
        <div className="font-mono flex items-stretch">
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

          <div className="flex flex-col">
            <span>{match.homeScore.display}</span>
            <span>{match.awayScore.display}</span>
          </div>
        </div>
      </Link>
    </section>
  )
}