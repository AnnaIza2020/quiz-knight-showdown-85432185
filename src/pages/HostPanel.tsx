
import React, { useState, useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { GameRound } from '@/types/game-types';
import TopBar from '@/components/hostpanel/TopBar';
import EventsBar from '@/components/hostpanel/EventsBar';
import GameActions from '@/components/host/GameActions';
import GameControlPanel from '@/components/host/GameControlPanel';
import PlayersManagementPanel from '@/components/host/PlayersManagementPanel';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const HostPanel = () => {
  const {
    round,
    players,
    resetGame,
    soundsEnabled,
    setSoundsEnabled,
    saveGameData,
    loadGameData,
    setRound,
    addLog
  } = useGameContext();
  
  const navigate = useNavigate();
  const [lastEvents, setLastEvents] = useState<string[]>([
    "Panel prowadzącego uruchomiony",
    "Przygotowanie do gry"
  ]);

  // Helper function to add an event to the notifications
  const addEvent = (event: string) => {
    setLastEvents(prev => [event, ...prev.slice(0, 4)]);
    addLog(event);
  };

  // Game actions
  const startGame = () => {
    if (players.length < 2) {
      toast.error('Potrzeba przynajmniej 2 graczy, aby rozpocząć grę');
      return;
    }
    
    setRound(GameRound.ROUND_ONE);
    addEvent("Gra rozpoczęta! Runda 1");
    toast.success('Gra rozpoczęta!');
  };
  
  const startNewGame = () => {
    resetGame();
    navigate('/setup');
    toast.success('Nowa gra utworzona');
  };
  
  const handleSaveLocal = async () => {
    try {
      const result = await saveGameData();
      if (result && result.success) {
        toast.success('Gra zapisana lokalnie');
        addEvent("Gra zapisana lokalnie");
      } else {
        toast.error('Błąd podczas zapisywania gry');
      }
    } catch (error) {
      console.error('Error saving game:', error);
      toast.error('Błąd podczas zapisywania gry');
    }
  };
  
  const handleLoadLocal = async () => {
    try {
      const result = await loadGameData();
      if (result && result.success) {
        toast.success('Gra wczytana lokalnie');
        addEvent("Gra wczytana lokalnie");
      } else {
        toast.error('Błąd podczas wczytywania gry');
      }
    } catch (error) {
      console.error('Error loading game:', error);
      toast.error('Błąd podczas wczytywania gry');
    }
  };
  
  const toggleSound = () => {
    setSoundsEnabled(!soundsEnabled);
    toast.info(soundsEnabled ? 'Dźwięki wyłączone' : 'Dźwięki włączone');
  };
  
  // Use effect to show round notification
  useEffect(() => {
    if (round === GameRound.ROUND_ONE) {
      toast.success('Runda 1 rozpoczęta!');
    } else if (round === GameRound.ROUND_TWO) {
      toast.success('Runda 2 rozpoczęta!');
    } else if (round === GameRound.ROUND_THREE) {
      toast.success('Runda 3 rozpoczęta!');
    } else if (round === GameRound.FINISHED) {
      toast.success('Gra zakończona!');
    }
  }, [round]);

  return (
    <div className="min-h-screen bg-neon-background p-4 flex flex-col">
      {/* Top Bar Component */}
      <TopBar />
      
      {/* Game Action Buttons */}
      <GameActions 
        round={round}
        startGame={startGame}
        startNewGame={startNewGame}
        handleSaveLocal={handleSaveLocal}
        handleLoadLocal={handleLoadLocal}
        soundMuted={!soundsEnabled}
        toggleSound={toggleSound}
      />
      
      {/* Main Content with Tabs */}
      <div className="flex-grow">
        <Tabs defaultValue="control" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-white/10">
            <TabsTrigger value="control" className="text-white data-[state=active]:bg-neon-blue">
              Kontrola Gry
            </TabsTrigger>
            <TabsTrigger value="players" className="text-white data-[state=active]:bg-neon-blue">
              Gracze
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="control" className="mt-4">
            <GameControlPanel />
          </TabsContent>
          
          <TabsContent value="players" className="mt-4">
            <PlayersManagementPanel />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Bottom Events Bar */}
      <EventsBar lastEvents={lastEvents} />
    </div>
  );
};

export default HostPanel;
