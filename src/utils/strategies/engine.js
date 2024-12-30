import { STRATEGIES, STRATEGY_TYPES } from '../../config/strategies'
import { THRESHOLDS } from '../../config/constants'
import { logAPI } from '../common/logger'

export class StrategyEngine {
  determinePhase(metrics) {
    const { trustLevel, suspicionLevel } = metrics

    // If suspicion is high, always use defensive strategy
    if (suspicionLevel > THRESHOLDS.SUSPICION.HIGH) {
      return {
        strategy: STRATEGY_TYPES.DEFENSIVE,
        phase: 'high'
      }
    }

    // Determine trust-based phase
    let phase = 'low'
    if (trustLevel >= THRESHOLDS.TRUST.HIGH) {
      phase = 'high'
    } else if (trustLevel >= THRESHOLDS.TRUST.MEDIUM) {
      phase = 'medium'
    }

    return {
      strategy: STRATEGY_TYPES.BUILD_TRUST,
      phase
    }
  }

  generateSuggestions(metrics, context) {
    try {
      const { strategy, phase } = this.determinePhase(metrics)
      const selectedStrategy = STRATEGIES[strategy]

      if (!selectedStrategy?.phases[phase]) {
        return selectedStrategy.fallback.suggestions
      }

      return selectedStrategy.phases[phase].suggestions

    } catch (error) {
      logAPI.error('strategy_engine_error', error)
      return STRATEGIES[STRATEGY_TYPES.BUILD_TRUST].fallback.suggestions
    }
  }
}

export const strategyEngine = new StrategyEngine() 