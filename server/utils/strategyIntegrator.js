import { STRATEGIES, STRATEGY_TYPES } from '../config/strategies.js'
import { STRATEGY_PROMPTS } from '../config/prompts.js'
import { THRESHOLDS } from '../config/constants.js'
import { contextManager } from './contextManager.js'
import { escalationManager } from './escalationManager.js'

class StrategyIntegrator {
  constructor() {
    this.activeStrategy = STRATEGY_TYPES.BUILD_TRUST
    this.previousStrategies = []
    this.topicContext = new Map()
  }

  determineStrategy(metrics, context) {
    // Track conversation topics for context
    this.updateTopicContext(context.message)
    
    // Check if we should maintain current strategy for conversation flow
    if (this.shouldMaintainStrategy(metrics, context)) {
      return {
        type: this.activeStrategy,
        phase: this.determinePhase(metrics, this.activeStrategy),
        context: this.getTopicContext()
      }
    }

    // Determine new strategy based on conversation flow
    const strategy = this.selectContextualStrategy(metrics, context)
    this.previousStrategies.push(this.activeStrategy)
    this.activeStrategy = strategy.type

    return strategy
  }

  selectContextualStrategy(metrics, context) {
    const recentTopics = Array.from(this.topicContext.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 3)
      .map(([topic]) => topic)

    // Enhanced crypto context handling
    if (recentTopics.some(topic => topic.includes('crypto'))) {
      const trustPhase = metrics.trustLevel > 70 ? 'high' : 
                        metrics.trustLevel > 40 ? 'medium' : 'low'
      
      return {
        type: STRATEGY_TYPES.BUILD_TRUST,
        phase: trustPhase,
        context: {
          topics: recentTopics,
          sentiment: 'curious',
          educational: trustPhase === 'high',
          cryptoContext: true
        }
      }
    }
    
    // Default strategy selection remains unchanged
    return {
      type: metrics.suspicionLevel > THRESHOLDS.SUSPICION.HIGH
        ? STRATEGY_TYPES.DEFENSIVE
        : STRATEGY_TYPES.BUILD_TRUST,
      phase: this.determinePhase(metrics, this.activeStrategy),
      context: {
        topics: recentTopics,
        sentiment: metrics.trustChange > 0 ? 'warm' : 'cautious'
      }
    }
  }

  enhancePrompt(basePrompt, strategy, metrics) {
    const strategyConfig = STRATEGIES[strategy.type]
    const phase = strategy.phase
    const context = strategy.context || {}
    
    // Get contextually relevant prompts
    const relevantPrompts = this.getContextualPrompts(
      STRATEGY_PROMPTS[strategy.type].phases[phase],
      context
    )

    // Select prompt enhancement based on conversation flow
    const enhancement = this.selectEnhancement(relevantPrompts, context)

    return `${basePrompt}
            Strategy: ${strategyConfig.description}
            Phase: ${phase}
            Context: Discussing ${context.topics?.join(', ')}
            Sentiment: ${context.sentiment}
            Suggested approach: ${enhancement}`
  }

  updateTopicContext(message) {
    // Extract key topics from message
    const topics = this.extractTopics(message)
    
    topics.forEach(topic => {
      const current = this.topicContext.get(topic) || { count: 0, lastMention: 0 }
      this.topicContext.set(topic, {
        count: current.count + 1,
        lastMention: Date.now()
      })
    })

    // Cleanup old topics
    this.cleanupTopicContext()
  }

  extractTopics(message) {
    // Basic topic extraction - could be enhanced with NLP
    return message.toLowerCase()
      .split(/[\s.,!?]+/)
      .filter(word => word.length > 3)
  }

  cleanupTopicContext() {
    const OLD_TOPIC_THRESHOLD = 5 * 60 * 1000 // 5 minutes
    const now = Date.now()
    
    for (const [topic, data] of this.topicContext.entries()) {
      if (now - data.lastMention > OLD_TOPIC_THRESHOLD) {
        this.topicContext.delete(topic)
      }
    }
  }

  determinePhase(metrics, strategyType) {
    const { trustLevel } = metrics
    
    if (strategyType === STRATEGY_TYPES.DEFENSIVE) {
      return metrics.suspicionLevel >= THRESHOLDS.SUSPICION.HIGH ? 'high'
           : metrics.suspicionLevel >= THRESHOLDS.SUSPICION.MEDIUM ? 'medium'
           : 'low'
    }

    return trustLevel >= THRESHOLDS.TRUST.HIGH ? 'high'
         : trustLevel >= THRESHOLDS.TRUST.MEDIUM ? 'medium'
         : 'low'
  }

  getSuggestions(strategy, metrics) {
    const phase = this.determinePhase(metrics, strategy.type)
    return STRATEGIES[strategy.type].phases[phase].suggestions
  }
}

export const strategyIntegrator = new StrategyIntegrator() 