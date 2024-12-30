import { ANALYSIS } from '../config/constants'
import { IntentEvaluator } from './intentDetector'

class ConversationAnalyzer {
  constructor() {
    this.intentEvaluator = new IntentEvaluator()
    this.historyWindow = 5 // Number of messages to analyze for trends
  }

  analyzeIntent(message, chatHistory) {
    const recentHistory = chatHistory.slice(-this.historyWindow)
    const conversationContext = this.buildContext(recentHistory)
    
    const currentIntent = this.intentEvaluator.evaluate(message, conversationContext)
    const trends = this.analyzeTrends(recentHistory, currentIntent)
    
    return {
      ...currentIntent,
      trends,
      confidence: this.adjustConfidence(currentIntent, trends),
      context: conversationContext
    }
  }

  buildContext(history) {
    return {
      sentiment: this.calculateSentimentTrend(history),
      topicPersistence: this.analyzeTopicPersistence(history),
      intentPatterns: this.detectIntentPatterns(history),
      recentEmotions: this.extractEmotions(history)
    }
  }

  analyzeTrends(history, currentIntent) {
    return {
      sentimentShift: this.detectSentimentShift(history),
      intentProgression: this.analyzeIntentProgression(history, currentIntent),
      emotionalEscalation: this.detectEmotionalEscalation(history),
      manipulationPatterns: this.findManipulationPatterns(history)
    }
  }

  adjustConfidence(intent, trends) {
    let confidence = intent.confidence

    if (trends.intentProgression.supports(intent.type)) {
      confidence *= 1.2
    }

    if (trends.emotionalEscalation.isConsistent) {
      confidence *= 1.1
    }

    return Math.min(1.0, confidence)
  }

  detectSentimentShift(history) {
    const sentiments = history.map(msg => this.analyzeSentiment(msg))
    return {
      direction: this.calculateTrendDirection(sentiments),
      magnitude: this.calculateTrendMagnitude(sentiments),
      isSignificant: this.isTrendSignificant(sentiments)
    }
  }

  analyzeIntentProgression(history, currentIntent) {
    const intents = history.map(msg => this.intentEvaluator.evaluate(msg.message))
    return {
      pattern: this.findIntentPattern(intents),
      supports: (intentType) => this.doesPatternSupport(intentType, intents),
      confidence: this.calculatePatternConfidence(intents)
    }
  }

  calculateSentimentTrend(history) {
    const sentiments = history.map(msg => this.analyzeSentiment(msg.message))
    return {
      average: sentiments.reduce((sum, val) => sum + val, 0) / sentiments.length,
      variance: this.calculateVariance(sentiments),
      trend: this.detectTrend(sentiments)
    }
  }

  analyzeSentiment(message) {
    return this.intentEvaluator.evaluateSentiment(message)
  }
}

export const conversationAnalyzer = new ConversationAnalyzer() 