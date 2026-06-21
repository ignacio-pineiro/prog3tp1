import { createContext, useContext, useState, useEffect } from "react";

const PredictionsContext = createContext()

export function PredictionsProvider({ children }) {
  const [predictions, setPredictions] = useState([])
  const [score, setScore] = useState(0)

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const cachedPredictions = window.localStorage.getItem('my_predictions')
    const cachedScore = window.localStorage.getItem('my_score')

    if (cachedPredictions) {
      setPredictions(JSON.parse(cachedPredictions))
    }

    if (cachedScore) {
      setScore(JSON.parse(cachedScore))
    }
  }, [])

  const savePredictions = (newPredictions) => {
    setPredictions(newPredictions);
    if (typeof window !== "undefined") {
      window.localStorage.setItem('my_predictions', JSON.stringify(newPredictions));
    }
  }

  const addPrediction = (id, choice) => {
    const newPrediction = {
      matchId: id,
      winner: choice
    }
    const newPredictions = [...predictions, newPrediction];
    savePredictions(newPredictions);
  }

  const updatePrediction = (id, choice) => {
    const updatedPredictions = predictions.map(prediction =>
      String(prediction.matchId) === String(id) ? {
        matchId: id,
        winner: choice
      } : prediction
    )
    savePredictions(updatedPredictions)
  }

  // maybe makes no sense to have
  const deletePrediction = (id) => {
    const filteredPredictions = predictions.filter(prediction =>
      String(prediction.matchId) !== String(id)
    )
    savePredictions(filteredPredictions)
  }

  const getPredictionById = (id) => predictions.find(prediction =>
    String(prediction.matchId) === String(id)
  )

  const updateScore = () => {
    const cachedMatches = JSON.parse(window.localStorage.getItem('matches'))
    var newScore = 0

    predictions.forEach(prediction => {
      const match = cachedMatches.find(match => String(match.id) === String(prediction.matchId))
      
      if (match) {
        if (match.winnerCode === prediction.winner) newScore += 1;
      }
    })

    setScore(newScore)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('my_score', JSON.stringify(newScore))
    }
  }

  if (!isMounted) return null;

  return (
    <PredictionsContext.Provider value={{
      predictions,
      score,
      addPrediction,
      updatePrediction,
      deletePrediction,
      getPredictionById,
      updateScore
    }}>
      {children}
    </PredictionsContext.Provider>
  )
}

export const usePredictions = () => useContext(PredictionsContext)