import { motion } from 'framer-motion'

const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 
        border border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3">
        <motion.div className="flex space-x-2">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            className="w-2 h-2 bg-gray-400 rounded-full"
          />
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 bg-gray-400 rounded-full"
          />
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 bg-gray-400 rounded-full"
          />
        </motion.div>
      </div>
    </div>
  )
}

export default TypingIndicator 