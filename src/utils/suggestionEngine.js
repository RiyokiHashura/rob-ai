import { THRESHOLDS, SAFE_DEFAULTS } from '../config/constants'
import { logAPI } from './common/logger'

class SuggestionEngine {
  constructor() {
    this.thresholds = THRESHOLDS.SUGGESTIONS
  }

  generateSuggestions(analysis, context) {
    try {
      const suggestions = []
      
      if (this.shouldAddSafetyWarning(analysis)) {
        suggestions.push(...this.getSafetyResponses())
      }
      
      if (this.shouldAddDelayTactic(analysis)) {
        suggestions.push(...this.getDelayResponses())
      }
      
      if (suggestions.length === 0) {
        suggestions.push(...this.getFriendlyResponses())
      }
      
      return suggestions.slice(0, this.thresholds.MAX_SUGGESTIONS)
      
    } catch (error) {
      logAPI.error('suggestion_generation_error', error)
      return SAFE_DEFAULTS.suggestions
    }
  }

  getSafetyResponses() {
    return [
      "I need to check with my family first.",
      "I'm not comfortable with this.",
      "Let me think about it and get back to you."
    ]
  }

  getDelayResponses() {
    return [
      "I'll need some time to consider this.",
      "Can we discuss this later?",
      "I'd like to sleep on this decision."
    ]
  }

  getFriendlyResponses() {
    return [
      "That's interesting, tell me more.",
      "I appreciate you sharing that.",
      "Let's keep chatting about this."
    ]
  }

  shouldAddSafetyWarning(analysis) {
    return analysis.metrics.suspicionChange > this.thresholds.SUSPICION_TRIGGER ||
           analysis.intent.type === 'suspicious'
  }

  shouldAddDelayTactic(analysis) {
    return analysis.metrics.trustChange < 0 ||
           analysis.context.topicPersistence.isRepetitive
  }
}

export const suggestionEngine = new SuggestionEngine()