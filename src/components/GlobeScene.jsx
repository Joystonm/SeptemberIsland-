import React, { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import ProceduralTree from './ProceduralTree'
import ProceduralHouse from './ProceduralHouse'
import ProceduralPumpkin from './ProceduralPumpkin'
import Creature from './Creature'
import LeafSpawner from './LeafSpawner'
import Bird from './Bird'
import Dog from './Dog'
import WeatherEffects from './WeatherEffects'
import WishLantern from './WishLantern'
import GlowingMushroom from './GlowingMushroom'
import { useWorldState } from '../hooks/useWorldState'

function Firefly({ position }) {
  const ref = useRef()
  const { scene } = useWorldState()
  
  useFrame((state) => {
    if (ref.current && scene === 'night') {
      ref.current.position.x += Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.002
      ref.current.position.y += Math.cos(state.clock.elapsedTime * 1.5 + position[1]) * 0.002
      ref.current.position.z += Math.sin(state.clock.elapsedTime * 1.8 + position[2]) * 0.002
    }
  })
  
  if (scene !== 'night') return null
  
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshStandardMaterial 
        color="#FFD700" 
        emissive="#FFD700" 
        emissiveIntensity={0.8}
      />
    </mesh>
  )
}

function Pond() {
  return (
    <mesh position={[1.5, 0.02, -1.5]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.8, 16]} />
      <meshStandardMaterial 
        color="#87CEEB" 
        transparent 
        opacity={0.8}
        roughness={0.1}
        metalness={0.1}
      />
    </mesh>
  )
}

function Bridge() {
  return (
    <group position={[-2, 0.1, 0]}>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[i * 0.15, 0, 0]}>
          <boxGeometry args={[0.12, 0.02, 0.4]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      ))}
      <mesh position={[0.4, 0.1, 0.15]}>
        <boxGeometry args={[0.8, 0.02, 0.02]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[0.4, 0.1, -0.15]}>
        <boxGeometry args={[0.8, 0.02, 0.02]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
    </group>
  )
}

function Island() {
  const ref = useRef()
  const { scene, autumnStage, windEnabled } = useWorldState()
  const [colors, setColors] = useState({
    base: "#D2B48C",
    grass: "#90EE90",
    hills: "#98FB98",
    tufts: "#7CFC00"
  })
  
  // Progressive color stages for island
  const islandColorStages = [
    { base: "#D2B48C", grass: "#90EE90", hills: "#98FB98", tufts: "#7CFC00" }, // Green
    { base: "#DEB887", grass: "#9ACD32", hills: "#ADFF2F", tufts: "#FFFF00" }, // Yellow
    { base: "#CD853F", grass: "#DAA520", hills: "#B8860B", tufts: "#FF8C00" }, // Orange
    { base: "#A0522D", grass: "#8B4513", hills: "#A0522D", tufts: "#8B0000" }  // Deep Red
  ]
  
  useEffect(() => {
    const targetStage = Math.min(autumnStage, 3)
    const targetColors = islandColorStages[targetStage]
    
    let progress = 0
    const animate = () => {
      progress += 0.015 // Smooth 1-2 second transition
      if (progress >= 1) {
        setColors(targetColors)
        return
      }
      
      // Interpolate colors
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
      
      setColors({
        base: interpolateColor(colors.base, targetColors.base, progress),
        grass: interpolateColor(colors.grass, targetColors.grass, progress),
        hills: interpolateColor(colors.hills, targetColors.hills, progress),
        tufts: interpolateColor(colors.tufts, targetColors.tufts, progress)
      })
      
      requestAnimationFrame(animate)
    }
    animate()
  }, [autumnStage])
  
  const decorations = useMemo(() => ({
    grass: Array.from({ length: 40 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 6,
        0.05 + Math.random() * 0.1,
        (Math.random() - 0.5) * 6
      ],
      scale: 0.8 + Math.random() * 0.4
    })),
    mushrooms: Array.from({ length: 12 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 5,
        0.05,
        (Math.random() - 0.5) * 5
      ]
    })),
    stones: Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 4,
        0.02,
        (Math.random() - 0.5) * 4
      ],
      scale: 0.5 + Math.random() * 0.3
    })),
    fireflies: Array.from({ length: 15 }, (_, i) => [
      (Math.random() - 0.5) * 8,
      1 + Math.random() * 2,
      (Math.random() - 0.5) * 8
    ])
  }), [])
  
  useFrame((state) => {
    if (ref.current) {
      const baseFloat = Math.sin(state.clock.elapsedTime * 0.3) * 0.15
      const windSway = windEnabled ? Math.sin(state.clock.elapsedTime * 1.5) * 0.02 : 0
      
      ref.current.position.y = baseFloat
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05 + windSway
      ref.current.rotation.z = windSway * 0.5
    }
  })
  
  return (
    <group ref={ref}>
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[4, 3.5, 0.8, 16]} />
        <meshStandardMaterial color={colors.base} roughness={0.8} />
      </mesh>
      
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[4.1, 3.6, 0.1, 16]} />
        <meshStandardMaterial color={colors.grass} />
      </mesh>
      
      {[
        { pos: [1, 0.1, 1], scale: [1.2, 0.3, 1.2] },
        { pos: [-1.5, 0.08, -0.5], scale: [1, 0.25, 1] },
        { pos: [0.5, 0.06, -1.8], scale: [0.8, 0.2, 0.8] }
      ].map((hill, i) => (
        <mesh key={i} position={hill.pos} scale={hill.scale}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color={colors.hills} />
        </mesh>
      ))}
      
      {decorations.grass.map((grass, i) => (
        <mesh key={i} position={grass.position} scale={grass.scale}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color={colors.tufts} />
        </mesh>
      ))}
      
      {decorations.mushrooms.map((mushroom, i) => (
        <GlowingMushroom 
          key={i} 
          position={mushroom.position}
          color="#FF6B6B"
        />
      ))}
      
      {decorations.stones.map((stone, i) => (
        <mesh key={i} position={stone.position} scale={stone.scale}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? "#A0A0A0" : "#B8860B"} 
            roughness={0.9}
          />
        </mesh>
      ))}
      
      {decorations.fireflies.map((pos, i) => (
        <Firefly key={i} position={pos} />
      ))}
      
      <Pond />
      <Bridge />
    </group>
  )
}

