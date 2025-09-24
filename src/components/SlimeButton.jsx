import { useState } from 'react'

export default function SlimeButton({ onClick, children, className = '' }) {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`slime-button ${className}`}
      style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        background: 'linear-gradient(135deg, #84cc16 0%, #a7f3d0 50%, #d1fae5 100%)',
        boxShadow: `
          0 0 20px rgba(167, 243, 208, 0.6),
          inset 0 8px 16px rgba(255, 255, 255, 0.3),
          inset 0 -4px 8px rgba(132, 204, 22, 0.2)
        `,
        transform: isPressed ? 'scale(0.95)' : 'scale(1)',
        transition: 'all 0.15s ease-out',
        overflow: 'hidden'
      }}
    >
      {/* Shine effect */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '20%',
        width: '25px',
        height: '25px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      
      {/* Moving shine */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
        animation: 'shine 3s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      
      {/* Kawaii face */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px'
      }}>
        {/* Eyes */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            backgroundColor: '#333',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '0px',
              right: '0px',
              width: '1.5px',
              height: '1.5px',
              borderRadius: '50%',
              backgroundColor: 'white'
            }} />
          </div>
          <div style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            backgroundColor: '#333',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '0px',
              right: '0px',
              width: '1.5px',
              height: '1.5px',
              borderRadius: '50%',
              backgroundColor: 'white'
            }} />
          </div>
        </div>
        
        {/* UwU smile */}
        <div style={{
          width: '8px',
          height: '4px',
          borderBottom: '1.5px solid #333',
          borderRadius: '0 0 8px 8px',
          marginTop: '1px'
        }} />
      </div>
      
      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          50% { transform: translateX(0%) translateY(0%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        
        .slime-button:hover {
          transform: scale(1.05) !important;
          box-shadow: 
            0 0 25px rgba(167, 243, 208, 0.8),
            inset 0 8px 16px rgba(255, 255, 255, 0.4),
            inset 0 -4px 8px rgba(132, 204, 22, 0.3) !important;
        }
        
        .slime-button:active {
          transform: scale(0.9) !important;
        }
      `}</style>
    </button>
  )
}
