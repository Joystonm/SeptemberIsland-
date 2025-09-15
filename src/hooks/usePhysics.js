import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

export function usePhysics(windEnabled = false) {
  const ref = useRef()
  
  useFrame((state, delta) => {
    if (ref.current && windEnabled) {
      // Simple physics simulation
      ref.current.position.y -= delta * 0.5
      ref.current.rotation.z += delta * 2
      
      // Reset position when object falls too low
      if (ref.current.position.y < -5) {
        ref.current.position.y = 5
        ref.current.position.x = (Math.random() - 0.5) * 10
      }
    }
  })
  
  return ref
}
