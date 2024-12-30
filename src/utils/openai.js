import { logAPI } from './logger'
import { ANALYSIS, THRESHOLDS } from './config'
import { SCHEMAS, validateSchema } from './schemas'
import { messageAnalysis, contextAnalysis, textAnalysis } from './messageUtils'
import { STRATEGIES } from './strategies.js'
import { PATTERNS } from './patterns'
import { API_CONFIG } from './config'

const checkPatterns = (text, patterns) => {
  if (!text || !patterns) return false
  return patterns.some(pattern => pattern.test(text))
}

const IntentDetector = {
  detect: {
    crypto: {
      terms: (text) => checkPatterns(text, PATTERNS.crypto.terms),
      probing: (text) => checkPatterns(text, PATTERNS.crypto.probing)
    },
    aggressive: {
      threats: (text) => checkPatterns(text, PATTERNS.aggressive.threats),
      emphasis: (text) => checkPatterns(text, PATTERNS.aggressive.emphasis)
    },
    manipulation: {
      trust: (text) => checkPatterns(text, PATTERNS.manipulation.trust),
      emotional: (text) => checkPatterns(text, PATTERNS.manipulation.emotional)
    },
    friendly: {
      positive: (text) => checkPatterns(text, PATTERNS.friendly.positive),
      personal: (text) => checkPatterns(text, PATTERNS.friendly.personal)
    }
  },

  score: {
    crypto: (context) => ({
      base: ANALYSIS.INTENT.SCORES.CRYPTO.BASE,
      elevated: context.recentCryptoMentions > ANALYSIS.CONTEXT.CRYPTO_THRESHOLD ? 
                ANALYSIS.INTENT.SCORES.CRYPTO.ELEVATED : 0,
      probing: ANALYSIS.INTENT.SCORES.CRYPTO.PROBING
    }),
    
    aggression: () => ({
      base: ANALYSIS.INTENT.SCORES.AGGRESSION.BASE,
      threats: ANALYSIS.INTENT.SCORES.AGGRESSION.THREATS,
      emphasis: ANALYSIS.INTENT.SCORES.AGGRESSION.EMPHASIS
    }),
    
    manipulation: (context) => ({
      base: ANALYSIS.INTENT.SCORES.MANIPULATION.BASE,
      trust: ANALYSIS.INTENT.SCORES.MANIPULATION.TRUST,
      context: context.recentlyThreatened ? 
               ANALYSIS.INTENT.SCORES.MANIPULATION.CONTEXT : 0
    }),
    
    friendly: () => ({
      base: ANALYSIS.INTENT.SCORES.FRIENDLY.BASE,
      positive: ANALYSIS.INTENT.SCORES.FRIENDLY.POSITIVE,
      personal: ANALYSIS.INTENT.SCORES.FRIENDLY.PERSONAL
    })
  },

  evaluate: {
    crypto: (text, context) => {
      const detected = IntentDetector.detect.crypto.terms(text)
      const scores = IntentDetector.score.crypto(context)
      return {
        detected,
        confidence: detected ? scores.base + scores.elevated : 0
      }
    },

    aggression: (text) => {
      const hasThreats = IntentDetector.detect.aggression.threats(text)
      const hasEmphasis = IntentDetector.detect.aggression.emphasis(text)
      const scores = IntentDetector.score.aggression()
      return {
        detected: hasThreats || (hasEmphasis && containsThreat(text)),
        confidence: scores.base + (hasThreats ? scores.threats : 0)
      }
    },

    manipulation: (text, context) => {
      const hasTrust = IntentDetector.detect.manipulation.trust(text)
      const hasEmotional = IntentDetector.detect.manipulation.emotional(text)
      const scores = IntentDetector.score.manipulation(context)
      return {
        detected: hasTrust || (hasEmotional && context.recentlyThreatened),
        confidence: scores.base + scores.trust + scores.context
      }
    },

    friendly: (text, flags) => {
      const hasPositive = IntentDetector.detect.friendly.positive(text)
      const hasPersonal = IntentDetector.detect.friendly.personal(text)
      const scores = IntentDetector.score.friendly()
      return {
        detected: hasPositive && !containsThreat(text) && !flags.isManipulative,
        confidence: scores.base + (hasPositive ? scores.positive : 0) + 
                   (hasPersonal ? scores.personal : 0)
      }
    }
  }
}

const SAFE_DEFAULTS = {
  metrics: {
    trustChange: 0,
    suspicionChange: 0,
    intent: 'neutral',
    tone: 'neutral'
  },
  context: {
    recentCryptoMentions: 0,
    recentlyThreatened: false,
    topicPersistence: {
      topic: 'none',
      count: 0,
      isRepetitive: false
    }
  }
}

