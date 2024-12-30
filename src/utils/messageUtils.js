import { PATTERNS } from './patterns'
import { THRESHOLDS } from './config'

export const textAnalysis = {
  containsThreat: (text) => 
    PATTERNS.aggressive.threats.some(pattern => pattern.test(text)),

  containsCrypto: (text) =>
    PATTERNS.crypto.terms.some(pattern => pattern.test(text)),

  containsManipulation: (text) =>
    PATTERNS.manipulation.trust.some(pattern => pattern.test(pattern)) ||
    PATTERNS.manipulation.emotional.some(pattern => pattern.test(text))
}

export const messageAnalysis = {
  countCryptoMentions: (messages, lookback = THRESHOLDS.PATTERNS.REPETITION.LOOKBACK) =>
    messages.slice(-lookback)
      .filter(msg => textAnalysis.containsCrypto(msg.message))
      .length,

  hasRecentThreat: (messages, lookback = THRESHOLDS.PATTERNS.REPETITION.LOOKBACK) =>
    messages.slice(-lookback)
      .some(msg => textAnalysis.containsThreat(msg.message)),

  hasRecentManipulation: (messages, lookback = THRESHOLDS.PATTERNS.REPETITION.LOOKBACK) =>
    messages.slice(-lookback)
      .some(msg => textAnalysis.containsManipulation(msg.message))
}

export const contextAnalysis = {
  getTopicPersistence: (messages, lookback = THRESHOLDS.PATTERNS.REPETITION.LOOKBACK) => {
    const recentTopics = messages.slice(-lookback)
      .map(msg => detectMainTopic(msg.message))
    
    const topicCounts = recentTopics.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1
      return acc
    }, {})

    const [mostFrequent] = Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)

    return {
      topic: mostFrequent?.[0] || 'none',
      count: mostFrequent?.[1] || 0,
      isRepetitive: mostFrequent?.[1] > THRESHOLDS.PATTERNS.REPETITION.MIN_FREQUENCY
    }
  }
}

const detectMainTopic = (text) => {
  const topics = {
    crypto: textAnalysis.containsCrypto,
    threat: textAnalysis.containsThreat,
    manipulation: textAnalysis.containsManipulation
  }

  return Object.entries(topics)
    .find(([_, detector]) => detector(text))?.[0] || 'general'
} 