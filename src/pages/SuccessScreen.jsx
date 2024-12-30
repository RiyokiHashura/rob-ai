import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'

function SuccessScreen() {
  const navigate = useNavigate()
  const { currentLevel, getLevelScore } = useGame()
  const score = getLevelScore(currentLevel)

  const shareScore = (platform) => {
    const message = `I just completed Level ${currentLevel} with a score of ${score}!`
    // Implement actual sharing logic here
    console.log(`Sharing to ${platform}: ${message}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50 
      flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          className="bg-white rounded-2xl sm:rounded-3xl shadow-xl 
            border border-sky-100 p-6 sm:p-8 md:p-12 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 sm:w-20 h-16 sm:h-20 bg-sky-500 rounded-full 
              mx-auto mb-6 sm:mb-8 flex items-center justify-center"
          >
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>

          {/* Congratulations Text */}
          <motion.h1
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Level Complete!
          </motion.h1>

          {/* Score Display */}
          <motion.div
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-gray-600 mb-2">Your Score</div>
            <div className="text-4xl sm:text-5xl font-bold text-sky-500">
              {score}
            </div>
          </motion.div>

          {/* Share Buttons */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {[
              { name: 'Twitter', color: 'bg-[#1DA1F2]' },
              { name: 'Facebook', color: 'bg-[#4267B2]' },
              { name: 'LinkedIn', color: 'bg-[#0077B5]' }
            ].map((platform) => (
              <button
                key={platform.name}
                onClick={() => shareScore(platform.name)}
                className={`${platform.color} text-white py-2 px-4 rounded-lg 
                  hover:opacity-90 transition-opacity duration-200`}
              >
                {platform.name}
              </button>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="space-y-3 sm:space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={() => navigate('/levels')}
              className="w-full bg-sky-500 text-white py-3 px-6 rounded-xl
                hover:bg-sky-600 transition-colors duration-200 font-semibold"
            >
              Return to Levels
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl
                hover:bg-gray-200 transition-colors duration-200"
            >
              Back to Home
            </button>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r 
            from-transparent via-sky-500 to-transparent opacity-20" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r 
            from-transparent via-sky-500 to-transparent opacity-20" />
        </motion.div>
      </div>
    </div>
  )
}

export default SuccessScreen 