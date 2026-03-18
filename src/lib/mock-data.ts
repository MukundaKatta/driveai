import { NeuralNetworkLayer, InterventionEvent, Scenario, EdgeCase, Detection } from '@/types'

export const mockNNLayers: NeuralNetworkLayer[] = [
  { name: 'Input Processing', type: 'conv2d', confidence: 0.99, activationStrength: 0.95, latency: 2.1 },
  { name: 'Feature Extraction', type: 'resnet_block', confidence: 0.97, activationStrength: 0.88, latency: 5.3 },
  { name: 'Object Detection', type: 'yolo_head', confidence: 0.94, activationStrength: 0.82, latency: 8.7 },
  { name: 'Depth Estimation', type: 'depth_net', confidence: 0.92, activationStrength: 0.79, latency: 4.2 },
  { name: 'Semantic Segmentation', type: 'unet', confidence: 0.91, activationStrength: 0.76, latency: 6.8 },
  { name: 'Trajectory Prediction', type: 'lstm', confidence: 0.89, activationStrength: 0.72, latency: 3.5 },
  { name: 'Path Planning', type: 'transformer', confidence: 0.93, activationStrength: 0.85, latency: 7.1 },
  { name: 'Control Output', type: 'mlp', confidence: 0.96, activationStrength: 0.91, latency: 1.8 },
]

export const mockDetections: Detection[] = [
  { id: 'd1', type: 'car', x: 320, y: 280, width: 120, height: 80, confidence: 0.95, distance: 15 },
  { id: 'd2', type: 'car', x: 550, y: 300, width: 100, height: 70, confidence: 0.88, distance: 25 },
  { id: 'd3', type: 'pedestrian', x: 180, y: 250, width: 40, height: 90, confidence: 0.92, distance: 8 },
  { id: 'd4', type: 'cyclist', x: 700, y: 290, width: 50, height: 70, confidence: 0.85, distance: 20 },
  { id: 'd5', type: 'traffic_light', x: 400, y: 100, width: 30, height: 60, confidence: 0.97, distance: 30 },
  { id: 'd6', type: 'truck', x: 100, y: 260, width: 150, height: 100, confidence: 0.91, distance: 35 },
  { id: 'd7', type: 'sign', x: 620, y: 150, width: 40, height: 40, confidence: 0.89, distance: 40 },
]

export const mockInterventions: InterventionEvent[] = Array.from({ length: 20 }, (_, i) => ({
  id: `int-${i + 1}`,
  timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 3600000).toISOString(),
  type: (['manual_takeover', 'system_disengage', 'emergency_stop', 'path_correction'] as const)[i % 4],
  reason: [
    'Unexpected pedestrian crossing',
    'Construction zone confusion',
    'Sensor occlusion in rain',
    'Ambiguous traffic signal',
    'Double-parked vehicle blocking lane',
  ][i % 5],
  severity: (['low', 'medium', 'high', 'critical'] as const)[i % 4],
  driverReactionTime: 0.5 + Math.random() * 3,
  speed: 10 + Math.random() * 50,
  location: { lat: 37.77 + Math.random() * 0.04, lng: -122.42 + Math.random() * 0.04 },
  resolved: i % 3 !== 0,
}))

export const mockScenarios: Scenario[] = [
  { id: 's1', name: 'Unprotected Left Turn', description: 'Navigate an unprotected left turn at a busy intersection', category: 'intersection', difficulty: 'hard', duration: 45, outcome: 'pass', score: 87, timestamp: new Date().toISOString() },
  { id: 's2', name: 'Highway Merge', description: 'Merge onto a highway with heavy traffic', category: 'highway', difficulty: 'medium', duration: 30, outcome: 'pass', score: 92, timestamp: new Date().toISOString() },
  { id: 's3', name: 'School Zone', description: 'Navigate through an active school zone', category: 'urban', difficulty: 'medium', duration: 60, outcome: 'pass', score: 95, timestamp: new Date().toISOString() },
  { id: 's4', name: 'Parallel Parking', description: 'Park in a tight parallel spot', category: 'parking', difficulty: 'hard', duration: 90, outcome: 'warning', score: 72, timestamp: new Date().toISOString() },
  { id: 's5', name: 'Heavy Rain Driving', description: 'Drive in heavy rain with reduced visibility', category: 'weather', difficulty: 'hard', duration: 120, outcome: 'pass', score: 81, timestamp: new Date().toISOString() },
  { id: 's6', name: 'Emergency Vehicle', description: 'Yield to approaching emergency vehicle', category: 'emergency', difficulty: 'medium', duration: 20, outcome: 'pass', score: 98, timestamp: new Date().toISOString() },
  { id: 's7', name: 'Construction Zone', description: 'Navigate temporary lane changes in construction', category: 'urban', difficulty: 'extreme', duration: 180, outcome: 'fail', score: 55, timestamp: new Date().toISOString() },
  { id: 's8', name: 'Roundabout', description: 'Multi-lane roundabout with heavy traffic', category: 'intersection', difficulty: 'hard', duration: 40, outcome: 'pass', score: 85, timestamp: new Date().toISOString() },
]

export const mockEdgeCases: EdgeCase[] = [
  { id: 'ec1', title: 'Overturned Garbage Can', description: 'AI confused by overturned garbage can in bike lane', category: 'Object Confusion', imageUrl: '', severity: 'medium', frequency: 3, handled: true, timestamp: new Date().toISOString() },
  { id: 'ec2', title: 'Mural on Building', description: 'Painted mural of a road triggered lane detection', category: 'Visual Confusion', imageUrl: '', severity: 'low', frequency: 1, handled: true, timestamp: new Date().toISOString() },
  { id: 'ec3', title: 'Drone Overhead', description: 'Low-flying delivery drone caused sensor interference', category: 'Sensor Interference', imageUrl: '', severity: 'high', frequency: 2, handled: false, timestamp: new Date().toISOString() },
  { id: 'ec4', title: 'Jaywalking Crowd', description: 'Large group jaywalking outside crosswalk', category: 'Pedestrian Behavior', imageUrl: '', severity: 'critical', frequency: 8, handled: true, timestamp: new Date().toISOString() },
  { id: 'ec5', title: 'Reflective Puddle', description: 'Large puddle reflecting sky confused depth sensor', category: 'Weather Effects', imageUrl: '', severity: 'medium', frequency: 12, handled: true, timestamp: new Date().toISOString() },
  { id: 'ec6', title: 'Tesla on Flatbed', description: 'Vehicle on flatbed truck detected as moving car', category: 'Object Confusion', imageUrl: '', severity: 'high', frequency: 4, handled: false, timestamp: new Date().toISOString() },
  { id: 'ec7', title: 'Costume Pedestrian', description: 'Person in dinosaur costume not classified as pedestrian', category: 'Classification Error', imageUrl: '', severity: 'critical', frequency: 1, handled: false, timestamp: new Date().toISOString() },
  { id: 'ec8', title: 'Bridge Shadow', description: 'Sharp bridge shadow interpreted as road edge', category: 'Visual Confusion', imageUrl: '', severity: 'medium', frequency: 6, handled: true, timestamp: new Date().toISOString() },
]
