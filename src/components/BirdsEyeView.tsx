'use client'

import { useRef, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { Camera, RotateCcw } from 'lucide-react'

export default function BirdsEyeView() {
  const { speed, steeringAngle } = useStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.clientWidth * 2
    canvas.height = canvas.clientHeight * 2
    ctx.scale(2, 2)

    let frame = 0
    const animate = () => {
      frame++
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const cx = w / 2
      const cy = h / 2

      // Background
      ctx.fillStyle = '#0a0f1a'
      ctx.fillRect(0, 0, w, h)

      // Road network (bird's eye)
      ctx.strokeStyle = '#1a2a4a'
      ctx.lineWidth = 40
      // Main road
      ctx.beginPath()
      ctx.moveTo(cx, 0)
      ctx.lineTo(cx, h)
      ctx.stroke()
      // Cross road
      ctx.beginPath()
      ctx.moveTo(0, cy)
      ctx.lineTo(w, cy)
      ctx.stroke()

      // Road markings
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 1
      ctx.setLineDash([10, 10])
      ctx.beginPath()
      ctx.moveTo(cx, 0)
      ctx.lineTo(cx, h)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, cy)
      ctx.lineTo(w, cy)
      ctx.stroke()
      ctx.setLineDash([])

      // Crosswalk stripes
      for (let i = -3; i <= 3; i++) {
        ctx.fillStyle = '#334155'
        ctx.fillRect(cx - 20 + i * 8, cy - 25, 4, 50)
        ctx.fillRect(cx - 25, cy - 20 + i * 8, 50, 4)
      }

      // Lidar sweep
      const sweepAngle = (frame * 0.03) % (Math.PI * 2)
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + Math.cos(sweepAngle) * 200, cy + Math.sin(sweepAngle) * 200)
      ctx.stroke()

      // Lidar scan area
      ctx.fillStyle = 'rgba(0, 255, 136, 0.03)'
      ctx.beginPath()
      ctx.arc(cx, cy, 200, sweepAngle - 0.3, sweepAngle)
      ctx.lineTo(cx, cy)
      ctx.fill()

      // Range rings
      for (let r = 50; r <= 200; r += 50) {
        ctx.strokeStyle = `rgba(0, 200, 255, ${0.1 + (200 - r) / 1000})`
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Other vehicles (top-down)
      const otherVehicles = [
        { x: cx + 15, y: cy - 80 - (frame * speed / 100) % 300, rot: 0, color: '#ef4444', label: 'V1' },
        { x: cx - 15, y: cy + 120 + (frame * speed / 150) % 250, rot: Math.PI, color: '#3b82f6', label: 'V2' },
        { x: cx + 60 + (frame * speed / 120) % 350, y: cy - 15, rot: -Math.PI / 2, color: '#eab308', label: 'V3' },
      ]

      otherVehicles.forEach(v => {
        const vy = ((v.y % h) + h) % h
        const vx = ((v.x % w) + w) % w
        ctx.save()
        ctx.translate(vx, vy)
        ctx.rotate(v.rot)
        ctx.fillStyle = v.color
        ctx.fillRect(-8, -14, 16, 28)
        ctx.fillStyle = '#ffffff40'
        ctx.fillRect(-6, -12, 12, 6)
        ctx.restore()

        // Detection radius
        ctx.strokeStyle = `${v.color}40`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(vx, vy, 25, 0, Math.PI * 2)
        ctx.stroke()

        ctx.fillStyle = v.color
        ctx.font = '9px monospace'
        ctx.fillText(v.label, vx + 15, vy - 5)
      })

      // Pedestrians
      const peds = [
        { x: cx - 40, y: cy - 30, dx: 0.3 },
        { x: cx + 50, y: cy + 20, dx: -0.2 },
      ]
      peds.forEach((p, i) => {
        const px = p.x + Math.sin(frame * 0.02 + i) * 20
        ctx.fillStyle = '#a855f7'
        ctx.beginPath()
        ctx.arc(px, p.y, 4, 0, Math.PI * 2)
        ctx.fill()
        // Prediction path
        ctx.strokeStyle = '#a855f740'
        ctx.lineWidth = 1
        ctx.setLineDash([3, 3])
        ctx.beginPath()
        ctx.moveTo(px, p.y)
        ctx.lineTo(px + p.dx * 60, p.y)
        ctx.stroke()
        ctx.setLineDash([])
      })

      // Ego vehicle (center)
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(steeringAngle * Math.PI / 180 * 0.1)
      // Body
      ctx.fillStyle = '#00d4ff'
      ctx.fillRect(-10, -16, 20, 32)
      ctx.fillStyle = '#ffffff30'
      ctx.fillRect(-8, -14, 16, 6)
      // Direction arrow
      ctx.fillStyle = '#00ff88'
      ctx.beginPath()
      ctx.moveTo(0, -22)
      ctx.lineTo(-5, -16)
      ctx.lineTo(5, -16)
      ctx.fill()
      ctx.restore()

      // Planned path
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.5)'
      ctx.lineWidth = 2
      ctx.setLineDash([6, 4])
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.quadraticCurveTo(cx + steeringAngle * 2, cy - 100, cx + steeringAngle * 4, cy - 200)
      ctx.stroke()
      ctx.setLineDash([])

      // Info overlay
      ctx.fillStyle = 'rgba(0,0,0,0.6)'
      ctx.fillRect(10, 10, 160, 70)
      ctx.fillStyle = '#00d4ff'
      ctx.font = 'bold 12px monospace'
      ctx.fillText("BIRD'S EYE VIEW", 20, 30)
      ctx.fillStyle = '#888'
      ctx.font = '10px monospace'
      ctx.fillText(`Objects: 5 tracked`, 20, 48)
      ctx.fillText(`LiDAR: 360deg scan`, 20, 62)

      animRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animRef.current)
  }, [speed, steeringAngle])

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Camera className="w-5 h-5 text-cyan-400" />
          Bird's Eye View
        </h2>
        <div className="flex gap-2 text-xs">
          <span className="flex items-center gap-1 px-2 py-1 bg-cyan-600/20 text-cyan-400 rounded">Ego Vehicle</span>
          <span className="flex items-center gap-1 px-2 py-1 bg-red-600/20 text-red-400 rounded">Vehicles</span>
          <span className="flex items-center gap-1 px-2 py-1 bg-purple-600/20 text-purple-400 rounded">Pedestrians</span>
          <span className="flex items-center gap-1 px-2 py-1 bg-green-600/20 text-green-400 rounded">Planned Path</span>
        </div>
      </div>
      <div className="flex-1 relative">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  )
}
