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
    <div className="flex justify-around items-center w-full gap-12 py-2 border-b ">
      <button
        className='border px-2 w-1/5 rounded-lg cursor-pointer hover:bg-zinc-400 
        disabled:hover:bg-background disabled:cursor-default outline-purple-900
        disabled:border-0 disabled:outline-2'
        onClick={() => handleChoice(1)}
        disabled={choice === 1}
      >
        <CountryFlag countryCode={(match.homeTeam.country.alpha2).toLowerCase()} />
      </button>

      <button
        className='border px-2 w-1/5 rounded-lg cursor-pointer hover:bg-zinc-400 
        disabled:hover:bg-background disabled:cursor-default outline-purple-900
        disabled:border-0 disabled:outline-2'
        onClick={() => handleChoice(3)}
        disabled={choice === 3}
      >
        <p className="text-center">X</p>
      </button>

      <button
        className='border px-2 w-1/5 rounded-lg cursor-pointer hover:bg-zinc-400 
        disabled:hover:bg-background disabled:cursor-default outline-purple-900
        disabled:border-0 disabled:outline-2'
        onClick={() => handleChoice(2)}
        disabled={choice === 2}
      >
        <CountryFlag
          countryCode={(match.awayTeam.country.alpha2).toLowerCase()}
        />
      </button>
    </div>
  )
}
