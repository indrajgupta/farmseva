import React, { createContext, useContext, useReducer } from 'react'
import { reducer } from './reducer.js'
import { farmers, providers, machines, initialBookings } from './mockData.js'

const StoreContext = createContext(null)

const initialState = {
  farmers,
  providers,
  machines: machines.map((m) => ({ ...m })), // deep copy so mutations don't affect seed
  bookings: initialBookings.map((b) => ({ ...b })),
  currentFarmerId: 'f1',  // Logged-in farmer for demo
  currentProviderId: 'p1', // Logged-in provider for demo
  lastCreatedBookingId: null,
  toasts: [],
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}

// Convenience selectors
export function useCurrentFarmer() {
  const { state } = useStore()
  return state.farmers.find((f) => f.id === state.currentFarmerId)
}

export function useCurrentProvider() {
  const { state } = useStore()
  return state.providers.find((p) => p.id === state.currentProviderId)
}

export function useProviderMachines() {
  const { state } = useStore()
  return state.machines.filter((m) => m.providerId === state.currentProviderId)
}

export function useProviderBookings() {
  const { state } = useStore()
  return state.bookings.filter(
    (b) => b.providerId === state.currentProviderId
  )
}

export function useFarmerBookings() {
  const { state } = useStore()
  return state.bookings.filter((b) => b.farmerId === state.currentFarmerId)
}
