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