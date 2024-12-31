import { ANALYSIS } from '../../config/constants'
import { logAPI } from '../common/logger'

export class IntentAnalyzer {
  constructor() {
    this.historyWindow = 5
  }

  analyze(message, chatHistory) {
    console.log('🔍 Starting Intent Analysis:', { message, historyLength: chatHistory.length });

    if (!message) {
      console.warn('⚠️ Empty message received');
      return this.createNeutralIntent();
    }

    const context = this.buildContext(chatHistory);
    console.log('📊 Analysis Context:', context);

    const intent = this.evaluateIntent(message, context);
    console.log('🎯 Raw Intent:', intent);

    const trends = this.analyzeTrends(chatHistory, intent);
    console.log('📈 Intent Trends:', trends);

    const finalIntent = {
      ...intent,
      trends,
      confidence: this.calculateConfidence(intent, trends, context),
      context
    };

    console.log('✅ Final Intent Analysis:', finalIntent);
    return finalIntent;
  }

  buildContext(history) {
    const recentHistory = history.slice(-this.historyWindow)
    return {
      sentiment: this.calculateSentimentTrend(recentHistory),
      topicPersistence: this.getTopicPersistence(recentHistory),
      recentInteractions: recentHistory.length
    }
  }

  evaluateIntent(message, context) {
    const text = message.toLowerCase();
    const friendly = this.evaluateFriendlyIntent(text);
    const suspicious = this.evaluateSuspiciousIntent(text, context);
    
    console.log('🔄 Intent Evaluation:', { friendly, suspicious });
    
    return friendly.confidence > suspicious.confidence 
      ? { type: 'friendly', ...friendly }
      : { type: 'suspicious', ...suspicious };
  }

  calculateConfidence(intent, trends, context) {
    let confidence = intent.baseConfidence || 0.5
    
    if (trends.supports(intent.type)) {
      confidence *= 1.2
    }
    
    return Math.min(1.0, confidence)
  }

  createNeutralIntent() {
    return {
      type: ANALYSIS.INTENT.TYPES.NEUTRAL,
      confidence: ANALYSIS.INTENT.BASE_CONFIDENCE,
      trends: {},
      context: {}
    }
  }
} 