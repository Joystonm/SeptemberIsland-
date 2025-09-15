import React, { useState } from 'react'
import { useWorldState } from '../hooks/useWorldState'

export default function AmbientSound() {
  const [isMuted, setIsMuted] = useState(false)
  const [currentTrack, setCurrentTrack] = useState('lofi')
  const { 
    toggleNature, 
    toggleCozy, 
    natureMode, 
    cozyMode, 
    isTogglingNature, 
    isTogglingCozy 
  } = useWorldState()
  
  const tracks = [
    { id: 'lofi', emoji: '🎵', bg: 'bg-purple-200 hover:bg-purple-300', text: 'text-purple-800' }
  ]
  
  const toggleMute = () => {
    setIsMuted(!isMuted)
    console.log(isMuted ? '🔊 Audio enabled' : '🔇 Audio muted')
  }
  
  const handleNatureToggle = () => {
    if (!isTogglingNature) {
      toggleNature()
    }
  }
  
  const handleCozyToggle = () => {
    if (!isTogglingCozy) {
      toggleCozy()
    }
  }
  
  return (
    <div className="absolute bottom-6 right-6 flex flex-col gap-3">
      {tracks.map(track => (
        <button
          key={track.id}
          onClick={() => setCurrentTrack(track.id)}
          className={`w-12 h-12 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center text-lg ${
            currentTrack === track.id
              ? `${track.bg} ${track.text} ring-2 ring-white ring-opacity-50`
              : `${track.bg} ${track.text}`
          }`}
          title={track.id}
        >
          {track.emoji}
        </button>
      ))}
      
      {/* Nature Toggle Button */}
      <button 
        onClick={handleNatureToggle}
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
      
      {/* Cozy Toggle Button */}
      <button 
        onClick={handleCozyToggle}
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
      
      <button 
        onClick={toggleMute}
        className={`w-12 h-12 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center text-lg ${
          isMuted 
            ? 'bg-red-200 hover:bg-red-300 text-red-800' 
            : 'bg-blue-200 hover:bg-blue-300 text-blue-800'
        }`}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  )
}
