import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import GlobeScene from './components/GlobeScene'
import UIOverlay from './components/UIOverlay'
import PumpkinCounter from './components/PumpkinCounter'
import DateTime from './components/DateTime'
import { useWorldState } from './hooks/useWorldState'
import './styles/globals.css'

function CameraController() {
  const controlsRef = useRef()
  
  useFrame((state) => {
    if (controlsRef.current) {
      // Subtle camera breathing effect
      const breathe = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      controlsRef.current.object.position.y = 5 + breathe
    }
  })
  
  return (
    <OrbitControls 
      ref={controlsRef}
      enablePan={false} 
      minDistance={5} 
      maxDistance={15}
      maxPolarAngle={Math.PI / 2}
      autoRotate={false}
      autoRotateSpeed={0.5}
    />
  )
}

function App() {
  const { scene } = useWorldState()
  
  const skyColors = {
    day: ['#87CEEB', '#FFB6A0'],
    sunset: ['#FF955C', '#FFB6A0'],
    night: ['#1C1C2B', '#2C2C54']
  }
  
  const [topColor, bottomColor] = skyColors[scene] || skyColors.day

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <div 
        className="absolute inset-0 transition-all duration-2000"
        style={{
          background: `linear-gradient(to bottom, ${topColor}, ${bottomColor})`
        }}
      />
      
      <Canvas 
        camera={{ position: [0, 5, 8], fov: 60 }}
        shadows
      >
        <CameraController />
        <GlobeScene />
      </Canvas>
      
      <DateTime />
      <UIOverlay />
      <PumpkinCounter />
    </div>
  )
}

export default App
