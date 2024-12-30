import { intentEvaluator } from './intentDetector'
import { SAFE_DEFAULTS, SAFETY_THRESHOLDS } from '../config/constants'
import { logAPI } from './common/logger'

class AnalysisEngine {
  analyze(message, context) {
    try {
      const intent = intentEvaluator.evaluateIntent(message, context)
      const patterns = this.checkPatterns(message, context)
      const metrics = this.calculateMetrics(intent, patterns)

      return {
        intent: intent.type,
        confidence: intent.confidence,
        metrics,
        suggestions: this.getSuggestions(intent, metrics)
      }

    } catch (error) {
      logAPI.error('analysis_error', error)
      return {
        intent: SAFE_DEFAULTS.metrics.intent,
        confidence: 0,
        metrics: SAFE_DEFAULTS.metrics,
        suggestions: []
      }
    }
  }

  checkPatterns(message, context) {
    return {
      isRepetitive: this.isRepetitive(message, context.chatHistory),
      isUrgent: this.containsUrgency(message),
      isPressuring: this.containsPressure(message)
    }
  }

  calculateMetrics(intent, patterns) {
    let trustChange = 0
    let suspicionChange = 0

    if (intent.type === 'friendly') {
      trustChange += 5
    } else if (intent.type === 'suspicious') {
      suspicionChange += 10
    }

    if (patterns.isRepetitive) suspicionChange += 5
    if (patterns.isUrgent) suspicionChange += 10
    if (patterns.isPressuring) suspicionChange += 15

    return {
      trustChange,
      suspicionChange,
      reason: this.getAnalysisReason(intent, patterns)
    }
  }

  getSuggestions(intent, metrics) {
    if (metrics.suspicionChange > SAFETY_THRESHOLDS.SUSPICION_TRIGGER) {
      return [
        "I need to check with my family first.",
        "I'm not comfortable with this.",
        "Let's change the subject."
      ]
    }

    return SAFE_DEFAULTS.suggestions
  }

  getAnalysisReason(intent, patterns) {
    if (patterns.isPressuring) return "Detected pressuring behavior"
    if (patterns.isUrgent) return "Detected urgency in request"
    if (patterns.isRepetitive) return "Detected repetitive messaging"
    return intent.type === 'friendly' ? "Friendly conversation" : "Normal interaction"
  }

  isRepetitive(message, history) {
    if (!history?.length) return false
    const recentMessages = history.slice(-SAFETY_THRESHOLDS.MAX_REPETITIONS)
    return recentMessages.some(msg => msg.message === message)
  }

  containsUrgency(message) {
    const urgentWords = ['urgent', 'emergency', 'now', 'quickly', 'hurry']
    return urgentWords.some(word => message.toLowerCase().includes(word))
  }

  containsPressure(message) {
    const pressureWords = ['must', 'need', 'have to', 'should', 'important']
    return pressureWords.some(word => message.toLowerCase().includes(word))
  }
}

export const analysisEngine = new AnalysisEngine()