
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import NotFound from '@/pages/NotFound'
import Settings from '@/pages/Settings'
import Host from '@/pages/Host'
import Overlay from '@/pages/Overlay'
import PlayerView from '@/pages/PlayerView'
import About from '@/pages/About'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from "@/components/ui/toaster"
import MainLayout from './layouts/MainLayout'
import { LogsProvider } from './context/LogsContext'
import UnifiedHostPanel from './components/UnifiedHostPanel'
import SwitchableHostPanel from './components/SwitchableHostPanel'
import HostAvailability from './pages/HostAvailability'
import Setup from './pages/Setup'
import './App.css'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LogsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<About />} />
              <Route path="host" element={<Host />} />
              <Route path="host-new" element={<UnifiedHostPanel />} />
              <Route path="host-switch" element={<SwitchableHostPanel />} />
              <Route path="host-availability" element={<HostAvailability />} />
              <Route path="settings/*" element={<Settings />} />
              <Route path="setup" element={<Setup />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/overlay" element={<Overlay />} />
            <Route path="/player/:token" element={<PlayerView />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </LogsProvider>
    </ThemeProvider>
  )
}

export default App
