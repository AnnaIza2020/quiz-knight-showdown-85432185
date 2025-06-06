
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameContextProvider } from '@/context/GameContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import SoundPreloader from '@/components/SoundPreloader';

// Lazy load components for better performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const HostPanel = lazy(() => import('@/pages/HostPanel'));
const OverlayView = lazy(() => import('@/pages/OverlayView'));
const PlayerView = lazy(() => import('@/pages/PlayerView'));
const Settings = lazy(() => import('@/pages/Settings'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <GameContextProvider>
          <TooltipProvider>
            <Router>
              <div className="min-h-screen bg-background font-sans antialiased">
                <SoundPreloader />
                <Suspense fallback={
                  <div className="min-h-screen bg-neon-background flex items-center justify-center">
                    <div className="text-white text-xl">Ładowanie...</div>
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/host" element={<HostPanel />} />
                    <Route path="/overlay" element={<OverlayView />} />
                    <Route path="/player/:playerId" element={<PlayerView />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                <Toaster />
              </div>
            </Router>
          </TooltipProvider>
        </GameContextProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
