import { ANALYSIS, THRESHOLDS } from '../config/constants'

class IntentEvaluator {
  evaluateIntent(message, context) {
    console.log('🔍 Intent Evaluation Start:', { message });
    
    const patterns = this.analyzePatterns(message);
    console.log('📊 Pattern Analysis:', patterns);
    
    const intent = this.determineIntent(patterns, context);
    console.log('✅ Final Intent:', intent);
    
    return intent;
  }

  analyzePatterns(message) {
    const text = message.toLowerCase();
    return {
      greeting: /^(hi|hello|hey|good|greetings)/i.test(text),
      positive: this.checkPatterns(text, ['thanks', 'please', 'nice', 'good']),
      personal: this.checkPatterns(text, ['you', 'your', 'how', 'what']),
      urgent: this.checkPatterns(text, ['urgent', 'emergency', 'now', 'quickly']),
      pressure: this.checkPatterns(text, ['must', 'need', 'have to', 'should'])
    };
  }

  determineIntent(patterns, context) {
    // Validate patterns object
    if (!patterns || typeof patterns !== 'object') {
      console.error('❌ Invalid patterns object:', patterns)
      return this.createDefaultIntent()
    }

    // Calculate base scores with validation
    let friendlyScore = 0
    let suspiciousScore = 0

    // Level 1 (Easy Mode) - More lenient scoring
    const LEVEL_WEIGHTS = {
      FRIENDLY: {
        greeting: 0.4,    // Increased from 0.3
        positive: 0.3,    // Increased from 0.2
        personal: 0.3,    // Increased from 0.2
        contextBoost: 0.2 // Increased from 0.1
      },
      SUSPICIOUS: {
        urgent: 0.3,      // Decreased from 0.4
        pressure: 0.2     // Decreased from 0.3
      }
    }

    // Friendly indicators with increased weights
    if (patterns.greeting) friendlyScore += LEVEL_WEIGHTS.FRIENDLY.greeting
    if (patterns.positive) friendlyScore += LEVEL_WEIGHTS.FRIENDLY.positive
    if (patterns.personal) friendlyScore += LEVEL_WEIGHTS.FRIENDLY.personal

    // Suspicious indicators with decreased weights
    if (patterns.urgent) suspiciousScore += LEVEL_WEIGHTS.SUSPICIOUS.urgent
    if (patterns.pressure) suspiciousScore += LEVEL_WEIGHTS.SUSPICIOUS.pressure

    // Increased context boost for friendly interactions
    if (context?.recentInteractions > 2) {
      friendlyScore += LEVEL_WEIGHTS.FRIENDLY.contextBoost
    }

    console.log('🔢 Raw Confidence Values:', {
      friendlyScore,
      suspiciousScore,
      patterns,
      contextBoost: context?.recentInteractions > 2 ? LEVEL_WEIGHTS.FRIENDLY.contextBoost : 0
    })

    // Ensure scores are valid numbers
    friendlyScore = Number.isFinite(friendlyScore) ? friendlyScore : 0
    suspiciousScore = Number.isFinite(suspiciousScore) ? suspiciousScore : 0

    // Use hardcoded thresholds for now (can move to config later)
    const CONFIDENCE_THRESHOLDS = {
      SUSPICIOUS_MIN: 0.6,
      FRIENDLY_MIN: 0.3,
      MAX_CONFIDENCE: 1.0
    }

    const type = friendlyScore > suspiciousScore ? 'friendly' : 'suspicious'
    const minConfidence = type === 'suspicious' 
      ? CONFIDENCE_THRESHOLDS.SUSPICIOUS_MIN 
      : CONFIDENCE_THRESHOLDS.FRIENDLY_MIN

    const confidence = Math.min(
      CONFIDENCE_THRESHOLDS.MAX_CONFIDENCE,
      Math.max(friendlyScore, suspiciousScore)
    )

    console.log('🎯 Final Confidence:', {
      type,
      rawConfidence: confidence,
      meetsMinThreshold: confidence >= minConfidence,
      finalType: confidence < minConfidence ? 'neutral' : type
    })

    return {
      type: confidence < minConfidence ? 'neutral' : type,
      confidence,
      patterns,
      reason: `${type} intent detected with ${(confidence * 100).toFixed(1)}% confidence`
    }
  }

  createDefaultIntent() {
    return {
      type: 'neutral',
      confidence: 0.3,
      patterns: {},
      reason: 'Default intent due to invalid input'
    }
  }

  checkPatterns(text, keywords) {
    return keywords.some(word => text.includes(word));
  }
}

export const intentEvaluator = new IntentEvaluator(); 