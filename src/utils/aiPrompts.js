export const prompts = {
  islandName: "Generate a creative, whimsical name for a magical autumn island. Keep it short and evocative.",
  
  affirmation: "Create a short, inspiring affirmation about creativity and building your own world. Keep it under 20 words.",
  
  creatureName: "Generate a cute name for a small woodland creature living on an autumn island.",
  
  sceneDescription: "Describe the peaceful, cozy atmosphere of an autumn island scene in one sentence.",
  
  weatherMood: "Create a short poetic description of autumn weather that matches a cozy, magical mood."
}

export function getPrompt(type, context = '') {
  const basePrompt = prompts[type] || prompts.affirmation
  return context ? `${basePrompt} Context: ${context}` : basePrompt
}
