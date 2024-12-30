export const SAFE_DEFAULTS = {
  metrics: {
    trustChange: 0,
    suspicionChange: 0,
    intent: 'neutral',
    tone: 'neutral'
  },
  context: {
    recentCryptoMentions: 0,
    recentlyThreatened: false,
    topicPersistence: {
      topic: 'none',
      count: 0,
      isRepetitive: false
    }
  }
} 