
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import NotFound from '@/pages/NotFound';
import Settings from '@/pages/Settings';
import Host from '@/pages/Host';
import Overlay from '@/pages/Overlay';
import PlayerView from '@/pages/PlayerView';
import About from '@/pages/About';
import { ThemeProvider } from '@/components/ThemeProvider';
import MainLayout from './layouts/MainLayout';
import { LogsProvider } from './context/LogsContext';
import HostAvailability from './pages/HostAvailability';
import Setup from './pages/Setup';
import { GameProvider } from './context/GameContext';
import HostPanel from './pages/HostPanel';
import { QuestionsProvider } from './context/QuestionsContext';
import { SpecialCardsProvider } from './context/SpecialCardsContext';
import { AvailabilityProvider } from './context/AvailabilityContext';
import './App.css';

// Error boundary component to catch React errors
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <GameProvider>
          <QuestionsProvider>
            <SpecialCardsProvider>
              <AvailabilityProvider>
                <LogsProvider>
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<MainLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="about" element={<About />} />
                        <Route path="host" element={<Host />} />
                        <Route path="host-panel" element={<HostPanel />} />
                        <Route path="host-availability" element={<HostAvailability />} />
                        <Route path="settings/*" element={<Settings />} />
                        <Route path="setup" element={<Setup />} />
                        <Route path="*" element={<NotFound />} />
                      </Route>
                      <Route path="/overlay" element={<Overlay />} />
                      <Route path="/player/:token" element={<PlayerView />} />
                    </Routes>
                  </BrowserRouter>
                </LogsProvider>
              </AvailabilityProvider>
            </SpecialCardsProvider>
          </QuestionsProvider>
        </GameProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
