
import React from 'react';
import { Player } from '@/types/game-types';
import PlayerCard from '@/components/PlayerCard';

interface PlayerGridProps {
  players: Player[];
  maxPlayers: number;
  position: 'top' | 'bottom';
}

const PlayerGrid = ({ players, maxPlayers, position }: PlayerGridProps) => {
  // Calculate which players to display
  const displayPlayers = 
    position === 'top' 
      ? [...players].slice(0, Math.ceil(maxPlayers / 2))
      : [...players].slice(Math.ceil(maxPlayers / 2), maxPlayers);

  // Calculate starting slot number
  const startingSlot = position === 'top' ? 1 : Math.ceil(maxPlayers / 2) + 1;

  return (
    <div className="grid grid-cols-5 gap-4">
      {Array(5).fill(0).map((_, i) => {
        const player = displayPlayers[i];
        return player ? (
          <PlayerCard key={player.id} player={player} />
        ) : (
          <div key={`empty-${position}-${i}`} className="player-card player-card-inactive bg-black/20">
            <div className="flex items-center justify-center h-full text-white/30">
              Slot {startingSlot + i}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlayerGrid;
