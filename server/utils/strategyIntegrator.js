import { STRATEGIES, STRATEGY_TYPES } from '../config/strategies.js'
import { STRATEGY_PROMPTS } from '../config/prompts.js'
import { THRESHOLDS } from '../config/constants.js'
import { contextManager } from './contextManager.js'
import { escalationManager } from './escalationManager.js'

class StrategyIntegrator {
  constructor() {
    this.activeStrategy = STRATEGY_TYPES.BUILD_TRUST
  }

  determineStrategy(metrics, context) {
    // Check escalation first
    const escalation = escalationManager.evaluateEscalation(
      context.message,
      context.analysis,
      contextManager.getContextFlags()
    )

    if (escalation.level !== 'low') {
      return {
        type: STRATEGY_TYPES.DEFENSIVE,
        phase: this.determinePhase(metrics, STRATEGY_TYPES.DEFENSIVE),
        escalation
      }
    }

    // Default strategy selection based on metrics
    const strategy = metrics.suspicionLevel > THRESHOLDS.SUSPICION.HIGH
      ? STRATEGY_TYPES.DEFENSIVE
      : STRATEGY_TYPES.BUILD_TRUST

    return {
      type: strategy,
      phase: this.determinePhase(metrics, strategy),
      escalation: null
    }
  }

  enhancePrompt(basePrompt, strategy, metrics) {
    const strategyConfig = STRATEGIES[strategy.type]
    const phase = strategy.phase
    const prompts = STRATEGY_PROMPTS[strategy.type].phases[phase]

    // Select a random prompt enhancement
    const enhancement = prompts[Math.floor(Math.random() * prompts.length)]

    return `${basePrompt}
            Strategy: ${strategyConfig.description}
            Phase: ${phase}
            Suggested approach: ${enhancement}
            ${strategy.escalation ? `Caution: ${strategy.escalation.response.response}` : ''}`
  }

  private determinePhase(metrics, strategyType) {
    const { trustLevel } = metrics
    
    if (strategyType === STRATEGY_TYPES.DEFENSIVE) {
      return metrics.suspicionLevel >= THRESHOLDS.SUSPICION.HIGH ? 'high' 
           : metrics.suspicionLevel >= THRESHOLDS.SUSPICION.MEDIUM ? 'medium'
           : 'low'
    }

    return trustLevel >= THRESHOLDS.TRUST.HIGH ? 'high'
         : trustLevel >= THRESHOLDS.TRUST.MEDIUM ? 'medium'
         : 'low'
  }

  getSuggestions(strategy, metrics) {
    const phase = this.determinePhase(metrics, strategy.type)
    return STRATEGIES[strategy.type].phases[phase].suggestions
  }
}

export const strategyIntegrator = new StrategyIntegrator() 