import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function WishLantern({ position, onRemove }) {
  const ref = useRef()
  const frameCount = useRef(0)
  
  useFrame(() => {
    frameCount.current++
    if (frameCount.current % 3 !== 0) return // Update every 3rd frame
    
    if (ref.current) {
      ref.current.position.y += 0.01
      if (ref.current.position.y > 10) {
        onRemove()
      }
    }
  })

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.3, 6, 4]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.8} />
      </mesh>
      <pointLight color="#ffaa00" intensity={1.5} distance={2} />
    </group>
  )
}
