
import React from 'react';
import { useGameContext } from '@/context/GameContext';
import GameOverlay from '@/components/overlay/GameOverlay';

const OverlayView: React.FC = () => {
  const { round, players } = useGameContext();
  
  const activePlayers = players.filter(p => !p.isEliminated);

  return (
    <div className="min-h-screen bg-neon-background">
      <GameOverlay />
    </div>
  );
};

export default OverlayView;
