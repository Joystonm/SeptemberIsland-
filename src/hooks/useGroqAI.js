import { useState, useCallback } from 'react'

export function useGroqAI() {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState('')
  const [error, setError] = useState(null)
  
  const generateContent = useCallback(async (prompt) => {
    setLoading(true)
    setError(null)
    
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY
      
      if (!apiKey || apiKey === 'your_groq_api_key_here') {
        // Fallback to cute predefined messages
        const fallbackMessages = [
          "🍂 Your island whispers stories of autumn magic and cozy moments.",
          "✨ Every pumpkin holds a wish, every leaf carries a dream.",
          "🦊 The fox says: 'Adventure begins with a single hop!'",
          "🏠 Home is where the heart finds its autumn rhythm.",
          "🌙 Under September stars, anything feels possible.",
          "🍵 Cozy tip: Light a candle and watch your island glow.",
          "🌳 Trees remember every season - what will yours remember?",
          "🎃 Pumpkin wisdom: Grow where you're planted, shine where you are."
        ]
        
        const randomMessage = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)]
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
        setResponse(randomMessage)
        return
      }
      
      // Actual Groq API call
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a cozy autumn spirit living on September Island. Respond with short, warm, inspiring messages (under 20 words) that capture autumn vibes, coziness, and magic. Use emojis sparingly.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          model: 'llama3-8b-8192',
          max_tokens: 50,
          temperature: 0.8
        })
      })
      
      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`)
      }
      
      const data = await response.json()
      const message = data.choices[0]?.message?.content || "✨ September Island sparkles with possibility."
      
      setResponse(message)
    } catch (err) {
      console.error('Groq API Error:', err)
      setError(err.message)
      
      // Fallback message on error
      const errorFallbacks = [
        "🍂 The island spirits are resting, but magic still flows.",
        "✨ Sometimes silence holds the deepest wisdom.",
        "🌙 Even in quiet moments, September Island dreams."
      ]
      setResponse(errorFallbacks[Math.floor(Math.random() * errorFallbacks.length)])
    } finally {
      setLoading(false)
    }
  }, [])
  
  return { generateContent, loading, response, error }
}
