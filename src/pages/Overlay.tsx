
import React, { useState, useEffect, useRef } from 'react';
import { useGameContext } from '@/context/GameContext';
import { GameRound } from '@/types/game-types';
import PlayerGrid from '@/components/overlay/PlayerGrid';
import RoundIndicator from '@/components/overlay/RoundIndicator';
import MiddleSection from '@/components/overlay/MiddleSection';
import WinnerDisplay from '@/components/overlay/WinnerDisplay';
import ConfettiEffect from '@/components/overlay/ConfettiEffect';
import InfoBar from '@/components/overlay/InfoBar';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubscription } from '@/hooks/useSubscription';
import { useFullscreen } from '@/hooks/useFullscreen';

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
  const [showIntro, setShowIntro] = useState(false);
  const [showRoundTransition, setShowRoundTransition] = useState(false);
  const [lastActivePlayer, setLastActivePlayer] = useState<string | null>(null);
  const [latestPoints, setLatestPoints] = useState<{playerId: string, points: number} | null>(null);
  
  // Refs for fullscreen and container
  const containerRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreen(containerRef);
  
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
    }
  );
  
  // Show confetti when winners are announced
  useEffect(() => {
    if (round === GameRound.FINISHED && winnerIds.length > 0) {
      setShowConfetti(true);
      
      // Play victory sound
      const victorySound = new Audio('/sounds/victory.mp3');
      victorySound.volume = 0.7;
      victorySound.play().catch(e => console.log('Error playing sound:', e));
      
      // Add game event about game completion
      const winnerNames = winnerIds
        .map(id => players.find(p => p.id === id)?.name || "Nieznany gracz")
        .join(", ");
      addGameEvent(`Gra zakończona! Zwycięzca(y): ${winnerNames}`);
    }
  }, [round, winnerIds, players]);
  
  // Show round transition animation when round changes
  useEffect(() => {
    const lastRound = localStorage.getItem('lastGameRound');
    
    // Only show transition if the round has actually changed
    if (lastRound !== round) {
      if (round !== GameRound.SETUP) {
        setShowRoundTransition(true);
        
        // Play round start sound
        const roundSound = new Audio('/sounds/round-start.mp3');
        roundSound.volume = 0.5;
        roundSound.play().catch(e => console.log('Error playing sound:', e));
        
        // Hide transition after animation
        const timeout = setTimeout(() => {
          setShowRoundTransition(false);
        }, 3000);
        
        // Add event for round change
        addGameEvent(`Rozpoczynamy ${getRoundName()}!`);
        
        // Save current round
        localStorage.setItem('lastGameRound', round);
        
        return () => clearTimeout(timeout);
      }
    }
  }, [round]);
  
  // Show intro animation on component mount
  useEffect(() => {
    const hasShownIntro = sessionStorage.getItem('hasShownOverlayIntro');
    
    if (!hasShownIntro && round !== GameRound.SETUP) {
      setShowIntro(true);
      
      // Play intro sound
      const introSound = new Audio('/sounds/round-start.mp3');
      introSound.volume = 0.7;
      introSound.play().catch(e => console.log('Error playing sound:', e));
      
      // Hide intro after animation
      const timeout = setTimeout(() => {
        setShowIntro(false);
        setShowConfetti(true);
        
        // Mark intro as shown
        sessionStorage.setItem('hasShownOverlayIntro', 'true');
      }, 4000);
      
      // Hide confetti after time
      const confettiTimeout = setTimeout(() => {
        setShowConfetti(false);
      }, 10000);
      
      return () => {
        clearTimeout(timeout);
        clearTimeout(confettiTimeout);
      };
    }
  }, [round]);
  
  // Handle timer sounds
  useEffect(() => {
    if (timerRunning && timerSeconds <= 5 && timerSeconds > 0) {
      // Play tick sound for last 5 seconds
      const tickSound = new Audio('/sounds/wheel-tick.mp3');
      tickSound.volume = 0.3;
      tickSound.play().catch(e => console.log('Error playing sound:', e));
    } else if (timerSeconds === 0) {
      // Play timeout sound when timer ends
      const timeoutSound = new Audio('/sounds/timeout.mp3');
      timeoutSound.volume = 0.5;
      timeoutSound.play().catch(e => console.log('Error playing sound:', e));
      
      addGameEvent("Czas minął!");
    }
  }, [timerRunning, timerSeconds]);
  
  // Track question changes
  useEffect(() => {
    if (currentQuestion) {
      addGameEvent(`Nowe pytanie: ${currentQuestion.category} (${currentQuestion.difficulty} pkt)`);
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
  
  // Double-click handler for fullscreen
  const handleDoubleClick = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className="w-full h-screen bg-neon-background overflow-hidden relative"
      onDoubleClick={handleDoubleClick}
    >
      {/* Intro animation */}
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 
                className="text-6xl font-bold mb-4" 
                style={{ 
                  color: primaryColor || '#ff00ff',
                  textShadow: `0 0 10px ${primaryColor || '#ff00ff'}, 0 0 20px ${primaryColor || '#ff00ff'}`
                }}
              >
                Discord Game Show
              </h1>
              <p className="text-white text-2xl">Rozpoczynamy już za chwilę!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Round transition overlay */}
      <AnimatePresence>
        {showRoundTransition && (
          <motion.div 
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 
                className="text-5xl font-bold mb-4" 
                style={{ 
                  color: primaryColor || '#ff00ff',
                  textShadow: `0 0 10px ${primaryColor || '#ff00ff'}, 0 0 20px ${primaryColor || '#ff00ff'}`
                }}
              >
                {getRoundName()}
              </h1>
              <p className="text-white text-xl">Rozpoczynamy!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main overlay grid layout */}
      <div className="w-full h-full grid grid-rows-[1fr_auto_1fr] p-4 gap-4">
        {/* Top row with first 5 players */}
        <PlayerGrid 
          players={activePlayers} 
          maxPlayers={maxPlayers} 
          position="top" 
          activePlayerId={activePlayerId}
          lastActivePlayer={lastActivePlayer}
          latestPoints={latestPoints}
        />
        
        {/* Middle row with host camera and question board */}
        <MiddleSection round={round} hostCameraUrl={hostCameraUrl} />
        
        {/* Bottom row with remaining 5 players */}
        <PlayerGrid 
          players={activePlayers} 
          maxPlayers={maxPlayers} 
          position="bottom" 
          activePlayerId={activePlayerId}
          lastActivePlayer={lastActivePlayer}
          latestPoints={latestPoints}
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
      
      {/* Fullscreen instructions */}
      <div className="absolute bottom-2 right-2 text-white/30 text-xs">
        Double-click to toggle fullscreen
      </div>
    </div>
  );
};

export default Overlay;
