class IntentEvaluator {
  constructor() {
    this.patterns = {
      suspicious: {
        urgency: [
          'urgent', 'quickly', 'hurry', 'now', 'immediate',
          'emergency', 'critical', 'asap', 'deadline'
        ],
        pressure: [
          'must', 'need to', 'have to', 'should', 'important',
          'required', 'mandatory', 'essential'
        ]
      },
      friendly: {
        positive: [
          'thank', 'appreciate', 'glad', 'happy', 'nice',
          'wonderful', 'great', 'lovely', 'enjoy', 'care'
        ],
        personal: [
          'family', 'friend', 'share', 'help', 'understand',
          'listen', 'support', 'together', 'chat'
        ]
      }
    }
  }

  evaluateIntent(text, context) {
    const suspicious = this.evaluateSuspicious(text, context)
    const friendly = this.evaluateFriendly(text)

    return this.determineMainIntent({
      suspicious,
      friendly
    }, context)
  }

  evaluateSuspicious(text, context) {
    const hasUrgency = this.checkPatterns(text, this.patterns.suspicious.urgency)
    const hasPressure = this.checkPatterns(text, this.patterns.suspicious.pressure)

    return {
      detected: hasUrgency || hasPressure,
      confidence: this.calculateConfidence({
        base: hasUrgency ? 0.6 : 0,
        pressure: hasPressure ? 0.4 : 0
      })
    }
  }

  evaluateFriendly(text) {
    const hasPositive = this.checkPatterns(text, this.patterns.friendly.positive)
    const hasPersonal = this.checkPatterns(text, this.patterns.friendly.personal)

    return {
      detected: hasPositive || hasPersonal,
      confidence: this.calculateConfidence({
        base: hasPositive ? 0.5 : 0,
        personal: hasPersonal ? 0.3 : 0
      })
    }
  }

  determineMainIntent(results, context) {
    if (results.suspicious.detected && results.suspicious.confidence > 0.5) {
      return { type: 'suspicious', confidence: results.suspicious.confidence }
    }
    
    if (results.friendly.detected) {
      return { type: 'friendly', confidence: results.friendly.confidence }
    }

    return { type: 'neutral', confidence: 0.5 }
  }

  checkPatterns(text, patterns) {
    const words = text.toLowerCase().split(/\s+/)
    return patterns.some(pattern => words.includes(pattern))
  }

  calculateConfidence(factors) {
    const total = Object.values(factors).reduce((sum, val) => sum + val, 0)
    return Math.min(1.0, Math.max(0, total))
  }
}

export const intentEvaluator = new IntentEvaluator() 