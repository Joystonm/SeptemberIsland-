import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'

const messages = [
  "boing 🍂",
  "cozy boing",
  "hi there boing",
  "sleepy boing",
  "warm hugs boing"
]

export default function SlimeNPC({ position = [2, 0, 2], sceneMode = 'day' }) {
  const slimeRef = useRef()
  const eyesRef = useRef()
  const [message, setMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [bounce, setBounce] = useState(1)

  useFrame((state) => {
    if (!slimeRef.current) return
    
    const time = state.clock.elapsedTime
    const idle = Math.sin(time * 1.8) * 0.015 + 1
    const wiggle = Math.sin(time * 2.5) * 0.008
    
    // Gentle breathing animation
    slimeRef.current.scale.set(1, idle * bounce, 1)
    slimeRef.current.rotation.z = wiggle
    
    // Sparkling eyes
    if (eyesRef.current) {
      eyesRef.current.rotation.z = Math.sin(time * 4) * 0.1
    }
  })

  const handleClick = () => {
    setBounce(0.8)
    setTimeout(() => setBounce(1.2), 80)
    setTimeout(() => setBounce(1), 200)
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    setMessage(randomMessage)
    setShowMessage(true)
    
    setTimeout(() => setShowMessage(false), 4000)
  }

  return (
    <group position={position}>
      {/* Soft shadow */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 16]} />
        <meshBasicMaterial color="#d1fae5" transparent opacity={0.3} />
      </mesh>
      
      {/* Adorable translucent slime */}
      <group ref={slimeRef} onClick={handleClick} position={[0, 0.12, 0]} scale={0.3}>
        {/* Soft pastel body with glow */}
        <mesh>
          <sphereGeometry args={[0.5, 20, 16]} />
          <meshStandardMaterial 
            color="#bfdbfe"
            transparent 
            opacity={0.75}
            roughness={0.02}
            metalness={0.3}
            emissive="#a7f3d0"
            emissiveIntensity={0.4}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
        
        {/* Glossy highlight */}
        <mesh position={[-0.15, 0.25, 0.3]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshBasicMaterial 
            color="white" 
            transparent 
            opacity={0.8}
          />
        </mesh>
        
        {/* Big adorable eyes directly attached */}
        <group ref={eyesRef}>
          <mesh position={[-0.18, 0.15, 0.4]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial color="white" />
          </mesh>
          <mesh position={[0.18, 0.15, 0.4]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial color="white" />
          </mesh>
          
          {/* Large pupils */}
          <mesh position={[-0.18, 0.15, 0.43]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshBasicMaterial color="black" />
          </mesh>
          <mesh position={[0.18, 0.15, 0.43]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshBasicMaterial color="black" />
          </mesh>
          
          {/* Multiple sparkles for adorable effect */}
          <mesh position={[-0.15, 0.18, 0.44]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color="white" />
          </mesh>
          <mesh position={[0.21, 0.18, 0.44]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color="white" />
          </mesh>
          <mesh position={[-0.2, 0.12, 0.44]}>
            <sphereGeometry args={[0.015, 6, 6]} />
            <meshBasicMaterial color="white" />
          </mesh>
          <mesh position={[0.16, 0.12, 0.44]}>
            <sphereGeometry args={[0.015, 6, 6]} />
            <meshBasicMaterial color="white" />
          </mesh>
        </group>
        
        {/* Friendly smile */}
        <mesh position={[0, 0.05, 0.42]}>
          <torusGeometry args={[0.06, 0.015, 6, 16, Math.PI]} />
          <meshBasicMaterial color="#333" />
        </mesh>
        
        {/* Soft blush for playful expression */}
        <mesh position={[-0.28, 0.08, 0.35]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial 
            color="#fecaca" 
            transparent 
            opacity={0.6}
          />
        </mesh>
        <mesh position={[0.28, 0.08, 0.35]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial 
            color="#fecaca" 
            transparent 
            opacity={0.6}
          />
        </mesh>
        
        {/* Additional glow effect */}
        <mesh position={[0, 0, 0]} scale={1.1}>
          <sphereGeometry args={[0.5, 16, 12]} />
          <meshBasicMaterial 
            color="#a7f3d0" 
            transparent 
            opacity={0.2}
          />
        </mesh>
      </group>
      
      {/* Vibrant text bubble */}
      {showMessage && (
        <Html position={[0, 0.5, 0]} center>
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7, #fed7aa, #fbbf24)',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontFamily: 'Comic Sans MS, cursive',
            color: '#92400e',
            fontWeight: '600',
            textShadow: '0 1px 2px rgba(255,255,255,0.8)',
            boxShadow: '0 2px 8px rgba(251,191,36,0.4), inset 0 1px 0 rgba(255,255,255,0.6)',
            border: '1px solid #f59e0b',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            animation: 'sparkle 0.3s ease-out',
            transform: 'scale(1)'
          }}>
            {message}
          </div>
          <style jsx>{`
            @keyframes sparkle {
              0% { opacity: 0; transform: translateY(8px) scale(0.8); }
              50% { transform: translateY(-2px) scale(1.05); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>
        </Html>
      )}
    </group>
  )
}
