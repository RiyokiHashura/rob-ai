import express from 'express'
import { analyzeMessage, generateResponse } from '../utils/openai.js'
import { CONVERSATION_LIMITS } from '../utils/constants.js'

const router = express.Router()

router.post('/analyze', async (req, res) => {
  try {
    const { message, chatHistory, character } = req.body

    // Basic validation
    if (!message?.trim() || message.length > CONVERSATION_LIMITS.MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: 'Invalid message' })
    }

    const analysis = await analyzeMessage(message, chatHistory, character)
    res.json(analysis)

  } catch (error) {
    console.error('Analysis endpoint error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/chat', async (req, res) => {
  try {
    const { prompt, message, chatHistory } = req.body

    // Basic validation
    if (!message?.trim() || message.length > CONVERSATION_LIMITS.MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: 'Invalid message' })
    }

    const response = await generateResponse(prompt, message, chatHistory)
    res.json({ message: response })

  } catch (error) {
    console.error('Chat endpoint error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router 