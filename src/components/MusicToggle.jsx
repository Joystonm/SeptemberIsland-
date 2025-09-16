import React, { useState, useRef, useEffect } from 'react'

export default function MusicToggle() {
  const [isPlaying, setIsPlaying] = useState(true)
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = new Audio('/src/assets/background.mp3')
    audio.loop = true
    audio.volume = 0
    audioRef.current = audio

    // Auto-start with fade-in
    audio.play().then(() => {
      fadeIn()
    }).catch(console.error)

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  const fadeIn = () => {
    const audio = audioRef.current
    if (!audio) return
    
    const fadeInterval = setInterval(() => {
      if (audio.volume < 0.5) {
        audio.volume = Math.min(audio.volume + 0.05, 0.5)
      } else {
        clearInterval(fadeInterval)
      }
    }, 50)
  }

  const fadeOut = (callback) => {
    const audio = audioRef.current
    if (!audio) return
    
    const fadeInterval = setInterval(() => {
      if (audio.volume > 0) {
        audio.volume = Math.max(audio.volume - 0.05, 0)
      } else {
        clearInterval(fadeInterval)
        callback()
      }
    }, 50)
  }

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      fadeOut(() => audio.pause())
    } else {
      audio.play().then(() => fadeIn()).catch(console.error)
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <button 
      onClick={toggleMusic}
      className="w-12 h-12 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center text-lg bg-purple-200 hover:bg-purple-300 text-purple-800"
      title={isPlaying ? 'Turn Music Off' : 'Turn Music On'}
    >
      {isPlaying ? '🎵' : '🔇'}
    </button>
  )
}
