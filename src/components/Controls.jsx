import React, { useRef } from 'react'
import { useWorldState } from '../hooks/useWorldState'
import { getRandomPosition } from '../utils/randomPosition'
import WeatherToggle from './WeatherToggle'

export default function Controls() {
  const { 
    addObject, 
    progressAutumn, 
    autumnStage, 
    isTransitioning, 
    toggleLanternMode, 
    lanternMode,
    toggleNature,
    toggleCozy,
    natureMode,
    cozyMode,
    isTogglingNature,
    isTogglingCozy
  } = useWorldState()
  const buttonRef = useRef()
  const lanternButtonRef = useRef()
  
  const handleLanternClick = () => {
    if (lanternButtonRef.current) {
      lanternButtonRef.current.style.transform = 'scale(1.2)'
      setTimeout(() => {
        if (lanternButtonRef.current) {
          lanternButtonRef.current.style.transform = 'scale(1)'
        }
      }, 150)
    }
    toggleLanternMode()
  }
  
  const addRandomPumpkin = () => {
    const position = getRandomPosition(2.5)
    position[1] = 0
    
    const uniqueId = `pumpkin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    console.log(`Adding pumpkin with ID: ${uniqueId}`)
    
    addObject({
      id: uniqueId,
      type: 'pumpkin',
      position,
      isNew: true
    })
  }
  
  const addRandomTree = () => {
    const position = getRandomPosition(2.5)
    position[1] = 0
    
    position[0] += (Math.random() - 0.5) * 0.3
    position[2] += (Math.random() - 0.5) * 0.3
    
    addObject({
      id: Date.now() + Math.random(),
      type: 'tree',
      position,
      isNew: true,
      seed: Math.random() * 1000
    })
  }
  
  const handleProgressAutumn = () => {
    if (!isTransitioning) {
      progressAutumn()
    }
  }
  
  const getAutumnButtonStyle = () => {
    const stages = [
      { bg: 'bg-green-200 hover:bg-green-300', text: 'text-green-800', icon: '🌱' },
      { bg: 'bg-yellow-200 hover:bg-yellow-300', text: 'text-yellow-800', icon: '🍃' },
      { bg: 'bg-orange-200 hover:bg-orange-300', text: 'text-orange-800', icon: '🍂' },
      { bg: 'bg-red-200 hover:bg-red-300', text: 'text-red-800', icon: '🍁' }
    ]
    
    if (isTransitioning) {
      return {
        bg: 'bg-amber-300',
        text: 'text-amber-900',
        icon: '✨',
        extra: 'cursor-not-allowed animate-pulse'
      }
    }
    
    return stages[autumnStage]
  }
  
  const buttonStyle = getAutumnButtonStyle()
  const tooltips = [
    "Start Autumn (Green)",
    "Deepen Colors (Yellow)", 
    "Rich Autumn (Orange)",
    "Peak Autumn (Deep Red)"
  ]
  
  const getTooltipText = () => {
    if (isTransitioning) return "Transitioning..."
    
    const { autumnDirection } = useWorldState.getState()
    const currentTooltip = tooltips[autumnStage]
    
    if (autumnStage === 3 && autumnDirection === 1) {
      return "Return to Orange"
    } else if (autumnStage === 0 && autumnDirection === -1) {
      return "Grow to Yellow"
    }
    
    return currentTooltip
  }
  
  return (
    <div className="absolute bottom-6 left-6 flex flex-col gap-3">
      <button 
        onClick={addRandomTree}
        className="w-12 h-12 bg-green-200 hover:bg-green-300 text-green-800 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center text-lg"
        title="Add Tree"
      >
        🌳
      </button>
      
      <button 
        onClick={addRandomPumpkin}
        className="w-12 h-12 bg-orange-200 hover:bg-orange-300 text-orange-800 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center text-lg"
        title="Add Pumpkin"
      >
        🎃
      </button>
      
      <button 
        ref={buttonRef}
        onClick={handleProgressAutumn}
        disabled={isTransitioning}
        className={`w-12 h-12 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center text-lg ${buttonStyle.bg} ${buttonStyle.text} ${buttonStyle.extra || ''}`}
        title={getTooltipText()}
      >
        {buttonStyle.icon}
      </button>
      
      <WeatherToggle />
      
      <button 
        ref={lanternButtonRef}
        onClick={handleLanternClick}
        className={`w-12 h-12 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center text-lg ${
          lanternMode 
            ? 'bg-yellow-200 hover:bg-yellow-300 text-yellow-800 ring-2 ring-yellow-400 animate-pulse' 
            : 'bg-orange-200 hover:bg-orange-300 text-orange-800'
        }`}
        title={`Lanterns ${lanternMode ? 'Auto' : 'Off'}`}
      >
        🏮
      </button>
      
      <button 
        onClick={toggleNature}
        disabled={isTogglingNature}
        className={`w-12 h-12 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center text-lg ${
          isTogglingNature
            ? 'bg-amber-300 text-amber-900 cursor-not-allowed animate-pulse'
            : natureMode 
            ? 'bg-green-200 hover:bg-green-300 text-green-800 ring-2 ring-green-400' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
        }`}
        title={`Nature ${natureMode ? 'ON' : 'OFF'}`}
      >
        {isTogglingNature ? '✨' : natureMode ? '🌿' : '🌱'}
      </button>
      
      <button 
        onClick={toggleCozy}
        disabled={isTogglingCozy}
        className={`w-12 h-12 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center text-lg ${
          isTogglingCozy
            ? 'bg-amber-300 text-amber-900 cursor-not-allowed animate-pulse'
            : cozyMode 
            ? 'bg-orange-200 hover:bg-orange-300 text-orange-800 ring-2 ring-orange-400' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
        }`}
        title={`Cozy ${cozyMode ? 'ON' : 'OFF'}`}
      >
        {isTogglingCozy ? '✨' : cozyMode ? '🔥' : '🕯️'}
      </button>
    </div>
  )
}
