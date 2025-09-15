import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { useWorldState } from '../hooks/useWorldState'
import FloatingText from './FloatingText'

export default function ProceduralPumpkin({ position = [0, 0, 0], isNew = false, id }) {
  const pumpkinRef = useRef()
  const glowRef = useRef()
  const [pop, setPop] = useState(0)
  const [scale, setScale] = useState(isNew ? 0 : 1)
  const [hovered, setHovered] = useState(false)
  const [collecting, setCollecting] = useState(false)
  const [collected, setCollected] = useState(false)
  const [showFloatingText, setShowFloatingText] = useState(false)
  const [burstProgress, setBurstProgress] = useState(0)
  const { collectPumpkin, playPopSound, scene } = useWorldState()
  
  // Ensure we have a valid ID
  const pumpkinId = id || `pumpkin-${Date.now()}-${Math.random()}`
  
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
    if (collected) return
    
    if (pumpkinRef.current && pop > 0) {
      const popScale = 1 + pop * 0.3
      pumpkinRef.current.scale.setScalar(popScale * scale)
      setPop(pop - 0.05)
    } else if (pumpkinRef.current) {
      const hoverScale = (hovered && !collecting) ? 1.1 : 1
      const collectScale = collecting ? 1.2 : 1
      pumpkinRef.current.scale.setScalar(scale * hoverScale * collectScale)
    }
    
    // Candle flicker animation for glow
    if (glowRef.current && scene === 'night') {
      const flicker = Math.sin(state.clock.elapsedTime * 8 + position[0] * 5) * 0.1 + 
                     Math.sin(state.clock.elapsedTime * 12 + position[2] * 3) * 0.05
      const intensity = 0.6 + flicker
      glowRef.current.material.emissiveIntensity = Math.max(0.3, intensity)
    }
  })
  
  // Use useCallback to ensure stable click handler per instance
  const handleClick = useCallback((e) => {
    e.stopPropagation()
    if (collected || collecting) return
    
    console.log(`Collecting pumpkin with ID: ${pumpkinId}`)
    
    // Disable further interaction immediately
    setCollecting(true)
    setShowFloatingText(true)
    
    // Start burst animation
    let progress = 0
    const animateBurst = () => {
      progress += 0.03 // Slower for 0.8s duration
      setBurstProgress(progress)
      
      if (progress < 1) {
        requestAnimationFrame(animateBurst)
      } else {
        // Animation complete - now remove pumpkin
        collectPumpkin(pumpkinId)
        playPopSound()
        setCollected(true)
      }
    }
    animateBurst()
  }, [collected, collecting, pumpkinId, collectPumpkin, playPopSound])
  
  // Don't render if collected
  if (collected) return null
  
  const isNight = scene === 'night'
  const showBurst = collecting && burstProgress > 0
  
  return (
    <group 
      position={position} 
      ref={pumpkinRef} 
      onClick={handleClick}
      onPointerEnter={() => !collecting && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Pumpkin body - hide during burst */}
      <mesh ref={glowRef} scale={[1, 0.8, 1]} visible={!showBurst}>
        <sphereGeometry args={[0.25, 16, 12]} />
        <meshStandardMaterial 
          color="#FF955C"
          emissive={isNight ? "#FF8C42" : "#000000"}
          emissiveIntensity={isNight ? 0.6 : 0}
        />
      </mesh>
      
      {/* Pumpkin ridges - hide during burst */}
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
            visible={!showBurst}
          >
            <boxGeometry args={[0.02, 0.4, 0.02]} />
            <meshStandardMaterial color="#E6804D" />
          </mesh>
        )
      })}
      
      {/* Stem - hide during burst */}
      <mesh position={[0, 0.25, 0]} visible={!showBurst}>
        <cylinderGeometry args={[0.03, 0.05, 0.15, 6]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      
      {/* Leaf - hide during burst */}
      <mesh position={[0.05, 0.3, 0]} rotation={[0, 0, Math.PI / 6]} visible={!showBurst}>
        <boxGeometry args={[0.08, 0.04, 0.01]} />
        <meshStandardMaterial color="#32CD32" />
      </mesh>
      
      {/* Ground glow effect - hide during burst */}
      {isNight && !showBurst && (
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
      
      {/* Burst particles - only show during collection */}
      {showBurst && Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const burstRadius = burstProgress * 0.8
        const particleScale = Math.sin(burstProgress * Math.PI) * 0.8 + 0.2
        const opacity = 1 - burstProgress
        
        return (
          <mesh 
            key={i}
            position={[
              Math.cos(angle) * burstRadius,
              0.1 + Math.sin(burstProgress * Math.PI) * 0.3,
              Math.sin(angle) * burstRadius
            ]}
            scale={[particleScale, particleScale, particleScale]}
          >
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#FFD700" : "#FF8C42"}
              emissive={i % 2 === 0 ? "#FFD700" : "#FF8C42"}
              emissiveIntensity={1.5 * opacity}
              transparent
              opacity={opacity}
            />
          </mesh>
        )
      })}
      
      {/* Floating +1 text */}
      {showFloatingText && (
        <FloatingText 
          position={position}
          text="+1 🎃"
          onComplete={() => setShowFloatingText(false)}
        />
      )}
    </group>
  )
}
