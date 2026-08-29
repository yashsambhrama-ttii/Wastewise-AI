import { WasteBin, CollectionArea, CollectionRoute, DriverProfile, CitizenReport, DepotLocation } from '../types';

export const INITIAL_DEPOT: DepotLocation = {
  depotId: 'DEPOT-BLR-CENTRAL',
  name: 'BBMP Central Solid Waste Logistics Hub & MRF',
  address: 'Majestic / Corporation Circle, Subhash Nagar, Bengaluru, Karnataka 560009',
  latitude: 12.9767,
  longitude: 77.5713,
  city: 'Bengaluru',
  state: 'Karnataka',
  activeVehiclesCount: 18
};

export const AVAILABLE_DEPOTS: DepotLocation[] = [
  INITIAL_DEPOT,
  {
    depotId: 'DEPOT-BLR-SOUTH',
    name: 'BBMP Koramangala South Transfer Hub',
    address: '80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034',
    latitude: 12.9338,
    longitude: 77.6295,
    city: 'Bengaluru',
    state: 'Karnataka',
    activeVehiclesCount: 12
  },
  {
    depotId: 'DEPOT-BLR-EAST',
    name: 'BBMP Whitefield Materials Recovery Facility (MRF)',
    address: 'EPIP Zone, Near ITPL, Whitefield, Bengaluru, Karnataka 560066',
    latitude: 12.9782,
    longitude: 77.7280,
    city: 'Bengaluru',
    state: 'Karnataka',
    activeVehiclesCount: 14
  },
  {
    depotId: 'DEPOT-BLR-NORTH',
    name: 'BBMP Yeshwanthpur Modern Compactor Depot',
    address: 'APMC Yard Approach, Tumkur Road, Yeshwanthpur, Bengaluru, Karnataka 560022',
    latitude: 13.0240,
    longitude: 77.5460,
    city: 'Bengaluru',
    state: 'Karnataka',
    activeVehiclesCount: 10
  }
];

export const INITIAL_AREAS: CollectionArea[] = [
  {
    id: 'BLR-INDIRANAGAR',
    areaId: 'BLR-INDIRANAGAR',
    name: 'Indiranagar Commercial Corridor',
    code: 'ZONE-IND',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    zoneType: 'commercial',
    riskLevel: 'HIGH',
    totalBins: 28,
    criticalBins: 6,
    assignedDriverName: 'Raghavendra Rao',
    predictedDailyTons: 7.4,
    currentFillAverage: 82,
    averageFillRatePerHour: 8.4,
    coordinates: { lat: 12.9784, lng: 77.6408 },
    latitude: 12.9784,
    longitude: 77.6408
  },
  {
    id: 'BLR-KORAMANGALA',
    areaId: 'BLR-KORAMANGALA',
    name: 'Koramangala 5th & 7th Block',
    code: 'ZONE-KOR',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    zoneType: 'commercial',
    riskLevel: 'CRITICAL',
    totalBins: 32,
    criticalBins: 9,
    assignedDriverName: 'Manjunath Gowda',
    predictedDailyTons: 8.6,
    currentFillAverage: 88,
    averageFillRatePerHour: 9.6,
    coordinates: { lat: 12.9352, lng: 77.6245 },
    latitude: 12.9352,
    longitude: 77.6245
  },
  {
    id: 'BLR-HSR',
    areaId: 'BLR-HSR',
    name: 'HSR Layout Sectors 1-7',
    code: 'ZONE-HSR',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    zoneType: 'residential',
    riskLevel: 'MODERATE',
    totalBins: 24,
    criticalBins: 3,
    assignedDriverName: 'Syed Farooq',
    predictedDailyTons: 5.1,
    currentFillAverage: 58,
    averageFillRatePerHour: 5.0,
    coordinates: { lat: 12.9121, lng: 77.6446 },
    latitude: 12.9121,
    longitude: 77.6446
  },
  {
    id: 'BLR-MGROAD',
    areaId: 'BLR-MGROAD',
    name: 'MG Road & Brigade Central Business District',
    code: 'ZONE-CBD',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    zoneType: 'commercial',
    riskLevel: 'HIGH',
    totalBins: 30,
    criticalBins: 7,
    assignedDriverName: 'Anand Kumar',
    predictedDailyTons: 7.9,
    currentFillAverage: 79,
    averageFillRatePerHour: 8.1,
    coordinates: { lat: 12.9756, lng: 77.6066 },
    latitude: 12.9756,
    longitude: 77.6066
  },
  {
    id: 'BLR-WHITEFIELD',
    areaId: 'BLR-WHITEFIELD',
    name: 'Whitefield ITPL & Tech Parks',
    code: 'ZONE-WTF',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    zoneType: 'tech_park',
    riskLevel: 'HIGH',
    totalBins: 34,
    criticalBins: 5,
    assignedDriverName: 'Raghavendra Rao',
    predictedDailyTons: 6.8,
    currentFillAverage: 73,
    averageFillRatePerHour: 6.5,
    coordinates: { lat: 12.9698, lng: 77.7499 },
    latitude: 12.9698,
    longitude: 77.7499
  },
  {
    id: 'BLR-JAYANAGAR',
    areaId: 'BLR-JAYANAGAR',
    name: 'Jayanagar 4th Block & Cultural Hub',
    code: 'ZONE-JAY',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    zoneType: 'residential',
    riskLevel: 'LOW',
    totalBins: 22,
    criticalBins: 1,
    assignedDriverName: 'Syed Farooq',
    predictedDailyTons: 3.8,
    currentFillAverage: 42,
    averageFillRatePerHour: 3.6,
    coordinates: { lat: 12.9308, lng: 77.5838 },
    latitude: 12.9308,
    longitude: 77.5838
  },
  {
    id: 'BLR-MALLESHWARAM',
    areaId: 'BLR-MALLESHWARAM',
    name: 'Malleshwaram Sampige Market',
    code: 'ZONE-MLW',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    zoneType: 'market',
    riskLevel: 'CRITICAL',
    totalBins: 26,
    criticalBins: 8,
    assignedDriverName: 'Manjunath Gowda',
    predictedDailyTons: 8.2,
    currentFillAverage: 86,
    averageFillRatePerHour: 9.2,
    coordinates: { lat: 13.0031, lng: 77.5643 },
    latitude: 13.0031,
    longitude: 77.5643
  },
  {
    id: 'BLR-MARATHAHALLI',
    areaId: 'BLR-MARATHAHALLI',
    name: 'Marathahalli Outer Ring Road Junction',
    code: 'ZONE-MRH',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    zoneType: 'commercial',
    riskLevel: 'HIGH',
    totalBins: 25,
    criticalBins: 4,
    assignedDriverName: 'Anand Kumar',
    predictedDailyTons: 5.9,
    currentFillAverage: 69,
    averageFillRatePerHour: 6.2,
    coordinates: { lat: 12.9591, lng: 77.6974 },
    latitude: 12.9591,
    longitude: 77.6974
  },
  {
    id: 'BLR-JPNAGAR',
    areaId: 'BLR-JPNAGAR',
    name: 'JP Nagar Phase 2 & 7',
    code: 'ZONE-JPN',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    zoneType: 'residential',
    riskLevel: 'LOW',
    totalBins: 20,
    criticalBins: 0,
    assignedDriverName: 'Syed Farooq',
    predictedDailyTons: 3.2,
    currentFillAverage: 38,
    averageFillRatePerHour: 3.1,
    coordinates: { lat: 12.9063, lng: 77.5857 },
    latitude: 12.9063,
    longitude: 77.5857
  },
  {
    id: 'BLR-YESHWANTHPUR',
    areaId: 'BLR-YESHWANTHPUR',
    name: 'Yeshwanthpur APMC Wholesale Yard',
    code: 'ZONE-YPR',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    zoneType: 'market',
    riskLevel: 'HIGH',
    totalBins: 28,
    criticalBins: 6,
    assignedDriverName: 'Manjunath Gowda',
    predictedDailyTons: 9.1,
    currentFillAverage: 78,
    averageFillRatePerHour: 8.5,
    coordinates: { lat: 13.0280, lng: 77.5409 },
    latitude: 13.0280,
    longitude: 77.5409
  },
  {
    id: 'BLR-ECITY',
    areaId: 'BLR-ECITY',
    name: 'Electronic City Phase 1 & 2',
    code: 'ZONE-ECT',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    zoneType: 'tech_park',
    riskLevel: 'MODERATE',
    totalBins: 30,
    criticalBins: 3,
    assignedDriverName: 'Raghavendra Rao',
    predictedDailyTons: 5.4,
    currentFillAverage: 52,
    averageFillRatePerHour: 4.8,
    coordinates: { lat: 12.8452, lng: 77.6602 },
    latitude: 12.8452,
    longitude: 77.6602
  },
  {
    id: 'BLR-HEBBAL',
    areaId: 'BLR-HEBBAL',
    name: 'Hebbal Flyover & Manyata Outer Corridor',
    code: 'ZONE-HBL',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    zoneType: 'mixed',
    riskLevel: 'MODERATE',
    totalBins: 22,
    criticalBins: 2,
    assignedDriverName: 'Anand Kumar',
    predictedDailyTons: 4.6,
    currentFillAverage: 61,
    averageFillRatePerHour: 5.3,
    coordinates: { lat: 13.0358, lng: 77.5970 },
    latitude: 13.0358,
    longitude: 77.5970
  }
];

