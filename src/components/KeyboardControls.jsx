import { useEffect } from 'react'
import { useWorldState } from '../hooks/useWorldState'
import { getRandomPosition } from '../utils/randomPosition'

export default function KeyboardControls() {
  const { setScene, scene, addObject } = useWorldState()
  
  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key.toLowerCase()
      
      switch (key) {
        case 'n':
          // Toggle between day and night
          setScene(scene === 'night' ? 'day' : 'night')
          break
          
        case 'g':
          // Grow Autumn - add multiple objects
          const objects = ['pumpkin', 'pumpkin', 'tree']
          objects.forEach((type, index) => {
            setTimeout(() => {
              const position = getRandomPosition(2)
              position[1] = 0
              addObject({
                id: Date.now() + index,
                type,
                position
              })
            }, index * 300)
          })
          break
          
        case 'p':
          // Take screenshot (placeholder)
          console.log('📸 Screenshot captured!')
          // In a real implementation, you'd capture the canvas
          break
          
        default:
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [scene, setScene, addObject])
  
  return null // This component doesn't render anything
}
