// ============================================================
// FarmSeva Mock Data Seed File
// All data is fictional demo data centered in Lucknow, UP
// ============================================================

export const CROPS = ['Wheat', 'Paddy', 'Potato', 'Sugarcane']
export const TASKS = ['Ploughing', 'Sowing', 'Spraying', 'Harvesting', 'Transport']
export const TASK_ICONS = {
  Ploughing: '🌾',
  Sowing: '🌱',
  Spraying: '💧',
  Harvesting: '🌾',
  Transport: '🚛',
}
export const TASK_DESCRIPTIONS = {
  Ploughing: 'Tilling & soil preparation',
  Sowing: 'Seed planting & drilling',
  Spraying: 'Pesticide & fertilizer application',
  Harvesting: 'Crop cutting & collection',
  Transport: 'Hauling produce & materials',
}

export const EQUIPMENT_CATEGORIES = [
  { id: 'tractors', label: 'Tractors', icon: '🚜', count: 4 },
  { id: 'harvesters', label: 'Harvesters', icon: '🌾', count: 2 },
  { id: 'seeders', label: 'Seeders & Drills', icon: '🌱', count: 2 },
  { id: 'sprayers', label: 'Sprayers', icon: '💧', count: 2 },
  { id: 'rotavators', label: 'Rotavators', icon: '⚙️', count: 2 },
  { id: 'cultivators', label: 'Cultivators', icon: '🔧', count: 1 },
  { id: 'trailers', label: 'Trailers', icon: '🚛', count: 1 },
  { id: 'other', label: 'Other Tools', icon: '🛠️', count: 2 },
]

export const CATEGORY_TO_MACHINE_CATEGORY = {
  tractors: 'Tractor',
  harvesters: 'Harvester',
  seeders: 'Seeder',
  sprayers: 'Sprayer',
  rotavators: 'Rotavator',
  cultivators: 'Cultivator',
  trailers: 'Trailer',
  other: 'Other',
}

export const farmers = [
  { id: 'f1', name: 'Ramesh Kumar', location: 'Lucknow, UP', phone: '9876500001' },
  { id: 'f2', name: 'Sunita Devi', location: 'Kanpur, UP', phone: '9876500002' },
]

export const providers = [
  { id: 'p1', name: 'Singh Agro Services', location: 'Aliganj, Lucknow', rating: 4.7 },
  { id: 'p2', name: 'Gupta Farm Equipment', location: 'Gomti Nagar, Lucknow', rating: 4.5 },
  { id: 'p3', name: 'Lucknow CHC Centre', location: 'Chinhat, Lucknow', rating: 4.2 },
  { id: 'p4', name: 'Verma Tractors & Tools', location: 'Kakori, Lucknow', rating: 4.9 },
  { id: 'p5', name: 'Sharma Machinery', location: 'Malihabad, Lucknow', rating: 4.4 },
]

const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
const dayAfter = new Date()
dayAfter.setDate(dayAfter.getDate() + 2)
const fmt = (d) => d.toISOString().split('T')[0]

