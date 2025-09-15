import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useWorldState } from '../hooks/useWorldState'
import { useGroqAI } from '../hooks/useGroqAI'

export default function ProceduralHouse({ position = [0, 0, 0] }) {
  const houseRef = useRef()
  const smokeRef = useRef()
  const [isClicked, setIsClicked] = useState(false)
  const { scene } = useWorldState()
  const { generateContent } = useGroqAI()
  
  useFrame((state) => {
    if (smokeRef.current && isClicked) {
      smokeRef.current.position.y += 0.02
      smokeRef.current.scale.setScalar(smokeRef.current.scale.x + 0.01)
      if (smokeRef.current.position.y > 3) {
        setIsClicked(false)
        smokeRef.current.position.y = 1.8
        smokeRef.current.scale.setScalar(0.1)
      }
    }
  })
  
  const handleClick = () => {
    setIsClicked(true)
    generateContent("Generate a cozy autumn house tip or quote")
  }
  
  const windowGlow = scene === 'night' ? '#FFD700' : '#87CEEB'
  
  return (
    <group position={position} ref={houseRef} onClick={handleClick}>
      {/* House base - rounded cube */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.2, 0.8, 1]} />
        <meshStandardMaterial color="#8B5A2B" />
      </mesh>
      
      {/* Roof - chubby cone */}
      <mesh position={[0, 1, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.9, 0.8, 4]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>
      
      {/* Door */}
      <mesh position={[0, 0.2, 0.51]}>
        <boxGeometry args={[0.3, 0.6, 0.02]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      
      {/* Windows */}
      <mesh position={[-0.3, 0.5, 0.51]}>
        <boxGeometry args={[0.2, 0.2, 0.02]} />
        <meshStandardMaterial 
          color={windowGlow} 
          emissive={scene === 'night' ? '#FFD700' : '#000000'}
          emissiveIntensity={scene === 'night' ? 0.5 : 0}
        />
      </mesh>
      <mesh position={[0.3, 0.5, 0.51]}>
        <boxGeometry args={[0.2, 0.2, 0.02]} />
        <meshStandardMaterial 
          color={windowGlow}
          emissive={scene === 'night' ? '#FFD700' : '#000000'}
          emissiveIntensity={scene === 'night' ? 0.5 : 0}
        />
      </mesh>
      
      {/* Chimney */}
      <mesh position={[0.4, 1.2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 8]} />
        <meshStandardMaterial color="#696969" />
      </mesh>
      
      {/* Smoke puff */}
      <mesh ref={smokeRef} position={[0.4, 1.8, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial 
          color="#F5F5F5" 
          transparent 
          opacity={0.6}
        />
      </mesh>
    </group>
  )
}
