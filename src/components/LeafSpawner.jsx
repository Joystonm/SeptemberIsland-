import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { getRandomAutumnColor } from '../utils/randomColor'
import { useWorldState } from '../hooks/useWorldState'

function Leaf({ position, color }) {
  const leafRef = useRef()
  const velocity = useRef([
    (Math.random() - 0.5) * 0.02,
    -Math.random() * 0.01 - 0.005,
    (Math.random() - 0.5) * 0.02
  ])
  
  const { windEnabled } = useWorldState()
  
  useFrame((state) => {
    if (leafRef.current) {
      // Apply gravity
      velocity.current[1] -= 0.0001
      
      // Enhanced wind effects
      if (windEnabled) {
        const windStrength = 0.002
        const time = state.clock.elapsedTime
        
        // Flowing wind direction
        velocity.current[0] += Math.sin(time * 1.5) * windStrength
        velocity.current[2] += Math.cos(time * 1.2) * windStrength
        
        // Swirling motion
        const swirl = Math.sin(time * 4 + position[0]) * 0.001
        velocity.current[0] += swirl
        velocity.current[2] += Math.cos(time * 4 + position[2]) * 0.001
        
        // Vertical wind gusts
        velocity.current[1] += Math.sin(time * 3) * 0.0005
      }
      
      // Update position
      leafRef.current.position.x += velocity.current[0]
      leafRef.current.position.y += velocity.current[1]
      leafRef.current.position.z += velocity.current[2]
      
      // Enhanced rotation for natural fall
      const rotSpeed = windEnabled ? 0.05 : 0.025
      leafRef.current.rotation.x += rotSpeed
      leafRef.current.rotation.z += rotSpeed * 0.8
      leafRef.current.rotation.y += rotSpeed * 0.4
      
      // Reset when too low
      if (leafRef.current.position.y < -2) {
        leafRef.current.position.set(
          (Math.random() - 0.5) * 10,
          5 + Math.random() * 4,
          (Math.random() - 0.5) * 10
        )
        velocity.current = [
          (Math.random() - 0.5) * 0.02,
          -Math.random() * 0.01 - 0.005,
          (Math.random() - 0.5) * 0.02
        ]
      }
    }
  })
  
  return (
    <mesh ref={leafRef} position={position}>
      <planeGeometry args={[0.12, 0.1]} />
      <meshStandardMaterial 
        color={color} 
        transparent 
        opacity={0.8}
        side={2}
      />
    </mesh>
  )
}

export default function LeafSpawner() {
  const { autumnMode } = useWorldState()
  const [leafCount, setLeafCount] = useState(25)
  
  // Respond to autumn mode changes
  useEffect(() => {
    if (autumnMode) {
      // Gradually increase leaf density
      let currentCount = 25
      const interval = setInterval(() => {
        currentCount += 2
        setLeafCount(currentCount)
        if (currentCount >= 45) {
          clearInterval(interval)
        }
      }, 200) // Add 2 leaves every 200ms
      
      return () => clearInterval(interval)
    } else {
      // Gradually decrease leaf density back to normal
      let currentCount = leafCount
      const interval = setInterval(() => {
        currentCount -= 2
        setLeafCount(Math.max(currentCount, 25))
        if (currentCount <= 25) {
          clearInterval(interval)
        }
      }, 150) // Remove 2 leaves every 150ms
      
      return () => clearInterval(interval)
    }
  }, [autumnMode])
  
  const leaves = useMemo(() => {
    return Array.from({ length: leafCount }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 10,
        Math.random() * 6 + 2,
        (Math.random() - 0.5) * 10
      ],
      color: getRandomAutumnColor()
    }))
  }, [leafCount])
  
  return (
    <group>
      {leaves.map(leaf => (
        <Leaf 
          key={leaf.id}
          position={leaf.position}
          color={leaf.color}
        />
      ))}
    </group>
  )
}
