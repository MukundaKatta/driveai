'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Play, Pause, SkipBack, SkipForward, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react'

export default function ScenarioReplay() {
  const { scenarios } = useStore()
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const outcomeColors = {
    pass: 'text-green-400 bg-green-600/20',
    fail: 'text-red-400 bg-red-600/20',
    warning: 'text-yellow-400 bg-yellow-600/20',
  }

  const difficultyColors = {
    easy: 'text-green-400',
    medium: 'text-yellow-400',
    hard: 'text-orange-400',
    extreme: 'text-red-400',
  }

  const categoryIcons: Record<string, string> = {
    intersection: 'Crossroads',
    highway: 'Highway',
    urban: 'City',
    parking: 'Parking',
    weather: 'Weather',
    emergency: 'Emergency',
  }

  const passRate = (scenarios.filter(s => s.outcome === 'pass').length / scenarios.length * 100).toFixed(0)
  const avgScore = (scenarios.reduce((s, sc) => s + sc.score, 0) / scenarios.length).toFixed(0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Scenario Replay</h2>
          <p className="text-gray-400">Review and replay driving test scenarios</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-gray-800 rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-gray-400">Pass Rate</p>
            <p className="text-lg font-bold text-green-400">{passRate}%</p>
          </div>
          <div className="bg-gray-800 rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-gray-400">Avg Score</p>
            <p className="text-lg font-bold text-cyan-400">{avgScore}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Scenario list */}
        <div className="col-span-1 space-y-3">
          <h3 className="text-sm font-medium text-gray-400 uppercase">Scenarios</h3>
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => { setSelectedScenario(scenario); setProgress(0); setIsPlaying(false) }}
              className={`w-full text-left p-4 rounded-xl transition-all ${
                selectedScenario.id === scenario.id
                  ? 'bg-cyan-600/20 border-2 border-cyan-500'
                  : 'bg-gray-800 border-2 border-transparent hover:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{scenario.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${outcomeColors[scenario.outcome]}`}>
                  {scenario.outcome}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{categoryIcons[scenario.category]}</span>
                <span className={difficultyColors[scenario.difficulty]}>{scenario.difficulty}</span>
                <span>Score: {scenario.score}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Replay viewer */}
        <div className="col-span-2 space-y-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            {/* Replay viewport */}
            <div className="h-80 bg-gray-800 relative">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {isPlaying ? (
                      <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Play className="w-8 h-8 text-cyan-400" />
                    )}
                  </div>
                  <p className="text-lg font-bold">{selectedScenario.name}</p>
                  <p className="text-sm text-gray-400 mt-1">{selectedScenario.description}</p>
                </div>
              </div>

              {/* Progress overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm p-4">
                <div className="flex items-center gap-4">
                  <button onClick={() => setProgress(0)} className="p-1 hover:text-cyan-400">
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 bg-cyan-600 rounded-full hover:bg-cyan-500"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button onClick={() => setProgress(100)} className="p-1 hover:text-cyan-400">
                    <SkipForward className="w-5 h-5" />
                  </button>
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={(e) => setProgress(Number(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                  <span className="text-xs text-gray-400 font-mono">{progress}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scenario details */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <h4 className="text-sm font-medium mb-3">Score Breakdown</h4>
              <div className="relative w-24 h-24 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#1f2937" strokeWidth="8" fill="none" />
                  <circle
                    cx="48" cy="48" r="40"
                    stroke={selectedScenario.score > 80 ? '#22c55e' : selectedScenario.score > 60 ? '#eab308' : '#ef4444'}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${selectedScenario.score * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">{selectedScenario.score}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <h4 className="text-sm font-medium mb-3">Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Category</span>
                  <span className="capitalize">{selectedScenario.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Difficulty</span>
                  <span className={difficultyColors[selectedScenario.difficulty] + ' capitalize'}>{selectedScenario.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration</span>
                  <span>{selectedScenario.duration}s</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <h4 className="text-sm font-medium mb-3">Timeline Events</h4>
              <div className="space-y-2">
                {['Detection started', 'Decision point', 'Action taken', 'Scenario end'].map((ev, i) => (
                  <div key={ev} className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${i < 3 ? 'bg-green-400' : 'bg-cyan-400'}`} />
                    <span className="text-gray-300">{ev}</span>
                    <span className="text-gray-500 ml-auto">{(selectedScenario.duration * (i + 1) / 4).toFixed(0)}s</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