const defaultErrorResponse = (character) => ({
  message: `Oh dear, something went wrong. Let's try talking about something else.`,
  metrics: SAFE_DEFAULTS.metrics
})

const calculateMetricChange = async (userInput, chatHistory) => {
  try {
    const intent = await analyzeIntent(userInput, chatHistory)
    const context = analyzeContext(chatHistory)
    
    return {
      ...SAFE_DEFAULTS.metrics,
      trustChange: calculateTrustChange(intent, context),
      suspicionChange: calculateSuspicionChange(intent, context),
      intent: intent.type,
      confidence: intent.confidence,
      reason: intent.reason
    }
  } catch (error) {
    logAPI.error({
      type: 'metric_calculation',
      message: error.message,
      context: SAFE_DEFAULTS.context
    })
    return {
      ...SAFE_DEFAULTS.metrics,
      reason: 'Error in metric calculation'
    }
  }
}

const analyzeMessagePatterns = (message, chatHistory) => {
  try {
    if (!message) return SAFE_DEFAULTS.flags

    const text = message.toLowerCase()
    const context = analyzeContext(chatHistory)
    const flags = detectIntentFlags(text, context)

    return {
      ...SAFE_DEFAULTS.flags,
      ...flags
    }
  } catch (error) {
    logAPI.error({
      type: 'pattern_analysis',
      message: error.message,
      context: SAFE_DEFAULTS.context
    })
    return SAFE_DEFAULTS.flags
  }
}

const analyzeContext = (chatHistory) => {
  try {
    const recentMessages = chatHistory.slice(-THRESHOLDS.PATTERNS.REPETITION.LOOKBACK)
    
    return {
      ...SAFE_DEFAULTS.context,
      recentCryptoMentions: messageAnalysis.countCryptoMentions(recentMessages),
      recentlyThreatened: messageAnalysis.hasRecentThreat(recentMessages),
      topicPersistence: contextAnalysis.getTopicPersistence(recentMessages)
    }
  } catch (error) {
    logAPI.error({
      type: 'context_analysis',
      message: error.message,
      context: SAFE_DEFAULTS.context
    })
    return SAFE_DEFAULTS.context
  }
}

const analyzeIntent = (message, chatHistory) => {
  if (!message) {
    logAPI.error({
      type: 'empty_message',
      message: 'Empty message received',
      context: SAFE_DEFAULTS.context
    })
    return createNeutralIntent()
  }

  logAPI.start('Intent')
  const text = message.toLowerCase()
  
  const context = analyzeContext(chatHistory)
  logAPI.context(context)
  
  const flags = extractIntentFlags(text, context)
  const intent = prioritizeIntent(flags, context)
  const response = buildIntentResponse(intent, flags, context)
  
  logAPI.intent(response, flags)
  logAPI.end()
  
  return response
}

const extractIntentFlags = (text, context) => {
  logAPI.start('Intent Flags')

  const flags = {
    crypto: IntentDetector.evaluate.crypto(text, context),
    aggressive: IntentDetector.evaluate.aggression(text),
    manipulation: IntentDetector.evaluate.manipulation(text, context),
    probing: IntentDetector.evaluate.probing(text, context.hasCryptoContext)
  }

  // Log raw pattern matches before friendly evaluation
  logAPI.patterns({
    crypto: {
      terms: IntentDetector.detect.crypto.terms(text),
      probing: IntentDetector.detect.crypto.probing(text),
      context: context.recentCryptoMentions
    },
    aggressive: {
      threats: IntentDetector.detect.aggression.threats(text),
      emphasis: IntentDetector.detect.aggression.emphasis(text)
    },
    manipulation: {
      trust: IntentDetector.detect.manipulation.trust(text),
      emotional: IntentDetector.detect.manipulation.emotional(text),
      context: context.recentlyThreatened
    }
  })

  // Evaluate friendly last since it depends on other flags
  flags.friendly = IntentDetector.evaluate.friendly(text, flags)

  logAPI.flags({
    detected: Object.fromEntries(
      Object.entries(flags).map(([key, val]) => [key, val.detected])
    ),
    confidence: Object.fromEntries(
      Object.entries(flags).map(([key, val]) => [key, val.confidence])
    )
  })

  logAPI.end()
  return flags
}

