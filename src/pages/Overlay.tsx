
import React, { useState, useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { GameRound } from '@/types/game-types';
import PlayerGrid from '@/components/overlay/PlayerGrid';
import RoundIndicator from '@/components/overlay/RoundIndicator';
import MiddleSection from '@/components/overlay/MiddleSection';
import WinnerDisplay from '@/components/overlay/WinnerDisplay';
import ConfettiEffect from '@/components/overlay/ConfettiEffect';
import InfoBar from '@/components/overlay/InfoBar';

const Overlay = () => {
  const { 
    round,
    players,
    hostCameraUrl,
    activePlayerId,
    winnerIds,
    primaryColor,
    secondaryColor
  } = useGameContext();

  const [showConfetti, setShowConfetti] = useState(false);
  const [gameEvents, setGameEvents] = useState<string[]>([]);
  
  // Show confetti when winners are announced
  useEffect(() => {
    if (round === GameRound.FINISHED && winnerIds.length > 0) {
      setShowConfetti(true);
      
      // Play victory sound
      const victorySound = new Audio('/sounds/victory.mp3');
      victorySound.volume = 0.7;
      victorySound.play().catch(e => console.log('Error playing sound:', e));
      
      // Dodaj wydarzenie o zakończeniu gry
      const winnerNames = winnerIds
        .map(id => players.find(p => p.id === id)?.name || "Nieznany gracz")
        .join(", ");
      addGameEvent(`Gra zakończona! Zwycięzca(y): ${winnerNames}`);
    }
  }, [round, winnerIds, players]);
  
  // Symulacja dodawania wydarzeń dla demonstracji
  useEffect(() => {
    // Przy pierwszym renderowaniu dodajmy kilka przykładowych wydarzeń
    if (gameEvents.length === 0) {
      setGameEvents([
        "Rozpoczynamy teleturniej!",
        "Gracz3 otrzymał kartę specjalną: Podwójne punkty",
        "Gracz5 został wyeliminowany z gry",
        "Rozpoczynamy rundę drugą",
        "Gracz1 zdobył 15 punktów za poprawną odpowiedź"
      ]);
    }
  }, [gameEvents.length]);
  
  const addGameEvent = (event: string) => {
    setGameEvents(prev => [event, ...prev]);
  };
  
  // Filter players based on current round
  const activePlayers = players.filter(p => !p.isEliminated);
  
  // For round 1: display all 10 players
  // For round 2: display 6 players
  // For round 3: display 3 players
  const maxPlayers = 
    round === GameRound.ROUND_ONE ? 10 : 
    round === GameRound.ROUND_TWO ? 6 : 
    round === GameRound.ROUND_THREE ? 3 : 10;

  // Get winners for display
  const winners = winnerIds.map(id => players.find(p => p.id === id)).filter(Boolean);
  
  return (
    <div className="w-full h-screen bg-neon-background overflow-hidden relative">
      {/* Overlay grid layout */}
      <div className="w-full h-full grid grid-rows-[1fr_auto_1fr] p-4 gap-4">
        {/* Top row with first 5 players */}
        <PlayerGrid 
          players={activePlayers} 
          maxPlayers={maxPlayers} 
          position="top" 
          activePlayerId={activePlayerId}
        />
        
        {/* Middle row with host camera and question board */}
        <MiddleSection round={round} hostCameraUrl={hostCameraUrl} />
        
        {/* Bottom row with remaining 5 players */}
        <PlayerGrid 
          players={activePlayers} 
          maxPlayers={maxPlayers} 
          position="bottom" 
          activePlayerId={activePlayerId}
        />
      </div>
      
      {/* Round indicator */}
      <RoundIndicator round={round} primaryColor={primaryColor} secondaryColor={secondaryColor} />
      
      {/* Winner display */}
      <WinnerDisplay 
        show={round === GameRound.FINISHED && winnerIds.length > 0} 
        winners={winners}
      />
      
      {/* Confetti effect */}
      <ConfettiEffect 
        primaryColor={primaryColor} 
        secondaryColor={secondaryColor} 
        show={showConfetti} 
      />
      
      {/* Info Bar */}
      <InfoBar events={gameEvents} />
    </div>
  );
};

export default Overlay;
