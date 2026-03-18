'use client'

import { useStore } from '@/lib/store'
import { Network, Activity, Cpu, Clock, Zap } from 'lucide-react'

export default function NeuralNetworkViz() {
  const { nnLayers } = useStore()

  const totalLatency = nnLayers.reduce((sum, l) => sum + l.latency, 0)
  const avgConfidence = nnLayers.reduce((sum, l) => sum + l.confidence, 0) / nnLayers.length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Neural Network Confidence</h2>
          <p className="text-gray-400">Real-time network layer analysis and confidence monitoring</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-gray-800 rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-gray-400">Total Latency</p>
            <p className="text-lg font-bold text-cyan-400">{totalLatency.toFixed(1)}ms</p>
          </div>
          <div className="bg-gray-800 rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-gray-400">Avg Confidence</p>
            <p className="text-lg font-bold text-green-400">{(avgConfidence * 100).toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Network visualization */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
        <div className="flex items-center gap-2 mb-6">
          <Network className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold">Network Architecture</h3>
        </div>

        {/* Pipeline flow */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4">
          {nnLayers.map((layer, i) => {
            const confColor = layer.confidence > 0.95 ? 'border-green-500 bg-green-500/10' :
              layer.confidence > 0.9 ? 'border-cyan-500 bg-cyan-500/10' :
              layer.confidence > 0.85 ? 'border-yellow-500 bg-yellow-500/10' : 'border-red-500 bg-red-500/10'

            return (
              <div key={layer.name} className="flex items-center">
                <div className={`border-2 rounded-xl p-4 min-w-[150px] ${confColor}`}>
                  <p className="text-sm font-medium">{layer.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{layer.type}</p>
                  <div className="mt-3 space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-400">Confidence</span>
                        <span className="font-mono">{(layer.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-green-500"
                          style={{ width: `${layer.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-400">Activation</span>
                        <span className="font-mono">{(layer.activationStrength * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-cyan-500"
                          style={{ width: `${layer.activationStrength * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {layer.latency.toFixed(1)}ms
                    </div>
                  </div>
                </div>
                {i < nnLayers.length - 1 && (
                  <div className="flex items-center px-1">
                    <div className="w-8 h-0.5 bg-gray-600" />
                    <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-gray-600" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Detailed metrics */}
      <div className="grid grid-cols-2 gap-6">
        {/* Layer performance */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold mb-4">Layer Performance</h3>
          <div className="space-y-3">
            {nnLayers.map((layer) => (
              <div key={layer.name} className="flex items-center gap-4">
                <span className="w-36 text-sm text-gray-300 truncate">{layer.name}</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-gray-800 rounded-full h-6 relative overflow-hidden">
                    <div
                      className="h-6 rounded-full flex items-center justify-end pr-2 transition-all"
                      style={{
                        width: `${layer.confidence * 100}%`,
                        background: `linear-gradient(90deg, ${layer.confidence > 0.93 ? '#22c55e' : '#eab308'}, ${layer.confidence > 0.93 ? '#10b981' : '#f59e0b'})`
                      }}
                    >
                      <span className="text-xs font-mono font-medium">{(layer.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 w-14 text-right">{layer.latency.toFixed(1)}ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inference stats */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold mb-4">Inference Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-gray-400">GPU Utilization</span>
              </div>
              <p className="text-2xl font-bold">78%</p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-400">FPS</span>
              </div>
              <p className="text-2xl font-bold">30</p>
              <p className="text-xs text-green-400 mt-2">Stable</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-400">Memory</span>
              </div>
              <p className="text-2xl font-bold">6.2 GB</p>
              <p className="text-xs text-gray-400 mt-2">of 8 GB</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-400">Avg Latency</span>
              </div>
              <p className="text-2xl font-bold">{(totalLatency / nnLayers.length).toFixed(1)}ms</p>
              <p className="text-xs text-green-400 mt-2">Within budget</p>
            </div>
          </div>

          {/* Latency chart */}
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-3">Latency Distribution (last 100 frames)</h4>
            <div className="flex items-end gap-0.5 h-24">
              {Array.from({ length: 50 }, (_, i) => {
                const v = 25 + Math.random() * 35 + Math.sin(i * 0.3) * 10
                return (
                  <div key={i} className="flex-1">
                    <div
                      className="w-full rounded-t-sm"
                      style={{
                        height: `${v}%`,
                        backgroundColor: v > 50 ? '#ef4444' : v > 35 ? '#eab308' : '#22c55e'
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
