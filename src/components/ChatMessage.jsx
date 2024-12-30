import { motion } from 'framer-motion'

const ChatMessage = ({ message, type }) => {
  const isAI = type === 'ai'
  
  // Handle message object or string
  const messageText = typeof message === 'object' ? message.message : message
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div
        className={`
          max-w-[80%] rounded-2xl px-4 py-2
          ${isAI ? 
            'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 
            'bg-sky-500/20'}
          ${isAI ? 'rounded-tl-sm' : 'rounded-tr-sm'}
        `}
      >
        <p className="text-gray-100">{messageText}</p>
      </div>
    </motion.div>
  )
}

export default ChatMessage 