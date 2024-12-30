import { API_CONFIG, SAFE_DEFAULTS } from '../config/constants'
import { logAPI } from '../utils/common/logger'

async function analyzeMessage(message, chatHistory, character) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        chatHistory,
        character
      })
    })

    if (!response.ok) {
      throw new Error('API request failed')
    }

    return await response.json()
  } catch (error) {
    logAPI.error('message_analysis_error', error)
    return SAFE_DEFAULTS.analysis
  }
}

async function generateResponse(prompt, message, chatHistory) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        message,
        chatHistory
      })
    })

    if (!response.ok) {
      throw new Error('API request failed')
    }

    const data = await response.json()
    return data.message
  } catch (error) {
    logAPI.error('response_generation_error', error)
    return SAFE_DEFAULTS.message
  }
}

export const ai = {
  analyzeMessage,
  generateResponse
} 