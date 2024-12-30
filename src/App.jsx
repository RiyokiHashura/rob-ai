import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import Home from './pages/Home'
import Levels from './pages/Levels'
import GameInterface from './pages/GameInterface'
import SuccessScreen from './pages/SuccessScreen'
import Play from './pages/Play'

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/levels" element={<Levels />} />
          <Route path="/play/:levelId" element={<Play />} />
          <Route path="/play" element={<GameInterface />} />
          <Route path="/success" element={<SuccessScreen />} />
        </Routes>
      </Router>
    </GameProvider>
  )
}

export default App
