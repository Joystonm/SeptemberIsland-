import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function MagicalExplosion({ position, onComplete }) {
  const particlesRef = useRef()
  const startTime = useRef(Date.now())
  
  const particles = useMemo(() => {
    const count = 50
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Random sphere distribution
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 0.2 + Math.random() * 0.3
      
      positions[i3] = Math.sin(phi) * Math.cos(theta) * radius
      positions[i3 + 1] = Math.cos(phi) * radius
      positions[i3 + 2] = Math.sin(phi) * Math.sin(theta) * radius
      
      // Explosion velocities
      velocities[i3] = positions[i3] * (2 + Math.random() * 3)
      velocities[i3 + 1] = positions[i3 + 1] * (2 + Math.random() * 3) + 1
      velocities[i3 + 2] = positions[i3 + 2] * (2 + Math.random() * 3)
      
      // Magical colors
      const colorType = Math.random()
      if (colorType < 0.3) {
        colors[i3] = 1; colors[i3 + 1] = 0.8; colors[i3 + 2] = 0.2 // Gold
      } else if (colorType < 0.6) {
        colors[i3] = 0.8; colors[i3 + 1] = 0.2; colors[i3 + 2] = 1 // Purple
      } else {
        colors[i3] = 0.2; colors[i3 + 1] = 0.8; colors[i3 + 2] = 1 // Cyan
      }
      
      sizes[i] = 0.02 + Math.random() * 0.03
    }
    
    return { positions, velocities, colors, sizes, count }
  }, [])
  
  useFrame(() => {
    if (!particlesRef.current) return
    
    const elapsed = (Date.now() - startTime.current) / 1000
    const duration = 1.5
    
    if (elapsed > duration) {
      onComplete()
      return
    }
    
    const progress = elapsed / duration
    const positions = particlesRef.current.geometry.attributes.position.array
    
    for (let i = 0; i < particles.count; i++) {
      const i3 = i * 3
      
      positions[i3] = particles.positions[i3] + particles.velocities[i3] * elapsed
      positions[i3 + 1] = particles.positions[i3 + 1] + particles.velocities[i3 + 1] * elapsed - 0.5 * 9.8 * elapsed * elapsed
      positions[i3 + 2] = particles.positions[i3 + 2] + particles.velocities[i3 + 2] * elapsed
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true
    particlesRef.current.material.opacity = 1 - progress
  })
  
  return (
    <group position={position}>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.count}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.count}
            array={particles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particles.count}
            array={particles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
