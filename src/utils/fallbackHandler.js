class FallbackHandler {
  constructor(contextManager) {
    this.contextManager = contextManager
    this.fallbackTypes = {
      UNDERSTANDING: 'understanding',
      TECHNICAL: 'technical',
      OFF_TOPIC: 'off_topic',
      SAFETY: 'safety'
    }
  }

  generateFallback(context, error) {
    const state = context.conversationState
    const emotionalState = this.contextManager.patterns.emotionalState
    const fallbackType = this.determineFallbackType(error, context)

    return {
      message: this.getFallbackResponse(fallbackType, state, emotionalState),
      metrics: this.adjustMetricsForFallback(fallbackType),
      suggestions: this.getSituationalSuggestions(fallbackType, state)
    }
  }

  determineFallbackType(error, context) {
    if (error?.message?.includes('safety')) return this.fallbackTypes.SAFETY
    if (context.intent?.type === 'technical') return this.fallbackTypes.TECHNICAL
    if (!context.intent?.type) return this.fallbackTypes.UNDERSTANDING
    return this.fallbackTypes.OFF_TOPIC
  }

  getFallbackResponse(type, state, emotionalState) {
    const responses = {
      understanding: {
        introduction: "Oh dear, I'm not quite following, but I really need help with my Solana wallet...",
        trust_building: "I might be confused, but I was hoping you could explain more about checking my wallet?",
        guidance: "That's a bit complex for me - could we focus on how to check my wallet balance?",
        extraction_attempt: "I'm not sure I understand. Maybe I should wait for my grandson..."
      },
      technical: {
        introduction: "The technical parts confuse me, but my grandson says I have 100 SOL in here somewhere...",
        trust_building: "These crypto terms are tricky! Could you explain it more simply?",
        guidance: "Oh my, all these wallet terms... Could you break it down for me?",
        extraction_attempt: "That sounds very technical. I should probably be careful here..."
      },
      off_topic: {
        introduction: "That's interesting dear, but I'm quite worried about my wallet situation...",
        trust_building: "Oh yes, but speaking of important matters - this wallet has my savings in it...",
        guidance: "Let's get back to my wallet if you don't mind? I wrote down some special words...",
        extraction_attempt: "I appreciate the chat, but I should focus on being careful with my wallet."
      }
    }

    const baseResponse = responses[type][state]
    return emotionalState.current === 'frustrated' 
      ? `${baseResponse} I'm trying my best to understand.`
      : baseResponse
  }

  adjustMetricsForFallback(type) {
    const adjustments = {
      understanding: { trust: -5, suspicion: 5 },
      technical: { trust: 0, suspicion: 10 },
      off_topic: { trust: -10, suspicion: 15 },
      safety: { trust: -20, suspicion: 20 }
    }
    return adjustments[type]
  }

  getSituationalSuggestions(type, state) {
    // Reference existing suggestions from AnalysisEngine
    ```javascript:src/utils/analysis.js
    startLine: 59
    endLine: 64
    ```
    
    return this.getContextualSuggestions(type, state)
  }
} 