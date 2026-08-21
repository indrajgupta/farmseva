// ============================================================
// Recommendation Scoring — Section 11 of PRD
// score = task_match(40) + crop_match(15) + distance(20) + availability(15) + rating(10)
// ============================================================

import { OPERATOR_FEE, SERVICE_FEE } from '../store/mockData.js'

/**
 * Score a single machine for a farm service request
 */
export function scoreMachine(machine, request, bookings) {
  const taskMatch = machine.suitableFor.includes(request.task)
  const cropMatch = machine.suitableCrops.includes(request.crop)
  const availabilityMatch = isMachineAvailableForSlot(machine, request.date, request.time, bookings)
  const masterAvailable = machine.available

  if (!masterAvailable) return null // provider disabled machine

  const score =
    (taskMatch ? 40 : 0) +
    (cropMatch ? 15 : 0) +
    Math.max(0, 20 - machine.distanceKm * 2) +
    (availabilityMatch ? 15 : 0) +
    (machine.rating / 5) * 10

  return {
    machine,
    score,
    taskMatch,
    cropMatch,
    availabilityMatch,
    isPartialMatch: taskMatch && !cropMatch,
  }
}

/**
 * Get ranked results for a farm service request (Section 11)
 * Returns array of { machine, score, isBestMatch, isPartialMatch }
 */
export function getRecommendations(machines, request, bookings) {
  const scored = machines
    .map((m) => scoreMachine(m, request, bookings))
    .filter(Boolean)

  // Eligible: task_match AND availability_match
  const eligible = scored.filter((s) => s.taskMatch && s.availabilityMatch)

  if (eligible.length > 0) {
    const sorted = eligible.sort((a, b) => b.score - a.score)
    return sorted.map((s, i) => ({ ...s, isBestMatch: i === 0, isPartialMatch: false }))
  }

  // Fallback: relax crop requirement — task match but ignore crop
  const partial = scored
    .filter((s) => s.taskMatch && s.availabilityMatch === false ? false : s.taskMatch)
    .sort((a, b) => b.score - a.score)

  if (partial.length > 0) {
    return partial.map((s, i) => ({ ...s, isBestMatch: i === 0, isPartialMatch: true }))
  }

  return [] // true empty
}

/**
 * Check if a machine is available for a given date/time slot
 */
export function isMachineAvailableForSlot(machine, date, time, bookings) {
  if (!machine.available) return false

  // Check existing non-cancelled bookings for this machine+date+time
  const conflicting = bookings.find(
    (b) =>
      b.machineId === machine.id &&
      b.date === date &&
      b.durationOrTime === time &&
      b.status !== 'Cancelled'
  )
  if (conflicting) return false

  // Check machine's own availability list
  const daySlot = machine.availability.find((slot) => slot.date === date)
  if (!daySlot) return false
  return daySlot.timeSlots.includes(time)
}

/**
 * Compute service price breakdown
 */
export function computeServicePrice(machine, areaAcres, operatorSelected) {
  let base = 0
  if (machine.pricingUnit === 'per acre') {
    base = machine.pricePerUnit * areaAcres
  } else if (machine.pricingUnit === 'per hour') {
    // Estimate 1 hour per 2 acres for hourly-priced machines in service mode
    const hours = Math.ceil(areaAcres / 2)
    base = machine.pricePerUnit * hours
  } else {
    base = machine.pricePerUnit
  }
  const operatorFee = operatorSelected ? OPERATOR_FEE : 0
  const serviceFee = SERVICE_FEE
  return { base, operatorFee, serviceFee, total: base + operatorFee + serviceFee }
}

/**
 * Compute rental price breakdown
 */
export function computeRentalPrice(machine, duration, operatorSelected) {
  let base = 0
  if (machine.pricingUnit === 'per day') {
    base = machine.pricePerUnit * duration
  } else if (machine.pricingUnit === 'per hour') {
    base = machine.pricePerUnit * duration
  } else if (machine.pricingUnit === 'per acre') {
    // treat as per day for rental context
    base = machine.pricePerUnit * duration
  } else {
    base = machine.pricePerUnit * duration
  }
  const operatorFee = operatorSelected ? OPERATOR_FEE * duration : 0
  const serviceFee = SERVICE_FEE
  return { base, operatorFee, serviceFee, total: base + operatorFee + serviceFee }
}

/**
 * Filter machines for equipment search
 */
export function filterMachines(machines, filters, bookings) {
  let result = machines.filter((m) => m.available)

  if (filters.category) {
    result = result.filter((m) => m.category === filters.category)
  }
  if (filters.query) {
    const q = filters.query.toLowerCase()
    result = result.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.suitableFor.some((t) => t.toLowerCase().includes(q))
    )
  }
  if (filters.minRating) {
    result = result.filter((m) => m.rating >= filters.minRating)
  }
  if (filters.maxPrice) {
    result = result.filter((m) => m.pricePerUnit <= filters.maxPrice)
  }
  if (filters.maxDistance) {
    result = result.filter((m) => m.distanceKm <= filters.maxDistance)
  }
  if (filters.date) {
    result = result.filter((m) => {
      const slot = m.availability.find((s) => s.date === filters.date)
      return slot && slot.timeSlots.length > 0
    })
  }

  // Sort
  if (filters.sort === 'price_asc') {
    result.sort((a, b) => a.pricePerUnit - b.pricePerUnit)
  } else if (filters.sort === 'distance') {
    result.sort((a, b) => a.distanceKm - b.distanceKm)
  } else if (filters.sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating)
  }
  // default: no special sort (insertion order = recommended)

  return result
}
