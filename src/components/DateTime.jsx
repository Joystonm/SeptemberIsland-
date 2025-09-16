import React, { useState, useEffect, useRef } from 'react'

export default function DateTime() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('dateTimePosition')
    return saved ? JSON.parse(saved) : { x: 16, y: 80 }
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const widgetRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    localStorage.setItem('dateTimePosition', JSON.stringify(position))
  }, [position])

  const handleMouseDown = (e) => {
    e.preventDefault()
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
    setIsDragging(true)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    
    const rect = widgetRef.current?.getBoundingClientRect()
    if (!rect) return

    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y
    
    const maxX = window.innerWidth - rect.width
    const maxY = window.innerHeight - rect.height
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'none'
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.userSelect = ''
      }
    }
  }, [isDragging, dragStart])

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div
      ref={widgetRef}
      className={`fixed z-40 cursor-move select-none ${
        isDragging ? 'scale-105 transition-none' : 'transition-all duration-300 ease-out hover:scale-105'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div 
        className={`bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-3 py-2 ${
          isDragging ? 'shadow-xl ring-2 ring-yellow-400 ring-opacity-60' : 'shadow-md'
        }`}
      >
        <div className="text-center font-quicksand text-white pointer-events-none">
          <div 
            className="text-xs font-medium"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
          >
            {formatDate(currentTime)}
          </div>
          <div 
            className="text-sm font-semibold text-yellow-200"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
          >
            {formatTime(currentTime)}
          </div>
        </div>
      </div>
    </div>
  )
}
