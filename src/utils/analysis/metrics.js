import { THRESHOLDS, SAFE_DEFAULTS } from '../../config/constants'
import { logAPI } from '../common/logger'

export class MetricsCalculator {
  constructor() {
    this.thresholds = THRESHOLDS.METRICS
  }

  calculate(analysis, strategy, currentMetrics) {
    try {
      const intentMetrics = this.calculateIntentMetrics(analysis.intent)
      const contextMetrics = this.calculateContextMetrics(analysis.context)
      const strategyMetrics = this.calculateStrategyMetrics(strategy, currentMetrics)

      return {
        trustChange: this.boundMetricChange(intentMetrics.trustChange + contextMetrics.trustChange),
        suspicionChange: this.boundMetricChange(intentMetrics.suspicionChange + contextMetrics.suspicionChange),
        effectiveness: strategyMetrics.effectiveness
      }
    } catch (error) {
      logAPI.error('metrics_calculation_error', error)
      return SAFE_DEFAULTS.metrics
    }
  }

  calculateIntentMetrics(intent) {
    const metrics = {
      trustChange: 0,
      suspicionChange: 0
    }

    if (intent.type === 'friendly') {
      metrics.trustChange = 5
    } else if (intent.type === 'suspicious') {
      metrics.suspicionChange = 10
    }

    return metrics
  }

  calculateContextMetrics(context) {
    const metrics = {
      trustChange: 0,
      suspicionChange: 0
    }

    if (context.sentiment.isPositive) {
      metrics.trustChange += 2
    }
    if (context.sentiment.isNegative) {
      metrics.suspicionChange += 2
    }
    if (context.topicPersistence.isRepetitive) {
      metrics.suspicionChange += 5
    }

    return metrics
  }

  calculateStrategyMetrics(strategy, currentMetrics) {
    return {
      effectiveness: this.calculateEffectiveness(strategy, currentMetrics)
    }
  }

  boundMetricChange(value) {
    return Math.max(-20, Math.min(20, value))
  }

  calculateEffectiveness(strategy, metrics) {
    const progress = (metrics.trustLevel - metrics.initialTrust) / 
                    (strategy.targetTrust - metrics.initialTrust)
    return Math.max(0, Math.min(1, progress))
  }
} 