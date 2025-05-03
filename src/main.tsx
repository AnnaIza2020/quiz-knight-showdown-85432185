
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import ThemeProvider from './components/ThemeProvider.tsx'
import { GameProvider } from './context/GameContext.tsx'
import Host from './pages/Host.tsx'
import HostPanel from './pages/HostPanel.tsx'
import Overlay from './pages/Overlay.tsx'
import PlayerView from './pages/PlayerView.tsx'
import Settings from './pages/Settings.tsx'
import Setup from './pages/Setup.tsx'
import Home from './pages/Home.tsx'
import NotFound from './pages/NotFound.tsx'
import MainLayout from './components/MainLayout.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <GameProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<App />} />
              <Route path="host" element={<Host />} />
              <Route path="hostpanel" element={<HostPanel />} />
              <Route path="overlay" element={<Overlay />} />
              <Route path="player/:token" element={<PlayerView />} />
              <Route path="settings" element={<Settings />} />
              <Route path="setup" element={<Setup />} />
              <Route path="home" element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </GameProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
