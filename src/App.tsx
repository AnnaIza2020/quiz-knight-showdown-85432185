
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Setup from '@/pages/Setup';
import Host from '@/pages/Host';
import Settings from '@/pages/Settings';
import About from '@/pages/About';
import HostPanel from '@/pages/HostPanel';
import PlayerView from '@/pages/PlayerView';
import { GameProvider } from '@/context/GameContext';
import ThemeProvider from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { Loader } from 'lucide-react';
import { Toaster as SonnerToaster } from 'sonner';

// Lazy-loaded components
const Overlay = lazy(() => import('@/pages/Overlay'));
const UnifiedHostPanel = lazy(() => import('@/components/UnifiedHostPanel'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-black">
    <div className="flex flex-col items-center">
      <Loader className="w-12 h-12 text-primary animate-spin mb-4" />
      <div className="text-white text-xl">Ładowanie...</div>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <GameProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/setup" element={<Setup />} />
              <Route path="/host" element={<Host />} />
              <Route path="/settings/*" element={<Settings />} />
              <Route path="/about" element={<About />} />
              <Route path="/hostpanel" element={<HostPanel />} />
              <Route path="/host-panel" element={<UnifiedHostPanel />} />
              <Route path="/overlay" element={<Overlay />} />
              <Route path="/player/:playerToken" element={<PlayerView />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
        <SonnerToaster position="top-right" closeButton richColors />
      </GameProvider>
    </ThemeProvider>
  );
}

export default App;
