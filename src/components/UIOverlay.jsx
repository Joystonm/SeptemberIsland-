import React from 'react'
import Controls from './Controls'
import SceneSwitcher from './SceneSwitcher'
import GroqQuotes from './GroqQuotes'
import AmbientSound from './AmbientSound'
import KeyboardControls from './KeyboardControls'

export default function UIOverlay() {
  return (
    <>
      <Controls />
      <SceneSwitcher />
      <GroqQuotes />
      <AmbientSound />
      <KeyboardControls />
      
      {/* Minimal title */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center">
        <h1 className="text-xl font-semibold text-white drop-shadow-lg opacity-90">
          🍂 September Island
        </h1>
      </div>
    </>
  )
}
