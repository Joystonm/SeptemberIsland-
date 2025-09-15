import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'

export default function FloatingText({ position, text = "+1 🎃", onComplete }) {
  const textRef = useRef()
  const [opacity, setOpacity] = useState(1)
  const [yOffset, setYOffset] = useState(0)
  const [scale, setScale] = useState(0.8)
  
  useEffect(() => {
    let progress = 0
    const animate = () => {
      progress += 0.025 // Slower for better visibility
      if (progress >= 1) {
        onComplete && onComplete()
        return
      }
      
      setYOffset(progress * 1.5) // Rise 1.5 units
      setOpacity(1 - Math.pow(progress, 2)) // Fade out with easing
      setScale(0.8 + progress * 0.4) // Scale up slightly
      requestAnimationFrame(animate)
    }
    animate()
  }, [onComplete])
  
  return (
    <Text
      ref={textRef}
      position={[position[0], position[1] + 0.8 + yOffset, position[2]]}
      fontSize={0.25}
      color="#FFD700"
      anchorX="center"
      anchorY="middle"
      material-transparent
      material-opacity={opacity}
      scale={[scale, scale, scale]}
    >
      {text}
    </Text>
  )
}
