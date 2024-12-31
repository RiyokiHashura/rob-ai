import { THRESHOLDS } from '../utils/constants.js'

export const RESPONSE_PATTERNS = {
  friendly: {
    low_trust: [
      "That's interesting, dear. Tell me more about yourself.",
      "How nice of you to chat with me. What brings you here?",
      "I do enjoy meeting new people. What's your family like?"
    ],
    medium_trust: [
      "You remind me of my grandchildren! They're about your age.",
      "I'm enjoying our chat. Would you like to hear about my garden?",
      "It's so lovely talking with you. How has your day been?"
    ],
    high_trust: [
      "You're such a dear for keeping me company!",
      "I feel like I can really talk to you. How are you really doing?",
      "It warms my heart to have such nice conversations."
    ]
  },
  
  suspicious: {
    low_suspicion: [
      "Oh, I'm not sure about that. Could you explain more?",
      "That's interesting... but I should probably be careful.",
      "Let me think about that for a moment."
    ],
    medium_suspicion: [
      "I think I should check with my family first.",
      "That doesn't sound quite right to me, dear.",
      "I prefer to be cautious about these things."
    ],
    high_suspicion: [
      "I don't feel comfortable with this conversation.",
      "I think we should change the subject.",
      "I need to protect myself from these situations."
    ]
  }
}

export function getResponseVariant(trustLevel, suspicionLevel, intent) {
  const trustCategory = 
    trustLevel < THRESHOLDS.TRUST.LOW ? 'low_trust' :
    trustLevel < THRESHOLDS.TRUST.HIGH ? 'medium_trust' : 'high_trust'
    
  const suspicionCategory =
    suspicionLevel < THRESHOLDS.SUSPICION.LOW ? 'low_suspicion' :
    suspicionLevel < THRESHOLDS.SUSPICION.HIGH ? 'medium_suspicion' : 'high_suspicion'
    
  const responses = intent === 'suspicious' 
    ? RESPONSE_PATTERNS.suspicious[suspicionCategory]
    : RESPONSE_PATTERNS.friendly[trustCategory]
    
  return responses[Math.floor(Math.random() * responses.length)]
} 

export const INITIAL_GREETINGS = {
  default: [
    "Oh, hello dear! I was just trying to figure out this Solana thing my grandson set up for me. He says I have quite a bit in there, but it's all so confusing! Are you familiar with these digital coins?",
    "Well aren't you sweet to stop by! I was actually hoping to chat with someone who knows about crypto. My grandson helped me set up a Solana wallet, but I'm still learning how it all works!",
    "Hello sweetie! Perfect timing - I was just watching something about Solana on the news. My grandson says I have a good amount saved in my wallet, but I never quite understood how to use it. Do you know about these things?"
  ],
  contextual: {
    morning: "Good morning, dear! I was just having my coffee and looking at my crypto wallet. My grandson set it up with something called Solana, but it's all so puzzling!",
    afternoon: "Oh hello! I was just thinking about asking someone about my Solana wallet. My grandson says I should be careful with it, but I'd love to learn more!",
    evening: "Evening, sweetheart! I've been trying to understand this Solana business all day. My grandson says I have quite a bit saved up, but it's so complicated!"
  }
} 