export const INITIAL_BINS: WasteBin[] = [
  // ================= Indiranagar Cluster =================
  {
    id: 'BIN-BLR-101',
    name: '100 Feet Rd & 12th Main Food Street Junction',
    areaId: 'BLR-INDIRANAGAR',
    areaName: 'Indiranagar Commercial Corridor',
    location: {
      lat: 12.9719,
      lng: 77.6412,
      address: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038'
    },
    type: 'general',
    capacityLiters: 1100,
    currentFillPercent: 94,
    predictedFillPercent: 100,
    predictedOverflowTime: '3:30 PM Today',
    overflowRisk: 'CRITICAL',
    status: 'overflow',
    lastCollectionTime: 'Yesterday, 8:00 PM',
    recommendedCollectionTime: 'Within 30 mins',
    priorityScore: 98,
    sensorBattery: 89,
    temperatureC: 25.4,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 38, weightKg: 130 },
      { timestamp: '10:00', fillPercent: 55, weightKg: 190 },
      { timestamp: '12:00', fillPercent: 78, weightKg: 265 },
      { timestamp: '14:00', fillPercent: 94, weightKg: 320 }
    ]
  },
  {
    id: 'BIN-BLR-102',
    name: 'CMH Road Metro Station Gate B',
    areaId: 'BLR-INDIRANAGAR',
    areaName: 'Indiranagar Commercial Corridor',
    location: {
      lat: 12.9784,
      lng: 77.6437,
      address: 'Chinmaya Mission Hospital Rd, Indiranagar, Bengaluru, Karnataka 560038'
    },
    type: 'recyclable',
    capacityLiters: 1100,
    currentFillPercent: 88,
    predictedFillPercent: 98,
    predictedOverflowTime: '4:15 PM Today',
    overflowRisk: 'CRITICAL',
    status: 'high',
    lastCollectionTime: 'Today, 6:30 AM',
    recommendedCollectionTime: 'Immediate (45 mins)',
    priorityScore: 92,
    sensorBattery: 94,
    temperatureC: 24.8,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 28, weightKg: 85 },
      { timestamp: '10:00', fillPercent: 48, weightKg: 150 },
      { timestamp: '12:00', fillPercent: 69, weightKg: 215 },
      { timestamp: '14:00', fillPercent: 88, weightKg: 275 }
    ]
  },
  {
    id: 'BIN-BLR-103',
    name: 'Defence Colony Park & Club Perimeter',
    areaId: 'BLR-INDIRANAGAR',
    areaName: 'Indiranagar Commercial Corridor',
    location: {
      lat: 12.9745,
      lng: 77.6465,
      address: 'Defence Colony, Indiranagar, Bengaluru, Karnataka 560038'
    },
    type: 'organic',
    capacityLiters: 800,
    currentFillPercent: 65,
    predictedFillPercent: 78,
    predictedOverflowTime: 'Tomorrow 9:00 AM',
    overflowRisk: 'MODERATE',
    status: 'moderate',
    lastCollectionTime: 'Today, 7:00 AM',
    recommendedCollectionTime: 'Evening route (6:30 PM)',
    priorityScore: 68,
    sensorBattery: 97,
    temperatureC: 23.5,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 18, weightKg: 45 },
      { timestamp: '10:00', fillPercent: 34, weightKg: 90 },
      { timestamp: '12:00', fillPercent: 50, weightKg: 135 },
      { timestamp: '14:00', fillPercent: 65, weightKg: 175 }
    ]
  },
  {
    id: 'BIN-BLR-104',
    name: 'Domlur Flyover & Old Airport Road Loop',
    areaId: 'BLR-INDIRANAGAR',
    areaName: 'Indiranagar Commercial Corridor',
    location: {
      lat: 12.9610,
      lng: 77.6388,
      address: 'Old Airport Road, Domlur / Indiranagar Junction, Bengaluru, Karnataka 560071'
    },
    type: 'general',
    capacityLiters: 1100,
    currentFillPercent: 82,
    predictedFillPercent: 94,
    predictedOverflowTime: '5:30 PM Today',
    overflowRisk: 'HIGH',
    status: 'high',
    lastCollectionTime: 'Yesterday, 9:00 PM',
    recommendedCollectionTime: 'By 4:30 PM',
    priorityScore: 84,
    sensorBattery: 82,
    temperatureC: 25.1,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 22, weightKg: 70 },
      { timestamp: '10:00', fillPercent: 44, weightKg: 140 },
      { timestamp: '12:00', fillPercent: 64, weightKg: 200 },
      { timestamp: '14:00', fillPercent: 82, weightKg: 260 }
    ]
  },

  // ================= Koramangala Cluster =================
  {
    id: 'BIN-BLR-201',
    name: 'Koramangala 5th Block - Jyoti Nivas College (JNC) Rd',
    areaId: 'BLR-KORAMANGALA',
    areaName: 'Koramangala 5th & 7th Block',
    location: {
      lat: 12.9344,
      lng: 77.6189,
      address: 'Jyoti Nivas College Rd, 5th Block, Koramangala, Bengaluru, Karnataka 560095'
    },
    type: 'general',
    capacityLiters: 1100,
    currentFillPercent: 97,
    predictedFillPercent: 100,
    predictedOverflowTime: '2:45 PM Today',
    overflowRisk: 'CRITICAL',
    status: 'overflow',
    lastCollectionTime: 'Yesterday, 10:00 PM',
    recommendedCollectionTime: 'Emergency Dispatch',
    priorityScore: 99,
    sensorBattery: 76,
    temperatureC: 26.2,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 48, weightKg: 160 },
      { timestamp: '10:00', fillPercent: 68, weightKg: 225 },
      { timestamp: '12:00', fillPercent: 85, weightKg: 280 },
      { timestamp: '14:00', fillPercent: 97, weightKg: 330 }
    ]
  },
  {
    id: 'BIN-BLR-202',
    name: 'Nexus Koramangala (Forum Mall) & Hosur Rd Junction',
    areaId: 'BLR-KORAMANGALA',
    areaName: 'Koramangala 5th & 7th Block',
    location: {
      lat: 12.9348,
      lng: 77.6115,
      address: 'Hosur Main Road, 7th Block, Koramangala, Bengaluru, Karnataka 560095'
    },
    type: 'recyclable',
    capacityLiters: 1100,
    currentFillPercent: 89,
    predictedFillPercent: 98,
    predictedOverflowTime: '3:45 PM Today',
    overflowRisk: 'CRITICAL',
    status: 'high',
    lastCollectionTime: 'Today, 6:00 AM',
    recommendedCollectionTime: 'Immediate (30 mins)',
    priorityScore: 94,
    sensorBattery: 91,
    temperatureC: 25.0,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 30, weightKg: 95 },
      { timestamp: '10:00', fillPercent: 54, weightKg: 170 },
      { timestamp: '12:00', fillPercent: 74, weightKg: 230 },
      { timestamp: '14:00', fillPercent: 89, weightKg: 280 }
    ]
  },
  {
    id: 'BIN-BLR-203',
    name: '80 Feet Road & 4th Block BDA Complex',
    areaId: 'BLR-KORAMANGALA',
    areaName: 'Koramangala 5th & 7th Block',
    location: {
      lat: 12.9332,
      lng: 77.6321,
      address: '80 Feet Rd, 4th Block, Koramangala, Bengaluru, Karnataka 560034'
    },
    type: 'organic',
    capacityLiters: 800,
    currentFillPercent: 86,
    predictedFillPercent: 96,
    predictedOverflowTime: '4:30 PM Today',
    overflowRisk: 'HIGH',
    status: 'high',
    lastCollectionTime: 'Yesterday, 6:00 PM',
    recommendedCollectionTime: 'By 3:30 PM',
    priorityScore: 88,
    sensorBattery: 85,
    temperatureC: 25.8,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 32, weightKg: 85 },
      { timestamp: '10:00', fillPercent: 52, weightKg: 140 },
      { timestamp: '12:00', fillPercent: 72, weightKg: 195 },
      { timestamp: '14:00', fillPercent: 86, weightKg: 235 }
    ]
  },
  {
    id: 'BIN-BLR-204',
    name: 'Sony World Signal & 100 Feet Intermediate Ring Road',
    areaId: 'BLR-KORAMANGALA',
    areaName: 'Koramangala 5th & 7th Block',
    location: {
      lat: 12.9388,
      lng: 77.6300,
      address: '100 Feet Intermediate Ring Rd, Koramangala 4th Block, Bengaluru, Karnataka 560034'
    },
    type: 'general',
    capacityLiters: 1100,
    currentFillPercent: 76,
    predictedFillPercent: 89,
    predictedOverflowTime: '6:00 PM Today',
    overflowRisk: 'HIGH',
    status: 'high',
    lastCollectionTime: 'Today, 8:00 AM',
    recommendedCollectionTime: 'By 5:00 PM',
    priorityScore: 80,
    sensorBattery: 92,
    temperatureC: 24.7,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 20, weightKg: 65 },
      { timestamp: '10:00', fillPercent: 40, weightKg: 130 },
      { timestamp: '12:00', fillPercent: 58, weightKg: 185 },
      { timestamp: '14:00', fillPercent: 76, weightKg: 240 }
    ]
  },

  // ================= HSR Layout Cluster =================
  {
    id: 'BIN-BLR-301',
    name: '27th Main Commercial High Street Corner',
    areaId: 'BLR-HSR',
    areaName: 'HSR Layout Sectors 1-7',
    location: {
      lat: 12.9116,
      lng: 77.6514,
      address: '27th Main Rd, Sector 1, HSR Layout, Bengaluru, Karnataka 560102'
    },
    type: 'general',
    capacityLiters: 1100,
    currentFillPercent: 78,
    predictedFillPercent: 91,
    predictedOverflowTime: '5:45 PM Today',
    overflowRisk: 'HIGH',
    status: 'high',
    lastCollectionTime: 'Today, 7:00 AM',
    recommendedCollectionTime: 'By 4:45 PM',
    priorityScore: 81,
    sensorBattery: 90,
    temperatureC: 24.2,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 15, weightKg: 50 },
      { timestamp: '10:00', fillPercent: 38, weightKg: 120 },
      { timestamp: '12:00', fillPercent: 60, weightKg: 190 },
      { timestamp: '14:00', fillPercent: 78, weightKg: 250 }
    ]
  },
  {
    id: 'BIN-BLR-302',
    name: 'HSR BDA Complex & 14th Main Junction',
    areaId: 'BLR-HSR',
    areaName: 'HSR Layout Sectors 1-7',
    location: {
      lat: 12.9158,
      lng: 77.6367,
      address: '14th Main Rd, Sector 6, HSR Layout, Bengaluru, Karnataka 560102'
    },
    type: 'recyclable',
    capacityLiters: 1100,
    currentFillPercent: 58,
    predictedFillPercent: 71,
    predictedOverflowTime: 'Tomorrow 11:00 AM',
    overflowRisk: 'MODERATE',
    status: 'moderate',
    lastCollectionTime: 'Today, 8:30 AM',
    recommendedCollectionTime: 'Tomorrow morning',
    priorityScore: 59,
    sensorBattery: 96,
    temperatureC: 23.4,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 12, weightKg: 35 },
      { timestamp: '10:00', fillPercent: 28, weightKg: 85 },
      { timestamp: '12:00', fillPercent: 44, weightKg: 135 },
      { timestamp: '14:00', fillPercent: 58, weightKg: 180 }
    ]
  },
  {
    id: 'BIN-BLR-303',
    name: 'Agara Lake Eco-Promenade South Gate',
    areaId: 'BLR-HSR',
    areaName: 'HSR Layout Sectors 1-7',
    location: {
      lat: 12.9228,
      lng: 77.6481,
      address: 'Outer Ring Road, Sector 1, HSR Layout, Bengaluru, Karnataka 560102'
    },
    type: 'organic',
    capacityLiters: 800,
    currentFillPercent: 45,
    predictedFillPercent: 57,
    predictedOverflowTime: 'Tomorrow 2:00 PM',
    overflowRisk: 'LOW',
    status: 'optimal',
    lastCollectionTime: 'Today, 6:00 AM',
    recommendedCollectionTime: 'Regular schedule',
    priorityScore: 42,
    sensorBattery: 98,
    temperatureC: 22.8,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 10, weightKg: 25 },
      { timestamp: '10:00', fillPercent: 22, weightKg: 55 },
      { timestamp: '12:00', fillPercent: 34, weightKg: 90 },
      { timestamp: '14:00', fillPercent: 45, weightKg: 120 }
    ]
  },
  {
    id: 'BIN-BLR-304',
    name: 'Sector 2 Club & 19th Main Crossing',
    areaId: 'BLR-HSR',
    areaName: 'HSR Layout Sectors 1-7',
    location: {
      lat: 12.9094,
      lng: 77.6432,
      address: '19th Main Rd, Sector 2, HSR Layout, Bengaluru, Karnataka 560102'
    },
    type: 'electronic',
    capacityLiters: 600,
    currentFillPercent: 52,
    predictedFillPercent: 64,
    predictedOverflowTime: 'In 2 Days',
    overflowRisk: 'LOW',
    status: 'optimal',
    lastCollectionTime: '2 Days ago',
    recommendedCollectionTime: 'Weekly cycle',
    priorityScore: 48,
    sensorBattery: 91,
    temperatureC: 23.1,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 40, weightKg: 95 },
      { timestamp: '10:00', fillPercent: 44, weightKg: 105 },
      { timestamp: '12:00', fillPercent: 48, weightKg: 115 },
      { timestamp: '14:00', fillPercent: 52, weightKg: 125 }
    ]
  },

  // ================= MG Road / CBD Cluster =================
  {
    id: 'BIN-BLR-401',
    name: 'Church Street Pedestrian Walkway & Brigade Crossing',
    areaId: 'BLR-MGROAD',
    areaName: 'MG Road & Brigade Central Business District',
    location: {
      lat: 12.9749,
      lng: 77.6074,
      address: 'Church Street, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560001'
    },
    type: 'general',
    capacityLiters: 1100,
    currentFillPercent: 96,
    predictedFillPercent: 100,
    predictedOverflowTime: '2:30 PM Today',
    overflowRisk: 'CRITICAL',
    status: 'overflow',
    lastCollectionTime: 'Yesterday, 11:30 PM',
    recommendedCollectionTime: 'Emergency Dispatch',
    priorityScore: 99,
    sensorBattery: 87,
    temperatureC: 25.9,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 45, weightKg: 150 },
      { timestamp: '10:00', fillPercent: 66, weightKg: 220 },
      { timestamp: '12:00', fillPercent: 84, weightKg: 280 },
      { timestamp: '14:00', fillPercent: 96, weightKg: 325 }
    ]
  },
  {
    id: 'BIN-BLR-402',
    name: 'MG Road Metro Station East Concourse',
    areaId: 'BLR-MGROAD',
    areaName: 'MG Road & Brigade Central Business District',
    location: {
      lat: 12.9756,
      lng: 77.6112,
      address: 'MG Road, Craig Park Layout, Bengaluru, Karnataka 560001'
    },
    type: 'recyclable',
    capacityLiters: 1100,
    currentFillPercent: 84,
    predictedFillPercent: 95,
    predictedOverflowTime: '4:45 PM Today',
    overflowRisk: 'HIGH',
    status: 'high',
    lastCollectionTime: 'Today, 7:00 AM',
    recommendedCollectionTime: 'By 3:45 PM',
    priorityScore: 87,
    sensorBattery: 93,
    temperatureC: 24.6,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 25, weightKg: 75 },
      { timestamp: '10:00', fillPercent: 46, weightKg: 145 },
      { timestamp: '12:00', fillPercent: 68, weightKg: 210 },
      { timestamp: '14:00', fillPercent: 84, weightKg: 260 }
    ]
  },
  {
    id: 'BIN-BLR-403',
    name: 'Commercial Street Central Market Plaza',
    areaId: 'BLR-MGROAD',
    areaName: 'MG Road & Brigade Central Business District',
    location: {
      lat: 12.9822,
      lng: 77.6083,
      address: 'Commercial Street, Tasker Town, Shivajinagar, Bengaluru, Karnataka 560001'
    },
    type: 'general',
    capacityLiters: 1100,
    currentFillPercent: 91,
    predictedFillPercent: 99,
    predictedOverflowTime: '3:15 PM Today',
    overflowRisk: 'CRITICAL',
    status: 'overflow',
    lastCollectionTime: 'Yesterday, 8:00 PM',
    recommendedCollectionTime: 'Within 45 mins',
    priorityScore: 95,
    sensorBattery: 79,
    temperatureC: 26.0,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 40, weightKg: 130 },
      { timestamp: '10:00', fillPercent: 60, weightKg: 195 },
      { timestamp: '12:00', fillPercent: 79, weightKg: 260 },
      { timestamp: '14:00', fillPercent: 91, weightKg: 305 }
    ]
  },
  {
    id: 'BIN-BLR-404',
    name: 'Cubbon Park Kasturba Road Gate',
    areaId: 'BLR-MGROAD',
    areaName: 'MG Road & Brigade Central Business District',
    location: {
      lat: 12.9781,
      lng: 77.5997,
      address: 'Kasturba Rd, Sampangi Rama Nagar, Bengaluru, Karnataka 560001'
    },
    type: 'organic',
    capacityLiters: 800,
    currentFillPercent: 46,
    predictedFillPercent: 58,
    predictedOverflowTime: 'Tomorrow 1:00 PM',
    overflowRisk: 'LOW',
    status: 'optimal',
    lastCollectionTime: 'Today, 8:00 AM',
    recommendedCollectionTime: 'Regular schedule',
    priorityScore: 44,
    sensorBattery: 99,
    temperatureC: 22.4,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 10, weightKg: 25 },
      { timestamp: '10:00', fillPercent: 22, weightKg: 60 },
      { timestamp: '12:00', fillPercent: 35, weightKg: 95 },
      { timestamp: '14:00', fillPercent: 46, weightKg: 125 }
    ]
  },

  // ================= Whitefield Cluster =================
  {
    id: 'BIN-BLR-501',
    name: 'ITPL Main Gate & Pattandur Agrahara Metro',
    areaId: 'BLR-WHITEFIELD',
    areaName: 'Whitefield ITPL & Tech Parks',
    location: {
      lat: 12.9863,
      lng: 77.7377,
      address: 'International Tech Park, ITPL Main Rd, Whitefield, Bengaluru, Karnataka 560066'
    },
    type: 'electronic',
    capacityLiters: 600,
    currentFillPercent: 92,
    predictedFillPercent: 99,
    predictedOverflowTime: '3:45 PM Today',
    overflowRisk: 'CRITICAL',
    status: 'overflow',
    lastCollectionTime: 'Yesterday, 4:00 PM',
    recommendedCollectionTime: 'Immediate (30 mins)',
    priorityScore: 96,
    sensorBattery: 81,
    temperatureC: 24.5,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 42, weightKg: 110 },
      { timestamp: '10:00', fillPercent: 62, weightKg: 165 },
      { timestamp: '12:00', fillPercent: 78, weightKg: 210 },
      { timestamp: '14:00', fillPercent: 92, weightKg: 250 }
    ]
  },
  {
    id: 'BIN-BLR-502',
    name: 'Forum Shantiniketan Commercial Promenade',
    areaId: 'BLR-WHITEFIELD',
    areaName: 'Whitefield ITPL & Tech Parks',
    location: {
      lat: 12.9904,
      lng: 77.7289,
      address: 'ITPL Main Rd, Thigalarapalya, Whitefield, Bengaluru, Karnataka 560067'
    },
    type: 'general',
    capacityLiters: 1100,
    currentFillPercent: 81,
    predictedFillPercent: 93,
    predictedOverflowTime: '5:15 PM Today',
    overflowRisk: 'HIGH',
    status: 'high',
    lastCollectionTime: 'Today, 6:00 AM',
    recommendedCollectionTime: 'By 4:15 PM',
    priorityScore: 85,
    sensorBattery: 88,
    temperatureC: 24.8,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 20, weightKg: 65 },
      { timestamp: '10:00', fillPercent: 42, weightKg: 135 },
      { timestamp: '12:00', fillPercent: 64, weightKg: 205 },
      { timestamp: '14:00', fillPercent: 81, weightKg: 260 }
    ]
  },
  {
    id: 'BIN-BLR-503',
    name: 'Hope Farm Junction Traffic Concourse',
    areaId: 'BLR-WHITEFIELD',
    areaName: 'Whitefield ITPL & Tech Parks',
    location: {
      lat: 12.9840,
      lng: 77.7521,
      address: 'Hope Farm Cir, Whitefield, Bengaluru, Karnataka 560066'
    },
    type: 'recyclable',
    capacityLiters: 1100,
    currentFillPercent: 73,
    predictedFillPercent: 86,
    predictedOverflowTime: '6:30 PM Today',
    overflowRisk: 'MODERATE',
    status: 'moderate',
    lastCollectionTime: 'Yesterday, 7:00 PM',
    recommendedCollectionTime: 'Evening route',
    priorityScore: 75,
    sensorBattery: 92,
    temperatureC: 25.1,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 25, weightKg: 80 },
      { timestamp: '10:00', fillPercent: 44, weightKg: 135 },
      { timestamp: '12:00', fillPercent: 59, weightKg: 185 },
      { timestamp: '14:00', fillPercent: 73, weightKg: 230 }
    ]
  },

  // ================= Malleshwaram & Yeshwanthpur Cluster =================
  {
    id: 'BIN-BLR-701',
    name: 'Sampige Road & 8th Cross Traditional Market',
    areaId: 'BLR-MALLESHWARAM',
    areaName: 'Malleshwaram Sampige Market',
    location: {
      lat: 12.9995,
      lng: 77.5708,
      address: 'Sampige Rd, 8th Cross, Malleshwaram, Bengaluru, Karnataka 560003'
    },
    type: 'organic',
    capacityLiters: 1100,
    currentFillPercent: 98,
    predictedFillPercent: 100,
    predictedOverflowTime: '2:15 PM Today',
    overflowRisk: 'CRITICAL',
    status: 'overflow',
    lastCollectionTime: 'Yesterday, 2:00 PM',
    recommendedCollectionTime: 'Emergency Dispatch',
    priorityScore: 100,
    sensorBattery: 72,
    temperatureC: 26.5,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 55, weightKg: 190 },
      { timestamp: '10:00', fillPercent: 75, weightKg: 260 },
      { timestamp: '12:00', fillPercent: 90, weightKg: 310 },
      { timestamp: '14:00', fillPercent: 98, weightKg: 340 }
    ]
  },
  {
    id: 'BIN-BLR-702',
    name: '18th Cross Margosa Road & Bus Terminus',
    areaId: 'BLR-MALLESHWARAM',
    areaName: 'Malleshwaram Sampige Market',
    location: {
      lat: 13.0094,
      lng: 77.5678,
      address: 'Margosa Rd, 18th Cross, Malleshwaram, Bengaluru, Karnataka 560055'
    },
    type: 'general',
    capacityLiters: 1100,
    currentFillPercent: 83,
    predictedFillPercent: 94,
    predictedOverflowTime: '5:00 PM Today',
    overflowRisk: 'HIGH',
    status: 'high',
    lastCollectionTime: 'Today, 6:00 AM',
    recommendedCollectionTime: 'By 4:00 PM',
    priorityScore: 86,
    sensorBattery: 89,
    temperatureC: 24.3,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 22, weightKg: 70 },
      { timestamp: '10:00', fillPercent: 45, weightKg: 145 },
      { timestamp: '12:00', fillPercent: 66, weightKg: 210 },
      { timestamp: '14:00', fillPercent: 83, weightKg: 265 }
    ]
  },
  {
    id: 'BIN-BLR-703',
    name: 'Yeshwanthpur APMC Wholesale Produce Yard Gate 1',
    areaId: 'BLR-YESHWANTHPUR',
    areaName: 'Yeshwanthpur APMC Wholesale Yard',
    location: {
      lat: 13.0245,
      lng: 77.5451,
      address: 'APMC Yard, Tumkur Rd, Yeshwanthpur, Bengaluru, Karnataka 560022'
    },
    type: 'organic',
    capacityLiters: 1500,
    currentFillPercent: 95,
    predictedFillPercent: 100,
    predictedOverflowTime: '2:50 PM Today',
    overflowRisk: 'CRITICAL',
    status: 'overflow',
    lastCollectionTime: 'Yesterday, 8:00 PM',
    recommendedCollectionTime: 'Within 30 mins',
    priorityScore: 97,
    sensorBattery: 80,
    temperatureC: 27.1,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 50, weightKg: 210 },
      { timestamp: '10:00', fillPercent: 70, weightKg: 295 },
      { timestamp: '12:00', fillPercent: 86, weightKg: 360 },
      { timestamp: '14:00', fillPercent: 95, weightKg: 400 }
    ]
  },

  // ================= Jayanagar & JP Nagar Cluster =================
  {
    id: 'BIN-BLR-601',
    name: 'Jayanagar 4th Block Shopping Complex Plaza',
    areaId: 'BLR-JAYANAGAR',
    areaName: 'Jayanagar 4th Block & Cultural Hub',
    location: {
      lat: 12.9298,
      lng: 77.5833,
      address: '4th Block, Jayanagar, Bengaluru, Karnataka 560011'
    },
    type: 'general',
    capacityLiters: 1100,
    currentFillPercent: 48,
    predictedFillPercent: 60,
    predictedOverflowTime: 'Tomorrow 11:30 AM',
    overflowRisk: 'LOW',
    status: 'optimal',
    lastCollectionTime: 'Today, 8:00 AM',
    recommendedCollectionTime: 'Tomorrow morning',
    priorityScore: 46,
    sensorBattery: 96,
    temperatureC: 23.0,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 10, weightKg: 30 },
      { timestamp: '10:00', fillPercent: 24, weightKg: 75 },
      { timestamp: '12:00', fillPercent: 37, weightKg: 115 },
      { timestamp: '14:00', fillPercent: 48, weightKg: 150 }
    ]
  },
  {
    id: 'BIN-BLR-602',
    name: 'JP Nagar 2nd Phase - 24th Main Cultural Street',
    areaId: 'BLR-JPNAGAR',
    areaName: 'JP Nagar Phase 2 & 7',
    location: {
      lat: 12.9102,
      lng: 77.5861,
      address: '24th Main Rd, Phase 2, JP Nagar, Bengaluru, Karnataka 560078'
    },
    type: 'recyclable',
    capacityLiters: 1100,
    currentFillPercent: 38,
    predictedFillPercent: 50,
    predictedOverflowTime: 'In 2 Days',
    overflowRisk: 'LOW',
    status: 'optimal',
    lastCollectionTime: 'Today, 9:00 AM',
    recommendedCollectionTime: 'Regular schedule',
    priorityScore: 35,
    sensorBattery: 99,
    temperatureC: 22.8,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 8, weightKg: 20 },
      { timestamp: '10:00', fillPercent: 18, weightKg: 50 },
      { timestamp: '12:00', fillPercent: 28, weightKg: 85 },
      { timestamp: '14:00', fillPercent: 38, weightKg: 115 }
    ]
  },

  // ================= Marathahalli Cluster =================
  {
    id: 'BIN-BLR-801',
    name: 'Marathahalli Bridge & Outer Ring Road Interchange',
    areaId: 'BLR-MARATHAHALLI',
    areaName: 'Marathahalli Outer Ring Road Junction',
    location: {
      lat: 12.9554,
      lng: 77.7011,
      address: 'Outer Ring Rd, Marathahalli Village, Bengaluru, Karnataka 560037'
    },
    type: 'general',
    capacityLiters: 1100,
    currentFillPercent: 77,
    predictedFillPercent: 90,
    predictedOverflowTime: '5:30 PM Today',
    overflowRisk: 'HIGH',
    status: 'high',
    lastCollectionTime: 'Today, 7:30 AM',
    recommendedCollectionTime: 'By 4:30 PM',
    priorityScore: 82,
    sensorBattery: 86,
    temperatureC: 25.3,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 18, weightKg: 55 },
      { timestamp: '10:00', fillPercent: 39, weightKg: 125 },
      { timestamp: '12:00', fillPercent: 58, weightKg: 185 },
      { timestamp: '14:00', fillPercent: 77, weightKg: 245 }
    ]
  },
  {
    id: 'BIN-BLR-802',
    name: 'Kalamandir Service Road & Spice Garden Concourse',
    areaId: 'BLR-MARATHAHALLI',
    areaName: 'Marathahalli Outer Ring Road Junction',
    location: {
      lat: 12.9587,
      lng: 77.7075,
      address: 'Varthur Rd, Spice Garden, Marathahalli, Bengaluru, Karnataka 560037'
    },
    type: 'organic',
    capacityLiters: 800,
    currentFillPercent: 71,
    predictedFillPercent: 84,
    predictedOverflowTime: '6:15 PM Today',
    overflowRisk: 'MODERATE',
    status: 'moderate',
    lastCollectionTime: 'Today, 8:00 AM',
    recommendedCollectionTime: 'Evening route',
    priorityScore: 73,
    sensorBattery: 91,
    temperatureC: 24.9,
    historicalReadings: [
      { timestamp: '08:00', fillPercent: 15, weightKg: 40 },
      { timestamp: '10:00', fillPercent: 35, weightKg: 95 },
      { timestamp: '12:00', fillPercent: 54, weightKg: 145 },
      { timestamp: '14:00', fillPercent: 71, weightKg: 190 }
    ]
  }
];

