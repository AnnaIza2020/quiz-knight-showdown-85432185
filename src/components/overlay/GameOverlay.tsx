
import React from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '@/context/GameContext';
import GameOverlayHeader from './GameOverlayHeader';
import PlayerCameraGrid from './PlayerCameraGrid';
import MiddleSection from './MiddleSection';
import { useGameState } from '@/context/GameStateContext';

const GameOverlay: React.FC = () => {
  const { 
    round, 
    players, 
    currentQuestion, 
    timerRunning, 
    timerSeconds, 
    activePlayerId,
    gameTitle,
    hostCameraUrl,
    categories
  } = useGameContext();
  
  const { gameState } = useGameState();
  
  // Get categories for Round 3 wheel
  const round3Categories = categories
    .filter(cat => cat.round === 3)
    .map(cat => cat.name);

  return (
    <motion.div 
      className="fixed inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Game Title and Round Info */}
      <GameOverlayHeader
        round={round}
        gameTitle={gameTitle}
        timerSeconds={timerSeconds}
        timerRunning={timerRunning}
      />
      
      <div className="h-full flex flex-col p-4 pt-20">
        {/* Top player area */}
        <div className="h-[300px] mb-4">
          <PlayerCameraGrid 
            players={players}
            position="top"
            activePlayerId={activePlayerId}
          />
        </div>

        {/* Middle area with host and question */}
        <div className="h-[360px] mb-4">
          <MiddleSection 
            round={round} 
            hostCameraUrl={hostCameraUrl}
            currentQuestion={currentQuestion}
            timerRunning={timerRunning}
            timerSeconds={timerSeconds}
            categories={round3Categories}
            onCategorySelected={(category) => {
              console.log('Selected category:', category);
              // This would trigger question selection from the category
            }}
          />
        </div>

        {/* Bottom player area */}
        <div className="h-[300px]">
          <PlayerCameraGrid 
            players={players}
            position="bottom"
            activePlayerId={activePlayerId}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default GameOverlay;
