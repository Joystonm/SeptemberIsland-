# September Island

A magical autumn island experience built with React + React Three Fiber + Groq AI + TailwindCSS.

## Features

- 🌳 Procedurally generated 3D objects (trees, houses, pumpkins, creatures)
- 🍂 Physics-based falling leaves with wind simulation
- 🌦️ Interactive weather system (Clear, Drizzle, Fog, Windy)
- 🎨 Dynamic scene switching (day/night/sunset/cozy cabin)
- 🤖 AI-generated names and affirmations via Groq
- 🎵 Ambient sound system
- 📱 Responsive UI with TailwindCSS

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add your Groq API key to `.env`:
   ```
   VITE_GROQ_API_KEY=your_api_key_here
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `src/components/` - 3D objects and UI components
- `src/hooks/` - Custom React hooks for state and AI
- `src/utils/` - Helper functions and utilities
- `src/styles/` - TailwindCSS styles

## Tech Stack

- React 18
- React Three Fiber
- Three.js
- Groq SDK
- TailwindCSS
- Zustand (state management)
- Vite (build tool)
