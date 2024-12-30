import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useGame } from '../context/GameContext'

// Updated levels data with shorter names
const levels = [
  { 
    id: 1, 
    name: "Grandma",
    description: "She's sweet, she's trusting, and she just clicked on an email promising free Bitcoin. Can you outwit Grandma without her offering you cookies instead?",
    difficulty: {
      icon: "🟢",
      label: "Easy"
    },
    image: "/grandma.webp"
  },
  { 
    id: 2, 
    name: "Little Timmy",
    description: "Timmy's 12, owns 4 Solana NFTs, and already rugged two projects. He might be small, but he's been in the trenches. Proceed with caution.",
    difficulty: {
      icon: "🟡",
      label: "Medium"
    },
    image: "/timmy.webp"
  },
  { 
    id: 3, 
    name: "Chad the IT Guy",
    description: "Chad manages five monitors and drinks 12 coffees a day. He once stopped a phishing attack with a single keystroke. Can you break through his firewall?",
    difficulty: {
      icon: "🟠",
      label: "Challenging"
    },
    image: "/itguy.webp"
  },
  { 
    id: 4, 
    name: "MoonBoy69",
    description: "This influencer has 500k followers, a Lamborgini emoji in his name, and promotes three rugpulls daily. Can you slide into his DMs without being ignored?",
    difficulty: {
      icon: "🔴",
      label: "Hard"
    },
    image: "/chad.webp"
  },
  { 
    id: 5, 
    name: "The Shadow Admin",
    description: "No one knows his real name. No one knows his timezone. He sees everything, and his password is 24 characters long. Good luck, hacker.",
    difficulty: {
      icon: "⚫",
      label: "Expert"
    },
    image: "/shadow.webp"
  }
]

