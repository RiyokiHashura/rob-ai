import { PATTERNS } from './patterns'
import { THRESHOLDS } from '../config/constants'

export const textAnalysis = {
  containsThreat: (text) => 
    PATTERNS.aggressive.threats.some(pattern => pattern.test(text)),

  containsCrypto: (text) =>
    PATTERNS.crypto.terms.some(pattern => pattern.test(text)),

  containsManipulation: (text) =>
    PATTERNS.manipulation.trust.some(pattern => pattern.test(text)) ||
    PATTERNS.manipulation.emotional.some(pattern => pattern.test(text))
}

export const detectMainTopic = (message) => {
  const topics = {
    crypto: /crypto|bitcoin|wallet|transfer/i,
    family: /family|grandson|daughter|son/i,
    weather: /weather|rain|sunny|cold|hot/i,
    health: /health|doctor|medicine|sick/i
  }

  for (const [topic, pattern] of Object.entries(topics)) {
    if (pattern.test(message)) return topic
  }
  
  return 'general'
}

export const CryptoIntentDetector = {
  patterns: {
    interest: [
      /what.*crypto/i,
      /how.*wallet.*work/i,
      /tell.*about.*solana/i,
      /learn.*blockchain/i
    ],
    transaction: [
      /send.*crypto/i,
      /transfer.*wallet/i,
      /move.*funds/i,
      /connect.*wallet/i
    ],
    educational: [
      /safe.*crypto/i,
      /protect.*wallet/i,
      /secure.*key/i,
      /backup.*phrase/i
    ]
  },

  analyze(message) {
    const intents = {
      type: null,
      confidence: 0,
      subtype: null
    }

    // Check each pattern category
    for (const [category, patterns] of Object.entries(this.patterns)) {
      for (const pattern of patterns) {
        if (pattern.test(message)) {
          intents.type = 'crypto'
          intents.subtype = category
          intents.confidence += 0.25
        }
      }
    }

    return intents
  },

  getContextualResponse(intent, context) {
    const { trustLevel = 50 } = context
    
    // Reference existing responses from CriticalHandler
    if (trustLevel < 40) {
      return 'cautious'
    } else if (trustLevel < 70) {
      return 'curious'
    } else {
      return 'educational'
    }
  }
} 