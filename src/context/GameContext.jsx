import { createContext, useContext, useReducer } from 'react'

const GameContext = createContext()

// Initial game state
const initialState = {
  currentLevel: 1,
  maxUnlockedLevel: 1,
  progress: {
    1: { completed: false, score: 0 },
    2: { completed: false, score: 0 },
    3: { completed: false, score: 0 },
    4: { completed: false, score: 0 },
    5: { completed: false, score: 0 },
    6: { completed: false, score: 0 },
    7: { completed: false, score: 0 },
    8: { completed: false, score: 0 },
    9: { completed: false, score: 0 },
  }
}

// Action types
const COMPLETE_LEVEL = 'COMPLETE_LEVEL'
const SET_CURRENT_LEVEL = 'SET_CURRENT_LEVEL'
const UPDATE_SCORE = 'UPDATE_SCORE'

// Reducer function
function gameReducer(state, action) {
  switch (action.type) {
    case COMPLETE_LEVEL:
      const newMaxLevel = Math.max(state.maxUnlockedLevel, action.payload + 1)
      return {
        ...state,
        maxUnlockedLevel: newMaxLevel,
        progress: {
          ...state.progress,
          [action.payload]: {
            ...state.progress[action.payload],
            completed: true
          }
        }
      }

    case SET_CURRENT_LEVEL:
      return {
        ...state,
        currentLevel: action.payload
      }

    case UPDATE_SCORE:
      return {
        ...state,
        progress: {
          ...state.progress,
          [action.payload.level]: {
            ...state.progress[action.payload.level],
            score: action.payload.score
          }
        }
      }

    default:
      return state
  }
}

// Provider component
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  // Actions
  const completeLevel = (levelId) => {
    dispatch({ type: COMPLETE_LEVEL, payload: levelId })
  }

  const setCurrentLevel = (levelId) => {
    dispatch({ type: SET_CURRENT_LEVEL, payload: levelId })
  }

  const updateScore = (levelId, score) => {
    dispatch({ 
      type: UPDATE_SCORE, 
      payload: { level: levelId, score } 
    })
  }

  const value = {
    ...state,
    completeLevel,
    setCurrentLevel,
    updateScore,
    isLevelUnlocked: (levelId) => levelId <= state.maxUnlockedLevel,
    isLevelCompleted: (levelId) => state.progress[levelId].completed,
    getLevelScore: (levelId) => state.progress[levelId].score
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

// Custom hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
} 