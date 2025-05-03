
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import ThemeProvider from './components/ThemeProvider.tsx'
import { GameProvider } from './context/GameContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <GameProvider>
        <Router>
          <App />
        </Router>
      </GameProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
