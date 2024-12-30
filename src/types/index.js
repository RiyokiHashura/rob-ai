export const MessageType = {
  USER: 'user',
  AI: 'ai',
  SYSTEM: 'system'
}

export const IntentType = {
  FRIENDLY: 'friendly',
  NEUTRAL: 'neutral',
  SUSPICIOUS: 'suspicious'
}

export const AnalysisResult = {
  intent: IntentType.NEUTRAL,
  trustChange: 0,
  suspicionChange: 0,
  tone: 'neutral',
  reason: ''
}

export const CharacterState = {
  name: 'grandma',
  trustLevel: 50,
  suspicionLevel: 0,
  metrics: {
    trustChange: 0,
    suspicionChange: 0,
    reason: ''
  }
}

export const ChatMessage = {
  type: MessageType.USER,
  message: '',
  timestamp: Date.now()
} 