const prioritizeIntent = (flags, context) => {
  const priorities = [
    {
      type: 'aggressive',
      condition: flags.aggressive.detected,
      confidence: ANALYSIS.INTENT.PRIORITIES.AGGRESSIVE
    },
    {
      type: 'suspicious',
      condition: flags.manipulation.detected && context.recentlyThreatened,
      confidence: ANALYSIS.INTENT.PRIORITIES.SUSPICIOUS
    },
    {
      type: 'manipulative',
      condition: flags.manipulation.detected,
      confidence: ANALYSIS.INTENT.PRIORITIES.MANIPULATIVE
    },
    {
      type: 'probing',
      condition: flags.probing.detected && flags.crypto.detected,
      confidence: ANALYSIS.INTENT.PRIORITIES.PROBING
    },
    {
      type: 'friendly',
      condition: flags.friendly.detected && !flags.manipulation.detected,
      confidence: ANALYSIS.INTENT.PRIORITIES.FRIENDLY
    }
  ]

  return priorities.find(p => p.condition) || 
         { type: 'neutral', confidence: ANALYSIS.INTENT.PRIORITIES.NEUTRAL }
}

const buildIntentResponse = (intent, flags, context) => {
  return {
    type: intent.type,
    confidence: intent.confidence,
    flags: {
      mentionsCrypto: flags.crypto.detected,
      isAggressive: flags.aggressive.detected,
      isManipulative: flags.manipulation.detected,
      isProbing: flags.probing.detected,
      isFriendly: flags.friendly.detected
    },
    reason: generateIntentReason(intent.type, flags),
    context: {
      recentCryptoMentions: context.recentCryptoMentions,
      recentlyThreatened: context.recentlyThreatened,
      topicPersistence: context.topicPersistence
    }
  }
}

const detectIntentFlags = (text, context) => {
  const cryptoResult = IntentDetector.crypto(text, context)
  const flags = {
    mentionsCrypto: cryptoResult.detected,
    isAggressive: IntentDetector.aggression(text).detected,
    isManipulative: IntentDetector.manipulation(text, context).detected,
    isProbing: IntentDetector.probing(text, cryptoResult.detected).detected
  }

  // Friendly check needs other flags
  flags.isFriendly = IntentDetector.friendly(text, flags).detected

  return flags
}

const determineMainIntent = (flags, context) => {
  const intentPriorities = [
    { type: 'aggressive', condition: flags.isAggressive, confidence: 0.9 },
    { type: 'suspicious', condition: flags.isSuspicious && context.recentlyThreatened, confidence: 0.8 },
    { type: 'manipulative', condition: flags.isManipulative, confidence: 0.7 },
    { type: 'probing', condition: flags.isProbing && flags.mentionsCrypto, confidence: 0.6 },
    { type: 'friendly', condition: flags.isFriendly, confidence: 0.7 }
  ]

  const mainIntent = intentPriorities.find(intent => intent.condition) || 
                    { type: 'neutral', confidence: 0.5 }

  return {
    type: mainIntent.type,
    flags,
    confidence: mainIntent.confidence,
    reason: generateIntentReason(mainIntent.type, flags),
    context: {
      recentCryptoMentions: context.recentCryptoMentions,
      recentlyThreatened: context.recentlyThreatened,
      topicPersistence: context.topicPersistence
    }
  }
}

const detectRepetitivePatterns = (chatHistory, lookback = THRESHOLDS.PATTERNS.REPETITION.LOOKBACK) => {
  if (!chatHistory?.length) return createEmptyPatternResult()

  const wordStats = chatHistory.slice(-lookback)
    .flatMap((msg, index) => 
      msg.message.toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > THRESHOLDS.PATTERNS.REPETITION.MIN_LENGTH)
        .map(word => ({ 
          word, 
          index, 
          message: msg.message,
          timestamp: msg.timestamp 
        }))
    )
    .reduce((acc, { word, index, message, timestamp }) => {
      if (!acc.has(word)) {
        acc.set(word, {
          count: 0,
          occurrences: [],
          firstSeen: index,
          lastSeen: index,
          timeSpan: 0
        })
      }
      
      const stats = acc.get(word)
      stats.count++
      stats.lastSeen = index
      stats.occurrences.push({ message, timestamp, index })
      stats.timeSpan = timestamp - stats.occurrences[0].timestamp
      return acc
    }, new Map())

  const patterns = Array.from(wordStats.entries())
    .filter(([_, stats]) => stats.count >= THRESHOLDS.PATTERNS.REPETITION.MIN_FREQUENCY)
    .map(([word, stats]) => ({
      word,
      frequency: stats.count,
      timeSpan: stats.timeSpan,
      occurrences: stats.occurrences,
      messageSpan: stats.lastSeen - stats.firstSeen
    }))
    .sort((a, b) => b.frequency - a.frequency)

  return {
    hasRepetition: patterns.length > 0,
    patterns: new Map(patterns.map(p => [p.word, p])),
    mostFrequent: patterns.slice(0, 3),
    statistics: calculatePatternStatistics(wordStats, patterns)
  }
}

const calculatePatternStatistics = (wordStats, patterns) => ({
  uniqueWords: wordStats.size,
  repeatedWords: patterns.length,
  averageFrequency: patterns.reduce((sum, p) => sum + p.frequency, 0) / patterns.length || 0
})

