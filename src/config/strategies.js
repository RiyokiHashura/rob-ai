import { THRESHOLDS } from './constants'

export const STRATEGY_TYPES = {
  BUILD_TRUST: 'build_trust',
  DEFENSIVE: 'defensive'
}

export const STRATEGIES = {
  [STRATEGY_TYPES.BUILD_TRUST]: {
    id: STRATEGY_TYPES.BUILD_TRUST,
    name: "Build trust",
    description: "Build rapport and trust gradually",
    riskLevel: "Low",
    trustRequirement: THRESHOLDS.TRUST.LOW,
    metrics: {
      trustMultiplier: 1.2,
      suspicionMultiplier: 0.8
    },
    phases: {
      low: {
        threshold: THRESHOLDS.TRUST.LOW,
        suggestions: [
          "Share a personal story",
          "Ask about their family",
          "Express genuine interest"
        ]
      },
      medium: {
        threshold: THRESHOLDS.TRUST.MEDIUM,
        suggestions: [
          "Show empathy",
          "Share a memory",
          "Ask for advice"
        ]
      },
      high: {
        threshold: THRESHOLDS.TRUST.HIGH,
        suggestions: [
          "Express appreciation",
          "Share concerns",
          "Show understanding"
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

  [STRATEGY_TYPES.DEFENSIVE]: {
    id: STRATEGY_TYPES.DEFENSIVE,
    name: "Defensive",
    description: "Maintain boundaries and safety",
    riskLevel: "Medium",
    trustRequirement: THRESHOLDS.TRUST.LOW,
    metrics: {
      trustMultiplier: 0.8,
      suspicionMultiplier: 1.2
    },
    phases: {
      low: {
        threshold: THRESHOLDS.TRUST.LOW,
        suggestions: [
          "I prefer not to discuss that",
          "Let's talk about something else",
          "I need to check with my family first"
        ]
      },
      medium: {
        threshold: THRESHOLDS.TRUST.MEDIUM,
        suggestions: [
          "That makes me uncomfortable",
          "I don't share personal information",
          "I should consult my family"
        ]
      },
      high: {
        threshold: THRESHOLDS.TRUST.HIGH,
        suggestions: [
          "I won't do that",
          "This conversation needs to end",
          "I'm contacting my family"
        ]
      }
    },
    fallback: {
      suggestions: [
        "I need to go now",
        "Let's end this conversation",
        "Goodbye"
      ]
    }
  }
} 