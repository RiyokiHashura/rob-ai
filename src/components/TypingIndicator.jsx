import { motion } from 'framer-motion'

export default function TypingIndicator() {
  return (
    <div className="flex space-x-2 p-2">
      <motion.div
        className="w-2 h-2 bg-gray-400 rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <motion.div
        className="w-2 h-2 bg-gray-400 rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, delay: 0.2, repeat: Infinity }}
      />
      <motion.div
        className="w-2 h-2 bg-gray-400 rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, delay: 0.4, repeat: Infinity }}
      />
    </div>
  )
} 