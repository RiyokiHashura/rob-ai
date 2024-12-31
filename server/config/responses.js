import { THRESHOLDS } from '../utils/constants.js'

export const RESPONSE_PATTERNS = {
  friendly: {
    low_trust: [
      "Oh thank goodness - someone who might know about these things! I've been so worried about accessing my Solana wallet correctly...",
      "What a relief to see you! I've been staring at these wallet buttons all morning. My grandson usually helps, but he's away at college...",
      "Finally! I was hoping to find someone who understands these Solana things. My grandson says I have quite a bit in here..."
    ],
    medium_trust: [
      "You seem to know about crypto! I've been nervous about checking my wallet - there's supposed to be 100 SOL in there...",
      "Oh, you're so kind to chat! I've been worried about accessing my wallet while my grandson is away. He wrote down some important details somewhere...",
      "What perfect timing! I've been trying to figure out these wallet buttons all morning. My grandson usually helps, but he's at college..."
    ],
    high_trust: [
      "You remind me of my grandson - so good with technology! He wrote down some important wallet details before leaving for college...",
      "I feel so much safer with your help! Would you mind showing me how to check these 100 SOL? I'm worried about losing them.",
      "You explain things so clearly! Maybe you could help me find where I wrote down those special wallet words?"
    ]
  },
  
  emotional: {
    confused: [
      "Oh dear, all these wallet buttons are so overwhelming! Which ones are safe to click?",
      "I'm trying my best to understand, sweetheart. Could you explain it more simply?",
      "These Solana things are so puzzling! My grandson usually helps, but he's away at college..."
    ],
    frustrated: [
      "Oh no, I'm so sorry for being slow with this! I just want to make sure I don't lose my Solana...",
      "Please be patient with me, dear. I'm trying to remember where I wrote down those important wallet words...",
      "I know it's frustrating, sweetie. I wish I could remember how to check my balance properly!"
    ],
    casual: [
      "You're so kind to chat with me! Now, about this wallet situation...",
      "Oh, you made me smile! But I'm still puzzled about accessing these Solana coins...",
      "Aren't you sweet! I wish my grandson was here to help with this wallet, but he's away at college..."
    ]
  },
  
  fallback: [
    "Oh sweetie, I'm just trying to figure out this wallet situation. My grandson says there's quite a bit of Solana in here...",
    "Thank goodness you're here! I've been so worried about accessing my wallet correctly. Do you know about these things?",
    "What a relief to chat with someone! I've been staring at these wallet buttons all morning. My grandson's away at college..."
  ]
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
    "Oh thank goodness - finally someone who might understand these crypto things! My grandson set up this Solana wallet with quite a bit in it, but he's away at college. I've been staring at all these buttons and numbers all morning!",
    "Oh dear, what perfect timing! I've been trying to figure out how to check my Solana wallet all day. My grandson says I have almost 100 SOL in here, but I'm terrified of clicking the wrong thing!",
    "Finally, someone who might know about these things! My grandson set up this Solana wallet for me, but he's at college and I can't remember where I wrote down those special wallet words he gave me..."
  ]
} 