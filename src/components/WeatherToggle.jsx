import React, { useState } from 'react'
import { useWorldState } from '../hooks/useWorldState'

export default function WeatherToggle() {
  const { weatherMode, setWeatherMode } = useWorldState()
  const [isOpen, setIsOpen] = useState(false)
  
  const weatherOptions = [
    { mode: 'clear', icon: '☀️', label: 'Clear' },
    { mode: 'drizzle', icon: '🌧️', label: 'Drizzle' },
    { mode: 'windy', icon: '🍂', label: 'Windy' }
  ]
  
  const currentWeather = weatherOptions.find(w => w.mode === weatherMode) || weatherOptions[0]
  
  const handleWeatherChange = (mode) => {
    setWeatherMode(mode)
    setIsOpen(false)
  }
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center text-lg ${
          weatherMode !== 'clear'
            ? 'bg-blue-200 hover:bg-blue-300 text-blue-800 ring-2 ring-blue-400' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
        }`}
        title={`Weather: ${currentWeather.label}`}
      >
        {currentWeather.icon}
      </button>
      
      {isOpen && (
        <div className="absolute bottom-14 left-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[120px] z-50 animate-in fade-in duration-200">
          {weatherOptions.map((weather) => (
            <button
              key={weather.mode}
              onClick={() => handleWeatherChange(weather.mode)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 transition-all duration-200 ${
                weatherMode === weather.mode ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{weather.icon}</span>
              <span className="text-sm">{weather.label}</span>
            </button>
          ))}
        </div>
      )}
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
