import { motion } from 'framer-motion'
import { componentStyles } from '../styles/theme'

const CharacterPanel = ({ character, trustLevel, suspicionLevel }) => {
  if (!character) return null
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl mb-4 p-4 shadow-lg relative"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-700/50 overflow-hidden flex-shrink-0 ring-2 ring-gray-600/50">
          <img 
            src={`/${character.name.toLowerCase()}.webp`}
            alt={character.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/fallback-avatar.webp'
            }}
          />
        </div>
        
        <div className="flex-1">
          <h2 className="text-lg text-white font-medium flex items-center gap-2">
            {character.name}
            <span className="text-xs text-gray-400 font-normal px-2 py-0.5 bg-gray-800 rounded-full">
              Level 1
            </span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {character.basePrompt?.split('\n')[0].trim()}
          </p>

          <div className="mt-3 space-y-2">
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Trust</span>
                <span>{trustLevel}%</span>
              </div>
              <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-green-500/80"
                  initial={{ width: 0 }}
                  animate={{ width: `${trustLevel}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Suspicion</span>
                <span>{suspicionLevel}%</span>
              </div>
              <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-red-500/80"
                  initial={{ width: 0 }}
                  animate={{ width: `${suspicionLevel}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative bottom divider */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent" />
    </motion.div>
  )
}

export default CharacterPanel 