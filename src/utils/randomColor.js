const autumnColors = [
  '#FF6B35', // Orange
  '#F7931E', // Golden
  '#FFD23F', // Yellow
  '#8B4513', // Brown
  '#DC143C', // Crimson
  '#FF4500', // Red-Orange
  '#DAA520', // Goldenrod
]

export function getRandomAutumnColor() {
  return autumnColors[Math.floor(Math.random() * autumnColors.length)]
}

export function getRandomColor() {
  return `hsl(${Math.random() * 360}, 70%, 60%)`
}
