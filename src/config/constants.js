export const THRESHOLDS = {
  TRUST: {
    LOW: 30,
    MEDIUM: 50,
    HIGH: 70,
    MIN_VALUE: 0,
    MAX_VALUE: 100
  },
  
  SUSPICION: {
    LOW: 25,
    MEDIUM: 50,
    HIGH: 75,
    MIN_VALUE: 0,
    MAX_VALUE: 100
  },
  
  PATTERNS: {
    REPETITION: {
      LOOKBACK: 5,
      MIN_FREQUENCY: 2
    }
  }
}

export const SAFETY_THRESHOLDS = {
  MAX_REPETITIONS: 3,
  MAX_TOPIC_PERSISTENCE: 5,
  SUSPICION_TRIGGER: 75,
  DEFENSIVE_TRIGGER: 60
}

export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  MAX_MESSAGE_LENGTH: 1000,
  ENDPOINT: '/api/ai',
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000'
}

export const SAFE_DEFAULTS = {
  message: "I'm not sure I understand. Could you rephrase that?",
  analysis: {
    trustChange: 0,
    suspicionChange: 0,
    intent: 'neutral',
    tone: 'neutral',
    reason: 'Default response due to processing error'
  },
  suggestions: [
    "Let's talk about something else.",
    "How are you today?",
    "Tell me about your family."
  ]
}

export const ANALYSIS = {
  INTENT: {
    TYPES: {
      FRIENDLY: 'friendly',
      NEUTRAL: 'neutral',
      SUSPICIOUS: 'suspicious'
    },
    BASE_CONFIDENCE: 0.5,
    MAX_CONFIDENCE: 1.0
  }
}

export const CONVERSATION_LIMITS = {
  MAX_MESSAGE_LENGTH: 1000,
  MAX_HISTORY_LENGTH: 50,
  MIN_RESPONSE_DELAY: 1000,
  MAX_SUGGESTIONS: 3
} 