export default function GlobeScene() {
  const { scene, objects, natureMode, cozyMode, lanterns, removeLantern, collectedStaticPumpkins } = useWorldState()
  const [birds, setBirds] = useState([])
  const [dogs, setDogs] = useState([])
  
  // Spawn initial animals
  useEffect(() => {
    // Initial birds
    setBirds([
      { id: 1, position: [-1.5, 1.8, 1], color: "#87CEEB" }, // On tree
      { id: 2, position: [2, 0.1, -1], color: "#FFD700" }, // On ground
    ])
    
    // Initial dogs
    setDogs([
      { id: 1, position: [1.5, 0, 1.5], color: "#D2691E" },
      { id: 2, position: [-2, 0, -1], color: "#8B4513" },
    ])
  }, [])
  
  // Spawn new birds periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (birds.length < 4) {
        const colors = ["#87CEEB", "#FFD700", "#FF6B6B", "#98FB98"]
        const newBird = {
          id: Date.now(),
          position: [
            (Math.random() - 0.5) * 4,
            Math.random() > 0.5 ? 1.8 : 0.1, // Tree or ground
            (Math.random() - 0.5) * 4
          ],
          color: colors[Math.floor(Math.random() * colors.length)]
        }
        setBirds(prev => [...prev, newBird])
      }
    }, 15000 + Math.random() * 10000) // Every 15-25 seconds
    
    return () => clearInterval(interval)
  }, [birds.length])
  
  const lightIntensity = scene === 'night' ? 0.4 : 0.9
  const ambientIntensity = scene === 'night' ? 0.3 : 0.6
  let lightColor = "#FFFFFF"
  
  // Nature mode: bright natural lighting
  if (natureMode) {
    lightColor = "#F0F8FF"
  }
  
  // Cozy mode: warm fireplace glow
  if (cozyMode) {
    lightColor = "#FFD700"
  }  
  return (
    <>
      <ambientLight intensity={ambientIntensity} color={lightColor} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={lightIntensity}
        color={lightColor}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      <Island />
      
      <ProceduralHouse position={[0, 0, 0]} />
      <ProceduralTree position={[-1.5, 0, 1]} />
      <Creature position={[1, 0, -1]} />
      {!collectedStaticPumpkins.includes('static-pumpkin-1') && (
        <ProceduralPumpkin position={[0.8, 0, 0.8]} id="static-pumpkin-1" />
      )}
      {!collectedStaticPumpkins.includes('static-pumpkin-2') && (
        <ProceduralPumpkin position={[-0.5, 0, -1.2]} id="static-pumpkin-2" />
      )}
      
      {objects.map((obj) => {
        const Component = {
          tree: ProceduralTree,
          house: ProceduralHouse,
          pumpkin: ProceduralPumpkin,
          creature: Creature
        }[obj.type]
        
        return Component ? (
          <Component 
            key={obj.id} 
            id={obj.id} 
            position={obj.position} 
            isNew={obj.isNew}
            autumnStage={obj.autumnStage}
            isAutumnTree={obj.isAutumnTree}
          />
        ) : null
      })}
      
      {/* Birds */}
      {birds.map(bird => (
        <Bird 
          key={bird.id}
          position={bird.position}
          color={bird.color}
        />
      ))}
      
      {/* Dogs */}
      {dogs.map(dog => (
        <Dog 
          key={dog.id}
          position={dog.position}
          color={dog.color}
        />
      ))}
      
      
      {lanterns.map(lantern => (
        <WishLantern
          key={lantern.id}
          position={lantern.position}
          onRemove={() => removeLantern(lantern.id)}
        />
      ))}      <LeafSpawner />
      <WeatherEffects />
    </>
  )
}
