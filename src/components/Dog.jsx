import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Dog({ position = [0, 0, 0], color = "#D2691E" }) {
  const dogRef = useRef()
  const tailRef = useRef()
  const [isWalking, setIsWalking] = useState(true)
  const [isSitting, setIsSitting] = useState(false)
  const [walkTarget, setWalkTarget] = useState(position)
  const [spin, setSpin] = useState(0)
  
  useEffect(() => {
    // Random behavior changes
    const interval = setInterval(() => {
      const behavior = Math.random()
      if (behavior < 0.3) {
        // Sit for a while
        setIsSitting(true)
        setIsWalking(false)
        setTimeout(() => {
          setIsSitting(false)
          setIsWalking(true)
        }, 3000 + Math.random() * 2000)
      } else {
        // Walk to new position
        const angle = Math.random() * Math.PI * 2
        const distance = 0.5 + Math.random() * 1.5
        setWalkTarget([
          position[0] + Math.cos(angle) * distance,
          position[1],
          position[2] + Math.sin(angle) * distance
        ])
        setIsWalking(true)
      }
    }, 4000 + Math.random() * 6000)
    
    return () => clearInterval(interval)
  }, [position])
  
  useFrame((state) => {
    if (dogRef.current) {
      // Tail wagging
      if (tailRef.current) {
        tailRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 8) * 0.5
      }
      
      // Spin animation
      if (spin > 0) {
        dogRef.current.rotation.y += 0.3
        setSpin(spin - 0.02)
      }
      
      // Walking behavior
      if (isWalking && !isSitting) {
        const currentPos = dogRef.current.position
        const dx = walkTarget[0] - currentPos.x
        const dz = walkTarget[2] - currentPos.z
        const distance = Math.sqrt(dx * dx + dz * dz)
        
        if (distance > 0.1) {
          // Move towards target
          const speed = 0.01
          dogRef.current.position.x += (dx / distance) * speed
          dogRef.current.position.z += (dz / distance) * speed
          
          // Face walking direction
          dogRef.current.rotation.y = Math.atan2(dx, dz)
          
          // Walking bob
          dogRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 6) * 0.02
        }
      } else if (isSitting) {
        // Sitting position - lower body
        dogRef.current.position.y = position[1] - 0.02
      } else {
        // Idle gentle bob
        dogRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.01
      }
    }
  })
  
  const handleClick = () => {
    console.log('🐕 Woof!')
    setSpin(1) // Trigger spin animation
  }
  
  return (
    <group ref={dogRef} position={position} onClick={handleClick}>
      {/* Dog body - small and round */}
      <mesh position={[0, 0.05, 0]} scale={[1, 0.8, 1.2]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Dog head - oversized for chibi effect */}
      <mesh position={[0, 0.15, 0.05]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Snout */}
      <mesh position={[0, 0.12, 0.11]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, 0.13, 0.13]}>
        <sphereGeometry args={[0.008, 6, 6]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.03, 0.17, 0.08]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.03, 0.17, 0.08]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Ears - floppy */}
      <mesh position={[-0.05, 0.2, 0.02]} rotation={[0, 0, -0.5]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>
      <mesh position={[0.05, 0.2, 0.02]} rotation={[0, 0, 0.5]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>
      
      {/* Legs - tiny */}
      {[-0.04, 0.04].map((x, i) => (
        <React.Fragment key={i}>
          <mesh position={[x, -0.02, 0.04]}>
            <cylinderGeometry args={[0.01, 0.01, 0.04, 6]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
          <mesh position={[x, -0.02, -0.04]}>
            <cylinderGeometry args={[0.01, 0.01, 0.04, 6]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
        </React.Fragment>
      ))}
      
      {/* Tail - wagging */}
      <group ref={tailRef} position={[0, 0.08, -0.08]}>
        <mesh rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.012, 0.06, 6]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    </group>
  )
}
