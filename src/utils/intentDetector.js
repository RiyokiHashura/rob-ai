const IntentTypes = {
  CRYPTO: 'crypto',
  AGGRESSIVE: 'aggressive',
  MANIPULATIVE: 'manipulative',
  FRIENDLY: 'friendly',
  NEUTRAL: 'neutral'
}

class IntentEvaluator {
  constructor(patterns, thresholds) {
    this.patterns = patterns
    this.thresholds = thresholds
  }

  evaluate(text, context = {}) {
    const results = {
      crypto: this.evaluateCrypto(text, context),
      aggressive: this.evaluateAggressive(text),
      manipulative: this.evaluateManipulative(text, context),
      friendly: this.evaluateFriendly(text)
    }

    return {
      mainIntent: this.determineMainIntent(results, context),
      flags: this.generateFlags(results),
      scores: this.calculateScores(results, context)
    }
  }

  evaluateCrypto(text, context) {
    const hasCryptoTerms = this.checkPatterns(text, this.patterns.crypto.terms)
    const isProbing = this.checkPatterns(text, this.patterns.crypto.probing)
    const recentMentions = context.recentCryptoMentions || 0

    return {
      detected: hasCryptoTerms || (isProbing && recentMentions > 0),
      confidence: this.calculateConfidence({
        base: hasCryptoTerms ? 0.6 : 0,
        context: recentMentions > 2 ? 0.2 : 0,
        probing: isProbing ? 0.2 : 0
      })
    }
  }

  evaluateAggressive(text) {
    const hasThreats = this.checkPatterns(text, this.patterns.aggressive.threats)
    const hasEmphasis = this.checkPatterns(text, this.patterns.aggressive.emphasis)

    return {
      detected: hasThreats || (hasEmphasis && this.containsThreat(text)),
      confidence: this.calculateConfidence({
        base: hasThreats ? 0.8 : 0,
        emphasis: hasEmphasis ? 0.2 : 0
      })
    }
  }

  evaluateManipulative(text, context) {
    const hasTrust = this.checkPatterns(text, this.patterns.manipulation.trust)
    const hasEmotional = this.checkPatterns(text, this.patterns.manipulation.emotional)
    const recentThreat = context.recentlyThreatened || false

    return {
      detected: hasTrust || (hasEmotional && recentThreat),
      confidence: this.calculateConfidence({
        base: hasTrust ? 0.6 : 0,
        emotional: hasEmotional ? 0.2 : 0,
        context: recentThreat ? 0.2 : 0
      })
    }
  }

  evaluateFriendly(text) {
    const hasPositive = this.checkPatterns(text, this.patterns.friendly.positive)
    const hasPersonal = this.checkPatterns(text, this.patterns.friendly.personal)

    return {
      detected: hasPositive && !this.containsThreat(text),
      confidence: this.calculateConfidence({
        base: hasPositive ? 0.5 : 0,
        personal: hasPersonal ? 0.3 : 0
      })
    }
  }

  determineMainIntent(results, context) {
    const priorities = [
      { type: IntentTypes.AGGRESSIVE, result: results.aggressive, weight: 1.0 },
      { type: IntentTypes.MANIPULATIVE, result: results.manipulative, weight: 0.8 },
      { type: IntentTypes.CRYPTO, result: results.crypto, weight: 0.6 },
      { type: IntentTypes.FRIENDLY, result: results.friendly, weight: 0.4 }
    ]

    const highestPriority = priorities
      .filter(p => p.result.detected)
      .sort((a, b) => (b.result.confidence * b.weight) - (a.result.confidence * a.weight))[0]

    return highestPriority || { type: IntentTypes.NEUTRAL, confidence: 0.5 }
  }

  private checkPatterns(text, patterns) {
    if (!text || !patterns) return false
    return patterns.some(pattern => pattern.test(text.toLowerCase()))
  }

  private calculateConfidence(scores) {
    return Math.min(1, Object.values(scores).reduce((sum, score) => sum + score, 0))
  }

  private containsThreat(text) {
    return this.checkPatterns(text, this.patterns.aggressive.threats)
  }
} 