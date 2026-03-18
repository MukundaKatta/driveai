'use client'

import { Brain, Eye, Network, AlertTriangle, Play, Camera, Gauge } from 'lucide-react'
import { useStore } from '@/lib/store'

const iconMap: Record<string, any> = {
  scene: Eye,
  birdseye: Camera,
  neural: Network,
  interventions: AlertTriangle,
  scenarios: Play,
  edgecases: Brain,
}

interface SidebarProps {
  tabs: { id: string; label: string }[]
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function Sidebar({ tabs, activeTab, onTabChange }: SidebarProps) {
  const { speed, isAutonomous } = useStore()

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">DriveAI</h1>
            <p className="text-xs text-gray-400">AV Visualization</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {tabs.map((tab) => {
          const Icon = iconMap[tab.id] || Eye
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-3">
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Speed</span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold">{speed} <span className="text-sm text-gray-400">mph</span></p>
        </div>
        <div className={`rounded-xl p-3 text-center text-sm font-medium ${
          isAutonomous ? 'bg-green-600/20 text-green-400 border border-green-600/30' : 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
        }`}>
          {isAutonomous ? 'Autonomous Mode' : 'Manual Override'}
        </div>
      </div>
    </aside>
  )
}
