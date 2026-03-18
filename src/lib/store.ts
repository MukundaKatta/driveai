import { create } from 'zustand'
import { NeuralNetworkLayer, InterventionEvent, Scenario, EdgeCase, Detection } from '@/types'
import { mockNNLayers, mockDetections, mockInterventions, mockScenarios, mockEdgeCases } from './mock-data'

interface AppState {
  activeTab: string
  nnLayers: NeuralNetworkLayer[]
  detections: Detection[]
  interventions: InterventionEvent[]
  scenarios: Scenario[]
  edgeCases: EdgeCase[]
  speed: number
  steeringAngle: number
  isAutonomous: boolean
  setActiveTab: (tab: string) => void
  setSpeed: (s: number) => void
  setSteeringAngle: (a: number) => void
  toggleAutonomous: () => void
}

export const useStore = create<AppState>((set) => ({
  activeTab: 'scene',
  nnLayers: mockNNLayers,
  detections: mockDetections,
  interventions: mockInterventions,
  scenarios: mockScenarios,
  edgeCases: mockEdgeCases,
  speed: 35,
  steeringAngle: 0,
  isAutonomous: true,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSpeed: (speed) => set({ speed }),
  setSteeringAngle: (steeringAngle) => set({ steeringAngle }),
  toggleAutonomous: () => set((s) => ({ isAutonomous: !s.isAutonomous })),
}))
