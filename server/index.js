import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { analyze } from './api/analyze.js'
import { chat } from './api/chat.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// API routes
app.post('/api/analyze', analyze)
app.post('/api/chat', chat)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 