'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { useStore } from '@/lib/store'
import { Gauge, Eye, Crosshair, RotateCcw, Maximize2 } from 'lucide-react'

export default function DrivingScene() {
  const { speed, steeringAngle, isAutonomous, detections, setSpeed, setSteeringAngle, toggleAutonomous } = useStore()
  const [viewAngle, setViewAngle] = useState(0)
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)

  // Animate the 3D driving scene on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.clientWidth * 2
      canvas.height = canvas.clientHeight * 2
      ctx.scale(2, 2)
    }
    resize()

    let frame = 0
    const animate = () => {
      frame++
      const w = canvas.clientWidth
      const h = canvas.clientHeight

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.5)
      skyGrad.addColorStop(0, '#0c1445')
      skyGrad.addColorStop(1, '#1a237e')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, w, h * 0.5)

      // Ground
      const groundGrad = ctx.createLinearGradient(0, h * 0.5, 0, h)
      groundGrad.addColorStop(0, '#1a1a2e')
      groundGrad.addColorStop(1, '#0a0a15')
      ctx.fillStyle = groundGrad
      ctx.fillRect(0, h * 0.5, w, h * 0.5)

      // Horizon line
      ctx.strokeStyle = '#2a2a5a'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, h * 0.5)
      ctx.lineTo(w, h * 0.5)
      ctx.stroke()

      // Road - perspective
      const roadTop = h * 0.5
      const roadBottom = h
      const vanishX = w * 0.5 + steeringAngle * 3
      const vanishY = h * 0.5

      ctx.fillStyle = '#1e1e3a'
      ctx.beginPath()
      ctx.moveTo(vanishX - 5, vanishY)
      ctx.lineTo(0, roadBottom)
      ctx.lineTo(w, roadBottom)
      ctx.lineTo(vanishX + 5, vanishY)
      ctx.closePath()
      ctx.fill()

      // Lane markings
      for (let i = 0; i < 15; i++) {
        const t = ((i * 60 + frame * (speed / 10)) % 900) / 900
        const y = roadTop + (roadBottom - roadTop) * t
        const xCenter = vanishX + (w * 0.5 - vanishX) * t
        const roadWidth = t * w * 0.4
        const dashLen = t * 20

        // Center dashes
        ctx.strokeStyle = `rgba(255, 255, 100, ${0.3 + t * 0.5})`
        ctx.lineWidth = 1 + t * 2
        ctx.setLineDash([dashLen, dashLen])
        ctx.beginPath()
        ctx.moveTo(xCenter, y)
        ctx.lineTo(xCenter, y + dashLen)
        ctx.stroke()
        ctx.setLineDash([])

        // Edge lines
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 + t * 0.3})`
        ctx.lineWidth = 1 + t
        ctx.beginPath()
        ctx.moveTo(xCenter - roadWidth, y)
        ctx.lineTo(xCenter - roadWidth, y + 2)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(xCenter + roadWidth, y)
        ctx.lineTo(xCenter + roadWidth, y + 2)
        ctx.stroke()
      }

      // Other vehicles (simple 3D boxes)
      const vehicles = [
        { x: 0.35, depth: 0.3, color: '#ef4444', w: 60, h: 30 },
        { x: 0.65, depth: 0.5, color: '#3b82f6', w: 50, h: 25 },
        { x: 0.45, depth: 0.15, color: '#22c55e', w: 80, h: 40 },
      ]

      vehicles.forEach(v => {
        const scale = v.depth
        const vx = vanishX + (v.x * w - vanishX) * scale
        const vy = roadTop + (roadBottom - roadTop) * scale
        const vw = v.w * scale
        const vh = v.h * scale

        // Vehicle body
        ctx.fillStyle = v.color
        ctx.fillRect(vx - vw / 2, vy - vh, vw, vh)

        // Windshield
        ctx.fillStyle = '#1a1a2e'
        ctx.fillRect(vx - vw * 0.3, vy - vh * 0.9, vw * 0.6, vh * 0.4)

        // Tail lights
        ctx.fillStyle = '#ff0000'
        ctx.fillRect(vx - vw / 2, vy - vh * 0.3, 4 * scale, 3 * scale)
        ctx.fillRect(vx + vw / 2 - 4 * scale, vy - vh * 0.3, 4 * scale, 3 * scale)

        // Bounding box
        if (showBoundingBoxes) {
          ctx.strokeStyle = '#00ff88'
          ctx.lineWidth = 1.5
          ctx.strokeRect(vx - vw / 2 - 5, vy - vh - 5, vw + 10, vh + 10)
          ctx.fillStyle = '#00ff88'
          ctx.font = `${10 * Math.max(0.5, scale)}px monospace`
          ctx.fillText(`CAR ${(0.8 + Math.random() * 0.2).toFixed(2)}`, vx - vw / 2 - 5, vy - vh - 10)
        }
      })

      // Pedestrian
      if (showBoundingBoxes) {
        const px = w * 0.2
        const py = h * 0.55
        ctx.fillStyle = '#8b5cf6'
        ctx.fillRect(px, py, 8, 20)
        ctx.fillRect(px - 2, py - 6, 12, 8)
        ctx.strokeStyle = '#ff6600'
        ctx.lineWidth = 1.5
        ctx.strokeRect(px - 8, py - 10, 24, 35)
        ctx.fillStyle = '#ff6600'
        ctx.font = '9px monospace'
        ctx.fillText('PED 0.92', px - 8, py - 14)
      }

      // Stars
      for (let i = 0; i < 30; i++) {
        const sx = (Math.sin(i * 137.5) * 0.5 + 0.5) * w
        const sy = (Math.cos(i * 97.3) * 0.3 + 0.1) * h * 0.5
        ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(frame * 0.02 + i) * 0.2})`
        ctx.fillRect(sx, sy, 1.5, 1.5)
      }

      // HUD overlay
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      ctx.fillRect(10, h - 60, 160, 50)
      ctx.fillStyle = '#00ff88'
      ctx.font = '14px monospace'
      ctx.fillText(`SPD: ${speed} mph`, 20, h - 40)
      ctx.fillText(`STR: ${steeringAngle.toFixed(1)}deg`, 20, h - 20)

      // Path prediction lines
      ctx.strokeStyle = 'rgba(0, 200, 255, 0.4)'
      ctx.lineWidth = 2
      ctx.setLineDash([8, 4])
      ctx.beginPath()
      ctx.moveTo(w * 0.4, h)
      ctx.quadraticCurveTo(w * 0.45 + steeringAngle * 2, h * 0.7, vanishX, vanishY)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(w * 0.6, h)
      ctx.quadraticCurveTo(w * 0.55 + steeringAngle * 2, h * 0.7, vanishX, vanishY)
      ctx.stroke()
      ctx.setLineDash([])

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [speed, steeringAngle, showBoundingBoxes])

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Eye className="w-5 h-5 text-cyan-400" />
          3D Driving Scene
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
              showBoundingBoxes ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            <Crosshair className="w-4 h-4" />
            Bounding Boxes
          </button>
          <button
            onClick={toggleAutonomous}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium ${
              isAutonomous ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
            }`}
          >
            {isAutonomous ? 'Autonomous' : 'Manual'}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <canvas ref={canvasRef} className="w-full h-full" />

        {/* Detection panel overlay */}
        <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700 w-64">
          <h3 className="text-sm font-medium mb-3">Detected Objects</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {detections.map((d) => (
              <div key={d.id} className="flex items-center justify-between text-xs bg-gray-800 rounded-lg px-3 py-2">
                <span className="capitalize font-medium">{d.type}</span>
                <span className="text-gray-400">{d.distance}m</span>
                <span className={`font-mono ${d.confidence > 0.9 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {(d.confidence * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Speed/Steering controls */}
        <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400">Speed: {speed} mph</label>
              <input
                type="range"
                min="0"
                max="70"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-48 accent-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Steering: {steeringAngle.toFixed(1)}</label>
              <input
                type="range"
                min="-30"
                max="30"
                step="0.5"
                value={steeringAngle}
                onChange={(e) => setSteeringAngle(Number(e.target.value))}
                className="w-48 accent-cyan-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
