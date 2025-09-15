import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useWorldState } from '../hooks/useWorldState'

export default function ProceduralPumpkin({ position = [0, 0, 0], isNew = false }) {
  const pumpkinRef = useRef()
  const glowRef = useRef()
  const [pop, setPop] = useState(0)
  const [scale, setScale] = useState(isNew ? 0 : 1)
  const { addObject, scene } = useWorldState()
  
  useEffect(() => {
    if (isNew) {
      // Pop-in animation: 0 → 1.1 → 1
      let progress = 0
      const animate = () => {
        progress += 0.05
        if (progress <= 0.5) {
          setScale(progress * 2.2) // 0 to 1.1
        } else if (progress <= 1) {
          setScale(1.1 - (progress - 0.5) * 0.2) // 1.1 to 1
        } else {
          setScale(1)
          return
        }
        requestAnimationFrame(animate)
      }
      animate()
    }
  }, [isNew])
  
  useFrame((state) => {
    if (pumpkinRef.current && pop > 0) {
      const popScale = 1 + pop * 0.3
      pumpkinRef.current.scale.setScalar(popScale * scale)
      setPop(pop - 0.05)
    } else if (pumpkinRef.current) {
      pumpkinRef.current.scale.setScalar(scale)
    }
    
    // Candle flicker animation for glow
    if (glowRef.current && scene === 'night') {
      const flicker = Math.sin(state.clock.elapsedTime * 8 + position[0] * 5) * 0.1 + 
                     Math.sin(state.clock.elapsedTime * 12 + position[2] * 3) * 0.05
      const intensity = 0.6 + flicker
      glowRef.current.material.emissiveIntensity = Math.max(0.3, intensity)
    }
  })
  
  const handleClick = () => {
    setPop(1)
    const newPos = [
      position[0] + (Math.random() - 0.5) * 2,
      position[1],
      position[2] + (Math.random() - 0.5) * 2
    ]
    addObject({
      id: Date.now(),
      type: 'pumpkin',
      position: newPos,
      isNew: true
    })
  }
  
  const isNight = scene === 'night'
  
  return (
    <group position={position} ref={pumpkinRef} onClick={handleClick}>
      <mesh ref={glowRef} scale={[1, 0.8, 1]}>
        <sphereGeometry args={[0.25, 16, 12]} />
        <meshStandardMaterial 
          color="#FF955C"
          emissive={isNight ? "#FF8C42" : "#000000"}
          emissiveIntensity={isNight ? 0.6 : 0}
        />
      </mesh>
      
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <mesh 
            key={i}
            position={[
              Math.cos(angle) * 0.22,
              0,
              Math.sin(angle) * 0.22
            ]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[0.02, 0.4, 0.02]} />
            <meshStandardMaterial color="#E6804D" />
          </mesh>
        )
      })}
      
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 0.15, 6]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      
      <mesh position={[0.05, 0.3, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.08, 0.04, 0.01]} />
        <meshStandardMaterial color="#32CD32" />
      </mesh>
      
      {/* Ground glow effect */}
      {isNight && (
        <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.8, 16]} />
          <meshStandardMaterial 
            color="#FFA552"
            transparent
            opacity={0.15}
            emissive="#FF8C42"
            emissiveIntensity={0.2}
          />
        </mesh>
      )}
    </group>
  )
}
