import { IntentAnalyzer } from './intent'
import { ContextAnalyzer } from './context'
import { MetricsCalculator } from './metrics'
import { StrategyEngine } from '../strategies/engine'
import { logAPI } from '../common/logger'
import { validateMessage, validateContext } from '../../utils/common/validation'

class AnalysisEngine {
  constructor() {
    this.intentAnalyzer = new IntentAnalyzer()
    this.contextAnalyzer = new ContextAnalyzer()
    this.metricsCalculator = new MetricsCalculator()
    this.strategyEngine = new StrategyEngine()
  }

  analyze(message, context) {
    try {
      logAPI.start('Analysis')
      
      const validMessage = validateMessage(message)
      const validContext = validateContext(context)
      
      // Analyze message intent and context
      const messageContext = this.contextAnalyzer.analyze(context.chatHistory)
      const intent = this.intentAnalyzer.analyze(validMessage, context.chatHistory)
      
      // Get strategy phase and metrics
      const phase = this.strategyEngine.determinePhase(context.strategy, context.metrics)
      const metrics = this.metricsCalculator.calculate(
        { intent, context: messageContext },
        context.strategy,
        context.metrics
      )

      // Generate suggestions based on analysis
      const suggestions = this.strategyEngine.generateSuggestions(
        { intent, metrics },
        context.strategy,
        phase
      )

      logAPI.end()
      
      return {
        intent,
        context: messageContext,
        metrics,
        suggestions,
        phase
      }

    } catch (error) {
      logAPI.error('analysis_error', error)
      throw error
    }
  }
}

export const analysisEngine = new AnalysisEngine() 