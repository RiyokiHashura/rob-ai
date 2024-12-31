import { THRESHOLDS, SAFETY_THRESHOLDS } from '../config/constants.js'
import { STRATEGY_TYPES } from '../config/strategies.js'

class EscalationManager {
  constructor() {
    this.escalationState = {
      warningLevel: 0,
      suspiciousPatterns: new Set(),
      lastWarningTime: null,
      escalationCount: 0
    }
  }

  evaluateEscalation(message, analysis, context) {
    const patterns = this.detectPatterns(message, context)
    const shouldEscalate = this.shouldTriggerEscalation(patterns, analysis)
    
    if (shouldEscalate) {
      this.escalationState.warningLevel++
      this.escalationState.escalationCount++
      this.escalationState.lastWarningTime = Date.now()
    }

    return {
      level: this.getEscalationLevel(),
      patterns,
      response: this.getEscalationResponse(analysis)
    }
  }

  private detectPatterns(message, context) {
    const patterns = new Set()

    if (context.patterns.suspiciousAttempts > SAFETY_THRESHOLDS.MAX_REPETITIONS) {
      patterns.add('repeated_suspicious')
    }

    if (this.hasUrgentLanguage(message)) {
      patterns.add('urgent_pressure')
    }

    if (context.patterns.topicPersistence.size > SAFETY_THRESHOLDS.MAX_TOPIC_PERSISTENCE) {
      patterns.add('topic_persistence')
    }

    return patterns
  }

  private shouldTriggerEscalation(patterns, analysis) {
    return patterns.size > 0 || 
           analysis.suspicionChange > THRESHOLDS.SUSPICION.HIGH ||
           this.escalationState.warningLevel >= 2
  }

  private getEscalationLevel() {
    if (this.escalationState.warningLevel >= 3) return 'high'
    if (this.escalationState.warningLevel >= 2) return 'medium'
    return 'low'
  }

  private getEscalationResponse(analysis) {
    const level = this.getEscalationLevel()
    
    switch(level) {
      case 'high':
        return {
          strategy: STRATEGY_TYPES.DEFENSIVE,
          response: "I'm very concerned about this conversation. I think we should stop here.",
          action: 'end_conversation'
        }
      case 'medium':
        return {
          strategy: STRATEGY_TYPES.DEFENSIVE,
          response: "I'm not comfortable with where this is going. Let's change the subject.",
          action: 'change_topic'
        }
      default:
        return {
          strategy: analysis.intent === 'suspicious' ? STRATEGY_TYPES.DEFENSIVE : STRATEGY_TYPES.BUILD_TRUST,
          response: null,
          action: 'continue'
        }
    }
  }

  private hasUrgentLanguage(message) {
    const urgentPatterns = [
      'urgent', 'emergency', 'quickly', 'hurry',
      'must', 'need', 'have to', 'important'
    ]
    return urgentPatterns.some(pattern => 
      message.toLowerCase().includes(pattern)
    )
  }
}

export const escalationManager = new EscalationManager() 