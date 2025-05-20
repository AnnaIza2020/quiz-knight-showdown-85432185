
import React, { useState, useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { GameRound } from '@/types/game-types';
import TopBar from '@/components/hostpanel/TopBar';
import RoundControls from '@/components/hostpanel/RoundControls';
import ControlPanel from '@/components/hostpanel/ControlPanel';
import EventsBar from '@/components/hostpanel/EventsBar';
import PlayerGridContainer from '@/components/rounds/PlayerGridContainer';
import PlayerCardsPanel from '@/components/cards/PlayerCardsPanel';
import { toast } from 'sonner';

const HostPanel = () => {
  const {
    round,
    players,
    advanceToRoundTwo,
    advanceToRoundThree,
    finishGame,
    checkRoundThreeEnd,
    timerRunning,
    startTimer,
    stopTimer,
    playSound,
    resetGame,
    activePlayerId
  } = useGameContext();
  
  const [isPaused, setIsPaused] = useState(false);
  const [lastEvents, setLastEvents] = useState<string[]>([
    "Gra została uruchomiona",
    "Przygotowanie do rundy 1"
  ]);

  // Helper function to add an event to the notifications
  const addEvent = (event: string) => {
    setLastEvents(prev => [event, ...prev.slice(0, 4)]);
  };

  // Round management
  const handleAdvanceToRound = (targetRound: GameRound) => {
    if (targetRound === GameRound.ROUND_TWO) {
      advanceToRoundTwo();
      addEvent("Rozpoczęto rundę 2: 5 sekund");
      playSound('round-start');
      toast.success('Rozpoczęto Rundę 2');
    } else if (targetRound === GameRound.ROUND_THREE) {
      advanceToRoundThree();
      addEvent("Rozpoczęto rundę 3: Koło Fortuny");
      playSound('round-start');
      toast.success('Rozpoczęto Rundę 3');
    }
  };

  // Timer management
  const handleStartTimer = (seconds: number) => {
    startTimer(seconds);
    addEvent(`Timer ${seconds}s uruchomiony`);
  };

  const handleTogglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      addEvent("Gra wznowiona");
      toast.success('Gra wznowiona');
    } else {
      setIsPaused(true);
      addEvent("Gra wstrzymana");
      toast.info('Gra wstrzymana');
    }
  };

  const handleSkipQuestion = () => {
    addEvent("Pytanie pominięte");
    toast.info('Pytanie pominięte');
    // Logic for skipping question would go here
  };

  const handleFinishGame = () => {
    // Sprawdzamy koniec rundy 3
    if (round === GameRound.ROUND_THREE) {
      const isEnded = checkRoundThreeEnd();
      
      // Only return if the function returns true explicitly
      if (isEnded === true) {
        addEvent("Runda 3 zakończona - wszyscy stracili życie");
        return;
      }
    }

    // Dla innych rund lub ręcznego zakończenia
    const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
    if (sortedPlayers.length > 0) {
      finishGame([sortedPlayers[0].id]);
      addEvent(`Gra zakończona! Zwycięzca: ${sortedPlayers[0].name}`);
      playSound('victory');
      toast.success(`Gra zakończona! Zwycięzca: ${sortedPlayers[0].name}`);
    }
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
      <TopBar 
        round={round}
        handleStartTimer={handleStartTimer}
        stopTimer={stopTimer}
        handleAdvanceToRound={handleAdvanceToRound}
      />
      
      {/* Main Layout with Players Grid and Right Column */}
      <div className="flex flex-grow gap-4">
        {/* Main Content Area */}
        <div className="flex-grow bg-black/50 backdrop-blur-md p-4 rounded-lg border border-white/10">
          {/* Round Controls */}
          <RoundControls 
            round={round} 
            handleStartTimer={handleStartTimer} 
          />
          
          {/* Special Cards Panel if not in SETUP phase */}
          {round !== GameRound.SETUP && (
            <div className="mt-6">
              <PlayerCardsPanel players={players} />
            </div>
          )}
        </div>
        
        {/* Right Control Column */}
        <ControlPanel 
          isPaused={isPaused}
          handleTogglePause={handleTogglePause}
          handleSkipQuestion={handleSkipQuestion}
          handleFinishGame={handleFinishGame}
          resetGame={resetGame}
        />
      </div>
      
      {/* Bottom Events Bar */}
      <EventsBar lastEvents={lastEvents} />
    </div>
  );
};

export default HostPanel;
