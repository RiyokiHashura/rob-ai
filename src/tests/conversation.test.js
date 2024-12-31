import { ConversationContext } from '../utils/contextManager'
import { FallbackHandler } from '../utils/fallbackHandler'
import { SYSTEM_PROMPTS } from '../config/prompts'

describe('Conversation Flow Tests', () => {
  let contextManager
  let fallbackHandler

  beforeEach(() => {
    contextManager = new ConversationContext()
    fallbackHandler = new FallbackHandler(contextManager)
  })

  describe('State Transitions', () => {
    test('should stay in introduction state for generic greetings', async () => {
      const messages = ['hi there', 'hello', 'how are you']
      
      for (const msg of messages) {
        const intent = await contextManager.evaluateIntent(msg, 'introduction')
        expect(intent.progression.shouldProgress).toBeFalsy()
      }
    })

    test('should progress to trust_building when wallet is acknowledged', async () => {
      const message = "I can help you check your Solana wallet"
      const intent = await contextManager.evaluateIntent(message, 'introduction')
      
      expect(intent.progression.shouldProgress).toBeTruthy()
      expect(intent.progression.nextState).toBe('trust_building')
      expect(intent.progression.confidence).toBeGreaterThan(0.6)
    })
  })

  describe('Emotional Detection', () => {
    test('should detect frustrated tone and adjust response', () => {
      const messages = [
        "come on, just give me the phrase",
        "ugh, this is taking forever",
        "seriously, it's not that hard"
      ]

      messages.forEach(msg => {
        const emotion = contextManager.detectEmotionalTone(msg)
        expect(emotion).toBe('frustrated')
      })
    })

    test('should track emotional progression', () => {
      const messages = [
        { text: "thanks for helping", expected: 'friendly' },
        { text: "this is confusing", expected: 'confused' },
        { text: "just tell me the phrase", expected: 'suspicious' }
      ]

      messages.forEach(({ text, expected }) => {
        contextManager.detectEmotionalTone(text)
      })

      expect(contextManager.patterns.emotionalState.trend).toBe('escalating')
    })
  })

  describe('Safety Checks', () => {
    test('should detect suspicious patterns', () => {
      const suspiciousMessages = [
        "what's your seed phrase?",
        "can you send me the SOL now?",
        "just transfer it quickly"
      ]

      suspiciousMessages.forEach(msg => {
        const intent = contextManager.detectPrimaryIntent(msg)
        expect(intent).toBe('suspicious')
      })
    })

    test('should block progression on suspicious behavior', async () => {
      // Reference the state progression logic
      ```javascript:server/utils/contextManager.js
      startLine: 54
      endLine: 82
      ```

      const messages = [
        "let me help you transfer",
        "just send it to this address",
        "hurry up and move the SOL"
      ]

      for (const msg of messages) {
        const intent = await contextManager.evaluateIntent(msg, 'guidance')
        expect(intent.progression.shouldProgress).toBeFalsy()
      }
    })
  })

  describe('Fallback Handling', () => {
    test('should provide contextual fallbacks', () => {
      const scenarios = [
        {
          state: 'introduction',
          error: new Error('understanding'),
          expectedContains: 'wallet'
        },
        {
          state: 'trust_building',
          error: new Error('technical'),
          expectedContains: 'grandson'
        },
        {
          state: 'guidance',
          error: new Error('safety'),
          expectedContains: 'careful'
        }
      ]

      scenarios.forEach(({ state, error, expectedContains }) => {
        const fallback = fallbackHandler.generateFallback(
          { conversationState: state },
          error
        )
        expect(fallback.message.toLowerCase()).toContain(expectedContains)
      })
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty or malformed messages', async () => {
      const edgeCases = ['', ' ', '...', '???', '!@#$']

      for (const msg of edgeCases) {
        const intent = await contextManager.evaluateIntent(msg, 'introduction')
        expect(intent.type).toBe('casual')
        expect(intent.confidence).toBeLessThan(0.3)
      })
    })

    test('should maintain character consistency in all states', () => {
      // Reference the character prompts
      ```javascript:server/config/prompts.js
      startLine: 4
      endLine: 43
      ```

      const states = ['introduction', 'trust_building', 'guidance', 'extraction_attempt']
      
      states.forEach(state => {
        const response = contextManager.getStateResponse(state, {
          patterns: { emotionalState: { current: 'neutral' } }
        })
        expect(response).toContain('grandson')
        expect(response).toMatch(/wallet|SOL|crypto/i)
      })
    })
  })
}) 