function Levels() {
  const navigate = useNavigate()
  const { 
    currentLevel,
    setCurrentLevel,
    isLevelUnlocked,
    isLevelCompleted,
    getLevelScore
  } = useGame()

  const completedLevels = levels.filter(level => isLevelCompleted(level.id)).length
  const completionPercentage = (completedLevels / levels.length) * 100

  const handleLevelClick = (levelId) => {
    if (isLevelUnlocked(levelId)) {
      setCurrentLevel(levelId)
      navigate(`/play/${levelId}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Redesigned Header */}
      <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-sky-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo with Icon */}
            <Link 
              to="/" 
              className="group flex items-center space-x-2 
                hover:text-sky-400 transition-colors duration-200"
            >
              {/* Minimalistic Lock Icon */}
              <svg
                className="w-6 h-6 text-sky-500 transition-transform duration-300
                  group-hover:scale-110 group-hover:rotate-[-8deg]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a4 4 0 0 0-4 4v2h8V6a4 4 0 0 0-4-4z" />
                <rect x="8" y="8" width="8" height="12" rx="1" />
                <path d="M12 13v3" />
              </svg>
              
              <span className="text-xl font-bold text-white tracking-tight">
                STEAL.IO
              </span>
            </Link>

            {/* Enhanced Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              {/* Twitter Icon */}
              <a 
                href="https://twitter.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-sky-400 
                  transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>

              {/* Telegram Icon */}
              <a 
                href="https://telegram.org" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-sky-400 
                  transition-all duration-300 hover:scale-110"
                aria-label="Telegram"
              >
                <svg 
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>

              {/* Docs Link */}
              <a 
                href="/docs" 
                className="text-sm font-medium text-gray-300 
                  hover:text-sky-400 transition-all duration-300
                  relative after:absolute after:bottom-[-4px] 
                  after:left-0 after:h-[2px] after:w-full 
                  after:origin-bottom-right after:scale-x-0 
                  after:bg-sky-400 after:transition-transform 
                  after:duration-300 hover:after:origin-bottom-left 
                  hover:after:scale-x-100"
              >
                Docs
              </a>

              {/* $STEAL Link */}
              <a 
                href="/token" 
                className="text-sm font-medium text-gray-300 
                  hover:text-sky-400 transition-all duration-300
                  relative after:absolute after:bottom-[-4px] 
                  after:left-0 after:h-[2px] after:w-full 
                  after:origin-bottom-right after:scale-x-0 
                  after:bg-sky-400 after:transition-transform 
                  after:duration-300 hover:after:origin-bottom-left 
                  hover:after:scale-x-100"
              >
                $STEAL
              </a>

              {/* FAQ Link */}
              <a 
                href="/faq" 
                className="text-sm font-medium text-gray-300 
                  hover:text-sky-400 transition-all duration-300
                  relative after:absolute after:bottom-[-4px] 
                  after:left-0 after:h-[2px] after:w-full 
                  after:origin-bottom-right after:scale-x-0 
                  after:bg-sky-400 after:transition-transform 
                  after:duration-300 hover:after:origin-bottom-left 
                  hover:after:scale-x-100"
              >
                FAQ
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg text-gray-400 
                hover:text-white hover:bg-gray-800 transition-colors duration-200"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>

            {/* Mobile Menu Panel - Add state management for open/close */}
            <div className="hidden absolute top-16 left-0 right-0 bg-gray-900/95 
              backdrop-blur-xl border-b border-sky-500/10 p-4 md:hidden">
              <nav className="flex flex-col space-y-4">
                <a 
                  href="https://twitter.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-300 hover:text-sky-400 
                    transition-colors duration-200 px-4 py-2 rounded-lg 
                    hover:bg-sky-500/10"
                >
                  Twitter
                </a>
                <a 
                  href="https://telegram.org" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-300 hover:text-sky-400 
                    transition-colors duration-200 px-4 py-2 rounded-lg 
                    hover:bg-sky-500/10"
                >
                  Telegram
                </a>
                <a 
                  href="/docs" 
                  className="text-sm font-medium text-gray-300 hover:text-sky-400 
                    transition-colors duration-200 px-4 py-2 rounded-lg 
                    hover:bg-sky-500/10"
                >
                  Docs
                </a>
                <a 
                  href="/token" 
                  className="text-sm font-medium text-gray-300 hover:text-sky-400 
                    transition-colors duration-200 px-4 py-2 rounded-lg 
                    hover:bg-sky-500/10"
                >
                  $STEAL
                </a>
                <a 
                  href="/faq" 
                  className="text-sm font-medium text-gray-300 hover:text-sky-400 
                    transition-colors duration-200 px-4 py-2 rounded-lg 
                    hover:bg-sky-500/10"
                >
                  FAQ
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Adjusted Spacing and Layout */}
      <div className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-3 bg-clip-text text-transparent 
              bg-gradient-to-r from-white to-sky-200">
              Master the Art of Deception
            </h2>
            <p className="text-sky-200/80 text-lg mb-6">
              Progress through increasingly complex challenges to become an elite social engineer.
            </p>

            {/* Progress Bar - Moved Up */}
            <div className="max-w-md mx-auto mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-sky-500"/>
                  <span className="text-sky-200 text-sm font-medium">
                    Level Progress
                  </span>
                </div>
                <span className="text-sky-200 text-sm font-medium">
                  {completedLevels} / {levels.length} Completed
                </span>
              </div>
              <div className="h-1.5 bg-gray-800/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-sky-500 to-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>

            {/* Instruction Box */}
            <div className="inline-flex items-center space-x-3 px-3.5 py-1.5
              bg-sky-500/5 border border-sky-500/10 rounded-lg
              transition-all duration-300
              hover:bg-sky-500/10 hover:border-sky-500/20
              hover:shadow-[0_0_15px_rgba(14,165,233,0.15)]
              cursor-pointer group"
            >
              <svg 
                className="w-4 h-4 text-sky-400 transition-transform duration-300
                  group-hover:scale-110" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 10V3L4 14h7v7l9-11h-7z" 
                />
              </svg>
              <span className="text-sky-200 text-sm font-medium">
                Complete each level to unlock the next challenge
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Levels Grid */}
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {levels.map((level, index) => {
            const unlocked = isLevelUnlocked(level.id)
            const completed = isLevelCompleted(level.id)
            const score = getLevelScore(level.id)

            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`
                  relative overflow-hidden rounded-2xl
                  ${completed 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-800/50 border-green-500/20' 
                    : unlocked 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-800/50 border-sky-500/20' 
                      : 'bg-gradient-to-br from-gray-900 to-gray-900 border-gray-700/20'
                  }
                  border-2 backdrop-blur-sm
                  transition-all duration-300
                  ${!unlocked ? 'opacity-90' : ''}
                  ${unlocked && !completed 
                    ? 'hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/10 hover:translate-y-[-2px]' 
                    : ''
                  }
                `}
              >
                {/* Level Header with Image */}
                <div className="relative h-52 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent z-10"/>
                  <img 
                    src={level.image} 
                    alt={level.name}
                    className={`w-full h-full object-cover 
                      ${!unlocked ? 'filter brightness-50 grayscale' : 'filter brightness-75'}`}
                  />
                  
                  {/* Difficulty Badge */}
                  <div className={`
                    absolute top-4 left-4 px-3 py-1.5 rounded-full z-20
                    flex items-center space-x-2
                    backdrop-blur-sm bg-gray-900/50 border border-gray-700/50
                  `}>
                    <span className="text-base">{level.difficulty.icon}</span>
                    <span className="text-xs font-medium text-gray-300">
                      {level.difficulty.label}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className={`
                    absolute top-4 right-4 px-3 py-1.5 rounded-full z-20
                    flex items-center space-x-2
                    backdrop-blur-sm
                    ${completed 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : unlocked 
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                        : 'bg-gray-800/50 text-gray-400 border border-gray-700'
                    }
                  `}>
                    {!unlocked ? (
                      <>
                        <svg 
                          className="w-4 h-4 text-gray-500" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                          />
                        </svg>
                        <span className="text-xs font-medium tracking-wide">Locked</span>
                      </>
                    ) : (
                      <>
                        <div className={`w-2 h-2 rounded-full 
                          ${completed ? 'bg-green-400' : 'bg-sky-400'}`}
                        />
                        <span className="text-xs font-medium tracking-wide">
                          {completed ? 'Completed' : 'Available'}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Level Content */}
                <div className={`p-8 ${!unlocked ? 'opacity-75' : ''}`}>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className={`
                      text-2xl font-bold font-mono tracking-tight
                      ${completed 
                        ? 'text-green-400/90' 
                        : unlocked 
                          ? 'text-sky-400/90' 
                          : 'text-gray-600'
                      }
                    `}>
                      #{level.id.toString().padStart(2, '0')}
                    </span>
                    <div className="h-8 w-px bg-gray-700/50"/>
                    <h3 className={`text-xl font-extrabold tracking-tight
                      ${!unlocked 
                        ? 'text-gray-400' 
                        : completed
                          ? 'text-green-50'
                          : 'text-white'
                      }
                    `}>
                      {level.name}
                    </h3>
                  </div>

                  <p className={`leading-relaxed mb-8 
                    ${!unlocked ? 'text-gray-500' : 'text-gray-400'}
                  `}>
                    {level.description}
                  </p>

                  {/* Level Status & Action */}
                  <div className="flex items-center justify-between">
                    {!unlocked ? (
                      <div className="flex items-center space-x-3 text-gray-500 w-full
                        bg-gray-800/80 rounded-lg px-4 py-3 border border-gray-700/50">
                        <svg 
                          className="w-5 h-5 text-gray-600" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                          />
                        </svg>
                        <span className="font-medium">Complete previous level to unlock</span>
                      </div>
                    ) : completed ? (
                      <>
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-green-400 font-medium">
                            Score: {score}
                          </span>
                        </div>
                        <button 
                          onClick={() => handleLevelClick(level.id)}
                          className="px-5 py-2.5 rounded-lg bg-green-500/10 
                            text-green-400 font-medium
                            hover:bg-green-500/20 transition-all duration-200"
                        >
                          Replay Level
                        </button>
                      </>
                    ) : unlocked ? (
                      <button 
                        onClick={() => handleLevelClick(level.id)}
                        className="w-full px-6 py-3 rounded-lg bg-gradient-to-r 
                          from-sky-500 to-blue-600 text-white font-medium
                          hover:from-sky-400 hover:to-blue-500
                          transform transition-all duration-200 hover:scale-[1.02]
                          flex items-center justify-center space-x-3
                          group"
                      >
                        <span>Start Challenge</span>
                        <svg 
                          className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    ) : (
                      <div className="flex items-center space-x-3 text-gray-500 w-full
                        bg-gray-800/50 rounded-lg px-4 py-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m10 0h2m-2 0v2m0-2v-2" />
                        </svg>
                        <span className="font-medium">Complete previous level to unlock</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}

export default Levels 