"use client"

import { usePredictions } from "../PredictionsContext";
import { useState, useEffect } from "react";
import CountryFlag from "./CountryFlag";

export default function Prediction({ match }) {
  const { addPrediction, updatePrediction, getPredictionById } = usePredictions()
  const [choice, setChoice] = useState(0)

  useEffect(() => {
    const prediction = getPredictionById(match.id)
    if (prediction) {
      setChoice(prediction.winner)
    }
  }, [])

  const handleChoice = (c) => {
    if (match.status.code === 0) {
      if (getPredictionById(match.id)) {
        updatePrediction(match.id, c)
      } else {
        addPrediction(match.id, c)
      }
      setChoice(c)
    }
  }

  // console.log(match.winnerCode);

  return (
    <>
    <span className="w-full text-center font-semibold pt-3">Haz tu predicción del ganador</span>
      <div className="flex justify-around items-center w-full gap-12 py-4">
        <button
          className='flex justify-center gap-4 rounded-lg border border-zinc-700 bg-zinc-800 
        h-8 transition-all hover:border-blue-500 hover:bg-zinc-700 w-1/5 cursor-pointer
        disabled:bg-background disabled:cursor-default outline-blue-500
        disabled:border-0 disabled:outline-2'
          onClick={() => handleChoice(1)}
          disabled={choice === 1}
        >
          <CountryFlag countryCode={(match.homeTeam.country.alpha2).toLowerCase()} />
        </button>

        <button
          className='flex justify-center gap-4 rounded-lg border border-zinc-700 bg-zinc-800 
        h-8 transition-all hover:border-blue-500 hover:bg-zinc-700 w-1/5 cursor-pointer
        disabled:bg-background disabled:cursor-default outline-blue-500
        disabled:border-0 disabled:outline-2'
          onClick={() => handleChoice(3)}
          disabled={choice === 3}
        >
          <p className="text-center self-center">X</p>
        </button>

        <button
          className='flex justify-center gap-4 rounded-lg border border-zinc-700 bg-zinc-800 
        h-8 transition-all hover:border-blue-500 hover:bg-zinc-700 w-1/5 cursor-pointer
        disabled:bg-background disabled:cursor-default outline-blue-500
        disabled:border-0 disabled:outline-2'
          onClick={() => handleChoice(2)}
          disabled={choice === 2}
        >
          <CountryFlag
            countryCode={(match.awayTeam.country.alpha2).toLowerCase()}
          />
        </button>
      </div>
    </>
  )
}
