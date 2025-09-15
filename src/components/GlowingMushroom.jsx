import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useWorldState } from '../hooks/useWorldState'

export default function GlowingMushroom({ 
  position, 
  color = "#FF6B6B", 
  size = 0.04, 
  stemHeight = 0.06,
  stemPosition = [0, 0.03, 0],
  capPosition = [0, 0.08, 0],
  spotPosition = [0.02, 0.08, 0.02]
}) {
  const capRef = useRef()
  const { scene } = useWorldState()
  
  const glowColors = useMemo(() => [
    "#9D4EDD", // Purple
    "#06FFA5", // Cyan  
    "#FF006E"  // Pink
  ], [])
  
  const glowColor = useMemo(() => 
    glowColors[Math.floor(Math.random() * glowColors.length)], 
    [glowColors]
  )
  
  useFrame((state) => {
    if (capRef.current && scene === 'night') {
      const pulse = Math.sin(state.clock.elapsedTime * 2 + position[0] * 10) * 0.3 + 0.7
      capRef.current.material.emissiveIntensity = pulse * 0.8
    }
  })
  
  const isNight = scene === 'night'
  
  return (
    <group position={position}>
      <mesh position={stemPosition}>
        <cylinderGeometry args={[0.02, 0.02, stemHeight, 6]} />
        <meshStandardMaterial color="#F5F5DC" />
      </mesh>
      <mesh ref={capRef} position={capPosition}>
        <sphereGeometry args={[size, 8, 8]} />
        <meshStandardMaterial 
          color={color}
          emissive={isNight ? glowColor : "#000000"}
          emissiveIntensity={isNight ? 0.6 : 0}
        />
      </mesh>
      <mesh position={spotPosition}>
        <sphereGeometry args={[0.008, 6, 6]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
    </group>
  )
}
