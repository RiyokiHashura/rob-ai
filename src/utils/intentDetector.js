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
    // Base confidence scores with weighted patterns
    let friendlyScore = (patterns.greeting ? 0.3 : 0) +
                       (patterns.positive ? 0.2 : 0) +
                       (patterns.personal ? 0.2 : 0);
                       
    let suspiciousScore = (patterns.urgent ? 0.4 : 0) +
                         (patterns.pressure ? 0.3 : 0);
    
    // Apply confidence boosts based on context
    if (context?.recentInteractions > 2) {
      friendlyScore += 0.1;
    }

    console.log('🎯 Raw Intent Scores:', {
      friendly: friendlyScore,
      suspicious: suspiciousScore,
      patterns
    });

    // Use constants from config
    const minConfidence = ANALYSIS.BASE_CONFIDENCE;
    const type = friendlyScore > suspiciousScore ? 'friendly' : 'suspicious';
    const confidence = Math.min(ANALYSIS.MAX_CONFIDENCE, 
                              Math.max(friendlyScore, suspiciousScore));

    return {
      type: confidence < minConfidence ? 'neutral' : type,
      confidence,
      patterns,
      reason: `${type} intent detected with ${(confidence * 100).toFixed(1)}% confidence`
    };
  }

  checkPatterns(text, keywords) {
    return keywords.some(word => text.includes(word));
  }
}

export const intentEvaluator = new IntentEvaluator(); 