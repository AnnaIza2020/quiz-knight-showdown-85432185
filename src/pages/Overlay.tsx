
import React, { useState, useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { GameRound, SoundEffect } from '@/types/game-types';
import RoundIndicator from '@/components/overlay/RoundIndicator';
import WinnerDisplay from '@/components/overlay/WinnerDisplay';
import ConfettiEffect from '@/components/overlay/ConfettiEffect';
import InfoBar from '@/components/overlay/InfoBar';
import { useSubscription } from '@/hooks/useSubscription';
import { useSoundEffects } from '@/hooks/useSoundEffects';

// Import our components
import OverlayContainer from '@/components/overlay/OverlayContainer';
import GameGrid from '@/components/overlay/GameGrid';
import RoundTransition from '@/components/overlay/RoundTransition';

const Overlay = () => {
  const { 
    round,
    players,
    hostCameraUrl,
    activePlayerId,
    winnerIds,
    primaryColor,
    secondaryColor,
    timerRunning,
    timerSeconds,
    currentQuestion
  } = useGameContext();

  const [showConfetti, setShowConfetti] = useState(false);
  const [gameEvents, setGameEvents] = useState<string[]>([]);
  const [showRoundTransition, setShowRoundTransition] = useState(false);
  const [lastActivePlayer, setLastActivePlayer] = useState<string | null>(null);
  const [latestPoints, setLatestPoints] = useState<{playerId: string, points: number} | null>(null);
  
  // Sound effects
  const { playSound, stopAllSounds } = useSoundEffects({
    enabled: true,
    useLocalStorage: true,
    defaultVolume: 0.7
  });
  
  // Subscribe to game events from the host panel
  useSubscription<any>(
    'game_events',
    'new_event',
    (payload) => {
      if (payload.event) {
        addGameEvent(payload.event);
      }
      
      // Handle other event types
      if (payload.type === 'player_active') {
        setLastActivePlayer(payload.playerId);
        
        // Reset after animation
        setTimeout(() => {
          setLastActivePlayer(null);
        }, 3000);
      }
      
      if (payload.type === 'points_awarded') {
        setLatestPoints({
          playerId: payload.playerId,
          points: payload.points
        });
        
        // Reset after animation
        setTimeout(() => {
          setLatestPoints(null);
        }, 3000);
      }
      
      // Handle sound control
      if (payload.type === 'sound_control') {
        if (payload.action === 'play') {
          const volumeLevel = payload.volume || 0.7;
          playSound(payload.sound as SoundEffect, volumeLevel);
        } else if (payload.action === 'stop') {
          stopAllSounds();
        }
      }
    }
  );
  
  // Helper function to add an event to the gameEvents list
  const addGameEvent = (event: string) => {
    setGameEvents(prev => {
      // Only add the event if it's not a duplicate of the most recent one
      if (prev.length > 0 && prev[0] === event) {
        return prev;
      }
      return [event, ...prev.slice(0, 9)];
    });
  };
  
  // Show confetti when winners are announced
  useEffect(() => {
    if (round === GameRound.FINISHED && winnerIds.length > 0) {
      setShowConfetti(true);
      
      // Play victory sound
      playSound('victory');
      
      // Add game event about game completion
      const winnerNames = winnerIds
        .map(id => players.find(p => p.id === id)?.name || "Nieznany gracz")
        .join(", ");
      addGameEvent(`Gra zakończona! Zwycięzca(y): ${winnerNames}`);
    }
  }, [round, winnerIds, players, playSound]);
  
  // Show round transition animation when round changes
  useEffect(() => {
    const lastRoundStr = localStorage.getItem('lastGameRound');
    const lastRound = lastRoundStr ? parseInt(lastRoundStr, 10) : null;
    
    // Only show transition if the round has actually changed
    if (lastRound !== round) {
      if (round !== GameRound.SETUP) {
        setShowRoundTransition(true);
        
        // Play round start sound
        playSound('round-start');
        
        // Hide transition after animation
        const timeout = setTimeout(() => {
          setShowRoundTransition(false);
        }, 3000);
        
        // Add event for round change
        addGameEvent(`Rozpoczynamy ${getRoundName()}!`);
        
        // Save current round - zapisujemy jako string
        localStorage.setItem('lastGameRound', String(round));
        
        return () => clearTimeout(timeout);
      }
    }
  }, [round, playSound]);
  
  // Handle timer sounds
  useEffect(() => {
    if (timerRunning && timerSeconds <= 5 && timerSeconds > 0) {
      // Play tick sound for last 5 seconds
      playSound('wheel-tick', 0.3);
    } else if (timerSeconds === 0) {
      // Play timeout sound when timer ends
      playSound('timeout', 0.5);
      
      addGameEvent("Czas minął!");
    }
  }, [timerRunning, timerSeconds, playSound]);
  
  // Track question changes
  useEffect(() => {
    if (currentQuestion) {
      const categoryName = currentQuestion.category || 'Ogólne';
      addGameEvent(`Nowe pytanie: ${categoryName} (${currentQuestion.difficulty} pkt)`);
    }
  }, [currentQuestion]);
  
  // Track active player changes
  useEffect(() => {
    if (activePlayerId) {
      const player = players.find(p => p.id === activePlayerId);
      if (player) {
        addGameEvent(`Aktywny gracz: ${player.name}`);
      }
    }
  }, [activePlayerId, players]);
  
  // Get round name for transitions
  const getRoundName = () => {
    switch (round) {
      case GameRound.SETUP:
        return "Przygotowanie";
      case GameRound.ROUND_ONE:
        return "Runda 1: Zróżnicowana Wiedza";
      case GameRound.ROUND_TWO:
        return "Runda 2: 5 Sekund";
      case GameRound.ROUND_THREE:
        return "Runda 3: Koło Chaosu";
      case GameRound.FINISHED:
        return "Finał Gry";
    }
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
    <OverlayContainer>
      {/* Round transition overlay */}
      <RoundTransition 
        show={showRoundTransition}
        round={round}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      />
      
      {/* Main overlay grid layout */}
      <GameGrid 
        activePlayers={activePlayers}
        maxPlayers={maxPlayers}
        round={round}
        hostCameraUrl={hostCameraUrl}
        activePlayerId={activePlayerId}
        lastActivePlayer={lastActivePlayer}
        latestPoints={latestPoints}
      />
      
      {/* Round indicator */}
      <RoundIndicator 
        round={round} 
        primaryColor={primaryColor} 
        secondaryColor={secondaryColor} 
      />
      
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
    </OverlayContainer>
  );
};

export default Overlay;
