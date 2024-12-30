import { createContext, useContext, useReducer } from 'react'
import { SAFE_DEFAULTS } from '../config/constants'

const AIContext = createContext(null)

const initialState = {
  name: 'grandma',
  trustLevel: 50,
  suspicionLevel: 0,
  metrics: {
    trustChange: 0,
    suspicionChange: 0,
    reason: ''
  },
  strategy: 'build_trust',
  suggestions: SAFE_DEFAULTS.suggestions,
  chatHistory: []
}

const aiReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_METRICS':
      return {
        ...state,
        trustLevel: Math.max(0, Math.min(100, state.trustLevel + (action.payload.trustChange || 0))),
        suspicionLevel: Math.max(0, Math.min(100, state.suspicionLevel + (action.payload.suspicionChange || 0))),
        metrics: {
          ...action.payload,
          trustChange: Math.max(-20, Math.min(20, action.payload.trustChange || 0)),
          suspicionChange: Math.max(-20, Math.min(20, action.payload.suspicionChange || 0))
        }
      }
    
    case 'SET_STRATEGY':
      return {
        ...state,
        strategy: action.payload
      }

    case 'UPDATE_CHAT':
      const newHistory = [...state.chatHistory, action.payload].slice(-50)
      return {
        ...state,
        chatHistory: newHistory
      }

    case 'SET_SUGGESTIONS':
      return {
        ...state,
        suggestions: action.payload.slice(0, 3)
      }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

export function AIProvider({ children }) {
  const [state, dispatch] = useReducer(aiReducer, initialState)
  return (
    <AIContext.Provider value={[state, dispatch]}>
      {children}
    </AIContext.Provider>
  )
}

export function useAIContext() {
  const context = useContext(AIContext)
  if (!context) {
    throw new Error('useAIContext must be used within an AIProvider')
  }
  return context
} 