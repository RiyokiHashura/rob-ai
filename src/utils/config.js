export const THRESHOLDS = {
  TRUST: {
    LOW: 30,
    MEDIUM: 50,
    HIGH: 70,
    DECAY_RATE: 0.05,
    DECAY_INTERVAL: 60000, // 1 minute
    MIN_VALUE: 0,
    MAX_VALUE: 100
  },
  
  SUSPICION: {
    LOW: 25,
    MEDIUM: 50,
    HIGH: 75,
    DECAY_RATE: 0.025,
    DECAY_INTERVAL: 120000, // 2 minutes
    MIN_VALUE: 0,
    MAX_VALUE: 100
  },
  
  PATTERNS: {
    REPETITION: {
      MIN_LENGTH: 3,
      MIN_FREQUENCY: 2,
      LOOKBACK: 5,
      TIME_WINDOW: 300000 // 5 minutes
    }
  },
  
  INTENT: {
    CONFIDENCE: {
      LOW: 0.3,
      MEDIUM: 0.6,
      HIGH: 0.8
    },
    DECAY_RATE: 0.1,
    MIN_CONFIDENCE: 0.1
  }
}

export const API_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  MAX_HISTORY_LENGTH: 50,
  MAX_MESSAGE_LENGTH: 1000,
  ENDPOINTS: {
    CHAT: '/api/chat',
    ANALYZE: '/api/analyze'
  },
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000'
}

export const STRATEGY_CONFIG = {
  MAX_SUGGESTIONS: 4,
  MIN_TRUST_FOR_AGGRESSIVE: 60,
  COOLDOWN_PERIOD: 300000, // 5 minutes
  ESCALATION_THRESHOLD: 3
}

export const ANALYSIS = {
  INTENT: {
    SCORES: {
      CRYPTO: {
        BASE: 0.6,
        ELEVATED: 0.2,
        PROBING: 0.1
      },
      AGGRESSION: {
        BASE: 0.7,
        THREATS: 0.2,
        EMPHASIS: 0.1
      },
      MANIPULATION: {
        BASE: 0.6,
        TRUST: 0.2,
        CONTEXT: 0.2
      },
      FRIENDLY: {
        BASE: 0.5,
        POSITIVE: 0.2,
        PERSONAL: 0.1
      }
    },
    PRIORITIES: {
      AGGRESSIVE: 0.9,
      SUSPICIOUS: 0.8,
      MANIPULATIVE: 0.7,
      PROBING: 0.6,
      FRIENDLY: 0.7,
      NEUTRAL: 0.5
    }
  },
  CONTEXT: {
    LOOKBACK: 5,
    CRYPTO_THRESHOLD: 2,
    MIN_WORD_LENGTH: 3
  }
} 