export const INITIAL_DRIVERS: DriverProfile[] = [
  {
    id: 'DRV-BLR-01',
    name: 'Raghavendra Rao',
    email: 'raghavendra.bbmp@bengaluru.gov.in',
    phone: '+91 98450 12891',
    vehicleId: 'VEH-BBMP-12',
    vehiclePlate: 'KA-01-MJ-4821',
    vehicleType: 'Heavy Compactor (15 Ton)',
    capacityTons: 15,
    status: 'ACTIVE',
    currentRouteId: 'ROUTE-BLR-INDIRANAGAR-12',
    completedRoutesToday: 1,
    collectedWeightKgToday: 4650
  },
  {
    id: 'DRV-BLR-02',
    name: 'Manjunath Gowda',
    email: 'manjunath.g@bengaluru.gov.in',
    phone: '+91 99001 44321',
    vehicleId: 'VEH-BBMP-07',
    vehiclePlate: 'KA-05-EV-3904',
    vehicleType: 'Eco Electric Truck (8 Ton)',
    capacityTons: 8,
    status: 'ON_DUTY',
    currentRouteId: 'ROUTE-BLR-KORAMANGALA-04',
    completedRoutesToday: 2,
    collectedWeightKgToday: 3400
  },
  {
    id: 'DRV-BLR-03',
    name: 'Syed Farooq',
    email: 'syed.farooq@bengaluru.gov.in',
    phone: '+91 97412 88712',
    vehicleId: 'VEH-BBMP-05',
    vehiclePlate: 'KA-03-SL-7712',
    vehicleType: 'Side Loader (10 Ton)',
    capacityTons: 10,
    status: 'ACTIVE',
    currentRouteId: 'ROUTE-BLR-HSR-01',
    completedRoutesToday: 1,
    collectedWeightKgToday: 2150
  },
  {
    id: 'DRV-BLR-04',
    name: 'Anand Kumar',
    email: 'anand.k@bengaluru.gov.in',
    phone: '+91 98802 99014',
    vehicleId: 'VEH-BBMP-09',
    vehiclePlate: 'KA-04-CP-1108',
    vehicleType: 'Medium Compactor (12 Ton)',
    capacityTons: 12,
    status: 'ACTIVE',
    currentRouteId: 'ROUTE-BLR-CBD-02',
    completedRoutesToday: 1,
    collectedWeightKgToday: 2900
  }
];

