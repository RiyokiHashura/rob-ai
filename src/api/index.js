import { analysisEngine } from '../utils/analysis'
import { ai } from './ai'
import { logAPI } from '../utils/common/logger'
import { SAFE_DEFAULTS } from '../config/constants'

export async function handleMessage(message, context) {
  try {
    // Run local analysis
    const analysis = analysisEngine.analyze(message, context)
    
    // Get AI response and analysis
    const [aiResponse, aiAnalysis] = await Promise.all([
      ai.generateResponse(context.prompt, message, context.chatHistory),
      ai.analyzeMessage(message, context.chatHistory, context.personality)
    ])

    // Combine local and AI analysis
    const combinedMetrics = {
      ...analysis.metrics,
      trustChange: (analysis.metrics.trustChange + aiAnalysis.trustChange) / 2,
      suspicionChange: Math.max(analysis.metrics.suspicionChange, aiAnalysis.suspicionChange),
      intent: aiAnalysis.intent,
      tone: aiAnalysis.tone,
      reason: aiAnalysis.reason
    }

    return {
      message: aiResponse,
      analysis: analysis.intent,
      metrics: combinedMetrics,
      suggestions: analysis.suggestions
    }
  } catch (error) {
    logAPI.error('message_handler', error)
    return {
      message: SAFE_DEFAULTS.message,
      metrics: SAFE_DEFAULTS.metrics,
      suggestions: SAFE_DEFAULTS.suggestions
    }
  }
} 