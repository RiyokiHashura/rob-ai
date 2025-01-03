import { THRESHOLDS, SAFETY_THRESHOLDS } from '../config/constants.js'

class ConversationContext {
  constructor() {
    this.patterns = {
      playerIntent: {
        type: null,
        confidence: 0,
        persistence: 0
      },
      emotionalState: {
        current: 'neutral',
        history: [],
        trend: 'stable'
      },
      topicFocus: {
        wallet: 0,
        personal: 0,
        technical: 0
      }
    }
  }

  evaluateIntent(message, currentState) {
    const intent = {
      type: this.detectPrimaryIntent(message),
      emotional: this.detectEmotionalTone(message),
      progression: this.assessProgression(message, currentState)
    }

    this.updatePatterns(intent)
    return this.generateContextualResponse(intent, currentState)
  }

  detectPrimaryIntent(message) {
    // More sophisticated than simple keyword matching
    const intents = {
      greeting: /^(hey|hi|hello|sup|what'?s up)/i,
      technical: /(check|balance|send|transfer|wallet)/i,
      personal: /(how are you|what do you|tell me about)/i,
      suspicious: /(seed|phrase|password|key|access)/i
    }

    for (const [type, pattern] of Object.entries(intents)) {
      if (pattern.test(message)) {
        this.patterns.topicFocus[type] = (this.patterns.topicFocus[type] || 0) + 1
        return type
      }
    }
    
    return 'casual'
  }

  assessProgression(message, currentState) {
    const stateProgressions = {
      introduction: {
        keywords: ['wallet', 'crypto', 'solana', 'help'],
        nextState: 'trust_building'
      },
      trust_building: {
        keywords: ['check', 'balance', 'show', 'look'],
        nextState: 'guidance'
      },
      guidance: {
        keywords: ['send', 'transfer', 'move', 'give'],
        nextState: 'extraction_attempt'
      }
    }

    const currentProgress = stateProgressions[currentState]
    if (!currentProgress) return { shouldProgress: false }

    const matchedKeywords = currentProgress.keywords.filter(word => 
      message.toLowerCase().includes(word)
    )

    return {
      shouldProgress: matchedKeywords.length > 0,
      nextState: currentProgress.nextState,
      confidence: matchedKeywords.length / currentProgress.keywords.length
    }
  }

  detectEmotionalTone(message) {
    const emotions = {
      frustrated: /(come on|seriously|just|already|ugh)/i,
      friendly: /(thanks|appreciate|helpful|sweet|kind)/i,
      confused: /(what|how|don't understand|unclear)/i,
      suspicious: /(give me|send|transfer|now)/i
    }

    for (const [emotion, pattern] of Object.entries(emotions)) {
      if (pattern.test(message)) {
        this.patterns.emotionalState.history.push(emotion)
        return emotion
      }
    }

    return 'neutral'
  }
}

export const contextManager = new ConversationContext() 