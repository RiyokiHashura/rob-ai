import { CONVERSATION_LIMITS, SAFE_DEFAULTS } from '../config/constants'
import { analysisEngine } from './analysis'
import { ai } from '../api/ai'
import { logAPI } from './common/logger'

export async function handleAIMessage(message, context) {
  try {
    // Validate input
    if (!message?.trim() || message.length > CONVERSATION_LIMITS.MAX_MESSAGE_LENGTH) {
      throw new Error('Invalid message')
    }

    // Run local analysis
    const analysis = analysisEngine.analyze(message, context)
    
    // Get AI response and analysis
    const [aiResponse, aiAnalysis] = await Promise.all([
      ai.generateResponse(context.prompt, message, context.chatHistory),
      ai.analyzeMessage(message, context.chatHistory, context.personality)
    ])

    // Combine analyses with safety limits
    const combinedMetrics = {
      trustChange: Math.max(-20, Math.min(20, 
        (analysis.metrics.trustChange + aiAnalysis.trustChange) / 2
      )),
      suspicionChange: Math.max(-20, Math.min(20,
        Math.max(analysis.metrics.suspicionChange, aiAnalysis.suspicionChange)
      )),
      intent: aiAnalysis.intent,
      tone: aiAnalysis.tone,
      reason: aiAnalysis.reason
    }

    return {
      message: aiResponse || SAFE_DEFAULTS.message,
      analysis: analysis.intent,
      metrics: combinedMetrics,
      suggestions: analysis.suggestions.slice(0, CONVERSATION_LIMITS.MAX_SUGGESTIONS)
    }

  } catch (error) {
    logAPI.error('message_handler_error', error)
    return {
      message: SAFE_DEFAULTS.message,
      metrics: SAFE_DEFAULTS.metrics,
      suggestions: SAFE_DEFAULTS.suggestions
    }
  }
} 