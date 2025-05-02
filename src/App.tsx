
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import HomePage from "./pages/HomePage";
import Overlay from "./pages/Overlay";
import UnifiedHostPanel from "./components/UnifiedHostPanel";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import PlayerView from "./pages/PlayerView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GameProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/overlay" element={<Overlay />} />
            <Route path="/unified-host" element={<UnifiedHostPanel />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/player/:playerId" element={<PlayerView />} />
            
            {/* Redirect all deprecated routes */}
            <Route path="/host" element={<Navigate to="/unified-host" replace />} />
            <Route path="/hostpanel" element={<Navigate to="/unified-host" replace />} />
            <Route path="/intro" element={<Navigate to="/" replace />} />
            <Route path="/rules" element={<Navigate to="/settings?tab=rules" replace />} />
            <Route path="/classic" element={<Navigate to="/unified-host" replace />} />
            <Route path="/zasady" element={<Navigate to="/settings?tab=rules" replace />} />
            <Route path="/klasyczny" element={<Navigate to="/unified-host" replace />} />
            <Route path="/gracze" element={<Navigate to="/settings?tab=gracze" replace />} />
            
            {/* Redirect any other unknown paths to 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </GameProvider>
  </QueryClientProvider>
);

export default App;
