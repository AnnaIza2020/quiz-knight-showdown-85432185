
import React from 'react';
import { Player } from '@/types/game-types';
import PlayerCard from '@/components/PlayerCard';

interface PlayerGridProps {
  players: Player[];
  maxPlayers?: number;
  position: 'top' | 'bottom';
  activePlayerId: string | null;
}

const PlayerGrid: React.FC<PlayerGridProps> = ({ 
  players, 
  maxPlayers = 5,
  position,
  activePlayerId
}) => {
  // Limit players to maxPlayers and determine which slice to show based on position
  const slicedPlayers = players.slice(0, maxPlayers); // For top players
  
  return (
    <div className={`grid grid-cols-5 gap-4 ${position === 'bottom' ? 'order-2' : 'order-0'}`}>
      {slicedPlayers.map((player) => (
        <PlayerCard 
          key={player.id}
          player={{
            ...player,
            isActive: player.id === activePlayerId
          }}
          size="md"
        />
      ))}
      
      {/* Fill empty slots with placeholders */}
      {Array.from({ length: Math.max(0, maxPlayers - slicedPlayers.length) }).map((_, index) => (
        <div 
          key={`empty-${index}`}
          className="h-36 rounded-md border-2 border-white/10 bg-black/20 backdrop-blur-sm"
        />
      ))}
    </div>
  );
};

export default PlayerGrid;
