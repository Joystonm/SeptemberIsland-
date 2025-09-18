import React, { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useWorldState } from '../hooks/useWorldState'

function Raindrop({ position, opacity }) {
  const dropRef = useRef()
  const velocity = useRef(-0.1 - Math.random() * 0.05)
  
  useFrame(() => {
    if (dropRef.current) {
      dropRef.current.position.y += velocity.current
      
      if (dropRef.current.position.y < -1) {
        dropRef.current.position.set(
          (Math.random() - 0.5) * 12,
          8 + Math.random() * 2,
          (Math.random() - 0.5) * 12
        )
      }
    }
  })
  
  return (
    <mesh ref={dropRef} position={position}>
      <cylinderGeometry args={[0.005, 0.005, 0.2]} />
      <meshStandardMaterial color="#87CEEB" transparent opacity={0.6 * opacity} />
    </mesh>
  )
}

function DrizzleEffect({ opacity }) {
  const raindrops = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 12,
        Math.random() * 8 + 2,
        (Math.random() - 0.5) * 12
      ]
    }))
  }, [])
  
  return (
    <group>
      {raindrops.map(drop => (
        <Raindrop key={drop.id} position={drop.position} opacity={opacity} />
      ))}
    </group>
  )
}

function FogEffect({ opacity }) {
  return (
    <mesh position={[0, 1, 0]} scale={[15, 6, 15]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial 
        color="#e6e6e6" 
        transparent 
        opacity={0.4 * opacity}
        depthWrite={false}
      />
    </mesh>
  )
}

export default function WeatherEffects() {
  const { weatherMode } = useWorldState()
  const [opacity, setOpacity] = useState(0)
  const [currentEffect, setCurrentEffect] = useState('clear')
  
  useEffect(() => {
    if (weatherMode !== currentEffect) {
      // Fade out current effect
      setOpacity(0)
      setTimeout(() => {
        setCurrentEffect(weatherMode)
        // Fade in new effect
        if (weatherMode !== 'clear') {
          setTimeout(() => setOpacity(1), 50)
        }
      }, 300)
    }
  }, [weatherMode, currentEffect])
  
  // Initialize on mount
  useEffect(() => {
    if (weatherMode !== 'clear') {
      setCurrentEffect(weatherMode)
      setOpacity(1)
    }
  }, [])
  
  return (
    <group>
      {currentEffect === 'drizzle' && (
        <group>
          <DrizzleEffect opacity={opacity} />
        </group>
      )}
    </group>
  )
}
