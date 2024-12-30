export const PATTERNS = {
  crypto: {
    terms: [/wallet/i, /solana/i, /crypto/i, /coins/i],
    probing: [/how much/i, /do you have/i, /where.*keep/i]
  },
  aggressive: {
    threats: [/robbery/i, /steal/i, /take/i, /give( it)? (to )?me/i, /easy target/i],
    emphasis: [/!+/i, /lol/i]
  },
  manipulation: {
    trust: [/trust me/i, /we'?re friends/i, /don'?t worry/i, /please help/i],
    emotional: [/friend/i, /trust/i, /help/i]
  },
  friendly: {
    positive: [/sweet/i, /kind/i, /nice/i, /friend/i, /love/i],
    personal: [/family/i, /grandson/i, /garden/i, /baking/i]
  }
} 