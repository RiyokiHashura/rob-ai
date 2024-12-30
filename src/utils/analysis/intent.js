import { ANALYSIS } from '../../config/constants'
import { logAPI } from '../common/logger'

export class IntentAnalyzer {
  constructor() {
    this.historyWindow = 5
  }

  analyze(message, chatHistory) {
    if (!message) {
      logAPI.error('empty_message')
      return this.createNeutralIntent()
    }

    const context = this.buildContext(chatHistory)
    const intent = this.evaluateIntent(message, context)
    const trends = this.analyzeTrends(chatHistory, intent)

    return {
      ...intent,
      trends,
      confidence: this.calculateConfidence(intent, trends, context),
      context
    }
  }

  buildContext(history) {
    const recentHistory = history.slice(-this.historyWindow)
    return {
      sentiment: this.calculateSentimentTrend(recentHistory),
      topicPersistence: this.getTopicPersistence(recentHistory),
      recentInteractions: recentHistory.length
    }
  }

  evaluateIntent(message, context) {
    const text = message.toLowerCase()
    return {
      friendly: this.evaluateFriendlyIntent(text),
      suspicious: this.evaluateSuspiciousIntent(text, context)
    }
  }

  calculateConfidence(intent, trends, context) {
    let confidence = intent.baseConfidence || 0.5
    
    if (trends.supports(intent.type)) {
      confidence *= 1.2
    }
    
    return Math.min(1.0, confidence)
  }

  createNeutralIntent() {
    return {
      type: ANALYSIS.INTENT.TYPES.NEUTRAL,
      confidence: ANALYSIS.INTENT.BASE_CONFIDENCE,
      trends: {},
      context: {}
    }
  }
} 