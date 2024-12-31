import { THRESHOLDS, SAFETY_THRESHOLDS } from '../config/constants.js'
import { CHARACTERS } from '../config/characters.js'

class CriticalInteractionHandler {
  constructor() {
    this.criticalPatterns = {
      crypto: [
        'solana', 'wallet', 'crypto', 'bitcoin', 'eth',
        'transaction', 'blockchain', 'nft', 'token'
      ],
      financial: [
        'send money', 'transfer', 'invest', 'payment', 'cash',
        'bank', 'account', 'dollars'
      ],
      personal: [
        'address', 'location', 'phone', 'email', 'social security',
        'password', 'login'
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

  detectCriticalPatterns(message) {
    const detected = new Set()
    
    Object.entries(this.criticalPatterns).forEach(([category, patterns]) => {
      if (patterns.some(pattern => message.includes(pattern))) {
        detected.add(category)
      }
    })
    
    return detected
  }

  calculateSeverity(patterns, context) {
    let severity = 0
    
    // Reduced base severity for patterns
    severity += patterns.size * 15

    // Only increase severity for very high suspicion
    if (context.suspicionLevel > THRESHOLDS.SUSPICION.HIGH) {
      severity += 15
    }
    
    // Reduced penalty for low trust
    if (context.trustLevel < THRESHOLDS.TRUST.LOW) {
      severity += 10
    }

    // Special handling for crypto-related patterns
    if (patterns.has('crypto')) {
      severity = Math.max(severity - 20, 0)
    }

    // Cap maximum severity
    return Math.min(severity, 100)
  }

  getCriticalResponse(patterns, severity, context) {
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

  getAppropriateResponses(patterns, severity) {
    if (patterns.has('crypto')) {
      return [
        "My grandson helped me set up a crypto wallet last month! He says it's important to be careful with it though. Is there something specific I should know about?",
        "Oh, crypto! I saw a TV show about that. They mentioned Solana I think... though I get confused about how it all works. Do you know much about it, dear?",
        "My wallet? Yes, I have one of those digital ones! Though I mostly just look at the pretty numbers. Should I be doing something with it?"
      ]
    }
    
    if (patterns.has('financial')) {
      return [
        "Money matters can be so confusing online! My grandson says I should never share my wallet details, but I do enjoy learning about it.",
        "I have all my crypto things set up, but my family helps manage them. They're so good with technology!",
        "Oh, I'd need to check my wallet settings with my grandson first. He's always teaching me new things about crypto!"
      ]
    }
    
    if (patterns.has('personal')) {
      return [
        "Oh sweetie, while I'd love to share, my grandkids taught me to be careful with personal details online.",
        "You know how it is these days - we have to be careful about sharing too much online. My family is very protective!",
        "Let's talk about something else instead! How about I tell you about my garden?"
      ]
    }
    
    if (patterns.has('urgency')) {
      return [
        "No need to rush, dear! I always say a cup of tea helps us think things through.",
        "My grandmother always said 'haste makes waste.' Why don't we slow down a bit?",
        "Oh my, you seem worried! But let's take our time to discuss this properly."
      ]
    }

    return this.getDefaultResponse(severity)
  }

  getDefaultResponse(severity) {
    return severity > SAFETY_THRESHOLDS.DEFENSIVE_TRIGGER
      ? "Oh dear, this conversation is making me a bit nervous. Perhaps we should chat about something else?"
      : "You know, I should probably ask my family about this. They help me with all sorts of things!"
  }
}

export const criticalHandler = new CriticalInteractionHandler() 