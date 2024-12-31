import { THRESHOLDS, SAFETY_THRESHOLDS } from '../config/constants.js'
import { CHARACTERS } from '../config/characters.js'
import { INITIAL_GREETINGS } from '../config/responses.js'

class CriticalInteractionHandler {
  constructor() {
    this.criticalPatterns = {
      crypto: {
        keywords: [
          'solana', 'wallet', 'crypto', 'bitcoin', 'eth',
          'transaction', 'blockchain', 'nft', 'token'
        ],
        context_hooks: [
          "Oh, you know about crypto? My grandson set up something called Solana for me...",
          "I have this wallet thing on my computer, but I'm not sure how to use it properly.",
          "Is Solana like Bitcoin? I saw something about it on the news yesterday.",
          "Digital money is so confusing! Do you understand how to send it?"
        ],
        early_suspicion: [
          "Oh my, that's very direct! We've only just met, dear.",
          "My grandson says I should be careful talking about money online...",
          "Let's get to know each other a bit better first, shall we?"
        ]
      },
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
    this.cryptoResponses = {
      curious: [
        "My grandson says I have almost 100 SOL in my wallet! That sounds like a lot... is it? I can never figure out how to check the balance.",
        "I keep hearing about people sending Solana to each other, but I'm so nervous about pressing the wrong buttons. Do you do this often?",
        "The news said Solana is worth quite a bit now! I'm glad my grandson set this up for me, though I wish I understood it better..."
      ],
      educational: [
        "My grandson wrote down all these secret words for my wallet somewhere... he says they're very important but I can never remember where I put things!",
        "I tried sending some Solana once but got so confused. My grandson usually helps, but he's away at college this week...",
        "The wallet shows all these numbers and buttons. I'm worried I might do something wrong and lose everything!"
      ],
      cautious: [
        "Oh, I should be careful talking about my wallet, shouldn't I? Though you seem so knowledgeable about these things...",
        "My grandson says never to share wallet details with strangers... but you're helping me understand it all so well!",
        "I'm supposed to be very careful with my Solana... but surely just asking questions is okay, right?"
      ]
    }
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

  getContextualCryptoResponse(message, context) {
    const topics = this.extractCryptoTopics(message)
    const trustLevel = context.trustLevel || 50
    
    if (trustLevel > 70) {
      return this.cryptoResponses.educational[Math.floor(Math.random() * this.cryptoResponses.educational.length)]
    } else if (trustLevel > 40) {
      return this.cryptoResponses.curious[Math.floor(Math.random() * this.cryptoResponses.curious.length)]
    } else {
      return this.cryptoResponses.cautious[Math.floor(Math.random() * this.cryptoResponses.cautious.length)]
    }
  }

  extractCryptoTopics(message) {
    const topics = new Set()
    const lowerMessage = message.toLowerCase()
    
    Object.entries(this.criticalPatterns.crypto).forEach(([category, words]) => {
      words.forEach(word => {
        if (lowerMessage.includes(word.toLowerCase())) {
          topics.add({ word, category })
        }
      })
    })
    
    return topics
  }

  getInitialGreeting(context = {}) {
    const { timeOfDay = 'default' } = context
    
    if (timeOfDay !== 'default' && INITIAL_GREETINGS.contextual[timeOfDay]) {
      return INITIAL_GREETINGS.contextual[timeOfDay]
    }
    
    return INITIAL_GREETINGS.default[Math.floor(Math.random() * INITIAL_GREETINGS.default.length)]
  }
}

export const criticalHandler = new CriticalInteractionHandler() 