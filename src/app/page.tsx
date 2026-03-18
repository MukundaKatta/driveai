'use client'

import { useStore } from '@/lib/store'
import Sidebar from '@/components/Sidebar'
import DrivingScene from '@/components/DrivingScene'
import BirdsEyeView from '@/components/BirdsEyeView'
import NeuralNetworkViz from '@/components/NeuralNetworkViz'
import InterventionTracker from '@/components/InterventionTracker'
import ScenarioReplay from '@/components/ScenarioReplay'
import EdgeCaseGallery from '@/components/EdgeCaseGallery'

const tabs = [
  { id: 'scene', label: '3D Driving Scene' },
  { id: 'birdseye', label: "Bird's Eye View" },
  { id: 'neural', label: 'Neural Network' },
  { id: 'interventions', label: 'Interventions' },
  { id: 'scenarios', label: 'Scenario Replay' },
  { id: 'edgecases', label: 'Edge Cases' },
]

export default function HomePage() {
  const { activeTab, setActiveTab } = useStore()

  const renderContent = () => {
    switch (activeTab) {
      case 'scene': return <DrivingScene />
      case 'birdseye': return <BirdsEyeView />
      case 'neural': return <NeuralNetworkViz />
      case 'interventions': return <InterventionTracker />
      case 'scenarios': return <ScenarioReplay />
      case 'edgecases': return <EdgeCaseGallery />
      default: return <DrivingScene />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  )
}