export const INITIAL_ROUTES: CollectionRoute[] = [
  {
    id: 'ROUTE-BLR-INDIRANAGAR-12',
    name: 'AI Priority Route 12 - Indiranagar Critical Corridor',
    areaId: 'BLR-INDIRANAGAR',
    areaName: 'Indiranagar Commercial Corridor',
    assignedDriverId: 'DRV-BLR-01',
    assignedDriverName: 'Raghavendra Rao',
    assignedVehicleId: 'VEH-BBMP-12',
    vehiclePlate: 'KA-01-MJ-4821',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    totalDistanceKm: 4.6,
    estimatedTimeMinutes: 36,
    co2SavingsKg: 5.4,
    completedStopsCount: 1,
    aiRecommendationReason: 'Predicted rapid overflow at 100 Feet Rd food hub and CMH Metro concourse before evening pedestrian surge. Avoids Old Airport Rd bottlenecks.',
    startTime: '02:00 PM',
    lastUpdated: 'Just now',
    stops: [
      {
        id: 'STOP-BLR-01',
        binId: 'BIN-BLR-101',
        sequence: 1,
        binName: '100 Feet Rd & 12th Main Food Street Junction',
        address: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
        lat: 12.9719,
        lng: 77.6412,
        currentFillPercent: 94,
        predictedFillPercent: 100,
        overflowRisk: 'CRITICAL',
        status: 'PENDING',
        priority: 'CRITICAL',
        estimatedKg: 320
      },
      {
        id: 'STOP-BLR-02',
        binId: 'BIN-BLR-102',
        sequence: 2,
        binName: 'CMH Road Metro Station Gate B',
        address: 'Chinmaya Mission Hospital Rd, Indiranagar, Bengaluru, Karnataka 560038',
        lat: 12.9784,
        lng: 77.6437,
        currentFillPercent: 88,
        predictedFillPercent: 98,
        overflowRisk: 'CRITICAL',
        status: 'PENDING',
        priority: 'CRITICAL',
        estimatedKg: 275
      },
      {
        id: 'STOP-BLR-03',
        binId: 'BIN-BLR-103',
        sequence: 3,
        binName: 'Defence Colony Park & Club Perimeter',
        address: 'Defence Colony, Indiranagar, Bengaluru, Karnataka 560038',
        lat: 12.9745,
        lng: 77.6465,
        currentFillPercent: 65,
        predictedFillPercent: 78,
        overflowRisk: 'MODERATE',
        status: 'PENDING',
        priority: 'MODERATE',
        estimatedKg: 175
      },
      {
        id: 'STOP-BLR-04',
        binId: 'BIN-BLR-104',
        sequence: 4,
        binName: 'Domlur Flyover & Old Airport Road Loop',
        address: 'Old Airport Road, Domlur / Indiranagar Junction, Bengaluru, Karnataka 560071',
        lat: 12.9610,
        lng: 77.6388,
        currentFillPercent: 82,
        predictedFillPercent: 94,
        overflowRisk: 'HIGH',
        status: 'PENDING',
        priority: 'HIGH',
        estimatedKg: 260
      }
    ]
  },
  {
    id: 'ROUTE-BLR-KORAMANGALA-04',
    name: 'Route 04 - Koramangala 5th Block & JNC Commercial Loop',
    areaId: 'BLR-KORAMANGALA',
    areaName: 'Koramangala 5th & 7th Block',
    assignedDriverId: 'DRV-BLR-02',
    assignedDriverName: 'Manjunath Gowda',
    assignedVehicleId: 'VEH-BBMP-07',
    vehiclePlate: 'KA-05-EV-3904',
    status: 'SCHEDULED',
    priority: 'HIGH',
    totalDistanceKm: 3.8,
    estimatedTimeMinutes: 28,
    co2SavingsKg: 3.9,
    completedStopsCount: 0,
    aiRecommendationReason: 'Synchronized traversal prioritizing 5th Block restaurant strip before peak 3:00 PM kitchen shift turnaround.',
    startTime: '03:15 PM',
    lastUpdated: '10 mins ago',
    stops: [
      {
        id: 'STOP-BLR-05',
        binId: 'BIN-BLR-201',
        sequence: 1,
        binName: 'Koramangala 5th Block - Jyoti Nivas College (JNC) Rd',
        address: 'Jyoti Nivas College Rd, 5th Block, Koramangala, Bengaluru, Karnataka 560095',
        lat: 12.9344,
        lng: 77.6189,
        currentFillPercent: 97,
        predictedFillPercent: 100,
        overflowRisk: 'CRITICAL',
        status: 'PENDING',
        priority: 'CRITICAL',
        estimatedKg: 330
      },
      {
        id: 'STOP-BLR-06',
        binId: 'BIN-BLR-202',
        sequence: 2,
        binName: 'Nexus Koramangala (Forum Mall) & Hosur Rd Junction',
        address: 'Hosur Main Road, 7th Block, Koramangala, Bengaluru, Karnataka 560095',
        lat: 12.9348,
        lng: 77.6115,
        currentFillPercent: 89,
        predictedFillPercent: 98,
        overflowRisk: 'CRITICAL',
        status: 'PENDING',
        priority: 'CRITICAL',
        estimatedKg: 280
      },
      {
        id: 'STOP-BLR-07',
        binId: 'BIN-BLR-203',
        sequence: 3,
        binName: '80 Feet Road & 4th Block BDA Complex',
        address: '80 Feet Rd, 4th Block, Koramangala, Bengaluru, Karnataka 560034',
        lat: 12.9332,
        lng: 77.6321,
        currentFillPercent: 86,
        predictedFillPercent: 96,
        overflowRisk: 'HIGH',
        status: 'PENDING',
        priority: 'HIGH',
        estimatedKg: 235
      }
    ]
  },
  {
    id: 'ROUTE-BLR-CBD-02',
    name: 'Route 02 - MG Road & Church Street High Street Sweep',
    areaId: 'BLR-MGROAD',
    areaName: 'MG Road & Brigade Central Business District',
    assignedDriverId: 'DRV-BLR-04',
    assignedDriverName: 'Anand Kumar',
    assignedVehicleId: 'VEH-BBMP-09',
    vehiclePlate: 'KA-04-CP-1108',
    status: 'SCHEDULED',
    priority: 'URGENT',
    totalDistanceKm: 3.2,
    estimatedTimeMinutes: 25,
    co2SavingsKg: 4.1,
    completedStopsCount: 0,
    aiRecommendationReason: 'Church Street & Commercial Street shopping hubs approaching capacity.',
    startTime: '04:00 PM',
    lastUpdated: '15 mins ago',
    stops: [
      {
        id: 'STOP-BLR-08',
        binId: 'BIN-BLR-401',
        sequence: 1,
        binName: 'Church Street Pedestrian Walkway & Brigade Crossing',
        address: 'Church Street, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560001',
        lat: 12.9749,
        lng: 77.6074,
        currentFillPercent: 96,
        predictedFillPercent: 100,
        overflowRisk: 'CRITICAL',
        status: 'PENDING',
        priority: 'CRITICAL',
        estimatedKg: 325
      },
      {
        id: 'STOP-BLR-09',
        binId: 'BIN-BLR-403',
        sequence: 2,
        binName: 'Commercial Street Central Market Plaza',
        address: 'Commercial Street, Tasker Town, Shivajinagar, Bengaluru, Karnataka 560001',
        lat: 12.9822,
        lng: 77.6083,
        currentFillPercent: 91,
        predictedFillPercent: 99,
        overflowRisk: 'CRITICAL',
        status: 'PENDING',
        priority: 'CRITICAL',
        estimatedKg: 305
      }
    ]
  }
];

