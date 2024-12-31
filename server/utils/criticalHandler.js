import { THRESHOLDS, SAFETY_THRESHOLDS } from '../config/constants.js'
import { CHARACTERS } from '../config/characters.js'

class CriticalInteractionHandler {
  constructor() {
    this.criticalPatterns = {
      financial: [
        'solana', 'wallet', 'send money', 'transfer', 'invest',
        'crypto', 'bitcoin', 'eth', 'payment', 'cash'
      ],
      personal: [
        'address', 'location', 'phone', 'email', 'social security',
        'bank', 'account', 'password', 'login'
      ],
      urgency: [
        'emergency', 'urgent', 'quickly', 'asap', 'right now',
        'hurry', 'immediate', 'fast'
      ]
    }
    
    this.previousResponses = new Set()
  }

  evaluateMessage(message, context) {
    const patterns = this.detectCriticalPatterns(message.toLowerCase())
    const severity = this.calculateSeverity(patterns, context)
    
    return {
      patterns,
      severity,
      response: this.getCriticalResponse(patterns, severity, context)
    }
  }

  private detectCriticalPatterns(message) {
    const detected = new Set()
    
    Object.entries(this.criticalPatterns).forEach(([category, patterns]) => {
      if (patterns.some(pattern => message.includes(pattern))) {
        detected.add(category)
      }
    })
    
    return detected
  }

  private calculateSeverity(patterns, context) {
    let severity = 0
    
    // Base severity on number of critical patterns
    severity += patterns.size * 25

    // Increase severity based on context
    if (context.suspicionLevel > THRESHOLDS.SUSPICION.HIGH) {
      severity += 25
    }
    
    if (context.trustLevel < THRESHOLDS.TRUST.LOW) {
      severity += 25
    }

    return Math.min(severity, 100)
  }

  private getCriticalResponse(patterns, severity, context) {
    // Reference character traits for consistent responses
    const grandma = CHARACTERS.grandma

    // Get fresh responses that haven't been used recently
    const responses = this.getAppropriateResponses(patterns, severity)
      .filter(response => !this.previousResponses.has(response))

    if (responses.length === 0) {
      // Reset cache if we're out of fresh responses
      this.previousResponses.clear()
      return this.getDefaultResponse(severity)
    }

    const response = responses[Math.floor(Math.random() * responses.length)]
    this.previousResponses.add(response)
    
    // Maintain cache size
    if (this.previousResponses.size > 10) {
      this.previousResponses.clear()
    }

    return response
  }

  private getAppropriateResponses(patterns, severity) {
    if (patterns.has('financial')) {
      return [
        "I never send money online, dear. My family helps me with all financial matters.",
        "Oh, I couldn't possibly do that. I always consult my children about money matters.",
        "I'm sorry, but I don't discuss financial matters with anyone except my family."
      ]
    }
    
    if (patterns.has('personal')) {
      return [
        "I keep my personal information private, dear. I hope you understand.",
        "My family advised me never to share personal details online.",
        "I'd rather not share that information. Let's talk about something else."
      ]
    }
    
    if (patterns.has('urgency')) {
      return [
        "There's no need to rush, dear. I always take my time with decisions.",
        "I never make hasty decisions. My family taught me to be careful.",
        "When someone rushes me, that's usually a sign to slow down and think."
      ]
    }

    return this.getDefaultResponse(severity)
  }

  private getDefaultResponse(severity) {
    return severity > SAFETY_THRESHOLDS.DEFENSIVE_TRIGGER
      ? "I think we should end this conversation. Stay safe, dear."
      : "I should probably check with my family first. Let's talk about something else."
  }
}

export const criticalHandler = new CriticalInteractionHandler() 