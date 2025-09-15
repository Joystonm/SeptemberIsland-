export function getRandomPosition(radius = 5) {
  const angle = Math.random() * Math.PI * 2
  const distance = Math.random() * radius
  
  return [
    Math.cos(angle) * distance,
    0,
    Math.sin(angle) * distance
  ]
}

export function getRandomSpherePosition(radius = 5) {
  const u = Math.random()
  const v = Math.random()
  const theta = u * 2.0 * Math.PI
  const phi = Math.acos(2.0 * v - 1.0)
  const r = Math.cbrt(Math.random()) * radius
  
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  ]
}
