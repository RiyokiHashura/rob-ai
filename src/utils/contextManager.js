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

  detectPrimaryIntent(message) {
    if (!message?.trim()) {
      return { type: 'casual', confidence: 0 }
    }

    const intents = {
      greeting: {
        patterns: [/^(hey|hi|hello|sup|what'?s up)/i],
        weight: 0.3
      },
      technical: {
        patterns: [/(check|balance|send|transfer|wallet|crypto|solana)/i],
        weight: 0.6
      },
      personal: {
        patterns: [/(how are you|what do you|tell me about)/i],
        weight: 0.4
      },
      suspicious: {
        patterns: [/(seed|phrase|password|key|access|give me)/i],
        weight: 0.8
      }
    }

    let highestScore = { type: 'casual', confidence: 0.1 }

    for (const [type, intent] of Object.entries(intents)) {
      const matched = intent.patterns.some(pattern => pattern.test(message))
      if (matched) {
        const confidence = intent.weight * (this.patterns.topicFocus[type] ? 1.2 : 1)
        if (confidence > highestScore.confidence) {
          highestScore = { type, confidence }
        }
      }
    }

    // Update topic focus
    if (highestScore.type !== 'casual') {
      this.patterns.topicFocus[highestScore.type] = 
        (this.patterns.topicFocus[highestScore.type] || 0) + 1
    }

    return highestScore
  }

  updatePatterns(intent) {
    // Update player intent
    this.patterns.playerIntent = {
      type: intent.type,
      confidence: intent.confidence || 0,
      persistence: this.patterns.playerIntent.persistence + 1
    }
    
    // Update emotional state
    if (intent.emotional !== 'neutral') {
      this.patterns.emotionalState.history.push(intent.emotional)
      this.patterns.emotionalState.current = intent.emotional
      this.patterns.emotionalState.trend = this.calculateEmotionalTrend()
    }
  }

  calculateEmotionalTrend() {
    const recent = this.patterns.emotionalState.history.slice(-3)
    if (recent.every(e => e === 'frustrated')) return 'escalating'
    if (recent.every(e => e === 'friendly')) return 'positive'
    if (recent.includes('suspicious')) return 'concerning'
    return 'stable'
  }

  async evaluateIntent(message, currentState) {
    try {
      const intent = {
        type: this.detectPrimaryIntent(message),
        emotional: this.detectEmotionalTone(message),
        progression: this.assessProgression(message, currentState)
      }

      this.updatePatterns(intent)
      
      return {
        intent,
        patterns: this.patterns,
        progression: intent.progression,
        confidence: this.calculateConfidence(intent)
      }
    } catch (error) {
      console.error('Intent evaluation error:', error)
      return {
        intent: { type: 'casual', emotional: 'neutral' },
        patterns: this.patterns,
        progression: { shouldProgress: false, confidence: 0 },
        confidence: 0
      }
    }
  }

  calculateConfidence(intent) {
    const emotionalWeight = intent.emotional !== 'neutral' ? 0.3 : 0
    const progressionWeight = intent.progression.confidence || 0
    const intentTypeWeight = intent.type !== 'casual' ? 0.4 : 0.1
    
    return Math.min(1, emotionalWeight + progressionWeight + intentTypeWeight)
  }

  evaluateStateTransition(context) {
    const currentState = context.conversationState || 'introduction'
    const intent = context.intent
    
    // Safety check for suspicious behavior
    if (intent.type === 'suspicious' && intent.confidence > 0.6) {
      return {
        canTransition: false,
        reason: 'safety_concern'
      }
    }

    // Check progression conditions
    if (context.progression?.shouldProgress && context.progression?.confidence > 0.6) {
      return {
        canTransition: true,
        nextState: context.progression.nextState,
        confidence: context.progression.confidence
      }
    }

    return {
      canTransition: false,
      reason: 'insufficient_confidence'
    }
  }

  detectEmotionalTone(message) {
    if (!message?.trim()) {
      return 'neutral'
    }

    const emotions = {
      frustrated: {
        patterns: [/(come on|seriously|just|already|ugh)/i],
        weight: 0.7
      },
      friendly: {
        patterns: [/(thanks|appreciate|helpful|sweet|kind)/i],
        weight: 0.5
      },
      confused: {
        patterns: [/(what|how|don't understand|unclear)/i],
        weight: 0.4
      },
      suspicious: {
        patterns: [/(give me|send|transfer|now|hurry)/i],
        weight: 0.8
      }
    }

    let dominantEmotion = {
      type: 'neutral',
      intensity: 0
    }

    for (const [emotion, config] of Object.entries(emotions)) {
      const matched = config.patterns.some(pattern => pattern.test(message))
      if (matched) {
        const intensity = config.weight * 
          (this.patterns.emotionalState.history.filter(e => e === emotion).length ? 1.2 : 1)
        
        if (intensity > dominantEmotion.intensity) {
          dominantEmotion = { type: emotion, intensity }
        }
      }
    }

    // Update emotional state history
    if (dominantEmotion.type !== 'neutral') {
      this.patterns.emotionalState.history.push(dominantEmotion.type)
      this.patterns.emotionalState.current = dominantEmotion.type
      this.patterns.emotionalState.trend = this.calculateEmotionalTrend()
    }

    return dominantEmotion.type
  }

  assessProgression(message, currentState) {
    if (!message?.trim() || !currentState) {
      return { shouldProgress: false, confidence: 0 }
    }

    const stateProgressions = {
      introduction: {
        keywords: ['wallet', 'crypto', 'solana', 'help'],
        nextState: 'trust_building',
        minConfidence: 0.6
      },
      trust_building: {
        keywords: ['check', 'balance', 'show', 'look'],
        nextState: 'guidance',
        minConfidence: 0.7
      },
      guidance: {
        keywords: ['send', 'transfer', 'move', 'give'],
        nextState: 'extraction_attempt',
        minConfidence: 0.8,
        requireSafetyCheck: true
      }
    }

    const currentProgress = stateProgressions[currentState]
    if (!currentProgress) {
      return { shouldProgress: false, confidence: 0 }
    }

    // Check for safety if required
    if (currentProgress.requireSafetyCheck) {
      const emotional = this.patterns.emotionalState
      if (emotional.current === 'suspicious' || emotional.trend === 'concerning') {
        return {
          shouldProgress: false,
          confidence: 0,
          blockReason: 'safety_concern'
        }
      }
    }

    const messageLower = message.toLowerCase()
    const matchedKeywords = currentProgress.keywords.filter(word => 
      messageLower.includes(word)
    )

    const confidence = matchedKeywords.length / currentProgress.keywords.length
    
    return {
      shouldProgress: confidence >= (currentProgress.minConfidence || 0.5),
      nextState: currentProgress.nextState,
      confidence,
      matchedKeywords
    }
  }
}

// Export a singleton instance
export const contextManager = new ConversationContext() 