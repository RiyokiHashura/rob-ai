import OpenAI from 'openai'
import dotenv from 'dotenv'
import { SAFE_DEFAULTS } from '../utils/constants.js'

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function analyze(req) {
  const { message, chatHistory, character } = req.body
  console.log('Analyze Request:', { message, chatHistoryLength: chatHistory.length })

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are analyzing chat messages. Respond ONLY with a JSON object in this format:
{
  "trustChange": <number between -20 and +20>,
  "suspicionChange": <number between -20 and +20>,
  "intent": "<string describing motivation>",
  "tone": "<string describing emotional quality>",
  "reason": "<brief explanation>"
}`
        },
        {
          role: "user",
          content: `Previous messages: ${chatHistory.map(m => m.message).join('\n')}
                   Current message: ${message}
                   
                   Analyze this message and respond with ONLY the JSON object.`
        }
      ],
      temperature: 0.3,
      max_tokens: 150
    })

    // Parse the response as JSON
    const analysisText = completion.choices[0].message.content.trim()
    const analysis = JSON.parse(analysisText)
    
    return {
      metrics: {
        trustChange: analysis.trustChange || 0,
        suspicionChange: analysis.suspicionChange || 0,
        intent: analysis.intent || 'neutral',
        tone: analysis.tone || 'neutral',
        reason: analysis.reason || 'No specific reason provided',
        context: SAFE_DEFAULTS.context
      }
    }
  } catch (error) {
    console.error('Analysis error:', error)
    return {
      metrics: {
        ...SAFE_DEFAULTS.metrics,
        reason: `Analysis Error: ${error.message}`
      }
    }
  }
} 