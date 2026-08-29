export type WasteStatus = 'optimal' | 'moderate' | 'high' | 'overflow' | 'damaged' | 'maintenance';
export type OverflowRisk = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type RouteStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
export type StopStatus = 'PENDING' | 'COLLECTED' | 'SKIPPED' | 'REPORTED_ISSUE';
export type UserRole = 'admin' | 'driver' | 'citizen';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  address: string;
}

export interface DepotLocation {
  depotId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  activeVehiclesCount?: number;
}

export interface HistoricalReading {
  timestamp: string;
  fillPercent: number;
  weightKg: number;
}

export interface WasteBin {
  id: string;
  name: string;
  areaId: string;
  areaName: string;
  location: LocationCoordinates;
  type: 'general' | 'recyclable' | 'organic' | 'hazardous' | 'electronic';
  capacityLiters: number;
  currentFillPercent: number;
  predictedFillPercent: number;
  predictedOverflowTime: string;
  overflowRisk: OverflowRisk;
  status: WasteStatus;
  lastCollectionTime: string;
  recommendedCollectionTime: string;
  priorityScore: number;
  sensorBattery: number;
  temperatureC: number;
  historicalReadings: HistoricalReading[];
}

export interface CollectionArea {
  id: string;
  areaId?: string;
  name: string;
  code: string;
  city: string;
  state: string;
  country: string;
  zoneType: 'commercial' | 'residential' | 'tech_park' | 'market' | 'mixed';
  riskLevel: OverflowRisk;
  totalBins: number;
  criticalBins: number;
  assignedVehicleId?: string;
  assignedDriverName?: string;
  predictedDailyTons: number;
  currentFillAverage: number;
  averageFillRatePerHour: number;
  coordinates: { lat: number; lng: number };
  latitude?: number;
  longitude?: number;
}

export interface RouteStop {
  id: string;
  binId: string;
  sequence: number;
  binName: string;
  address: string;
  lat: number;
  lng: number;
  currentFillPercent: number;
  predictedFillPercent: number;
  overflowRisk: OverflowRisk;
  status: StopStatus;
  priority: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  estimatedKg: number;
  collectedAt?: string;
  notes?: string;
}

export interface CollectionRoute {
  id: string;
  name: string;
  areaId: string;
  areaName: string;
  assignedDriverId: string;
  assignedDriverName: string;
  assignedVehicleId: string;
  vehiclePlate: string;
  status: RouteStatus;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  stops: RouteStop[];
  totalDistanceKm: number;
  estimatedTimeMinutes: number;
  co2SavingsKg: number;
  completedStopsCount: number;
  aiRecommendationReason: string;
  startTime: string;
  lastUpdated: string;
}

export interface DriverProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleType: string;
  capacityTons: number;
  status: 'ACTIVE' | 'ON_DUTY' | 'BREAK' | 'OFF_DUTY';
  currentRouteId?: string;
  completedRoutesToday: number;
  collectedWeightKgToday: number;
}

export interface CitizenReport {
  id: string;
  reportType: 'overflow' | 'damaged' | 'illegal_dumping' | 'odor_hazard';
  location: LocationCoordinates;
  areaName: string;
  binId?: string;
  description: string;
  photoUrl?: string;
  status: 'PENDING_REVIEW' | 'VERIFIED' | 'DISPATCHED' | 'RESOLVED';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  reportedBy: string;
  aiAnalysis?: {
    severity: string;
    confidence: number;
    suggestedAction: string;
    verifiedLikelihood: number;
  };
}

export interface AIPredictionResult {
  wasteAccumulationPredictions: {
    area: string;
    predictedFillRate: number;
    expectedKg: number;
    timeToOverflowHours: number;
    risk: OverflowRisk;
  }[];
  overflowRiskSummary: {
    criticalCount: number;
    highCount: number;
    moderateCount: number;
    safeCount: number;
  };
  recommendedSchedule: {
    timeWindow: string;
    zone: string;
    priority: string;
    reason: string;
    vehicleType: string;
  }[];
  optimizedRouteExplanation: string;
  co2ReductionEstimate: number;
  anomalies: string[];
  executiveSummary: string;
}
