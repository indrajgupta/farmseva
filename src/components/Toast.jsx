import React, { useEffect, useRef } from 'react'
import { useStore } from '../store/StoreContext.jsx'
import { ACTIONS } from '../store/reducer.js'
import { CheckCircle, XCircle } from 'lucide-react'

export default function Toast() {
  const { state, dispatch } = useStore()
  const timersRef = useRef({})

  useEffect(() => {
    state.toasts.forEach((toast) => {
      if (!timersRef.current[toast.id]) {
        timersRef.current[toast.id] = setTimeout(() => {
          dispatch({ type: ACTIONS.REMOVE_TOAST, payload: { id: toast.id } })
          delete timersRef.current[toast.id]
        }, 3500)
      }
    })
  }, [state.toasts, dispatch])

  if (!state.toasts.length) return null

  return (
    <div className="toast-container">
      {state.toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast ${toast.variant === 'error' ? 'toast-error' : 'toast-success'}`}
        >
          {toast.variant === 'error' ? <XCircle size={18} /> : <CheckCircle size={18} />}
          {toast.message}
        </div>
      ))}
    </div>
  )
}
