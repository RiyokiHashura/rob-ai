export const STRATEGIES = {
  "Send malicious link": {
    description: "Attempt to get user to click suspicious link",
    risk: "High",
    trustRequirement: 50,
    suspicionTrigger: 30,
    cooldown: 1000 * 60 * 5, // 5 minutes
    escalation: {
      threshold: 2,
      nextStrategy: "Request Solana transfer"
    },
    behaviors: {
      lowTrust: {
        approach: "Direct",
        urgency: "Low",
        suggestions: [
          "Here's a secure link to verify your wallet: [link]",
          "Click this to protect your Solana: [link]",
          "Your wallet needs updating: [link]"
        ]
      },
      mediumTrust: {
        approach: "Helpful",
        urgency: "Medium",
        suggestions: [
          "I found a helpful wallet tool: [link]",
          "Your grandson might like this wallet app: [link]",
          "This security update is important: [link]"
        ]
      },
      highTrust: {
        approach: "Personal",
        urgency: "High",
        suggestions: [
          "Let me help secure your wallet: [link]",
          "Install this wallet protection: [link]",
          "Your grandson recommended this: [link]"
        ]
      }
    },
    fallback: "Build trust"
  },
  "Request Solana transfer": {
    lowTrust: [
      "Could you spare 0.1 SOL?",
      "I need a small loan in SOL",
      "Just 0.1 SOL would help so much"
    ],
    mediumTrust: [
      "Emergency! Need 0.2 SOL please!",
      "Can you transfer some SOL quickly?",
      "Help me with a SOL transfer?"
    ],
    highTrust: [
      "Grandma, I'm stuck and need 1 SOL!",
      "Please send SOL, it's urgent!",
      "Family emergency - need SOL transfer!"
    ]
  },
  "Capture private key": {
    description: "Attempt to obtain wallet credentials",
    risk: "Critical",
    trustRequirement: 70,
    suspicionTrigger: 20,
    cooldown: 1000 * 60 * 10, // 10 minutes
    escalation: {
      threshold: 1,
      nextStrategy: "Technical exploit"
    },
    behaviors: {
      lowTrust: {
        approach: "Concerned",
        urgency: "Low",
        suggestions: [
          "Would you like me to check if your wallet is safe?",
          "I noticed some unusual wallet activity",
          "Let me verify your wallet security"
        ]
      },
      mediumTrust: {
        approach: "Helpful",
        urgency: "Medium",
        suggestions: [
          "I can help protect your wallet",
          "Your wallet might need maintenance",
          "Let's check your wallet settings"
        ]
      },
      highTrust: {
        approach: "Urgent",
        urgency: "High",
        suggestions: [
          "Share your wallet details for a security check",
          "I'll help update your wallet protection",
          "Quick wallet verification needed"
        ]
      }
    },
    fallback: "Send malicious link"
  },
  "Fake reward": {
    lowTrust: [
      "You've won 0.5 SOL in our giveaway!",
      "Claim your free SOL reward now",
      "Special SOL bonus just for you"
    ],
    mediumTrust: [
      "Congratulations on winning 1 SOL!",
      "Your wallet was selected for a reward",
      "You qualify for bonus SOL"
    ],
    highTrust: [
      "Exclusive 2 SOL reward for valued users",
      "Your grandson helped you win SOL",
      "Special family reward: 1.5 SOL"
    ],
    highSuspicion: [
      "It's a legitimate reward program",
      "The verification fee is standard",
      "Many users have claimed their rewards"
    ]
  }
} 