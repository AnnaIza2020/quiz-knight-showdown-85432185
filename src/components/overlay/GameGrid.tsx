
import React from 'react';
import { motion } from 'framer-motion';
import PlayerGrid from '@/components/overlay/PlayerGrid';
import MiddleSection from '@/components/overlay/MiddleSection';
import { GameRound, Question } from '@/types/game-types';
import { Player } from '@/types/game-types';
import { useGameContext } from '@/context/GameContext';

interface GameGridProps {
  activePlayers: Player[];
  maxPlayers: number;
  round: GameRound;
  hostCameraUrl?: string;
  activePlayerId?: string;
  lastActivePlayer: string | null;
  latestPoints: {playerId: string, points: number} | null;
}

const GameGrid: React.FC<GameGridProps> = ({
  activePlayers,
  maxPlayers,
  round,
  hostCameraUrl,
  activePlayerId,
  lastActivePlayer,
  latestPoints
}) => {
  // Get context values for required props
  const { currentQuestion, timerRunning, timerSeconds, categories } = useGameContext();
  
  // Mock categories if not available
  const wheelCategories = categories?.map(cat => cat.name) || [
    "Język polskiego internetu",
    "Polska scena Twitcha", 
    "Zagadki",
    "Czy jesteś mądrzejszy od 8-klasisty",
    "Gry, które podbiły Polskę",
    "Technologie i internet w Polsce"
  ];

  // Mock category selection handler
  const handleCategorySelected = (category: string) => {
    console.log('Selected category:', category);
  };
  
  return (
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
      <MiddleSection 
        round={round} 
        hostCameraUrl={hostCameraUrl}
        currentQuestion={currentQuestion}
        timerRunning={timerRunning}
        timerSeconds={timerSeconds}
        categories={wheelCategories}
        onCategorySelected={handleCategorySelected}
      />
      
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
  );
};

export default GameGrid;
