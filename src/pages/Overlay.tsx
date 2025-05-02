
import React, { useState, useEffect, useRef } from 'react';
import { useGameContext } from '@/context/GameContext';
import { GameRound } from '@/types/game-types';
import PlayerGrid from '@/components/overlay/PlayerGrid';
import RoundIndicator from '@/components/overlay/RoundIndicator';
import MiddleSection from '@/components/overlay/MiddleSection';
import WinnerDisplay from '@/components/overlay/WinnerDisplay';
import ConfettiEffect from '@/components/overlay/ConfettiEffect';
import InfoBar from '@/components/overlay/InfoBar';
import IntroScreen from '@/components/overlay/IntroScreen';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubscription } from '@/hooks/useSubscription';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useSoundEffects } from '@/hooks/useSoundEffects';

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
  const [showIntro, setShowIntro] = useState(true); // Start with intro visible
  const [showRoundTransition, setShowRoundTransition] = useState(false);
  const [lastActivePlayer, setLastActivePlayer] = useState<string | null>(null);
  const [latestPoints, setLatestPoints] = useState<{playerId: string, points: number} | null>(null);
  const [introFinished, setIntroFinished] = useState(false);
  const [manualIntroControl, setManualIntroControl] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  
  // Sound effects
  const { playSound, stopAllSounds } = useSoundEffects({
    useLocalStorage: true,
    defaultVolume: 0.7
  });
  
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
      
      // Handle intro control
      if (payload.type === 'intro_control') {
        if (payload.action === 'show') {
          setShowIntro(true);
          setIntroFinished(false);
          setManualIntroControl(true);
        } else if (payload.action === 'hide') {
          setShowIntro(false);
          setIntroFinished(true);
          setManualIntroControl(true);
        } else if (payload.action === 'toggle') {
          setShowIntro(prev => !prev);
          setIntroFinished(prev => !prev);
          setManualIntroControl(true);
        } else if (payload.action === 'start') {
          setIsStarting(true);
        }
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
          playSound(payload.sound, { volume: payload.volume || 0.7 });
        } else if (payload.action === 'stop') {
          stopAllSounds();
        }
      }
    }
  );
  
  // Handle intro completion
  const handleIntroFinished = () => {
    if (!manualIntroControl) {
      setIntroFinished(true);
      setShowIntro(false);
    }
    
    // Reset starting state
    setIsStarting(false);
  };
  
  // Handle start button click in intro (host only)
  const handleStartClick = () => {
    setIsStarting(true);
    addGameEvent("Rozpoczynamy show!");
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
    const lastRound = localStorage.getItem('lastGameRound');
    
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
        
        // Save current round
        localStorage.setItem('lastGameRound', round);
        
        return () => clearTimeout(timeout);
      }
    }
  }, [round, playSound]);
  
  // Auto-hide intro when game starts
  useEffect(() => {
    if (round !== GameRound.SETUP && showIntro && !introFinished && !manualIntroControl && !isStarting) {
      // Auto-hide intro when game starts
      setShowIntro(false);
      setIntroFinished(true);
    }
  }, [round, showIntro, introFinished, manualIntroControl, isStarting]);
  
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
      {/* Intro Screen - enhanced version with start button, narrator and transition */}
      <IntroScreen 
        show={showIntro || isStarting} 
        onFinished={handleIntroFinished}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        autoplay={true}
        onStartClick={handleStartClick} 
        isStarting={isStarting}
      />
      
      {/* Round transition overlay with improved animation */}
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
              animate={{ 
                scale: [0.8, 1.1, 1],
                opacity: 1
              }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ 
                duration: 0.7,
                times: [0, 0.6, 1]
              }}
              className="text-center"
            >
              <motion.h1 
                className="text-5xl font-bold mb-4" 
                style={{ 
                  color: primaryColor || '#ff00ff',
                  textShadow: `0 0 10px ${primaryColor || '#ff00ff'}, 0 0 20px ${primaryColor || '#ff00ff'}`
                }}
                animate={{
                  textShadow: [
                    `0 0 10px ${primaryColor || '#ff00ff'}, 0 0 20px ${primaryColor || '#ff00ff'}`,
                    `0 0 20px ${primaryColor || '#ff00ff'}, 0 0 35px ${primaryColor || '#ff00ff'}`,
                    `0 0 10px ${primaryColor || '#ff00ff'}, 0 0 20px ${primaryColor || '#ff00ff'}`,
                  ]
                }}
                transition={{
                  duration: 1.5,
                  repeat: 2,
                  repeatType: 'reverse',
                }}
              >
                {getRoundName()}
              </motion.h1>
              <motion.p 
                className="text-white text-xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Rozpoczynamy!
              </motion.p>
              
              {/* Additional decorative elements for round transition */}
              <motion.div
                className="absolute inset-0 -z-10 opacity-30"
                initial={{ scale: 0 }}
                animate={{ scale: 2 }}
                transition={{ duration: 2.5 }}
              >
                <div className="w-full h-full rounded-full"
                  style={{ 
                    background: `radial-gradient(circle, ${secondaryColor} 0%, transparent 70%)` 
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main overlay grid layout with animated entrance */}
      <AnimatePresence>
        {!showIntro && !isStarting && (
          <motion.div 
            className="w-full h-full grid grid-rows-[1fr_auto_1fr] p-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Round indicator - visible only when not showing intro */}
      {!showIntro && !isStarting && (
        <RoundIndicator round={round} primaryColor={primaryColor} secondaryColor={secondaryColor} />
      )}
      
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
      {!showIntro && !isStarting && (
        <InfoBar events={gameEvents} />
      )}
      
      {/* Fullscreen instructions */}
      <div className="absolute bottom-2 right-2 text-white/30 text-xs">
        Double-click to toggle fullscreen
      </div>
    </div>
  );
};

export default Overlay;
