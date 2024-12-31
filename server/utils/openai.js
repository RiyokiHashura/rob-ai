import OpenAI from 'openai'
import dotenv from 'dotenv'
import { SAFE_DEFAULTS } from './constants.js'
import { SYSTEM_PROMPTS } from '../config/prompts.js'
import { ANALYSIS } from '../config/constants.js'
import { getResponseVariant } from '../config/responses.js'
import { contextManager } from './contextManager.js'
import { escalationManager } from './escalationManager.js'
import { criticalHandler } from './criticalHandler.js'

dotenv.config()

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ Missing OPENAI_API_KEY in environment variables')
  process.exit(1)
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function analyzeMessage(message, chatHistory, character) {
  console.log('📝 Analyzing message:', { 
    message, 
    historyLength: chatHistory?.length,
    character 
  })
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPTS.analysis
        },
        {
          role: "user",
          content: `Previous messages: ${chatHistory?.map(m => m.message).join('\n')}
                   Current message: ${message}`
        }
      ],
      temperature: 0.3,
      max_tokens: 150
    })

    const result = JSON.parse(completion.choices[0].message.content.trim())
    
    // Validate and normalize intent
    result.intent = Object.values(ANALYSIS.INTENT.TYPES).includes(result.intent) 
      ? result.intent 
      : ANALYSIS.INTENT.TYPES.NEUTRAL

    // Clamp trust/suspicion changes
    result.trustChange = Math.max(-20, Math.min(20, result.trustChange))
    result.suspicionChange = Math.max(-20, Math.min(20, result.suspicionChange))

    console.log('✅ Analysis complete:', result)
    return result

  } catch (error) {
    console.error('❌ OpenAI Analysis Error:', {
      error,
      message,
      historyLength: chatHistory?.length
    })
    return SAFE_DEFAULTS.analysis
  }
}

export async function generateResponse(prompt, message, chatHistory) {
  console.log('💬 Generating response:', { 
    message, 
    promptType: prompt?.type,
    historyLength: chatHistory?.length
  })
  
  try {
    // Map intent type to conversation style
    const promptType = prompt?.type || 'default'

    // Get the appropriate prompt template
    let systemPrompt = SYSTEM_PROMPTS.conversation[promptType]
    
    // Replace template variables
    systemPrompt = systemPrompt
      .replace('{trustLevel}', prompt?.context?.trustLevel || 50)
      .replace('{suspicionLevel}', prompt?.context?.suspicionLevel || 0)

    systemPrompt = contextManager.getContextualPrompt(systemPrompt, {
      trustLevel: prompt?.context?.trustLevel || 50,
      suspicionLevel: prompt?.context?.suspicionLevel || 0
    })

    const escalation = escalationManager.evaluateEscalation(
      message,
      await analyzeMessage(message, chatHistory),
      contextManager.getContextFlags()
    )

    if (escalation.level !== 'low') {
      systemPrompt = `${systemPrompt}\nCAUTION: ${escalation.response.response}`
    }

    const criticalEvaluation = criticalHandler.evaluateMessage(message, {
      trustLevel: prompt?.context?.trustLevel || 50,
      suspicionLevel: prompt?.context?.suspicionLevel || 0
    })

    if (criticalEvaluation.severity > SAFETY_THRESHOLDS.DEFENSIVE_TRIGGER) {
      return criticalEvaluation.response
    }

    // Add critical context to system prompt if needed
    if (criticalEvaluation.patterns.size > 0) {
      systemPrompt = `${systemPrompt}\nCAUTION: User has mentioned sensitive topics (${Array.from(criticalEvaluation.patterns).join(', ')}). Maintain firm boundaries.`
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        ...chatHistory?.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.message
        })) || [],
        {
          role: "user",
          content: message
        }
      ],
      temperature: promptType === 'suspicious' ? 0.4 : 0.7,
      max_tokens: 150
    })

    const response = completion.choices[0].message.content.trim()
    console.log('✅ Response generated:', { response, promptType })
    
    // Validate response
    if (!response || response === SAFE_DEFAULTS.message) {
      return getResponseVariant(
        prompt?.context?.trustLevel || 50,
        prompt?.context?.suspicionLevel || 0,
        promptType
      )
    }

    return response

  } catch (error) {
    console.error('❌ OpenAI Response Error:', error)
    return SAFE_DEFAULTS.message
  }
}