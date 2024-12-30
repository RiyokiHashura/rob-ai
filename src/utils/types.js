export const MessageType = {
  USER: 'user',
  AI: 'ai',
  SYSTEM: 'system'
}

export const IntentType = {
  CRYPTO: 'crypto',
  AGGRESSIVE: 'aggressive',
  MANIPULATIVE: 'manipulative',
  FRIENDLY: 'friendly',
  NEUTRAL: 'neutral'
}

export const StrategyPhase = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
}

export const AnalysisResult = {
  intent: {
    type: String,
    confidence: Number,
    trends: Object
  },
  metrics: {
    trustChange: Number,
    suspicionChange: Number,
    effectiveness: Number
  },
  suggestions: Array,
  context: Object
} 