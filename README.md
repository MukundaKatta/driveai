# DriveAI

> Autonomous Vehicle Simulation and Analysis Platform

DriveAI is an interactive platform for visualizing and analyzing autonomous driving scenarios. Explore 3D driving scenes, view bird's-eye perspectives, inspect neural network decisions, replay scenarios, and study edge cases.

## Features

- **3D Driving Scene** -- WebGL-rendered autonomous driving environment with vehicles and road
- **Bird's Eye View** -- Top-down visualization of vehicle positions and trajectories
- **Neural Network Visualizer** -- Inspect perception model activations and decision layers
- **Intervention Tracker** -- Log and analyze human driver interventions and takeovers
- **Scenario Replay** -- Record and replay driving scenarios for analysis
- **Edge Case Gallery** -- Catalog of challenging scenarios for safety evaluation

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **3D Rendering:** Three.js, React Three Fiber, React Three Drei
- **Database:** Supabase (PostgreSQL)
- **Charts:** Recharts
- **State Management:** Zustand
- **Animation:** Framer Motion
- **Icons:** Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your SUPABASE_URL and SUPABASE_ANON_KEY

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/
    page.tsx                  # Main application with sidebar navigation
  components/
    Sidebar.tsx               # Tab-based navigation
    DrivingScene.tsx          # 3D autonomous driving visualization
    BirdsEyeView.tsx         # Top-down map view
    NeuralNetworkViz.tsx     # Neural network layer visualization
    InterventionTracker.tsx  # Intervention logging and analysis
    ScenarioReplay.tsx       # Driving scenario playback
    EdgeCaseGallery.tsx      # Edge case catalog
  lib/
    store.ts                  # Zustand state management
```

## License

MIT
