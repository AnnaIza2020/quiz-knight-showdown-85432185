
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import Overlay from "./pages/Overlay";
import Host from "./pages/Host";
import HostPanel from "./pages/HostPanel";
import UnifiedHostPanel from "./components/UnifiedHostPanel";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import PlayerView from "./pages/PlayerView";
import Rules from "./pages/Rules";

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
            <Route path="/classic" element={<Index />} />
            <Route path="/overlay" element={<Overlay />} />
            <Route path="/host" element={<Navigate to="/unified-host" replace />} />
            <Route path="/hostpanel" element={<Navigate to="/unified-host" replace />} />
            <Route path="/unified-host" element={<UnifiedHostPanel />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/player/:playerId" element={<PlayerView />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </GameProvider>
  </QueryClientProvider>
);

export default App;
