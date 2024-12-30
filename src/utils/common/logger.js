import { API_CONFIG } from '../../config/constants'

export const logAPI = {
  start: (operation) => {
    console.group(`🚀 ${operation} Analysis`)
    console.time(operation)
  },

  end: () => {
    console.timeEnd()
    console.groupEnd()
  },

  error: (type, error = {}) => {
    console.error(`❌ ${type}:`, error)
  },

  context: (context) => {
    console.log('📊 Context:', context)
  },

  intent: (intent, flags) => {
    console.log('🎯 Intent:', intent)
    console.log('🚩 Flags:', flags)
  }
} 