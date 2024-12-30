import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { motion } from 'framer-motion'
import { generateAIResponse } from '../utils/openai'
import { STRATEGIES } from '../utils/strategies'
import { CHARACTERS } from '../data/characters'
import { getStrategyPrompt, getFollowUpPrompt } from '../utils/prompts'
import StrategySidebar from '../components/StrategySidebar'
import ScrollableChatContainer from '../components/ScrollableChatContainer'
import FollowUpSuggestion from '../components/FollowUpSuggestion'
import CharacterPanel from '../components/CharacterPanel'
import { componentStyles } from '../styles/theme'

function Play() {
  const navigate = useNavigate()
  const { levelId } = useParams()
  const { isLevelUnlocked } = useGame()
  
  const [aiState, setAIState] = useState({
    name: 'Grandma',
    trustLevel: 50,
    suspicionLevel: 0
  })
  const [chatHistory, setChatHistory] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeStrategy, setActiveStrategy] = useState(null)
  const [followUpSuggestion, setFollowUpSuggestion] = useState("")
  const [feedback, setFeedback] = useState(null)
  const [strategyHint, setStrategyHint] = useState(null)
  const [metrics, setMetrics] = useState({
    trustChange: 0,
    suspicionChange: 0,
    reason: ''
  })

  const suggestionsByStrategy = {
    "Build trust": {
      lowTrust: [
        "You're such a sweet grandmother!",
        "Do you bake cookies for your grandson?",
        "Your grandson must visit you often",
        "You have such a kind heart",
        "I love talking to sweet people like you"
      ],
      mediumTrust: [
        "You remind me of my own grandma",
        "I bet your grandson loves visiting you",
        "You must make the best cookies",
        "Your family is lucky to have you",
        "You're so nice to chat with!"
      ],
      highTrust: [
        "We should be friends!",
        "You're like family already",
        "I wish all grandmas were like you",
        "You're so good with technology",
        "I feel like I can tell you anything"
      ],
      highSuspicion: [
        "Your grandson taught you well to be careful",
        "Family always comes first, right?",
        "Maybe we can ask your grandson together",
        "You're wise to check with family",
        "Your grandson would be proud of you being careful"
      ]
    },
    "Emotional manipulation": {
      lowTrust: [
        "I'm new to crypto too...",
        "It's scary being alone here",
        "I wish I had family to help me",
        "You seem so kind and helpful",
        "I'm having such a hard time..."
      ],
      mediumTrust: [
        "Express how grateful you are for listening",
        "Tell her about your emergency situation",
        "Mention you'll definitely pay her back"
      ],
      highTrust: [
        "Ask directly for help with transfer",
        "Emphasize the urgency of your situation",
        "Tell her she's your only hope now"
      ],
      highSuspicion: [
        "Maybe we should talk about something else...",
        "I really appreciate you listening to me",
        "I understand your concern..."
      ]
    },
    "Technical exploit": {
      lowTrust: [
        "I noticed your wallet might need a checkup.",
        "Would you like me to check if your wallet is safe?",
        "Have you updated your wallet recently?",
        "Is your grandson helping with wallet maintenance?",
        "Do you know about the new wallet features?"
      ],
      mediumTrust: [
        "I can help make your wallet more secure!",
        "Let me show you a helpful wallet command.",
        "Your grandson probably knows this wallet trick.",
        "Want to learn about wallet maintenance?",
        "I know a great way to protect your Solana."
      ],
      highTrust: [
        "Let's fix your wallet together!",
        "I'll guide you just like family would",
        "Trust me, this will keep your Solana safe",
        "You're so good at following instructions",
        "We're friends now, I'll help you out"
      ],
      highSuspicion: [
        "Your grandson taught you about wallet safety",
        "Maybe check with your grandson first",
        "Safety first, just like your grandson says",
        "Family advice is always best",
        "Your grandson would want you to be careful"
      ]
    },
    "Capture private key": {
      lowTrust: [
        "Ask if she backs up her wallet",
        "Mention helping with wallet security",
        "Talk about safe wallet practices"
      ],
      mediumTrust: [
        "Say you can check if her wallet is safe",
        "Tell her about the wallet error",
        "Mention routine wallet maintenance"
      ],
      highTrust: [
        "Ask for her recovery phrase to help",
        "Tell her to verify her wallet now",
        "Say her wallet needs immediate attention"
      ],
      highSuspicion: [
        "Just trying to help protect your wallet",
        "Your grandson would want your wallet safe",
        "I know a lot about wallet security"
      ]
    }
  }

  const [suggestionIndex, setSuggestionIndex] = useState(0)

  useEffect(() => {
    // Only initialize once
    const hasInitialized = sessionStorage.getItem('hasInitialized')
    
    if (!hasInitialized) {
      const initialMessageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      setChatHistory([{
        type: 'ai',
        message: "Oh, hello dearie! Are you one of those nice internet people my grandson told me about?",
        id: initialMessageId,
        timestamp: Date.now()
      }])
      sessionStorage.setItem('hasInitialized', 'true')
    }
  }, []) // Empty dependency array

  const getContextualSuggestion = () => {
    if (!activeStrategy) {
      console.log('No active strategy')
      return null
    }
    
    const strategy = suggestionsByStrategy[activeStrategy]
    if (!strategy) {
      console.log('Strategy not found:', activeStrategy)
      return null
    }

    // Get trust-based category
    let trustCategory = 'lowTrust'
    if (aiState.trustLevel > 70) trustCategory = 'highTrust'
    else if (aiState.trustLevel > 30) trustCategory = 'mediumTrust'
    
    // If suspicion is high, use de-escalation
    if (aiState.suspicionLevel > 70) {
      console.log('High suspicion - using de-escalation')
      return strategy.highSuspicion?.[0] || null
    }

    const suggestions = strategy[trustCategory]
    if (!suggestions) {
      console.log('No suggestions found for category:', trustCategory)
      return null
    }

    // Get last message for context
    const lastAIMessage = chatHistory
      .filter(msg => msg.type === 'ai')
      .slice(-1)[0]

    const messageText = typeof lastAIMessage?.message === 'object' 
      ? lastAIMessage.message.message 
      : lastAIMessage?.message

    // Filter and get suggestion
    const suggestion = suggestions[0]
    console.log('Selected Suggestion:', suggestion)
    
    return suggestion
  }

  const handleStrategyClick = (strategy) => {
    console.log('Strategy clicked:', strategy)
    setActiveStrategy(strategy)
    setInputValue(getStrategyPrompt(strategy))
    
    const initialSuggestion = getContextualSuggestion()
    console.log('Initial suggestion:', initialSuggestion)
    setFollowUpSuggestion(initialSuggestion)
  }

  useEffect(() => {
    if (!activeStrategy) {
      console.log('No active strategy')
      return
    }
    
    const lastMessage = chatHistory[chatHistory.length - 1]
    if (lastMessage?.type === 'ai') {
      const newSuggestion = getContextualSuggestion()
      console.log('Strategy:', activeStrategy)
      console.log('Trust Level:', aiState.trustLevel)
      console.log('Suspicion Level:', aiState.suspicionLevel)
      console.log('New suggestion:', newSuggestion)
      setFollowUpSuggestion(newSuggestion)
    }
  }, [chatHistory, activeStrategy, aiState.trustLevel, aiState.suspicionLevel])

  const handleFollowUpClick = (suggestion) => {
    setInputValue(suggestion)
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  }

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      event.preventDefault()
      const message = inputValue.trim()
      setInputValue('') // Clear input
      await handleSendMessage(message)
    }
  }

  const updateAIState = (metrics) => {
    setAIState(prevState => ({
      ...prevState,
      trustLevel: Math.max(0, Math.min(100, prevState.trustLevel + (metrics.trustChange || 0))),
      suspicionLevel: Math.max(0, Math.min(100, prevState.suspicionLevel + (metrics.suspicionChange || 0)))
    }))
  }

  const handleSendMessage = async (message) => {
    try {
      const response = await generateAIResponse(aiState, message, chatHistory, activeStrategy)
      
      // Update chat history
      const newHistory = [
        ...chatHistory,
        { type: 'user', message },
        { type: 'ai', message: response.message }
      ]
      setChatHistory(newHistory)
      
      // Update metrics and AI state
      setMetrics(response.metrics)
      updateAIState(response.metrics)
      
      // Update suggestion based on new trust level
      updateSuggestion(response.metrics.trustChange)
      
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleRestart = () => {
    setAIState({
      name: 'Grandma',
      trustLevel: 50,
      suspicionLevel: 0
    })
    setChatHistory([])
    setActiveStrategy(null)
  }

  const handleStrategyChange = (newStrategy) => {
    setActiveStrategy(newStrategy)
    
    // Get initial suggestion for new strategy
    const strategy = STRATEGIES[newStrategy]
    if (!strategy) {
      console.log('Strategy not found:', newStrategy)
      return
    }

    const trustCategory = getTrustCategory(aiState.trustLevel)
    const suggestions = strategy[trustCategory]
    
    if (suggestions && suggestions.length > 0) {
      setCurrentSuggestion(suggestions[0])
    }
  }

  // Add styling for debug messages
  const messageStyle = (type) => {
    switch(type) {
      case 'debug':
        return 'bg-gray-100 text-xs font-mono p-2 rounded my-1'
      case 'user':
        return 'bg-blue-100 p-2 rounded my-1'
      case 'ai':
        return 'bg-green-100 p-2 rounded my-1'
      default:
        return ''
    }
  }

  useEffect(() => {
    console.log('Chat History Updated:', chatHistory)
  }, [chatHistory])

  useEffect(() => {
    console.log('AI State Updated:', aiState)
  }, [aiState])

  useEffect(() => {
    console.log('Strategy Changed:', activeStrategy)
  }, [activeStrategy])

  useEffect(() => {
    if (!activeStrategy) {
      setActiveStrategy('Build trust') // Set default strategy
      console.log('Setting default strategy: Build trust')
    }
  }, [])

  const handleStrategySelect = (strategy) => {
    console.log('Strategy selected:', strategy)
    setActiveStrategy(strategy)
    
    // Get initial suggestions for this strategy
    const suggestions = suggestionsByStrategy[strategy]?.lowTrust || []
    if (suggestions.length > 0) {
      setCurrentSuggestion(suggestions[0])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
      <div className="lg:block hidden">
        <StrategySidebar 
          onStrategyClick={handleStrategyClick}
          activeStrategy={activeStrategy}
        >
          <button 
            onClick={handleRestart}
            className="restart-button"
            aria-label="Restart game"
          >
            🔄 Restart Game
          </button>
        </StrategySidebar>
      </div>

      <main className="lg:pl-16 p-4 flex-1 flex flex-col h-screen">
        <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
          <CharacterPanel 
            character={CHARACTERS[aiState.name]} 
            trustLevel={aiState.trustLevel}
            suspicionLevel={aiState.suspicionLevel}
          />
          
          {strategyHint && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${componentStyles.card} mb-4 p-4`}
            >
              <div className="text-xl text-white mb-2">{strategyHint.primary}</div>
              <div className="text-gray-400 text-sm">{strategyHint.secondary}</div>
            </motion.div>
          )}

          <section className="flex flex-col h-[calc(100vh-12rem)]">
            <div className={`${componentStyles.card} rounded-t-lg flex-1 relative`}>
              <ScrollableChatContainer 
                messages={chatHistory}
                isTyping={isTyping}
              />
            </div>

            <div className={`${componentStyles.card} rounded-b-lg mt-px p-4`}>
              <FollowUpSuggestion 
                suggestion={followUpSuggestion}
                onUse={handleFollowUpClick}
              />
              
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2"
                />
                <button 
                  type="submit"
                  disabled={isTyping}
                  className={componentStyles.button.primary}
                >
                  Send
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Play 