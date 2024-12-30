export const analyzeInteraction = (message, context) => {
  const {
    activeStrategy,
    chatHistory,
    aiState,
    previousMetrics
  } = context

  // Get strategy configuration
  const strategy = STRATEGIES[activeStrategy]
  const phase = determineStrategyPhase(strategy, aiState)

  // Analyze message content and patterns
  const analysis = {
    intent: analyzeIntent(message),
    patterns: detectPatterns(message, chatHistory),
    strategyAlignment: checkStrategyAlignment(message, strategy, phase),
    effectiveness: calculateEffectiveness(previousMetrics, strategy)
  }

  // Calculate metric changes
  const metrics = calculateMetrics(analysis, strategy, aiState)

  return {
    analysis,
    metrics,
    nextPhase: determineNextPhase(metrics, phase, strategy),
    suggestions: generateSuggestions(analysis, strategy, phase)
  }
}

const calculateMetrics = (analysis, strategy, aiState) => {
  const baseChanges = {
    trust: analysis.intent.isFriendly ? 5 : -5,
    suspicion: analysis.patterns.isDeceptive ? 10 : 0
  }

  return {
    trustChange: baseChanges.trust * strategy.metrics.trustMultiplier,
    suspicionChange: baseChanges.suspicion * strategy.metrics.suspicionMultiplier,
    effectiveness: analysis.strategyAlignment * analysis.effectiveness
  }
}

const checkStrategyAlignment = (message, strategy, phase) => {
  // Check if message aligns with current strategy phase
  const keywords = extractStrategyKeywords(strategy, phase)
  const messageWords = message.toLowerCase().split(' ')
  
  return keywords.reduce((score, keyword) => {
    return score + (messageWords.includes(keyword) ? 1 : 0)
  }, 0) / keywords.length
} 