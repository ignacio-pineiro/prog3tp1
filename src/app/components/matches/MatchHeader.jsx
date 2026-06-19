"use client"

import { useMatches } from "@/app/matches/MatchesContext"
import CountryFlag from "../CountryFlag"

export default function MatchHeader({ match }) {
  const { convertTimestamp } = useMatches()

  return (
    <div className="border-b w-full bg-blue-300 py-1 flex justify-around items-center h-28">
      <div className="flex flex-col items-center w-1/6">
        <CountryFlag countryCode={(match.homeTeam.country.alpha2).toLowerCase()} size={'lg'} />
        <span className="text-sm">{match.homeTeam.name}</span>
        <span className="font-light text-xs">FIFA: {match.homeTeam.ranking} </span>
      </div>

      <div className="flex flex-col items-center">
        <p>{convertTimestamp(match.startTimestamp)}</p>
        <span className="text-5xl font-semibold">{match.homeScore.display}-{match.awayScore.display}</span>
        <p className="uppercase">{match.status.description}</p>
      </div>

      <div className="flex flex-col items-center w-1/6">
        <CountryFlag countryCode={(match.awayTeam.country.alpha2).toLowerCase()} size={'lg'} />
        <span className="text-sm">{match.awayTeam.name}</span>
        <span className="font-light text-xs">FIFA: {match.awayTeam.ranking} </span>
      </div>
    </div>
  )
}