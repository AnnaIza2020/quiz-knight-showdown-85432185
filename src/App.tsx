
import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GameContextProvider } from "@/context/GameContext";
import { QuestionsContextProvider } from "@/context/QuestionsContext";
import { GameStateProvider } from "@/context/GameStateContext";
import SoundPreloader from "@/components/SoundPreloader";
import MainLayout from "@/layouts/MainLayout";

// Lazy load components
const HomePage = lazy(() => import("./pages/HomePage"));
const Setup = lazy(() => import("./pages/Setup"));
const HostPanel = lazy(() => import("./pages/HostPanel"));
const OverlayView = lazy(() => import("./pages/OverlayView"));
const PlayerView = lazy(() => import("./pages/PlayerView"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameContextProvider>
        <QuestionsContextProvider>
          <GameStateProvider>
            <TooltipProvider>
              <Router>
                <MainLayout>
                  <Suspense fallback={
                    <div className="min-h-screen bg-neon-background flex items-center justify-center">
                      <div className="text-white text-xl">Ładowanie...</div>
                    </div>
                  }>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/setup" element={<Setup />} />
                      <Route path="/host" element={<HostPanel />} />
                      <Route path="/overlay" element={<OverlayView />} />
                      <Route path="/player/:playerId?" element={<PlayerView />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                  <SoundPreloader />
                  <Toaster />
                </MainLayout>
              </Router>
            </TooltipProvider>
          </GameStateProvider>
        </QuestionsContextProvider>
      </GameContextProvider>
    </QueryClientProvider>
  );
}

export default App;
