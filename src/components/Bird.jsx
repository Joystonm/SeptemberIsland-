import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Bird({ position = [0, 0, 0], color = "#87CEEB" }) {
  const birdRef = useRef()
  const [isFlying, setIsFlying] = useState(false)
  const [flyPath, setFlyPath] = useState({ center: position, radius: 1, angle: 0 })
  
  useEffect(() => {
    // Random flying behavior every 8-15 seconds
    const interval = setInterval(() => {
      if (!isFlying) {
        setIsFlying(true)
        setFlyPath({
          center: position,
          radius: 0.8 + Math.random() * 0.7,
          angle: 0
        })
        
        // Stop flying after 3-5 seconds
        setTimeout(() => setIsFlying(false), 3000 + Math.random() * 2000)
      }
    }, 8000 + Math.random() * 7000)
    
    return () => clearInterval(interval)
  }, [position])
  
  useFrame((state) => {
    if (birdRef.current) {
      if (isFlying) {
        // Flying in circle animation
        flyPath.angle += 0.05
        const x = flyPath.center[0] + Math.cos(flyPath.angle) * flyPath.radius
        const z = flyPath.center[2] + Math.sin(flyPath.angle) * flyPath.radius
        const y = flyPath.center[1] + Math.sin(flyPath.angle * 2) * 0.2
        
        birdRef.current.position.set(x, y, z)
        birdRef.current.rotation.y = flyPath.angle + Math.PI / 2
        
        // Wing flapping
        birdRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 15) * 0.3
      } else {
        // Perched animation - gentle bobbing
        birdRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.02
        birdRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.1
      }
    }
  })
  
  const handleClick = () => {
    console.log('🐦 Chirp!')
    // Trigger a quick hop
    if (birdRef.current && !isFlying) {
      birdRef.current.position.y += 0.1
    }
  }
  
  return (
    <group ref={birdRef} position={position} onClick={handleClick}>
      {/* Bird body */}
      <mesh>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Bird head */}
      <mesh position={[0, 0.05, 0.04]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Beak */}
      <mesh position={[0, 0.05, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.01, 0.02, 6]} />
        <meshStandardMaterial color="#FFA500" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.02, 0.07, 0.06]}>
        <sphereGeometry args={[0.008, 6, 6]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.02, 0.07, 0.06]}>
        <sphereGeometry args={[0.008, 6, 6]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Wings */}
      <mesh position={[-0.04, 0, 0]} rotation={[0, 0, -0.3]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.04, 0, 0]} rotation={[0, 0, 0.3]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Tail */}
      <mesh position={[0, 0, -0.06]} rotation={[0.3, 0, 0]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}
