
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { GameProvider } from './context/GameContext';
import { QuestionsProvider } from './context/QuestionsContext';
import { SpecialCardsProvider } from './context/SpecialCardsContext';
import { LogsProvider } from './context/LogsContext';
import { AvailabilityProvider } from './context/AvailabilityContext';

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Host from './pages/Host';
import HostPanel from './pages/HostPanel';
import HostAvailability from './pages/HostAvailability';
import Overlay from './pages/Overlay';
import PlayerView from './pages/PlayerView';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <LogsProvider>
        <GameProvider>
          <QuestionsProvider>
            <SpecialCardsProvider>
              <AvailabilityProvider>
                <Router>
                  <Routes>
                    <Route path="/" element={<MainLayout />}>
                      <Route index element={<Home />} />
                      <Route path="host" element={<Host />} />
                      <Route path="hostpanel" element={<HostPanel />} />
                      <Route path="availability" element={<HostAvailability />} />
                      <Route path="overlay" element={<Overlay />} />
                      <Route path="player/:token" element={<PlayerView />} />
                      <Route path="settings/*" element={<Settings />} />
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </Router>
              </AvailabilityProvider>
            </SpecialCardsProvider>
          </QuestionsProvider>
        </GameProvider>
      </LogsProvider>
    </ThemeProvider>
  );
}

export default App;