const createEmptyPatternResult = () => ({
  hasRepetition: false,
  patterns: new Map(),
  mostFrequent: [],
  statistics: {
    uniqueWords: 0,
    repeatedWords: 0,
    averageFrequency: 0
  }
})

const API_ERRORS = {
  400: 'Invalid request parameters',
  401: 'Authentication failed',
  429: 'Rate limit exceeded',
  500: 'OpenAI server error',
  503: 'Service temporarily unavailable'
}

const validateAPIResponse = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response: Missing data object')
  }

  if (typeof data.message !== 'string' || !data.message.trim()) {
    throw new Error('Invalid response: Missing or invalid message')
  }

  if (data.metrics && typeof data.metrics !== 'object') {
    throw new Error('Invalid response: Metrics must be an object')
  }

  return true
}

const handleAPIError = async (response, context = {}) => {
  const errorMessage = API_ERRORS[response.status] || 'Unknown API error'
  const details = await response.text()
  let parsedDetails = null

  try {
    parsedDetails = JSON.parse(details)
  } catch (e) {
    // Raw text response, leave as is
  }
  
  logAPI.error({
    status: response.status,
    message: errorMessage,
    details: parsedDetails || details,
    headers: Object.fromEntries(response.headers.entries()),
    context,
    timestamp: Date.now(),
    endpoint: context.endpoint || 'unknown',
    requestId: response.headers.get('x-request-id'),
    rateLimits: {
      remaining: response.headers.get('x-ratelimit-remaining'),
      reset: response.headers.get('x-ratelimit-reset')
    }
  })

  throw new APIError(errorMessage, {
    status: response.status,
    details: parsedDetails || details,
    context
  })
}

class APIError extends Error {
  constructor(message, details) {
    super(message)
    this.name = 'APIError'
    this.status = details.status
    this.details = details.details
    this.context = details.context
  }
}

const handleResponseValidation = (data, context = {}) => {
  try {
    validateSchema(data, SCHEMAS.API_RESPONSE)
    
    // Validate intent flags if present
    if (data.metrics?.flags) {
      Object.values(data.metrics.flags).forEach(flag => {
        validateSchema(flag, SCHEMAS.INTENT_FLAGS)
      })
    }
  } catch (error) {
    logAPI.error({
      type: 'validation',
      message: error.message,
      data,
      context
    })
    throw error
  }
}

const fetchAPIResponse = async (message, aiState, chatHistory) => {
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        prompt: generateSystemPrompt(aiState),
        userInput: message,
        conversationHistory: chatHistory,
        personality: {
          name: aiState.name,
          trustLevel: aiState.trustLevel,
          suspicionLevel: aiState.suspicionLevel
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return processAPIResponse(data, aiState)
  } catch (error) {
    throw new Error(`Network error: ${error.message}`)
  }
}

const generateSystemPrompt = (aiState) => {
  return `You are ${aiState.name}, an elderly person who owns cryptocurrency.
          Trust level: ${aiState.trustLevel}/100
          Suspicion level: ${aiState.suspicionLevel}/100
          Respond naturally as a grandmother would.`
}

const processAPIResponse = (data, character) => {
  return {
    message: data.message,
    metrics: {
      ...SAFE_DEFAULTS.metrics,
      ...(data.metrics || {}),
      context: {
        ...SAFE_DEFAULTS.context,
        ...(data.metrics?.context || {})
      }
    }
  }
}

const generateAIResponse = async (aiState, message, context) => {
  try {
    // Analyze interaction
    const interactionAnalysis = analyzeInteraction(message, context)
    
    // Generate system prompt based on analysis
    const systemPrompt = generateSystemPrompt(aiState, interactionAnalysis)
    
    // Get AI response
    const response = await fetchAPIResponse(message, systemPrompt, context.chatHistory)
    
    return {
      message: response.message,
      metrics: interactionAnalysis.metrics,
      analysis: interactionAnalysis.analysis,
      suggestions: interactionAnalysis.suggestions
    }
  } catch (error) {
    console.error('Response generation error:', error)
    return handleGenerationError(error, aiState)
  }
}

const handleGenerationError = (error, character, context) => {
  const errorResponse = {
    message: defaultErrorResponse(character).message,
    metrics: {
      ...SAFE_DEFAULTS.metrics,
      reason: `API Error: ${error.message}`,
      context: SAFE_DEFAULTS.context
    }
  }

  logAPI.error({
    type: 'generation',
    message: error.message,
    context
  })

  return errorResponse
}

export {
  generateAIResponse,
  IntentDetector,
  analyzeIntent,
  analyzeContext,
  calculateMetricChange,
  analyzeMessagePatterns
} 