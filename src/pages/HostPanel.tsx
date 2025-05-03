import React, { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { GameRound } from '@/types/game-types';
import TopBar from '@/components/hostpanel/TopBar';
import PlayersGrid from '@/components/hostpanel/PlayersGrid';
import RoundControls from '@/components/hostpanel/RoundControls';
import ControlPanel from '@/components/hostpanel/ControlPanel';
import EventsBar from '@/components/hostpanel/EventsBar';

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
    } else if (targetRound === GameRound.ROUND_THREE) {
      advanceToRoundThree();
      addEvent("Rozpoczęto rundę 3: Koło Fortuny");
      playSound('round-start');
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
    } else {
      setIsPaused(true);
      addEvent("Gra wstrzymana");
    }
  };

  const handleSkipQuestion = () => {
    addEvent("Pytanie pominięte");
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
    }
  };

  // Get active players that aren't eliminated
  const activePlayers = players.filter(player => !player.isEliminated);

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
        {/* Players Grid */}
        <div className="flex-grow bg-black/50 backdrop-blur-md p-4 rounded-lg border border-white/10">
          <h2 className="text-2xl font-bold mb-4 text-white">Siatka Graczy</h2>
          
          <PlayersGrid activePlayers={activePlayers} />
          
          {/* Round-specific controls */}
          <RoundControls round={round} handleStartTimer={handleStartTimer} />
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
