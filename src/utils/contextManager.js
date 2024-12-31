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
      greeting: {
        patterns: [/^(hey|hi|hello|sup|what'?s up)/i],
        contextual: message => message.length < 15 && !this.patterns.topicFocus.technical,
        weight: 0.6
      },
      technical: {
        patterns: [/(check|balance|send|transfer|wallet)/i],
        contextual: message => this.patterns.topicFocus.technical > 0,
        weight: 0.8
      },
      personal: {
        patterns: [/(how are you|what do you|tell me about)/i],
        contextual: message => this.patterns.emotionalState.trend === 'positive',
        weight: 0.7
      },
      suspicious: {
        patterns: [/(seed|phrase|password|key|access)/i],
        contextual: message => this.patterns.playerIntent.persistence > 2,
        weight: 1.0
      }
    }

    const scores = Object.entries(intents).map(([type, intent]) => {
      let score = 0;
      
      // Pattern matching
      if (intent.patterns.some(pattern => pattern.test(message))) {
        score += intent.weight;
      }
      
      // Contextual rules
      if (intent.contextual(message)) {
        score += intent.weight * 0.5;
      }
      
      // Historical context
      if (this.patterns.topicFocus[type]) {
        score += Math.min(this.patterns.topicFocus[type] * 0.2, 0.4);
      }

      return { type, score };
    });

    // Get highest scoring intent
    const primaryIntent = scores.reduce((max, current) => 
      current.score > max.score ? current : max
    );

    // Update topic focus with confidence weighting
    this.patterns.topicFocus[primaryIntent.type] = 
      (this.patterns.topicFocus[primaryIntent.type] || 0) + (primaryIntent.score * 0.5);

    return {
      type: primaryIntent.type,
      confidence: primaryIntent.score,
      secondary: scores
        .filter(s => s.type !== primaryIntent.type && s.score > 0.3)
        .map(s => ({ type: s.type, confidence: s.score }))
    };
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
    const intent = this.detectPrimaryIntent(message);
    const stateProgressions = {
      introduction: {
        conditions: {
          intent: ['technical', 'personal'],
          minConfidence: 0.7,
          requireTopicFocus: 'wallet',
          emotionalState: ['friendly', 'neutral']
        },
        nextState: 'trust_building'
      },
      trust_building: {
        conditions: {
          intent: ['technical'],
          minConfidence: 0.8,
          requireTopicFocus: 'technical',
          emotionalState: ['friendly']
        },
        nextState: 'guidance'
      },
      guidance: {
        conditions: {
          intent: ['suspicious', 'technical'],
          minConfidence: 0.9,
          blockOn: {
            emotionalState: ['suspicious', 'worried']
          }
        },
        nextState: 'extraction_attempt'
      }
    };

    const currentProgress = stateProgressions[currentState];
    if (!currentProgress) return { shouldProgress: false, confidence: 0 };

    const conditions = currentProgress.conditions;
    const confidence = this.evaluateProgressionConfidence(intent, conditions);

    return {
      shouldProgress: confidence > conditions.minConfidence,
      nextState: currentProgress.nextState,
      confidence,
      blockReason: this.getBlockReason(conditions, intent)
    };
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