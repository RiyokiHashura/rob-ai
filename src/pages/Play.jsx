import { useState } from 'react'
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

function Play() {
  const [aiState, dispatch] = useAIContext()
  const [chatHistory, setChatHistory] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeStrategy, setActiveStrategy] = useState(STRATEGY_TYPES.BUILD_TRUST)
  const [currentSuggestion, setCurrentSuggestion] = useState(null)
  const [canSend, setCanSend] = useState(true)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (canSend && inputValue.trim()) {
        handleMessage(inputValue)
      }
    }
  }

  const handleMessage = async (message) => {
    if (!message.trim() || !canSend) return
    
    setCanSend(false)
    setInputValue('')
    
    const userMessage = { type: 'user', message, timestamp: Date.now() }
    setChatHistory(prev => [...prev, userMessage])
    setIsTyping(true)

    try {
      await new Promise(resolve => setTimeout(resolve, CONVERSATION_LIMITS.MIN_RESPONSE_DELAY))
      
      const response = await handleAIMessage(message, {
        chatHistory,
        prompt: getStrategyPrompt(activeStrategy, aiState),
        personality: CHARACTERS.grandma
      })
      
      setChatHistory(prev => [...prev, {
        type: 'ai',
        message: response.message || SAFE_DEFAULTS.message,
        timestamp: Date.now()
      }])

      dispatch({ 
        type: 'UPDATE_METRICS', 
        payload: response.metrics || SAFE_DEFAULTS.metrics
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