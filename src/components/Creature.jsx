import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGroqAI } from '../hooks/useGroqAI'

export default function Creature({ position = [0, 0, 0] }) {
  const foxRef = useRef()
  const tailRef = useRef()
  const [hop, setHop] = useState(0)
  const [hopDirection, setHopDirection] = useState([0, 0])
  const { generateContent } = useGroqAI()
  
  useFrame((state) => {
    // Tail swish
    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.3
    }
    
    // Hop animation
    if (foxRef.current && hop > 0) {
      foxRef.current.position.y = Math.sin(hop * Math.PI) * 0.3
      foxRef.current.position.x += hopDirection[0] * 0.02
      foxRef.current.position.z += hopDirection[1] * 0.02
      setHop(hop - 0.05)
    }
  })
  
  const handleClick = () => {
    setHop(1)
    setHopDirection([
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    ])
    generateContent("Generate a cute fox fact or playful message")
  }
  
  return (
    <group position={position} ref={foxRef} onClick={handleClick}>
      {/* Fox body - chibi style */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#FF8C00" />
      </mesh>
      
      {/* Fox head - bigger than body */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color="#FF8C00" />
      </mesh>
      
      {/* Fox ears */}
      <mesh position={[-0.1, 0.45, 0]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.06, 0.15, 6]} />
        <meshStandardMaterial color="#FF6347" />
      </mesh>
      <mesh position={[0.1, 0.45, 0]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.06, 0.15, 6]} />
        <meshStandardMaterial color="#FF6347" />
      </mesh>
      
      {/* Fox snout */}
      <mesh position={[0, 0.25, 0.15]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#FFB347" />
      </mesh>
      
      {/* Fox eyes */}
      <mesh position={[-0.06, 0.32, 0.12]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.06, 0.32, 0.12]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Fox tail - oversized for cuteness */}
      <group ref={tailRef} position={[0, 0.15, -0.2]}>
        <mesh>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#FF4500" />
        </mesh>
        <mesh position={[0, 0, -0.15]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>
      
      {/* Fox legs */}
      {[-0.08, 0.08].map((x, i) => (
        <React.Fragment key={i}>
          <mesh position={[x, -0.05, 0.05]}>
            <cylinderGeometry args={[0.02, 0.02, 0.1, 6]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[x, -0.05, -0.05]}>
            <cylinderGeometry args={[0.02, 0.02, 0.1, 6]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  )
}
