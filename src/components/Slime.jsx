import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Slime({ position = [0, 0, 0], scale = 1 }) {
  const slimeRef = useRef()
  const eyesRef = useRef()

  useFrame((state) => {
    if (slimeRef.current) {
      slimeRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      slimeRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05
    }
  })

  return (
    <group position={position} scale={scale}>
      {/* Main slime body */}
      <mesh ref={slimeRef}>
        <sphereGeometry args={[0.4, 16, 12]} />
        <meshPhysicalMaterial
          color="#ff9ec7"
          transparent
          opacity={0.8}
          transmission={0.3}
          roughness={0.1}
          metalness={0.1}
          emissive="#ff9ec7"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Eyes */}
      <group ref={eyesRef} position={[0, 0.1, 0.3]}>
        <mesh position={[-0.05, 0, 0]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color="#2a2a2a" />
        </mesh>
        <mesh position={[0.05, 0, 0]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color="#2a2a2a" />
        </mesh>
        {/* Eye highlights */}
        <mesh position={[-0.045, 0.005, 0.01]}>
          <sphereGeometry args={[0.005, 6, 6]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[0.055, 0.005, 0.01]}>
          <sphereGeometry args={[0.005, 6, 6]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </group>
    </group>
  )
}
