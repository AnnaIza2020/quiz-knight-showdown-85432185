
import React from 'react';
import { useGameContext } from '@/context/GameContext';
import { GameRound } from '@/types/game-types';
import GameGrid from './GameGrid';
import WinnerDisplay from './WinnerDisplay';
import RoundTransition from './RoundTransition';
import { motion, AnimatePresence } from 'framer-motion';

const GameOverlay: React.FC = () => {
  const { 
    round, 
    players, 
    winnerIds, 
    hostCameraUrl,
    activePlayerId,
    gameTitle 
  } = useGameContext();

  const activePlayers = players.filter(p => !p.isEliminated);
  const maxPlayers = 10; // Standard max for the overlay layout
  const lastActivePlayer = null; // TODO: Implement last active player tracking
  const latestPoints = null; // TODO: Implement latest points tracking

  // Show winner display if game is finished
  if (round === GameRound.FINISHED && winnerIds.length > 0) {
    const winners = players.filter(p => winnerIds.includes(p.id));
    return <WinnerDisplay winners={winners} />;
  }

  // Show transition between rounds
  if (round === GameRound.SETUP) {
    return (
      <div className="min-h-screen bg-neon-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold text-neon-green mb-4">
            {gameTitle || 'Discord Game Show'}
          </h1>
          <p className="text-2xl text-white">Przygotowanie do gry...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neon-background">
      <AnimatePresence mode="wait">
        <GameGrid
          key={round}
          activePlayers={activePlayers}
          maxPlayers={maxPlayers}
          round={round}
          hostCameraUrl={hostCameraUrl}
          activePlayerId={activePlayerId}
          lastActivePlayer={lastActivePlayer}
          latestPoints={latestPoints}
        />
      </AnimatePresence>
    </div>
  );
};

export default GameOverlay;
