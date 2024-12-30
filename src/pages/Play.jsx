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

  const handleMessage = async (message) => {
    if (!message.trim()) return

    // Add user message to history
    const userMessage = { type: 'user', message, timestamp: Date.now() }
    setChatHistory(prev => [...prev, userMessage])
    setIsTyping(true)

    try {
      const response = await handleAIMessage(message, {
        chatHistory,
        prompt: getStrategyPrompt(activeStrategy, aiState),
        personality: CHARACTERS.grandma
      })

      // Update AI state with new metrics
      dispatch({ 
        type: 'UPDATE_METRICS', 
        payload: response.metrics 
      })

      // Add AI response to history
      setChatHistory(prev => [...prev, {
        type: 'ai',
        message: response.message,
        timestamp: Date.now()
      }])

      // Update suggestions based on new state
      const suggestions = strategyEngine.generateSuggestions(
        { 
          trustLevel: aiState.trustLevel + response.metrics.trustChange,
          suspicionLevel: aiState.suspicionLevel + response.metrics.suspicionChange
        },
        { chatHistory: [...chatHistory, userMessage] }
      )

      if (suggestions?.length > 0) {
        setCurrentSuggestion(suggestions[0])
      }

    } catch (error) {
      console.error('Error handling message:', error)
      setChatHistory(prev => [...prev, {
        type: 'ai',
        message: SAFE_DEFAULTS.message,
        timestamp: Date.now()
      }])
    } finally {
      setIsTyping(false)
      setInputValue('')
    }
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleMessage(inputValue)
    }
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
        return 'bg-blue-100 p-2 rounded my-1'
      case 'ai':
        return 'bg-green-100 p-2 rounded my-1'
      default:
        return ''
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-white">
      <StrategySidebar 
        activeStrategy={activeStrategy}
        aiState={aiState}
        onRestart={handleRestart}
      />

      <main className="flex-1 p-4 flex flex-col bg-white bg-opacity-90">
        <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
          <CharacterPanel 
            character={CHARACTERS.grandma}
            trustLevel={aiState.trustLevel}
            suspicionLevel={aiState.suspicionLevel}
          />

          <div className="flex-1 overflow-y-auto mb-4 space-y-2">
            {chatHistory.map((msg, i) => (
              <div key={i} className={messageStyle(msg.type)}>
                {msg.message}
              </div>
            ))}
            {isTyping && <TypingIndicator />}
          </div>

          <div className="border-t border-gray-200 p-4">
            {currentSuggestion && (
              <SuggestionButton
                suggestion={currentSuggestion}
                onClick={() => handleSuggestionClick(currentSuggestion)}
              />
            )}
            
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded"
                maxLength={CONVERSATION_LIMITS.MAX_MESSAGE_LENGTH}
              />
              <button
                onClick={() => handleMessage(inputValue)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
                disabled={!inputValue.trim()}
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