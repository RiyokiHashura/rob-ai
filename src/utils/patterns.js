import { THRESHOLDS } from '../config/constants'

export const PATTERNS = {
  crypto: {
    terms: [
      /crypto/i,
      /bitcoin/i,
      /wallet/i,
      /private\s*key/i,
      /seed\s*phrase/i,
      /transfer/i
    ],
    probing: [
      /do\s*you\s*have/i,
      /how\s*much/i,
      /invest/i
    ]
  },
  
  aggressive: {
    threats: [
      /urgent/i,
      /emergency/i,
      /must\s*now/i,
      /immediately/i
    ],
    emphasis: [
      /!{2,}/,
      /\?{2,}/,
      /PLEASE/
    ]
  },

  manipulation: {
    trust: [
      /trust\s*me/i,
      /promise/i,
      /secret/i,
      /just\s*between\s*us/i
    ],
    emotional: [
      /need\s*help/i,
      /please\s*help/i,
      /desperate/i,
      /worried/i
    ]
  },

  friendly: {
    positive: [
      /thank/i,
      /appreciate/i,
      /nice/i,
      /good/i
    ],
    personal: [
      /family/i,
      /grandma/i,
      /how\s*are\s*you/i,
      /weather/i
    ]
  }
}

export const checkPattern = (text, pattern) => {
  if (!text || !pattern) return false
  return pattern.test(text)
}

export const matchesAnyPattern = (text, patterns) => {
  return patterns.some(pattern => checkPattern(text, pattern))
} 