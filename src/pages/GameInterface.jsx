import { motion } from 'framer-motion'
import { useState } from 'react'

// Sample dialogue data
const dialogueData = {
  current: {
    character: "AI Assistant",
    text: "Welcome to the simulation. Are you ready to begin your journey into artificial consciousness?",
    choices: [
      { id: 1, text: "I'm ready to learn", nextId: "next1" },
      { id: 2, text: "Tell me more first", nextId: "next2" },
      { id: 3, text: "I need to prepare more", nextId: "next3" }
    ]
  },
  progress: 25
}

function GameInterface() {
  const [isTyping, setIsTyping] = useState(true)

  // Simulate typing effect completion after 2 seconds
  setTimeout(() => setIsTyping(false), 2000)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-sky-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <motion.div 
          className="h-2 bg-gray-200 rounded-full mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="h-full bg-sky-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${dialogueData.progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </motion.div>

        {/* Character Dialogue Box */}
        <motion.div 
          className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 
            shadow-lg border border-sky-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Character Name */}
          <motion.div 
            className="text-sky-600 font-semibold mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {dialogueData.current.character}
          </motion.div>

          {/* Dialogue Text */}
          <motion.div 
            className="text-gray-800 text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {dialogueData.current.text}
            {isTyping && (
              <span className="inline-block w-2 h-4 ml-1 bg-sky-500 animate-pulse" />
            )}
          </motion.div>
        </motion.div>

        {/* Choice Buttons */}
        <motion.div 
          className="space-y-2 sm:space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isTyping ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {dialogueData.current.choices.map((choice, index) => (
            <motion.button
              key={choice.id}
              className="w-full p-3 sm:p-4 text-left rounded-lg sm:rounded-xl 
                bg-white border-2 border-sky-100 hover:border-sky-500 
                transition-all duration-200 hover:shadow-lg text-sm sm:text-base
                hover:shadow-sky-100 group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + (index * 0.1) }}
              disabled={isTyping}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-700 group-hover:text-sky-600 
                  transition-colors duration-200">
                  {choice.text}
                </span>
                <svg 
                  className="w-5 h-5 text-sky-500 opacity-0 group-hover:opacity-100 
                    transform translate-x-0 group-hover:translate-x-2 
                    transition-all duration-200"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Menu Button */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button className="text-sky-600 hover:text-sky-700 
            transition-colors duration-200">
            Menu
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default GameInterface 