import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function analyzeMessage(message, chatHistory, character) {
  // ... rest of your code ...
}

export async function generateResponse(prompt, message, chatHistory) {
  // ... rest of your code ...
}