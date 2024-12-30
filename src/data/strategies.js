export const STRATEGIES = {
  "Build trust": {
    id: "build_trust",
    description: "Build rapport and trust gradually",
    successConditions: {
      minTrustGain: 5,
      maxSuspicionGain: 10
    },
    metrics: {
      trustMultiplier: 1.2,
      suspicionMultiplier: 0.8
    },
    phases: {
      low: {
        threshold: 30,
        suggestions: [
          "Share a personal story",
          "Ask about their family",
          "Express genuine interest"
        ]
      },
      medium: {
        threshold: 60,
        suggestions: [
          "Mention crypto knowledge",
          "Share investment success",
          "Ask for advice"
        ]
      },
      high: {
        threshold: 80,
        suggestions: [
          "Discuss wallet security",
          "Share concerns about scams",
          "Ask about backup practices"
        ]
      }
    },
    fallback: {
      suggestions: [
        "Change topic to something lighter",
        "Express appreciation",
        "Show understanding"
      ]
    }
  },
  // Add other strategies with similar structure
} 