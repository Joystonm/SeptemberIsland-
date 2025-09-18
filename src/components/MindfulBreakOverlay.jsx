import React, { useState, useEffect } from 'react'

export default function MindfulBreakOverlay({ show, onComplete }) {
  const [mounted, setMounted] = useState(false)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    if (show) {
      setMounted(true)
      // Fade in immediately
      setTimeout(() => setOpacity(1), 50)
      
      // Fade out after 5 seconds
      setTimeout(() => setOpacity(0), 5000)
      
      // Complete cleanup after fade out
      setTimeout(() => {
        setMounted(false)
        onComplete()
      }, 6000)
    }
  }, [show])

  if (!mounted) return null

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-none overflow-hidden transition-opacity duration-1000"
      style={{ opacity }}
    >
      {/* Falling Leaves */}
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          className="absolute text-2xl animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            animation: `fall ${4 + Math.random() * 2}s linear ${i * 0.5}s infinite`,
            animationFillMode: 'both'
          }}
        >
          🍂
        </div>
      ))}

      {/* Glowing Lanterns */}
      <div className="absolute text-3xl" style={{ left: '15%', top: '20%', animation: 'glow 2s ease-in-out 0.5s infinite alternate' }}>🏮</div>
      <div className="absolute text-3xl" style={{ left: '85%', top: '25%', animation: 'glow 2s ease-in-out 1s infinite alternate' }}>🏮</div>
      <div className="absolute text-3xl" style={{ left: '25%', top: '70%', animation: 'glow 2s ease-in-out 1.5s infinite alternate' }}>🏮</div>
      <div className="absolute text-3xl" style={{ left: '75%', top: '65%', animation: 'glow 2s ease-in-out 2s infinite alternate' }}>🏮</div>

      {/* Mindful Message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 bg-opacity-95 backdrop-blur-sm border-2 border-orange-200 px-12 py-8 rounded-3xl shadow-2xl text-center">
          <div className="font-quicksand font-medium text-amber-800 text-2xl leading-relaxed">
            Pause. Breathe. Autumn waits for you. 🌿
          </div>
        </div>
      </div>
    </div>
  )
}
