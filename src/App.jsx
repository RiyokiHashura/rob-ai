import { BrowserRouter } from 'react-router-dom'
import { AIProvider } from './context/AIContext'
import { Routes, Route } from 'react-router-dom'
import Play from './pages/Play'

export default function App() {
  return (
    <BrowserRouter>
      <AIProvider>
        <Routes>
          <Route path="/*" element={<Play />} />
        </Routes>
      </AIProvider>
    </BrowserRouter>
  )
}