export const INITIAL_REPORTS: CitizenReport[] = [
  {
    id: 'REP-BLR-129',
    reportType: 'overflow',
    location: {
      lat: 12.9719,
      lng: 77.6412,
      address: '100 Feet Road, Near 12th Main Signal, Indiranagar, Bengaluru, Karnataka'
    },
    areaName: 'Indiranagar Commercial Corridor',
    binId: 'BIN-BLR-101',
    description: 'Food takeaway boxes and coconut shells overflowing onto the footpath near the restaurant cluster. Pedestrians having to walk on the road.',
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    status: 'VERIFIED',
    urgency: 'critical',
    timestamp: '5 mins ago',
    reportedBy: 'Kavitha S. (Indiranagar Resident)',
    aiAnalysis: {
      severity: 'Critical Commercial Overflow',
      confidence: 0.96,
      suggestedAction: 'Append to Active BBMP Indiranagar Route 12 immediately',
      verifiedLikelihood: 0.97
    }
  },
  {
    id: 'REP-BLR-124',
    reportType: 'damaged',
    location: {
      lat: 12.9784,
      lng: 77.6437,
      address: 'CMH Road Metro Station Concourse Gate B, Bengaluru, Karnataka'
    },
    areaName: 'Indiranagar Commercial Corridor',
    binId: 'BIN-BLR-102',
    description: 'Ultrasonic sensor enclosure lid is partially damaged and foot pedal mechanism is stuck ajar.',
    photoUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80',
    status: 'PENDING_REVIEW',
    urgency: 'medium',
    timestamp: '1 hour ago',
    reportedBy: 'Aditya Hegde (Metro Commuter)',
    aiAnalysis: {
      severity: 'Mechanical Hardware Defect',
      confidence: 0.89,
      suggestedAction: 'Dispatch BBMP Sensor Maintenance Crew in 16:00 shift',
      verifiedLikelihood: 0.92
    }
  },
  {
    id: 'REP-BLR-118',
    reportType: 'illegal_dumping',
    location: {
      lat: 12.9995,
      lng: 77.5708,
      address: 'Sampige Road rear alley, Malleshwaram, Bengaluru, Karnataka'
    },
    areaName: 'Malleshwaram Sampige Market',
    description: 'Bulk packaging carton boxes and rotten vegetable sacks dumped behind flower stalls after morning wholesale auction.',
    photoUrl: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=600&q=80',
    status: 'DISPATCHED',
    urgency: 'high',
    timestamp: '2 hours ago',
    reportedBy: 'Malleshwaram Merchants Forum',
    aiAnalysis: {
      severity: 'Bulk Organic Hazard & Street Obstruction',
      confidence: 0.95,
      suggestedAction: 'Deploy BBMP Heavy Tipper Truck from Central Depot',
      verifiedLikelihood: 0.98
    }
  }
];

