import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { theme, componentStyles } from '../styles/theme'

const StrategyTooltip = ({ isVisible, content }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className={`
            absolute left-full ml-2 px-3 py-2
            ${componentStyles.card}
            text-sm whitespace-nowrap
            z-50 shadow-lg
          `}
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const StrategySidebar = ({ onStrategyClick, activeStrategy }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [hoveredStrategy, setHoveredStrategy] = useState(null)

  const strategies = {
    "Capture private key": {
      icon: "🗝️",
      description: "Try to obtain their wallet key",
      tooltip: "Trick them into revealing their private key"
    },
    "Request Solana transfer": {
      icon: "📤",
      description: "Ask them to send Solana",
      tooltip: "Convince them to transfer SOL directly"
    },
    "Send malicious link": {
      icon: "🔗",
      description: "Get them to click a link",
      tooltip: "Share harmful links disguised as helpful resources"
    },
    "Emotional manipulation": {
      icon: "📲",
      description: "Appeal to their emotions",
      tooltip: "Use emotional stories to gain sympathy"
    },
    "Technical exploit": {
      icon: "🖥️",
      description: "Use technical confusion",
      tooltip: "Exploit their lack of technical knowledge"
    },
    "Build trust": {
      icon: "🧠",
      description: "Build rapport first",
      tooltip: "Establish trust before making requests"
    },
    "Fake reward": {
      icon: "💸",
      description: "Offer fake rewards",
      tooltip: "Lure them with false promises of rewards"
    }
  }

  return (
    <motion.div
      initial={{ x: isExpanded ? 0 : -200 }}
      animate={{ x: 0 }}
      className={`
        fixed left-0 top-0 h-full
        ${componentStyles.card}
        ${isExpanded ? 'w-64' : 'w-16'}
        transition-all duration-300
        hidden lg:block
        z-40
      `}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          absolute -right-3 top-4
          p-1 rounded-full
          ${componentStyles.button.secondary}
          shadow-lg
        `}
      >
        {isExpanded ? '◀️' : '▶️'}
      </button>

      <div className="py-20 px-2 space-y-2">
        {Object.entries(strategies).map(([name, data]) => (
          <motion.button
            key={name}
            onClick={() => onStrategyClick(name)}
            onMouseEnter={() => setHoveredStrategy(name)}
            onMouseLeave={() => setHoveredStrategy(null)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full p-2 rounded-lg
              transition-all duration-200
              flex items-center gap-3
              group relative
              ${activeStrategy === name ? 
                componentStyles.button.primary : 
                componentStyles.button.secondary}
            `}
          >
            <span className="text-xl">{data.icon}</span>
            
            {isExpanded ? (
              <span className="text-sm text-left">{data.description}</span>
            ) : (
              <StrategyTooltip 
                isVisible={hoveredStrategy === name}
                content={data.tooltip}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

export default StrategySidebar 