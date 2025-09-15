import React, { useEffect, useState } from 'react'
import { useGroqAI } from '../hooks/useGroqAI'

export default function GroqQuotes() {
  const { response, loading, generateContent } = useGroqAI()
  const [displayMessage, setDisplayMessage] = useState("🍂 Welcome to September Island!")
  const [isVisible, setIsVisible] = useState(true)
  
  useEffect(() => {
    if (response) {
      setDisplayMessage(response)
      setIsVisible(true)
      // Auto-hide after 5 seconds
      setTimeout(() => setIsVisible(false), 5000)
    }
  }, [response])
  
  if (!isVisible && !loading) return null
  
  return (
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg max-w-xs">
      <div className="flex items-center justify-center min-h-[24px]">
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-3 w-3 border-2 border-orange-500 border-t-transparent"></div>
            <span className="text-xs text-gray-600">✨</span>
          </div>
        ) : (
          <p className="text-xs text-gray-700 text-center italic">
            {displayMessage}
          </p>
        )}
      </div>
    </div>
  )
}
