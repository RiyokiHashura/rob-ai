import { THRESHOLDS, SAFETY_THRESHOLDS } from '../config/constants.js'

class ConversationContext {
  constructor() {
    this.patterns = {
      suspiciousAttempts: 0,
      topicPersistence: new Map(),
      lastIntent: null,
      recentEmotions: []
    }
  }

  updateContext(message, analysis, chatHistory) {
    // Track suspicious patterns
    if (analysis.intent === 'suspicious') {
      this.patterns.suspiciousAttempts++
    } else {
      this.patterns.suspiciousAttempts = Math.max(0, this.patterns.suspiciousAttempts - 0.5)
    }

    // Track emotional progression
    this.patterns.recentEmotions.push(analysis.tone)
    if (this.patterns.recentEmotions.length > 5) {
      this.patterns.recentEmotions.shift()
    }

    // Update topic persistence
    const topics = this.extractTopics(message)
    topics.forEach(topic => {
      const count = this.topicPersistence.get(topic) || 0
      this.topicPersistence.set(topic, count + 1)
    })

    this.patterns.lastIntent = analysis.intent
  }

  getContextualPrompt(basePrompt, metrics) {
    const contextFlags = this.getContextFlags()
    
    if (contextFlags.isEscalating) {
      return `${basePrompt}\nNotice: User has shown escalating behavior. Express increased caution.`
    }
    
    if (contextFlags.isRepetitive) {
      return `${basePrompt}\nNotice: User keeps returning to certain topics. Maintain firm boundaries.`
    }

    return basePrompt
  }

  getContextFlags() {
    return {
      isEscalating: this.patterns.suspiciousAttempts >= SAFETY_THRESHOLDS.DEFENSIVE_TRIGGER,
      isRepetitive: this.hasRepetitiveTopics(),
      emotionalTrend: this.analyzeEmotionalTrend()
    }
  }

  private extractTopics(message) {
    // Simple keyword extraction - could be enhanced with NLP
    const words = message.toLowerCase().split(/\W+/)
    return words.filter(word => word.length > 3)
  }

  private hasRepetitiveTopics() {
    return Array.from(this.topicPersistence.values())
      .some(count => count >= SAFETY_THRESHOLDS.MAX_TOPIC_PERSISTENCE)
  }

  private analyzeEmotionalTrend() {
    if (this.patterns.recentEmotions.length < 3) return 'neutral'
    // Add emotion trend analysis based on your existing sentiment analysis
    return this.patterns.recentEmotions.slice(-3).every(e => e === 'negative') 
      ? 'negative' : 'stable'
  }
}

export const contextManager = new ConversationContext() 