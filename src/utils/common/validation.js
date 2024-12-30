import { CONVERSATION_LIMITS } from '../../config/constants'

export function validateMessage(message) {
  if (!message?.trim()) {
    throw new Error('Message cannot be empty')
  }
  
  if (message.length > CONVERSATION_LIMITS.MAX_MESSAGE_LENGTH) {
    throw new Error('Message exceeds maximum length')
  }
  
  return message.trim()
}

export function validateContext(context) {
  if (!context) {
    throw new Error('Context is required')
  }

  if (!Array.isArray(context.chatHistory)) {
    throw new Error('Chat history must be an array')
  }

  if (typeof context.strategy !== 'string') {
    throw new Error('Strategy must be a string')
  }

  return context
} 