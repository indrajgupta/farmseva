import { useStore } from '../store/StoreContext.jsx'
import { ACTIONS } from '../store/reducer.js'

export function useToast() {
  const { dispatch } = useStore()
  return {
    success: (message) =>
      dispatch({ type: ACTIONS.ADD_TOAST, payload: { message, variant: 'success' } }),
    error: (message) =>
      dispatch({ type: ACTIONS.ADD_TOAST, payload: { message, variant: 'error' } }),
  }
}
