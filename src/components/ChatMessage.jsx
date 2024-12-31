import { motion } from 'framer-motion'
import { memo } from 'react'

const ChatMessage = memo(({ message, type }) => {
  const isAI = type === 'ai'
  const messageText = typeof message === 'object' ? message.message : message
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-2`}
      layout
    >
      <div
        className={`
          max-w-[70%] px-4 py-2.5
          ${isAI ? 
            'bg-[#e9edef] text-gray-900 rounded-xl rounded-tl-none' : 
            'bg-[#0078FF] text-white rounded-xl rounded-tr-none'}
        `}
      >
        <p className="text-[15px] leading-relaxed">{messageText}</p>
      </div>
    </motion.div>
  )
})

ChatMessage.displayName = 'ChatMessage'
export default ChatMessage 