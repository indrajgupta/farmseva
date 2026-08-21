// ============================================================
// FarmSeva Store Reducer
// All state mutations flow through here
// ============================================================

import { generateBookingId } from './mockData.js'

export const ACTIONS = {
  CREATE_BOOKING: 'CREATE_BOOKING',
  UPDATE_BOOKING_STATUS: 'UPDATE_BOOKING_STATUS',
  ACCEPT_BOOKING: 'ACCEPT_BOOKING',
  REJECT_BOOKING: 'REJECT_BOOKING',
  TOGGLE_MACHINE_AVAILABILITY: 'TOGGLE_MACHINE_AVAILABILITY',
  ADD_MACHINE: 'ADD_MACHINE',
  UPDATE_MACHINE: 'UPDATE_MACHINE',
  ADD_TOAST: 'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
  CANCEL_BOOKING: 'CANCEL_BOOKING',
}

// Status order for progression
export const STATUS_ORDER = [
  'Requested',
  'Confirmed',
  'OperatorAssigned',
  'OnTheWay',
  'WorkStarted',
  'Completed',
]

export const STATUS_LABELS = {
  Requested: 'Requested',
  Confirmed: 'Confirmed',
  OperatorAssigned: 'Operator Assigned',
  OnTheWay: 'On the Way',
  WorkStarted: 'Work Started',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
}

let machineCounter = 20

export function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.CREATE_BOOKING: {
      const newBooking = {
        ...action.payload,
        id: generateBookingId(),
        status: 'Requested',
        createdAt: new Date().toISOString(),
      }
      // Mark the availability slot as booked
      const updatedMachines = state.machines.map((m) => {
        if (m.id !== action.payload.machineId) return m
        const updatedAvailability = m.availability.map((slot) => {
          if (slot.date !== action.payload.date) return slot
          return {
            ...slot,
            timeSlots: slot.timeSlots.filter((t) => t !== action.payload.durationOrTime),
          }
        })
        return { ...m, availability: updatedAvailability }
      })
      return {
        ...state,
        bookings: [newBooking, ...state.bookings],
        machines: updatedMachines,
        lastCreatedBookingId: newBooking.id,
      }
    }

    case ACTIONS.ACCEPT_BOOKING: {
      const updated = state.bookings.map((b) =>
        b.id === action.payload.bookingId ? { ...b, status: 'Confirmed' } : b
      )
      return { ...state, bookings: updated }
    }

    case ACTIONS.REJECT_BOOKING: {
      const updated = state.bookings.map((b) =>
        b.id === action.payload.bookingId ? { ...b, status: 'Cancelled', cancelReason: action.payload.reason || 'Rejected by provider' } : b
      )
      return { ...state, bookings: updated }
    }

    case ACTIONS.CANCEL_BOOKING: {
      const updated = state.bookings.map((b) =>
        b.id === action.payload.bookingId ? { ...b, status: 'Cancelled', cancelReason: 'Cancelled by farmer' } : b
      )
      return { ...state, bookings: updated }
    }

    case ACTIONS.UPDATE_BOOKING_STATUS: {
      const updated = state.bookings.map((b) => {
        if (b.id !== action.payload.bookingId) return b
        const currentIdx = STATUS_ORDER.indexOf(b.status)
        if (currentIdx < 0 || currentIdx >= STATUS_ORDER.length - 1) return b
        const nextStatus = STATUS_ORDER[currentIdx + 1]
        return { ...b, status: nextStatus }
      })
      return { ...state, bookings: updated }
    }

    case ACTIONS.TOGGLE_MACHINE_AVAILABILITY: {
      const updated = state.machines.map((m) =>
        m.id === action.payload.machineId ? { ...m, available: !m.available } : m
      )
      return { ...state, machines: updated }
    }

    case ACTIONS.ADD_MACHINE: {
      machineCounter++
      const newMachine = {
        ...action.payload,
        id: `m${machineCounter}`,
        rating: 0,
        operatorAvailable: false,
        available: true,
        imageUrl: null,
        specs: [],
        availability: [],
      }
      return { ...state, machines: [...state.machines, newMachine] }
    }

    case ACTIONS.UPDATE_MACHINE: {
      const updated = state.machines.map((m) =>
        m.id === action.payload.machineId ? { ...m, ...action.payload.updates } : m
      )
      return { ...state, machines: updated }
    }

    case ACTIONS.ADD_TOAST: {
      const toast = { id: Date.now(), ...action.payload }
      return { ...state, toasts: [...state.toasts, toast] }
    }

    case ACTIONS.REMOVE_TOAST: {
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload.id) }
    }

    default:
      return state
  }
}
