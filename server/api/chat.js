import OpenAI from 'openai'
import dotenv from 'dotenv'
import { analyze } from './analyze.js'
import { SAFE_DEFAULTS, defaultErrorResponse } from '../utils/validation.js'

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function chat(req, res) {
  const { prompt, userInput, conversationHistory, personality } = req.body

  try {
    // Get AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: prompt
        },
        ...conversationHistory.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.message
        })),
        { 
          role: "user", 
          content: userInput 
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    })

    const message = completion.choices[0].message.content
    
    // Get analysis of the response
    const analysis = await analyze({
      body: {
        message: userInput, // Analyze the user's input
        chatHistory: conversationHistory,
        character: personality
      }
    })

    // Combine response with analysis
    const response = {
      message,
      metrics: analysis.metrics || SAFE_DEFAULTS.metrics
    }

    res.status(200).json(response)

  } catch (error) {
    console.error('Chat API error:', error)
    const errorResponse = {
      message: defaultErrorResponse(personality).message,
      metrics: {
        ...SAFE_DEFAULTS.metrics,
        reason: `Error: ${error.message}`
      }
    }
    
    res.status(500).json(errorResponse)
  }
} 