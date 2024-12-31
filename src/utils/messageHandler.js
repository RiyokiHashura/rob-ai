import { CONVERSATION_LIMITS, SAFE_DEFAULTS } from '../config/constants'
import { analysisEngine } from './analysis'
import { ai } from '../api/ai'
import { logAPI } from './common/logger'
import { FallbackHandler } from './fallbackHandler'

export async function handleAIMessage(message, context) {
  try {
    console.log('2. handleAIMessage called with:', { message, context })
    
    // Validate input
    if (!message?.trim() || message.length > CONVERSATION_LIMITS.MAX_MESSAGE_LENGTH) {
      throw new Error('Invalid message')
    }

    // Run local analysis
    const analysis = analysisEngine.analyze(message, context)
    console.log('2a. Local analysis:', {
      intent: analysis.intent,
      confidence: analysis.confidence,
      patterns: analysis.patterns
    })
    
    // Determine prompt type with explicit confidence checks
    let promptType
    if (analysis.confidence < 0.15) {
      promptType = 'default'
    } else if (analysis.intent === 'suspicious' && analysis.confidence > 0.6) {
      promptType = 'suspicious'
    } else if (analysis.intent === 'friendly' && analysis.confidence > 0.3) {
      promptType = 'friendly'
    } else {
      promptType = 'default'
    }

    console.log('2b. Mapped prompt type:', { promptType, originalIntent: analysis.intent })

    const prompt = {
      type: promptType,
      confidence: analysis.confidence,
      context: {
        trustLevel: context.aiState?.trustLevel || 50,
        suspicionLevel: context.aiState?.suspicionLevel || 0
      }
    }

    // Get AI response and analysis
    const [aiResponse, aiAnalysis] = await Promise.all([
      ai.generateResponse(prompt, message, context.chatHistory),
      ai.analyzeMessage(message, context.chatHistory, context.personality)
    ])

    return {
      message: aiResponse,
      metrics: aiAnalysis,
      suggestions: aiAnalysis.suggestions
    }

  } catch (error) {
    const fallbackHandler = new FallbackHandler(contextManager)
    return fallbackHandler.generateFallback(context, error)
  }
} 