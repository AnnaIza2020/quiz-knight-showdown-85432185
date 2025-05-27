
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { GameStateProvider } from '@/context/GameStateContext';
import HomePage from '@/pages/HomePage';
import Host from '@/pages/Host';
import PlayerView from '@/pages/PlayerView';
import SettingsView from '@/pages/SettingsView';
import Overlay from '@/pages/Overlay';
import PlayersView from '@/pages/PlayersView';
import RulesView from '@/pages/RulesView';
import './App.css';

function App() {
  return (
    <GameStateProvider>
      <Router>
        <div className="min-h-screen bg-[#0C0C13]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/host" element={<Host />} />
            <Route path="/player" element={<PlayerView />} />
            <Route path="/player/:token" element={<PlayerView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/overlay" element={<Overlay />} />
            <Route path="/players" element={<PlayersView />} />
            <Route path="/rules" element={<RulesView />} />
          </Routes>
          <Toaster theme="dark" />
        </div>
      </Router>
    </GameStateProvider>
  );
}

export default App;