export const HISTORICAL_CHART_DATA = [
  { day: 'Mon', actualTons: 14.2, predictedTons: 14.0, efficiency: 93, co2Saved: 48 },
  { day: 'Tue', actualTons: 15.6, predictedTons: 15.2, efficiency: 95, co2Saved: 52 },
  { day: 'Wed', actualTons: 16.1, predictedTons: 15.9, efficiency: 94, co2Saved: 54 },
  { day: 'Thu', actualTons: 16.8, predictedTons: 16.5, efficiency: 96, co2Saved: 59 },
  { day: 'Fri', actualTons: 19.4, predictedTons: 19.1, efficiency: 91, co2Saved: 68 },
  { day: 'Sat', actualTons: 22.8, predictedTons: 22.4, efficiency: 97, co2Saved: 76 },
  { day: 'Sun (Today)', actualTons: 16.4, predictedTons: 17.1, efficiency: 94.8, co2Saved: 58 }
];

export const HOURLY_GENERATION_DATA = [
  { time: '06:00', general: 1.2, recyclable: 0.6, organic: 1.4, predicted: 3.2 },
  { time: '08:00', general: 2.5, recyclable: 1.4, organic: 2.8, predicted: 6.7 },
  { time: '10:00', general: 3.8, recyclable: 2.2, organic: 3.9, predicted: 9.9 },
  { time: '12:00', general: 5.6, recyclable: 3.1, organic: 4.8, predicted: 13.5 },
  { time: '14:00', general: 4.8, recyclable: 2.8, organic: 4.1, predicted: 11.7 },
  { time: '16:00', general: 4.2, recyclable: 2.5, organic: 3.6, predicted: 10.3 },
  { time: '18:00', general: 5.9, recyclable: 3.4, organic: 5.2, predicted: 14.5 },
  { time: '20:00', general: 3.8, recyclable: 2.1, organic: 3.0, predicted: 8.9 }
];
