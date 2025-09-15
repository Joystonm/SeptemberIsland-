import React, { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useWorldState } from '../hooks/useWorldState'

export default function ProceduralTree({ position = [0, 0, 0], isNew = false, autumnStage: propAutumnStage, isAutumnTree = false, seed }) {
  const treeRef = useRef()
  const [shake, setShake] = useState(0)
  const [scale, setScale] = useState(isNew ? 0 : 1)
  const [opacity, setOpacity] = useState(1)
  const [leafColors, setLeafColors] = useState(["#228B22", "#32CD32", "#228B22"])
  const [targetColors, setTargetColors] = useState(null)
  const [colorProgress, setColorProgress] = useState(0)
  const { addObject, windEnabled, autumnStage: globalAutumnStage } = useWorldState()
  
  // Generate random tree characteristics once
  const treeVariation = useMemo(() => {
    const baseSeed = seed || (position[0] + position[2] * 100) // Use provided seed or position-based
    const random = (min, max, offset = 0) => min + (Math.abs(Math.sin(baseSeed * 12.9898 + offset)) * (max - min))
    
    return {
      // Trunk variations
      trunkHeight: random(0.5, 0.8, 1),
      trunkWidth: random(0.12, 0.25, 2),
      trunkTint: random(0.8, 1.2, 3),
      
      // Leaf variations
      leafSize: random(0.4, 0.8, 4),
      leafCount: Math.floor(random(2, 4, 5)),
      treeShape: random(0, 1, 6) > 0.5 ? 'tall' : 'round',
      
      // Position variations
      posOffset: [random(-0.1, 0.1, 7), 0, random(-0.1, 0.1, 8)],
      rotation: random(-0.2, 0.2, 9),
      
      // Special features
      hasBird: random(0, 1, 10) > 0.85,
      hasMushroom: random(0, 1, 11) > 0.9
    }
  }, [position[0], position[2], seed])
  
  // Define color stages for gradient progression
  const colorStages = [
    ["#228B22", "#32CD32", "#228B22"], // Green (stage 0)
    ["#FFD700", "#FFFF99", "#FFD700"], // Yellow (stage 1)
    ["#FF8C00", "#FFA500", "#FF8C00"], // Orange (stage 2)
    ["#8B0000", "#DC143C", "#8B0000"]  // Deep Red (stage 3)
  ]
  
  // Use prop autumn stage for spawned trees, global for existing trees
  const currentAutumnStage = propAutumnStage !== undefined ? propAutumnStage : globalAutumnStage
  
  // Handle color transitions based on autumn stage
  useEffect(() => {
    const targetStage = Math.min(currentAutumnStage, 3)
    const newTargetColors = colorStages[targetStage]
    
    if (JSON.stringify(newTargetColors) !== JSON.stringify(targetColors)) {
      setTargetColors(newTargetColors)
      setColorProgress(0)
    }
  }, [currentAutumnStage])
  
  // Pop-in animation for new trees
  useEffect(() => {
    if (isNew) {
      let progress = 0
      const animate = () => {
        progress += 0.04
        if (progress <= 0.5) {
          setScale(progress * 2.2)
        } else if (progress <= 1) {
          setScale(1.1 - (progress - 0.5) * 0.2)
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
    if (treeRef.current) {
      const baseSway = Math.sin(state.clock.elapsedTime * 2) * 0.05
      const windSway = windEnabled ? Math.sin(state.clock.elapsedTime * 4) * 0.08 : 0
      const shakeAmount = shake * Math.sin(state.clock.elapsedTime * 20) * 0.1
      
      treeRef.current.rotation.z = (baseSway + windSway + shakeAmount) * scale
      treeRef.current.scale.setScalar(scale)
      
      if (shake > 0) {
        setShake(shake - 0.02)
      }
      
      // Smooth color transition animation (1-2 seconds)
      if (targetColors && colorProgress < 1) {
        setColorProgress(prev => Math.min(prev + 0.012, 1)) // Slower for smoother transition
        
        const interpolateColor = (start, end, progress) => {
          const r1 = parseInt(start.slice(1, 3), 16)
          const g1 = parseInt(start.slice(3, 5), 16)
          const b1 = parseInt(start.slice(5, 7), 16)
          const r2 = parseInt(end.slice(1, 3), 16)
          const g2 = parseInt(end.slice(3, 5), 16)
          const b2 = parseInt(end.slice(5, 7), 16)
          
          const r = Math.round(r1 + (r2 - r1) * progress)
          const g = Math.round(g1 + (g2 - g1) * progress)
          const b = Math.round(b1 + (b2 - b1) * progress)
          
          return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
        }
        
        setLeafColors([
          interpolateColor(leafColors[0], targetColors[0], colorProgress),
          interpolateColor(leafColors[1], targetColors[1], colorProgress),
          interpolateColor(leafColors[2], targetColors[2], colorProgress)
        ])
      }
    }
  })
  
  const handleClick = () => {
    setShake(0.3)
    const leafPos = [
      position[0] + (Math.random() - 0.5) * 2,
      position[1] + 2,
      position[2] + (Math.random() - 0.5) * 2
    ]
    addObject({
      id: Date.now(),
      type: 'leaf',
      position: leafPos
    })
  }
  
  if (opacity <= 0) return null
  
  return (
    <group ref={treeRef} position={[
      position[0] + treeVariation.posOffset[0],
      position[1] + treeVariation.posOffset[1], 
      position[2] + treeVariation.posOffset[2]
    ]} rotation={[0, treeVariation.rotation, 0]} onClick={handleClick}>
      {/* Trunk */}
      <mesh position={[0, treeVariation.trunkHeight * 0.5, 0]}>
        <cylinderGeometry args={[treeVariation.trunkWidth * 0.75, treeVariation.trunkWidth, treeVariation.trunkHeight, 8]} />
        <meshStandardMaterial 
          color={`hsl(25, 60%, ${30 * treeVariation.trunkTint}%)`} 
          transparent 
          opacity={opacity} 
        />
      </mesh>
      
      {/* Leaves - varied based on tree shape */}
      {treeVariation.treeShape === 'tall' ? (
        // Tall thin tree
        <>
          <mesh position={[0, treeVariation.trunkHeight + 0.4, 0]}>
            <sphereGeometry args={[treeVariation.leafSize * 0.7, 12, 12]} />
            <meshStandardMaterial color={leafColors[0]} transparent opacity={opacity} />
          </mesh>
          <mesh position={[0, treeVariation.trunkHeight + 0.8, 0]}>
            <sphereGeometry args={[treeVariation.leafSize * 0.5, 12, 12]} />
            <meshStandardMaterial color={leafColors[1]} transparent opacity={opacity} />
          </mesh>
        </>
      ) : (
        // Round bushy tree
        <>
          <mesh position={[0, treeVariation.trunkHeight + 0.2, 0]}>
            <sphereGeometry args={[treeVariation.leafSize, 12, 12]} />
            <meshStandardMaterial color={leafColors[0]} transparent opacity={opacity} />
          </mesh>
          <mesh position={[0.2 * treeVariation.leafSize, treeVariation.trunkHeight + 0.4, 0.1 * treeVariation.leafSize]}>
            <sphereGeometry args={[treeVariation.leafSize * 0.6, 12, 12]} />
            <meshStandardMaterial color={leafColors[1]} transparent opacity={opacity} />
          </mesh>
          <mesh position={[-0.1 * treeVariation.leafSize, treeVariation.trunkHeight + 0.3, -0.2 * treeVariation.leafSize]}>
            <sphereGeometry args={[treeVariation.leafSize * 0.55, 12, 12]} />
            <meshStandardMaterial color={leafColors[2]} transparent opacity={opacity} />
          </mesh>
        </>
      )}
      
      {/* Optional bird */}
      {treeVariation.hasBird && (
        <mesh position={[0.3, treeVariation.trunkHeight + 0.8, 0.2]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color="#FF6B6B" />
        </mesh>
      )}
      
      {/* Optional glowing mushroom */}
      {treeVariation.hasMushroom && (
        <group position={[0.4, 0.05, -0.3]}>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.04, 6]} />
            <meshStandardMaterial color="#F5DEB3" />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#FF6B47" emissive="#FF6B47" emissiveIntensity={0.2} />
          </mesh>
        </group>
      )}
    </group>
  )
}
