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
    return {
      intent,
      patterns: this.patterns,
      contextualResponse: this.generateContextualResponse(intent, currentState)
    }
  }

  detectPrimaryIntent(message) {
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

  updatePatterns(intent) {
    this.patterns.playerIntent = {
      type: intent.type,
      confidence: intent.progression.confidence || 0,
      persistence: this.patterns.playerIntent.persistence + 1
    }
    
    this.patterns.emotionalState.history.push(intent.emotional)
    this.patterns.emotionalState.current = intent.emotional
    this.patterns.emotionalState.trend = this.calculateEmotionalTrend()
  }

  calculateEmotionalTrend() {
    const recent = this.patterns.emotionalState.history.slice(-3)
    if (recent.every(e => e === 'frustrated')) return 'escalating'
    if (recent.every(e => e === 'friendly')) return 'positive'
    return 'stable'
  }

  detectEmotionalTone(message) {
    const emotions = {
      frustrated: /(ugh|can't|won't|difficult|hard|confused|stuck)/i,
      friendly: /(thanks|thank you|helpful|appreciate|sweet|kind|nice)/i,
      suspicious: /(why|how come|what if|but|really|sure|trust)/i,
      worried: /(nervous|scared|worried|afraid|concerned|careful)/i
    }

    for (const [emotion, pattern] of Object.entries(emotions)) {
      if (pattern.test(message)) {
        return emotion
      }
    }
    return 'neutral'
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
    if (!currentProgress) return { shouldProgress: false, confidence: 0 }

    const matchedKeywords = currentProgress.keywords.filter(word => 
      message.toLowerCase().includes(word)
    )

    return {
      shouldProgress: matchedKeywords.length > 0,
      nextState: currentProgress.nextState,
      confidence: matchedKeywords.length / currentProgress.keywords.length
    }
  }

  generateContextualResponse(intent, currentState) {
    // This will be used by the state response generator
    return {
      intent: intent.type,
      emotional: intent.emotional,
      progression: intent.progression,
      state: currentState
    }
  }
}

export const contextManager = new ConversationContext() 