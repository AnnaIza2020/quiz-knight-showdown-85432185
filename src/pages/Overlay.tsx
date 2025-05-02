
import React, { useState, useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { GameRound } from '@/context/GameContext';
import PlayerGrid from '@/components/overlay/PlayerGrid';
import RoundIndicator from '@/components/overlay/RoundIndicator';
import MiddleSection from '@/components/overlay/MiddleSection';
import WinnerDisplay from '@/components/overlay/WinnerDisplay';
import ConfettiEffect from '@/components/overlay/ConfettiEffect';

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
  
  // Show confetti when winners are announced
  useEffect(() => {
    if (round === GameRound.FINISHED && winnerIds.length > 0) {
      setShowConfetti(true);
      
      // Play victory sound
      const victorySound = new Audio('/sounds/victory.mp3');
      victorySound.volume = 0.7;
      victorySound.play().catch(e => console.log('Error playing sound:', e));
    }
  }, [round, winnerIds]);
  
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
  const winners = winnerIds.map(id => players.find(p => p.id === id)).filter(Boolean) as Player[];
  
  return (
    <div className="w-full h-screen bg-neon-background overflow-hidden relative">
      {/* Overlay grid layout */}
      <div className="w-full h-full grid grid-rows-[1fr_auto_1fr] p-4 gap-4">
        {/* Top row with first 5 players */}
        <PlayerGrid players={activePlayers} maxPlayers={maxPlayers} position="top" />
        
        {/* Middle row with host camera and question board */}
        <MiddleSection round={round} hostCameraUrl={hostCameraUrl} />
        
        {/* Bottom row with remaining 5 players */}
        <PlayerGrid players={activePlayers} maxPlayers={maxPlayers} position="bottom" />
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
    </div>
  );
};

export default Overlay;
