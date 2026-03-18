export interface SensorData {
  lidar: LidarPoint[]
  camera: CameraFrame
  radar: RadarReturn[]
  timestamp: number
}

export interface LidarPoint {
  x: number; y: number; z: number
  intensity: number
  classification: 'ground' | 'vehicle' | 'pedestrian' | 'building' | 'vegetation' | 'unknown'
}

export interface CameraFrame {
  detections: Detection[]
  confidence: number
}

export interface Detection {
  id: string
  type: 'car' | 'truck' | 'pedestrian' | 'cyclist' | 'traffic_light' | 'sign'
  x: number; y: number; width: number; height: number
  confidence: number
  distance: number
}

export interface RadarReturn {
  distance: number
  velocity: number
  angle: number
}

export interface NeuralNetworkLayer {
  name: string
  type: string
  confidence: number
  activationStrength: number
  latency: number
}

export interface InterventionEvent {
  id: string
  timestamp: string
  type: 'manual_takeover' | 'system_disengage' | 'emergency_stop' | 'path_correction'
  reason: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  driverReactionTime: number
  speed: number
  location: { lat: number; lng: number }
  resolved: boolean
}

export interface Scenario {
  id: string
  name: string
  description: string
  category: 'intersection' | 'highway' | 'urban' | 'parking' | 'weather' | 'emergency'
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme'
  duration: number
  outcome: 'pass' | 'fail' | 'warning'
  score: number
  timestamp: string
}

export interface EdgeCase {
  id: string
  title: string
  description: string
  category: string
  imageUrl: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  frequency: number
  handled: boolean
  timestamp: string
}
