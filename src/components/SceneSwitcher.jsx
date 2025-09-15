import React from 'react'
import { useWorldState } from '../hooks/useWorldState'

export default function SceneSwitcher() {
  const { scene, setScene } = useWorldState()
  
  const scenes = [
    { value: 'day', emoji: '☀️', bg: 'bg-yellow-200 hover:bg-yellow-300', text: 'text-yellow-800' },
    { value: 'sunset', emoji: '🌅', bg: 'bg-orange-200 hover:bg-orange-300', text: 'text-orange-800' },
    { value: 'night', emoji: '🌙', bg: 'bg-indigo-200 hover:bg-indigo-300', text: 'text-indigo-800' }
  ]
  
  return (
    <div className="absolute top-6 right-6 flex gap-3">
      {scenes.map(sceneOption => (
        <button
          key={sceneOption.value}
          onClick={() => setScene(sceneOption.value)}
          className={`w-12 h-12 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center text-lg ${
            scene === sceneOption.value
              ? `${sceneOption.bg} ${sceneOption.text} ring-2 ring-white ring-opacity-50`
              : `${sceneOption.bg} ${sceneOption.text}`
          }`}
          title={sceneOption.value.charAt(0).toUpperCase() + sceneOption.value.slice(1)}
        >
          {sceneOption.emoji}
        </button>
      ))}
    </div>
  )
}
