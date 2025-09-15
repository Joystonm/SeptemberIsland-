import React, { useState, useEffect } from 'react'
import { useWorldState } from '../hooks/useWorldState'

export default function PumpkinCounter() {
  const { pumpkinCount, getTotalPumpkins } = useWorldState()
  const [showCompletion, setShowCompletion] = useState(false)
  const totalPumpkins = getTotalPumpkins()
  const allCollected = totalPumpkins === 0 && pumpkinCount > 0
  
  useEffect(() => {
    if (allCollected && !showCompletion) {
      setShowCompletion(true)
    } else if (!allCollected && showCompletion) {
      setShowCompletion(false)
    }
  }, [allCollected, showCompletion])
  
  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-bold">
        <span className="text-xl">🎃</span>
        <span>{pumpkinCount}</span>
      </div>
      
      {showCompletion && (
        <div className="mt-2 bg-yellow-400 text-yellow-900 px-3 py-2 rounded-full shadow-lg text-sm font-bold animate-bounce">
          🎉 All pumpkins collected! 🎉
        </div>
      )}
    </div>
  )
}
