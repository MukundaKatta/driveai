'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { AlertTriangle, CheckCircle, Clock, Filter, TrendingDown, Hand, Zap, OctagonIcon, ArrowRight } from 'lucide-react'

export default function InterventionTracker() {
  const { interventions } = useStore()
  const [typeFilter, setTypeFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')

  const filtered = interventions.filter(e => {
    if (typeFilter !== 'all' && e.type !== typeFilter) return false
    if (severityFilter !== 'all' && e.severity !== severityFilter) return false
    return true
  })

  const typeIcons: Record<string, any> = {
    manual_takeover: Hand,
    system_disengage: Zap,
    emergency_stop: OctagonIcon,
    path_correction: ArrowRight,
  }

  const severityColors: Record<string, string> = {
    critical: 'bg-red-600 text-red-100',
    high: 'bg-orange-600 text-orange-100',
    medium: 'bg-yellow-600 text-yellow-100',
    low: 'bg-blue-600 text-blue-100',
  }

  const avgReactionTime = interventions.reduce((s, i) => s + i.driverReactionTime, 0) / interventions.length
  const unresolvedCount = interventions.filter(i => !i.resolved).length

  // Weekly trend
  const weekData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    count: Math.floor(1 + Math.random() * 5),
  }))

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Intervention Tracker</h2>
          <p className="text-gray-400">Monitor all human interventions and system disengagements</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
          <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-2xl font-bold">{interventions.length}</p>
          <p className="text-xs text-gray-400">Total Interventions</p>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
          <div className="w-10 h-10 bg-yellow-600/20 rounded-xl flex items-center justify-center mb-3">
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold">{avgReactionTime.toFixed(1)}s</p>
          <p className="text-xs text-gray-400">Avg Reaction Time</p>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
          <div className="w-10 h-10 bg-orange-600/20 rounded-xl flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-2xl font-bold">{unresolvedCount}</p>
          <p className="text-xs text-gray-400">Unresolved</p>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
          <div className="w-10 h-10 bg-green-600/20 rounded-xl flex items-center justify-center mb-3">
            <TrendingDown className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold">-23%</p>
          <p className="text-xs text-gray-400">vs Last Month</p>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold mb-4">Weekly Interventions</h3>
        <div className="flex items-end gap-4 h-32">
          {weekData.map(d => (
            <div key={d.day} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-cyan-500 rounded-t hover:bg-cyan-400 transition-colors"
                style={{ height: `${d.count * 22}px` }}
              />
              <span className="text-xs text-gray-500 mt-2">{d.day}</span>
              <span className="text-xs text-gray-400">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-gray-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="all">All Types</option>
          <option value="manual_takeover">Manual Takeover</option>
          <option value="system_disengage">System Disengage</option>
          <option value="emergency_stop">Emergency Stop</option>
          <option value="path_correction">Path Correction</option>
        </select>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="bg-gray-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Reason</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Severity</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Reaction</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Speed</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filtered.map((evt) => {
              const Icon = typeIcons[evt.type] || AlertTriangle
              return (
                <tr key={evt.id} className="hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm capitalize">{evt.type.replace(/_/g, ' ')}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300 max-w-[200px] truncate">{evt.reason}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityColors[evt.severity]}`}>
                      {evt.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{evt.driverReactionTime.toFixed(1)}s</td>
                  <td className="px-4 py-3 text-sm">{evt.speed.toFixed(0)} mph</td>
                  <td className="px-4 py-3">
                    {evt.resolved ? (
                      <span className="text-green-400 text-sm flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Resolved
                      </span>
                    ) : (
                      <span className="text-yellow-400 text-sm">Open</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {new Date(evt.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
