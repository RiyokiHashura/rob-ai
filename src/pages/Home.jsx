import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  const handleStartClick = () => {
    navigate('/levels')
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-white via-sky-50 to-white 
      relative overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 
        min-h-screen flex flex-col justify-center">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Main Header - Added text shadows */}
          <motion.h1 
            className="text-5xl sm:text-6xl md:text-8xl font-bold text-gray-900 
              tracking-tight mb-6"
            style={{
              textShadow: '0 2px 10px rgba(186, 230, 253, 0.3)' // sky-200 with low opacity
            }}
          >
            <motion.span 
              className="block mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{
                textShadow: '0 2px 8px rgba(15, 23, 42, 0.08)' // gray-900 with very low opacity
              }}
            >
              Outsmart.
            </motion.span>
            <motion.span 
              className="block mb-3 text-transparent bg-clip-text bg-gradient-to-r 
                from-sky-500 to-blue-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              style={{
                textShadow: '0 2px 12px rgba(14, 165, 233, 0.2)' // sky-500 with low opacity
              }}
            >
              Outplay.
            </motion.span>
            <motion.span 
              className="block text-transparent bg-clip-text bg-gradient-to-r 
                from-blue-600 to-indigo-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
              style={{
                textShadow: '0 2px 12px rgba(37, 99, 235, 0.2)' // blue-600 with low opacity
              }}
            >
              Outsteal.
            </motion.span>
          </motion.h1>

          {/* Subheader with tighter line spacing */}
          <div className="relative pb-12 mb-4">
            <motion.p 
              className="text-lg sm:text-xl text-gray-600 
                max-w-2xl mx-auto leading-snug"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.7, 
                delay: 0.8, 
                ease: "easeOut" 
              }}
            >
              Level up your social engineering skills and outwit every challenge.
              <motion.span 
                className="block mt-3 font-semibold text-sky-600 text-xl sm:text-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 1.0 }}
              >
                Are you ready to steal some Solana?
              </motion.span>
            </motion.p>

            {/* Animated divider line */}
            <motion.div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-[1px]
                bg-gradient-to-r from-transparent via-sky-200 to-transparent"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 0.5, width: 192 }}
              transition={{ 
                duration: 0.7, 
                delay: 1.1,
                ease: "easeOut" 
              }}
            />
          </div>

          {/* Updated CTA Button with onClick handler */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5,
              delay: 1.2,
              type: "spring",
              stiffness: 150,
              damping: 12
            }}
          >
            <button 
              onClick={handleStartClick}
              className="inline-flex items-center px-8 py-4 text-lg 
                bg-gradient-to-r from-sky-500 to-blue-600 text-white 
                rounded-full font-semibold
                transition-all duration-300 ease-out
                hover:scale-105
                hover:bg-gradient-to-r hover:from-sky-400 hover:to-blue-500
                relative group"
            >
              <span className="relative z-10 flex items-center">
                Start Hacking
                <svg 
                  className="w-5 h-5 ml-2 transform group-hover:translate-x-1 
                    transition-transform duration-200" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 7l5 5m0 0l-5 5m5-5H6" 
                  />
                </svg>
              </span>
              <div className="absolute inset-0 -z-10 rounded-full 
                transition-all duration-300 ease-out
                group-hover:blur-xl
                bg-gradient-to-r from-sky-400/50 to-blue-500/50
                opacity-0 group-hover:opacity-100" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Home