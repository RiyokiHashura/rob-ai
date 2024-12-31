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
    console.log('🚀 API Request:', {
      promptType: prompt?.type,
      messageLength: message?.length,
      historyLength: chatHistory?.length
    })

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: {
          ...prompt,
          context: {
            trustLevel: prompt?.context?.trustLevel || 50,
            suspicionLevel: prompt?.context?.suspicionLevel || 0
          }
        },
        message,
        chatHistory
      })
    })

    if (!response.ok) {
      throw new Error('API request failed')
    }

    const data = await response.json()
    
    if (!data?.message || data.message === SAFE_DEFAULTS.message) {
      if (prompt?.type === 'friendly') {
        return "That's very kind of you to say! Would you like to chat more?"
      } else if (prompt?.type === 'suspicious') {
        return "I need to be careful about these things. Perhaps we should change the subject?"
      }
    }

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