export const machines = [
  // --- Combine Harvesters ---
  {
    id: 'm1',
    name: 'Claas Crop Tiger Combine Harvester',
    category: 'Harvester',
    providerId: 'p1',
    suitableFor: ['Harvesting'],
    suitableCrops: ['Wheat', 'Paddy'],
    location: 'Aliganj, Lucknow',
    distanceKm: 3.2,
    pricePerUnit: 900,
    pricingUnit: 'per acre',
    rating: 4.8,
    operatorAvailable: true,
    available: true,
    imageUrl: null,
    specs: ['18.5 HP', '1.8m Cutting Width', 'GPS Enabled'],
    availability: [
      { date: fmt(tomorrow), timeSlots: ['08:00', '10:00', '14:00'] },
      { date: fmt(dayAfter), timeSlots: ['08:00', '10:00'] },
    ],
  },
  {
    id: 'm2',
    name: 'Preet 987 Combine Harvester',
    category: 'Harvester',
    providerId: 'p3',
    suitableFor: ['Harvesting'],
    suitableCrops: ['Wheat', 'Paddy', 'Sugarcane'],
    location: 'Chinhat, Lucknow',
    distanceKm: 8.5,
    pricePerUnit: 750,
    pricingUnit: 'per acre',
    rating: 4.2,
    operatorAvailable: true,
    available: true,
    imageUrl: null,
    specs: ['110 HP', '2.4m Cutting Width', 'Straw Chopper'],
    availability: [
      { date: fmt(tomorrow), timeSlots: ['08:00', '10:00', '12:00', '14:00'] },
      { date: fmt(dayAfter), timeSlots: ['08:00', '10:00', '14:00'] },
    ],
  },
  // --- Tractors ---
  {
    id: 'm3',
    name: 'Mahindra 575 DI Tractor',
    category: 'Tractor',
    providerId: 'p2',
    suitableFor: ['Ploughing', 'Sowing', 'Transport'],
    suitableCrops: ['Wheat', 'Paddy', 'Potato', 'Sugarcane'],
    location: 'Gomti Nagar, Lucknow',
    distanceKm: 5.1,
    pricePerUnit: 600,
    pricingUnit: 'per hour',
    rating: 4.6,
    operatorAvailable: true,
    available: true,
    imageUrl: null,
    specs: ['45 HP', '2WD', 'Power Steering'],
    availability: [
      { date: fmt(tomorrow), timeSlots: ['08:00', '10:00', '12:00', '14:00', '16:00'] },
      { date: fmt(dayAfter), timeSlots: ['08:00', '10:00', '12:00'] },
    ],
  },
  {
    id: 'm4',
    name: 'Mahindra 265 DI Power Plus',
    category: 'Tractor',
    providerId: 'p4',
    suitableFor: ['Ploughing', 'Sowing', 'Transport'],
    suitableCrops: ['Wheat', 'Potato', 'Sugarcane'],
    location: 'Kakori, Lucknow',
    distanceKm: 12.0,
    pricePerUnit: 450,
    pricingUnit: 'per hour',
    rating: 4.9,
    operatorAvailable: true,
    available: true,
    imageUrl: null,
    specs: ['30 HP', '2WD', 'Ergonomic Cabin'],
    availability: [
      { date: fmt(tomorrow), timeSlots: ['08:00', '10:00', '14:00', '16:00'] },
      { date: fmt(dayAfter), timeSlots: ['10:00', '14:00'] },
    ],
  },
  {
    id: 'm5',
    name: 'Swaraj 855 FE Tractor',
    category: 'Tractor',
    providerId: 'p1',
    suitableFor: ['Ploughing', 'Transport'],
    suitableCrops: ['Wheat', 'Paddy', 'Sugarcane'],
    location: 'Aliganj, Lucknow',
    distanceKm: 3.2,
    pricePerUnit: 550,
    pricingUnit: 'per hour',
    rating: 4.5,
    operatorAvailable: false,
    available: true,
    imageUrl: null,
    specs: ['55 HP', '4WD Available', 'Oil Immersed Brakes'],
    availability: [
      { date: fmt(tomorrow), timeSlots: ['08:00', '10:00', '12:00', '14:00'] },
      { date: fmt(dayAfter), timeSlots: ['08:00', '10:00'] },
    ],
  },
  // --- Rotavators ---
  {
    id: 'm6',
    name: 'Fieldking Samrat Rotavator',
    category: 'Rotavator',
    providerId: 'p2',
    suitableFor: ['Ploughing'],
    suitableCrops: ['Wheat', 'Paddy', 'Potato'],
    location: 'Gomti Nagar, Lucknow',
    distanceKm: 5.1,
    pricePerUnit: 800,
    pricingUnit: 'per acre',
    rating: 4.4,
    operatorAvailable: true,
    available: true,
    imageUrl: null,
    specs: ['42 Blades', '6ft Width', 'Heavy Duty'],
    availability: [
      { date: fmt(tomorrow), timeSlots: ['08:00', '10:00', '14:00'] },
      { date: fmt(dayAfter), timeSlots: ['08:00', '12:00'] },
    ],
  },
  {
    id: 'm7',
    name: 'Shaktiman Rotavator Pro',
    category: 'Rotavator',
    providerId: 'p5',
    suitableFor: ['Ploughing'],
    suitableCrops: ['Wheat', 'Sugarcane', 'Potato'],
    location: 'Malihabad, Lucknow',
    distanceKm: 14.2,
    pricePerUnit: 650,
    pricingUnit: 'per acre',
    rating: 4.3,
    operatorAvailable: true,
    available: true,
    imageUrl: null,
    specs: ['36 Blades', '5ft Width', 'Adjustable Depth'],
    availability: [
      { date: fmt(tomorrow), timeSlots: ['08:00', '10:00', '12:00', '14:00'] },
      { date: fmt(dayAfter), timeSlots: ['08:00', '10:00', '14:00'] },
    ],
  },
  // --- Seed Drill ---
  {
    id: 'm8',
    name: 'Landforce Zero Till Seed Drill',
    category: 'Seeder',
    providerId: 'p4',
    suitableFor: ['Sowing'],
    suitableCrops: ['Wheat', 'Paddy'],
    location: 'Kakori, Lucknow',
    distanceKm: 12.0,
    pricePerUnit: 400,
    pricingUnit: 'per acre',
    rating: 4.7,
    operatorAvailable: true,
    available: true,
    imageUrl: null,
    specs: ['9-Row', 'Zero-till', 'Fertilizer Box'],
    availability: [
      { date: fmt(tomorrow), timeSlots: ['08:00', '10:00', '14:00'] },
      { date: fmt(dayAfter), timeSlots: ['10:00', '14:00'] },
    ],
  },
  // --- Sprayer ---
  {
    id: 'm9',
    name: 'Boom Sprayer 500L',
    category: 'Sprayer',
    providerId: 'p3',
    suitableFor: ['Spraying'],
    suitableCrops: ['Wheat', 'Paddy', 'Sugarcane', 'Potato'],
    location: 'Chinhat, Lucknow',
    distanceKm: 8.5,
    pricePerUnit: 300,
    pricingUnit: 'per acre',
    rating: 4.3,
    operatorAvailable: true,
    available: true,
    imageUrl: null,
    specs: ['500L Tank', '10m Boom', 'Tractor-mounted'],
    availability: [
      { date: fmt(tomorrow), timeSlots: ['08:00', '10:00', '12:00'] },
      { date: fmt(dayAfter), timeSlots: ['08:00', '10:00', '14:00'] },
    ],
  },
  // --- Cultivator ---
  {
    id: 'm10',
    name: 'VST Cultivator Heavy Duty',
    category: 'Cultivator',
    providerId: 'p5',
    suitableFor: ['Ploughing'],
    suitableCrops: ['Wheat', 'Paddy', 'Potato', 'Sugarcane'],
    location: 'Malihabad, Lucknow',
    distanceKm: 14.2,
    pricePerUnit: 350,
    pricingUnit: 'per acre',
    rating: 4.1,
    operatorAvailable: false,
    available: true,
    imageUrl: null,
    specs: ['9 Tines', 'Spring Loaded', '5ft Width'],
    availability: [
      { date: fmt(tomorrow), timeSlots: ['08:00', '10:00', '12:00', '14:00'] },
      { date: fmt(dayAfter), timeSlots: ['08:00', '10:00', '14:00'] },
    ],
  },
  // --- Trailer ---
  {
    id: 'm11',
    name: 'Tractor Trolley 4-Tonne',
    category: 'Trailer',
    providerId: 'p2',
    suitableFor: ['Transport'],
    suitableCrops: ['Wheat', 'Paddy', 'Potato', 'Sugarcane'],
    location: 'Gomti Nagar, Lucknow',
    distanceKm: 5.1,
    pricePerUnit: 800,
    pricingUnit: 'per day',
    rating: 4.4,
    operatorAvailable: false,
    available: true,
    imageUrl: null,
    specs: ['4 Tonne Capacity', 'Hydraulic Tip', 'All-terrain'],
    availability: [
      { date: fmt(tomorrow), timeSlots: ['08:00'] },
      { date: fmt(dayAfter), timeSlots: ['08:00'] },
    ],
  },
]

