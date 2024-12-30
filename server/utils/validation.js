import { SAFE_DEFAULTS } from './constants.js'

export const handleResponseValidation = (data, context = {}) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response: Missing data object')
  }

  if (typeof data.message !== 'string' || !data.message.trim()) {
    throw new Error('Invalid response: Missing or invalid message')
  }

  return true
}

export const defaultErrorResponse = (character) => ({
  message: `Oh dear, something went wrong. Let's try talking about something else.`,
  metrics: SAFE_DEFAULTS.metrics
})

export { SAFE_DEFAULTS } 