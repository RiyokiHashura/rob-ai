import { THRESHOLDS } from '../../config/constants'
import { logAPI } from '../common/logger'

export class ContextAnalyzer {
  constructor() {
    this.historyWindow = THRESHOLDS.PATTERNS.REPETITION.LOOKBACK
  }

  analyze(chatHistory) {
    try {
      const recentHistory = chatHistory.slice(-this.historyWindow)
      
      return {
        sentiment: this.calculateSentiment(recentHistory),
        topicPersistence: this.checkTopicPersistence(recentHistory),
        recentInteractions: recentHistory.length,
        messageFrequency: this.calculateMessageFrequency(recentHistory)
      }
    } catch (error) {
      logAPI.error('context_analysis_error', error)
      return {}
    }
  }

  calculateSentiment(history) {
    const messages = history.map(msg => msg.message)
    return {
      isPositive: this.hasPositiveLanguage(messages),
      isNegative: this.hasNegativeLanguage(messages)
    }
  }

  checkTopicPersistence(history) {
    const topics = history.map(msg => this.detectTopic(msg.message))
    const mostFrequent = this.getMostFrequentTopic(topics)
    
    return {
      topic: mostFrequent,
      count: topics.filter(t => t === mostFrequent).length,
      isRepetitive: this.isTopicRepetitive(topics)
    }
  }

  calculateMessageFrequency(history) {
    if (history.length < 2) return 0
    const timeSpans = []
    for (let i = 1; i < history.length; i++) {
      timeSpans.push(history[i].timestamp - history[i-1].timestamp)
    }
    return timeSpans.reduce((a,b) => a + b, 0) / timeSpans.length
  }

  detectTopic(message) {
    const topics = {
      family: /family|relative|parent|child/i,
      weather: /weather|temperature|rain|sun/i,
      health: /health|doctor|medicine|sick/i,
      general: /hello|hi|how|what|when/i
    }

    for (const [topic, pattern] of Object.entries(topics)) {
      if (pattern.test(message)) return topic
    }
    return 'other'
  }

  getMostFrequentTopic(topics) {
    const counts = topics.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1
      return acc
    }, {})
    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)[0][0]
  }

  isTopicRepetitive(topics) {
    const threshold = THRESHOLDS.PATTERNS.REPETITION.MIN_FREQUENCY
    const mostFrequent = this.getMostFrequentTopic(topics)
    return topics.filter(t => t === mostFrequent).length >= threshold
  }

  hasPositiveLanguage(messages) {
    const positiveWords = ['thank', 'happy', 'glad', 'good', 'nice', 'love', 'care']
    return messages.some(msg => 
      positiveWords.some(word => msg.toLowerCase().includes(word))
    )
  }

  hasNegativeLanguage(messages) {
    const negativeWords = ['bad', 'sad', 'upset', 'angry', 'hate', 'terrible']
    return messages.some(msg => 
      negativeWords.some(word => msg.toLowerCase().includes(word))
    )
  }
} 