export const OPERATOR_FEE = 500 // per day
export const SERVICE_FEE = 100

let bookingCounter = 100

export const generateBookingId = () => {
  bookingCounter++
  return `FS${bookingCounter}`
}

// Pre-seeded bookings for demo
export const initialBookings = [
  {
    id: 'FS001',
    type: 'service',
    farmerId: 'f1',
    providerId: 'p3',
    machineId: 'm2',
    machineName: 'Preet 987 Combine Harvester',
    task: 'Harvesting',
    crop: 'Paddy',
    areaAcres: 3,
    date: fmt(dayAfter),
    durationOrTime: '10:00',
    operatorSelected: true,
    basePrice: 2250,
    operatorFee: 500,
    serviceFee: 100,
    totalPrice: 2850,
    status: 'Requested',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'FS002',
    type: 'rental',
    farmerId: 'f1',
    providerId: 'p2',
    machineId: 'm6',
    machineName: 'Fieldking Samrat Rotavator',
    task: null,
    crop: null,
    areaAcres: null,
    date: fmt(tomorrow),
    durationOrTime: '2 days',
    operatorSelected: true,
    basePrice: 1600,
    operatorFee: 1000,
    serviceFee: 100,
    totalPrice: 2700,
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'FS003',
    type: 'service',
    farmerId: 'f1',
    providerId: 'p1',
    machineId: 'm3',
    machineName: 'Mahindra 575 DI Tractor',
    task: 'Ploughing',
    crop: 'Wheat',
    areaAcres: 4,
    date: fmt(new Date(Date.now() - 86400000 * 3)),
    durationOrTime: '08:00',
    operatorSelected: false,
    basePrice: 2400,
    operatorFee: 0,
    serviceFee: 100,
    totalPrice: 2500,
    status: 'Completed',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
]
