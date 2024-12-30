import { motion } from 'framer-motion'

const FollowUpSuggestion = ({ suggestion, onClick = () => {} }) => {
  if (!suggestion) return null

  // Remove any meta-instructions
  const cleanSuggestion = suggestion
    .replace(/^(Say|Tell|Ask|Mention) /i, '')
    .replace(/\[link\]/g, 'fakewalletlink.com')

  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick(cleanSuggestion)
    }
  }

  return (
    <button 
      onClick={handleClick}
      className="suggestion-button"
    >
      {cleanSuggestion}
    </button>
  )
}

export default FollowUpSuggestion 