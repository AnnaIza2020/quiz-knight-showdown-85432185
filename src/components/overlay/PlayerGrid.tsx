
import React from 'react';
import { Player } from '@/types/game-types';
import { cn } from "@/lib/utils";
import PlayerCard from '@/components/PlayerCard';

interface PlayerGridProps {
  players: Player[];
  maxPlayers: number;
  position: 'top' | 'bottom';
  activePlayerId: string | null;
  className?: string;
}

const PlayerGrid: React.FC<PlayerGridProps> = ({
  players,
  maxPlayers,
  position,
  activePlayerId,
  className
}) => {
  // Determine which players to show based on position
  const halfMax = Math.ceil(maxPlayers / 2);
  let displayPlayers: Player[] = [];
  
  if (position === 'top') {
    // First half of players
    displayPlayers = players.slice(0, halfMax);
  } else {
    // Second half of players
    displayPlayers = players.slice(halfMax, maxPlayers);
  }
  
  // Fill with empty slots if not enough players
  const emptySlots = Math.max(0, (position === 'top' ? halfMax : maxPlayers - halfMax) - displayPlayers.length);
  
  return (
    <div className={cn(
      'grid grid-cols-5 gap-4',
      className
    )}>
      {displayPlayers.map((player) => (
        <PlayerCard 
          key={player.id} 
          player={{
            ...player,
            isActive: player.id === activePlayerId
          }}
          size="md"
          showHealthBar={true}
          showLives={true}
        />
      ))}
      
      {/* Empty slots */}
      {Array.from({ length: emptySlots }).map((_, i) => (
        <div 
          key={`empty-${i}`} 
          className="h-36 rounded-md border border-white/10 bg-black/20 flex items-center justify-center"
        >
          <span className="text-xs text-white/30">Brak gracza</span>
        </div>
      ))}
    </div>
  );
};

export default PlayerGrid;
