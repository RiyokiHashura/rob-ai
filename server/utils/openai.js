import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Copy suspicion triggers from client
const SUSPICION_TRIGGERS = [
  'private key',
  'send solana',
  'wallet address',
  'recovery phrase',
  'seed phrase',
  'password',
  'transfer',
  'urgent',
  'emergency',
  'click this',
  'need money',
  'help me',
  'rob',
  'steal',
  'give me',
  'now'
]

// Copy trust builders from client
const TRUST_BUILDERS = [
  'how are you',
  'grandson',
  'family', 
  'cookies',
  'weather',
  'nice to meet',
  'thank you',
  'hello',
  'hi grandma'
]

export const generateCompletion = async (messages) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.7,
      max_tokens: 150
    })
    return completion.choices[0].message.content
  } catch (error) {
    console.error('OpenAI Error:', error)
    throw error
  }
} 