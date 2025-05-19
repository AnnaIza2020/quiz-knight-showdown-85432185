import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import Home from './pages/Home';
import About from './pages/About';
import Host from './pages/Host';
import Overlay from './pages/Overlay';
import PlayerView from './pages/PlayerView';
import Settings from './pages/Settings';
import Setup from './pages/Setup';
import NotFound from './pages/NotFound';
import SoundPreloader from './components/SoundPreloader';
import PlayerAvailabilityCalendar from './components/settings/player/PlayerAvailabilityCalendar';

import HostAvailability from './pages/HostAvailability';
import { AvailabilityProvider } from './context/AvailabilityContext';

function App() {
  const isMobile = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Windows Phone|webOS/i.test(navigator.userAgent);

  return (
    <ThemeProvider>
      <AvailabilityProvider>
        <BrowserRouter>
          <SoundPreloader />
          <Routes>
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/home" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/about" element={<MainLayout><About /></MainLayout>} />
            <Route path="/host" element={<Host />} />
            <Route path="/host/availability" element={<HostAvailability />} />
            <Route path="/overlay" element={<Overlay />} />
            <Route path="/player" element={<PlayerView />} />
            <Route path="/player/calendar" element={<MainLayout><PlayerAvailabilityCalendar players={[]} /></MainLayout>} />
            <Route path="/settings/*" element={<Settings />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
          </Routes>
        </BrowserRouter>
      </AvailabilityProvider>
    </ThemeProvider>
  );
}

export default App;
