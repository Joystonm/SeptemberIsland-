import React, { useState, useEffect, useRef } from 'react'
import MindfulBreakOverlay from './MindfulBreakOverlay'

export default function BreakTimer() {
  const [timeLeft, setTimeLeft] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [inputMinutes, setInputMinutes] = useState('')
  const [showMindfulBreak, setShowMindfulBreak] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsActive(false)
            setShowMindfulBreak(true)
            return 0
          }
          return time - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isActive, timeLeft])

  const startTimer = () => {
    const minutes = parseInt(inputMinutes)
    if (minutes > 0) {
      setTimeLeft(minutes * 60)
      setIsActive(true)
      setShowInput(false)
      setInputMinutes('')
    }
  }

  const stopTimer = () => {
    setIsActive(false)
    setTimeLeft(0)
    setShowMindfulBreak(false)
  }

  const handleMindfulBreakComplete = () => {
    setShowMindfulBreak(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <>
      <MindfulBreakOverlay 
        show={showMindfulBreak} 
        onComplete={handleMindfulBreakComplete} 
      />

      <div className="fixed top-20 right-4 z-40 flex flex-col items-end gap-3">
        {!isActive && timeLeft === 0 && !showInput && (
          <button
            onClick={() => setShowInput(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl shadow-lg transition-all duration-200 font-quicksand font-medium flex items-center gap-2"
          >
            Set Break Timer ⏳
          </button>
        )}

        {showInput && (
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl shadow-xl p-4 border border-orange-200">
            <div className="text-center mb-3">
              <h3 className="font-quicksand font-semibold text-amber-800 flex items-center justify-center gap-2">
                Set Break Timer ⏳
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              <input
                type="number"
                value={inputMinutes}
                onChange={(e) => setInputMinutes(e.target.value)}
                placeholder="Minutes"
                className="border-2 border-orange-200 rounded-lg px-3 py-2 w-24 text-center font-quicksand focus:border-orange-400 focus:outline-none"
                min="1"
                max="999"
              />
              <div className="flex gap-2">
                <button
                  onClick={startTimer}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-quicksand font-medium transition-colors"
                >
                  Start Timer
                </button>
                <button
                  onClick={() => setShowInput(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded-lg text-sm font-quicksand font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {(isActive || timeLeft > 0) && (
          <div className="bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-orange-300 rounded-xl px-4 py-3 shadow-lg backdrop-blur-sm">
            <div className="text-center">
              <div className="text-xs font-quicksand font-medium text-amber-700 mb-1">Break Timer</div>
              <div className="text-2xl font-bold font-mono text-orange-600 mb-2">
                {formatTime(timeLeft)}
              </div>
              <button
                onClick={stopTimer}
                className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-quicksand font-medium transition-colors"
              >
                Stop Timer
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
