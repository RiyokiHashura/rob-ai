export const getStrategyPrompt = (strategy, context) => {
  const basePrompt = `You are roleplaying as ${context.character}, attempting to ${strategy.description}.
                     Trust level: ${context.trustLevel}
                     Suspicion level: ${context.suspicionLevel}`

  return {
    role: 'system',
    content: basePrompt
  }
}

export const getFollowUpPrompt = (strategy, previousResponse) => {
  return {
    role: 'system',
    content: `Continue the conversation naturally. 
              Previous response: "${previousResponse}"
              Current strategy: ${strategy.description}
              Maintain character consistency.`
  }
} 