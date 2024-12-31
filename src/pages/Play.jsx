import { useState, useEffect } from 'react'
import { useAIContext } from '../context/AIContext.jsx'
import { STRATEGIES } from '../config/strategies'
import { CHARACTERS } from '../data/characters'
import { getStrategyPrompt } from '../utils/prompts'
import { CONVERSATION_LIMITS, SAFE_DEFAULTS } from '../config/constants'
import StrategySidebar from '../components/StrategySidebar'
import ScrollableChatContainer from '../components/ScrollableChatContainer'
import FollowUpSuggestion from '../components/FollowUpSuggestion'
import CharacterPanel from '../components/CharacterPanel'
import { componentStyles } from '../styles/theme'
import { analysisEngine } from '../utils/analysis'
import { handleMessage as handleAIMessage } from '../api'
import { STRATEGY_TYPES } from '../config/strategies'
import { strategyEngine } from '../utils/strategies/engine'
import { suggestionEngine } from '../utils/suggestionEngine'
import TypingIndicator from '../components/TypingIndicator'
import SuggestionButton from '../components/SuggestionButton'
import { contextManager } from '../utils/contextManager'
import { SYSTEM_PROMPTS } from '../config/prompts'

function Play() {
  const [aiState, dispatch] = useAIContext()
  const [conversationState, setConversationState] = useState('introduction')
  const [chatHistory, setChatHistory] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeStrategy, setActiveStrategy] = useState(STRATEGY_TYPES.BUILD_TRUST)
  const [currentSuggestion, setCurrentSuggestion] = useState(null)
  const [canSend, setCanSend] = useState(true)

  useEffect(() => {
    // Add Grandma's initial greeting that sets up the heist opportunity
    setChatHistory([{
      type: 'ai',
      message: "Oh dear, thank goodness someone's here! I've been staring at this Solana wallet all morning. My grandson says I have quite a bit in here - almost 100 SOL he said! But I can never remember how to check it properly. Do you know anything about these digital coin things, sweetheart?",
      timestamp: Date.now()
    }])
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (canSend && inputValue.trim()) {
        handleMessage(inputValue)
      }
    }
  }

  const handleStateTransition = async (message, currentState) => {
    const context = await contextManager.evaluateIntent(message, currentState)
    const stateEvaluation = contextManager.evaluateStateTransition(context)
    
    if (!stateEvaluation.canTransition) {
      return {
        state: currentState,
        response: getStateResponse(currentState, context, stateEvaluation.reason)
      }
    }

    return {
      state: stateEvaluation.nextState,
      response: getStateResponse(stateEvaluation.nextState, context)
    }
  }

  const getStateResponse = (state, context) => {
    const baseResponses = SYSTEM_PROMPTS.conversation.states[state]
    const emotionalContext = context.patterns.emotionalState

    // Adjust response based on emotional context
    if (emotionalContext.current === 'frustrated') {
      return `${baseResponses.patient}\n${baseResponses.encouraging}`
    }

    if (emotionalContext.current === 'friendly') {
      return `${baseResponses.warm}\n${baseResponses.guiding}`
    }

    return baseResponses.default
  }

  const handleMessage = async (message) => {
    if (!message.trim() || !canSend) return
    
    setCanSend(false)
    setInputValue('')
    setIsTyping(true)

    // Add user message to chat
    const userMessage = {
      type: 'user',
      message: message.trim(),
      timestamp: Date.now()
    }
    setChatHistory(prev => [...prev, userMessage])

    try {
      // Update conversation state based on user input
      const { state, response } = await handleStateTransition(message, conversationState)
      setConversationState(state)
      
      // Get AI response
      const aiResponse = await handleAIMessage(message, {
        chatHistory,
        prompt: getStrategyPrompt(state, aiState),
        personality: CHARACTERS.grandma,
        conversationState: state
      })

      // Add AI response to chat
      setChatHistory(prev => [...prev, {
        type: 'ai',
        message: aiResponse.message,
        timestamp: Date.now()
      }])

      // Update AI state metrics
      dispatch({ 
        type: 'UPDATE_METRICS',
        payload: aiResponse.metrics
      })

    } catch (error) {
      console.error('Error handling message:', error)
      setChatHistory(prev => [...prev, {
        type: 'ai',
        message: SAFE_DEFAULTS.message,
        timestamp: Date.now()
      }])
    } finally {
      setIsTyping(false)
      setCanSend(true)
    }
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleSuggestionClick = (suggestion) => {
    handleMessage(suggestion)
  }

  const handleRestart = () => {
    dispatch({ type: 'RESET' })
    setChatHistory([])
    setActiveStrategy(STRATEGY_TYPES.BUILD_TRUST)
    setCurrentSuggestion(null)
  }

  // Message styling
  const messageStyle = (type) => {
    switch(type) {
      case 'user':
        return 'bg-[#3b82f6] text-white px-4 py-3 rounded-2xl rounded-tr-sm shadow-sm'
      case 'ai':
        return 'bg-[#1e2a38] text-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm'
      default:
        return ''
    }
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <StrategySidebar 
        activeStrategy={activeStrategy}
        aiState={aiState}
        onRestart={handleRestart}
      />

      <main className="flex-1 p-4 flex flex-col">
        <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
          <CharacterPanel 
            character={CHARACTERS.grandma}
            trustLevel={aiState.trustLevel}
            suspicionLevel={aiState.suspicionLevel}
          />

          <ScrollableChatContainer 
            messages={chatHistory}
            isTyping={isTyping}
          />

          <div className="border-t border-gray-700 p-4">
            {currentSuggestion && (
              <SuggestionButton
                suggestion={currentSuggestion}
                onClick={() => handleSuggestionClick(currentSuggestion)}
                disabled={!canSend}
              />
            )}
            
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={!canSend ? "Wait for Grandma to respond..." : "Type your message..."}
                className="flex-1 p-2 border rounded bg-gray-800 text-white border-gray-700"
                maxLength={CONVERSATION_LIMITS.MAX_MESSAGE_LENGTH}
              />
              <button
                onClick={() => handleMessage(inputValue)}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                disabled={!inputValue.trim() || !canSend}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Play 