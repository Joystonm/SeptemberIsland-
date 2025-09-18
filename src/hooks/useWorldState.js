import { create } from 'zustand'

export const useWorldState = create((set, get) => ({
  objects: [],
  scene: 'day',
  windEnabled: false,
  weatherMode: 'clear',
  autumnStage: 0, // 0=green, 1=yellow, 2=orange, 3=deep red
  autumnDirection: 1, // 1=forward, -1=backward
  isTransitioning: false,
  autumnTreeIds: [],
  natureMode: false,
  cozyMode: false,
  isTogglingNature: false,
  isTogglingCozy: false,
  lanterns: [],
  lanternMode: false,
  lanternInterval: null,
  pumpkinCount: 0,
  collectedStaticPumpkins: [],
  
  getTotalPumpkins: () => {
    const state = get()
    const dynamicPumpkins = state.objects.filter(obj => obj.type === 'pumpkin').length
    const staticPumpkins = 2 - state.collectedStaticPumpkins.length
    return dynamicPumpkins + staticPumpkins
  },
  
  addObject: (object) => set((state) => ({ 
    objects: [...state.objects, object] 
  })),
  
  removeObject: (id) => set((state) => ({ 
    objects: state.objects.filter(obj => obj.id !== id) 
  })),
  
  removeAutumnTrees: () => set((state) => ({
    objects: state.objects.filter(obj => !state.autumnTreeIds.includes(obj.id)),
    autumnTreeIds: []
  })),
  
  setScene: (scene) => set({ scene }),
  
  toggleWind: () => set((state) => ({ 
    windEnabled: !state.windEnabled 
  })),
  
  setWeatherMode: (mode) => set((state) => ({
    weatherMode: mode,
    windEnabled: mode === 'windy'
  })),  
  
  toggleNature: () => {
    const state = get()
    if (!state.isTogglingNature) {
      set({ isTogglingNature: true })
      setTimeout(() => {
        set((state) => ({ 
          natureMode: !state.natureMode,
          isTogglingNature: false
        }))
      }, 500)
    }
  },
  
  toggleCozy: () => {
    const state = get()
    if (!state.isTogglingCozy) {
      set({ isTogglingCozy: true })
      setTimeout(() => {
        set((state) => ({ 
          cozyMode: !state.cozyMode,
          isTogglingCozy: false
        }))
      }, 500)
    }
  },
  
  progressAutumn: () => {
    const state = get()
    if (state.isTransitioning) return
    
    set({ isTransitioning: true })
    
    let newStage = state.autumnStage + state.autumnDirection
    let newDirection = state.autumnDirection
    
    // Handle boundaries and direction changes
    if (newStage > 3) {
      newStage = 3
      newDirection = -1 // Switch to backward
    } else if (newStage < 0) {
      newStage = 0
      newDirection = 1 // Switch to forward
    }
    
    set({ 
      autumnStage: newStage,
      autumnDirection: newDirection
    })
    
    // Add autumn trees only on first forward progression to stage 1
    if (newStage === 1 && state.autumnStage === 0 && newDirection === 1) {
      const newTreeIds = []
      
      // Add 3 autumn trees with delays
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const angle = Math.random() * Math.PI * 2
          const radius = 1.5 + Math.random() * 1.5
          const position = [
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
          ]
          
          const treeId = Date.now() + i
          newTreeIds.push(treeId)
          
          set((state) => ({
            objects: [...state.objects, {
              id: treeId,
              type: 'tree',
              position,
              isNew: true,
              autumnStage: newStage,
              isAutumnTree: true
            }],
            autumnTreeIds: [...state.autumnTreeIds, treeId]
          }))
          
          console.log('🍂 Rustle sound effect')
          
        }, i * 600)
      }
    }
    
    // Remove autumn trees when going back to green
    if (newStage === 0 && state.autumnStage === 1 && newDirection === -1) {
      setTimeout(() => {
        get().removeAutumnTrees()
      }, 1000)
    }
    
    // Particle burst effect
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const burstPos = [
          (Math.random() - 0.5) * 6,
          3 + Math.random() * 2,
          (Math.random() - 0.5) * 6
        ]
        set((state) => ({
          objects: [...state.objects, {
            id: Date.now() + Math.random(),
            type: 'leaf',
            position: burstPos,
            isBurst: true
          }]
        }))
      }, i * 100)
    }
    
    // Reset transition flag
    setTimeout(() => {
      set({ isTransitioning: false })
    }, 1500) // Reduced for smoother experience
  },
  
  spawnLantern: () => {
    const newLantern = {
      id: Date.now() + Math.random(),
      position: [
        (Math.random() - 0.5) * 8,
        0.5,
        (Math.random() - 0.5) * 8
      ]
    }
    
    set((state) => ({ lanterns: [...state.lanterns, newLantern] }))
  },
  
  removeLantern: (id) => set((state) => ({
    lanterns: state.lanterns.filter(lantern => lantern.id !== id)
  })),
  
  toggleLanternMode: () => {
    const state = get()
    if (state.lanternMode) {
      // Turn off
      if (state.lanternInterval) {
        clearInterval(state.lanternInterval)
      }
      set({ lanternMode: false, lanternInterval: null })
    } else {
      // Turn on
      const interval = setInterval(() => {
        get().spawnLantern()
      }, 3000)
      set({ lanternMode: true, lanternInterval: interval })
    }
  },
  
  collectPumpkin: (id) => set((state) => {
    console.log(`Collecting pumpkin ID: ${id}`)
    console.log(`Current objects:`, state.objects.map(obj => ({ id: obj.id, type: obj.type })))
    console.log(`Current pumpkin count: ${state.pumpkinCount}`)
    
    const newState = {
      objects: state.objects.filter(obj => obj.id !== id),
      pumpkinCount: state.pumpkinCount + 1,
      collectedStaticPumpkins: id.startsWith('static-') 
        ? [...state.collectedStaticPumpkins, id]
        : state.collectedStaticPumpkins
    }
    
    console.log(`New pumpkin count: ${newState.pumpkinCount}`)
    console.log(`Remaining objects:`, newState.objects.map(obj => ({ id: obj.id, type: obj.type })))
    
    return newState
  }),
  
  playPopSound: () => {
    // Placeholder for sound effect - could be replaced with actual audio
    console.log('🎵 Pop! Pumpkin collected')
  },
  
  resetAutumn: () => set({ 
    autumnStage: 0,
    autumnDirection: 1,
    isTransitioning: false,
    objects: [],
    autumnTreeIds: []
  })
}))
