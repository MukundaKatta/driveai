'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Brain, AlertTriangle, CheckCircle, Filter, Search, Eye } from 'lucide-react'

export default function EdgeCaseGallery() {
  const { edgeCases } = useStore()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedCase, setSelectedCase] = useState<string | null>(null)

  const categories = [...new Set(edgeCases.map(e => e.category))]
  const filtered = edgeCases.filter(e => {
    if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.description.toLowerCase().includes(search.toLowerCase())) return false
    if (categoryFilter !== 'all' && e.category !== categoryFilter) return false
    return true
  })

  const severityColors: Record<string, string> = {
    critical: 'border-red-500 bg-red-500/10',
    high: 'border-orange-500 bg-orange-500/10',
    medium: 'border-yellow-500 bg-yellow-500/10',
    low: 'border-blue-500 bg-blue-500/10',
  }

  const handledCount = edgeCases.filter(e => e.handled).length
  const criticalCount = edgeCases.filter(e => e.severity === 'critical').length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Edge Case Gallery</h2>
          <p className="text-gray-400">Catalog of unusual scenarios encountered by the driving AI</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-gray-800 rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-gray-400">Total Cases</p>
            <p className="text-lg font-bold">{edgeCases.length}</p>
          </div>
          <div className="bg-gray-800 rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-gray-400">Handled</p>
            <p className="text-lg font-bold text-green-400">{handledCount}</p>
          </div>
          <div className="bg-gray-800 rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-gray-400">Critical</p>
            <p className="text-lg font-bold text-red-400">{criticalCount}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search edge cases..."
            className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-gray-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((ec) => (
          <div
            key={ec.id}
            className={`rounded-2xl border-2 p-5 cursor-pointer transition-all hover:scale-[1.01] ${severityColors[ec.severity]} ${
              selectedCase === ec.id ? 'ring-2 ring-cyan-400' : ''
            }`}
            onClick={() => setSelectedCase(selectedCase === ec.id ? null : ec.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-medium">{ec.title}</h3>
                  <p className="text-xs text-gray-400">{ec.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {ec.handled ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                )}
                <span className={`text-xs px-2 py-1 rounded-full ${
                  ec.severity === 'critical' ? 'bg-red-600 text-red-100' :
                  ec.severity === 'high' ? 'bg-orange-600 text-orange-100' :
                  ec.severity === 'medium' ? 'bg-yellow-600 text-yellow-100' :
                  'bg-blue-600 text-blue-100'
                }`}>
                  {ec.severity}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-3">{ec.description}</p>

            {/* Image placeholder */}
            <div className="w-full h-32 bg-gray-800 rounded-xl flex items-center justify-center mb-3">
              <div className="text-center">
                <Eye className="w-8 h-8 text-gray-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Visual capture</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Frequency: {ec.frequency} occurrences</span>
              <span>{ec.handled ? 'Handled' : 'Unhandled'}</span>
            </div>

            {selectedCase === ec.id && (
              <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                <h4 className="text-sm font-medium">Analysis Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <span className="text-xs text-gray-400">Root Cause</span>
                    <p className="mt-1">Insufficient training data for this scenario type</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <span className="text-xs text-gray-400">Resolution</span>
                    <p className="mt-1">{ec.handled ? 'Added to training set, model retrained' : 'Pending data collection'}</p>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <span className="text-xs text-gray-400">Sensor Data Available</span>
                  <div className="flex gap-2 mt-2">
                    {['LiDAR', 'Camera', 'Radar', 'IMU'].map(s => (
                      <span key={s} className="px-2 py-1 bg-gray-700 rounded text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
