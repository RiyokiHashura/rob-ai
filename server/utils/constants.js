import { config } from 'dotenv'
config()

export const SAFE_DEFAULTS = {
  analysis: {
    trustChange: 0,
    suspicionChange: 0,
    intent: 'neutral',
    tone: 'neutral',
    reason: 'Unable to analyze message'
  },
  message: "I'm sorry, I didn't quite catch that. Could you please rephrase?",
  suggestions: []
}

export const CONVERSATION_LIMITS = {
  MAX_MESSAGE_LENGTH: 500,
  MAX_HISTORY_LENGTH: 50,
  MAX_SUGGESTIONS: 3
}

export const API_CONFIG = {
  PORT: process.env.PORT || 3000,
  BASE_URL: process.env.API_URL || 'http://localhost:3000',
  OPENAI_MODEL: 'gpt-4'
} 