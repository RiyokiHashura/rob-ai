import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Levels from './pages/Levels'
import Play from './pages/Play'
import { GameProvider } from './context/GameContext'
import { AIProvider } from './context/AIContext'

function App() {
  return (
    <Router>
      <GameProvider>
        <AIProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/levels" element={<Levels />} />
            <Route path="/play/:levelId" element={<Play />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AIProvider>
      </GameProvider>
    </Router>
  )
}

export default App
