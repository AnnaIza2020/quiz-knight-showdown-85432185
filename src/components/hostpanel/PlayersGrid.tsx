
import React from 'react';
import { Player } from '@/types/game-types';
import PlayerCardWithControls from './PlayerCardWithControls';

interface PlayersGridProps {
  activePlayers: Player[];
}

const PlayersGrid = ({ activePlayers }: PlayersGridProps) => {
  // Split players into two rows
  const topRowPlayers = activePlayers.slice(0, 5);
  const bottomRowPlayers = activePlayers.slice(5, 10);

  return (
    <>
      {/* Top row of players */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        {topRowPlayers.map(player => (
          <PlayerCardWithControls key={player.id} player={player} />
        ))}
        
        {/* Fill with empty slots if less than 5 players */}
        {Array.from({ length: Math.max(0, 5 - topRowPlayers.length) }).map((_, i) => (
          <div key={`empty-top-${i}`} className="h-36 rounded-lg border border-white/10 bg-black/30 flex items-center justify-center text-white/30">
            Slot {topRowPlayers.length + i + 1}
          </div>
        ))}
      </div>
      
      {/* Bottom row of players */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {bottomRowPlayers.map(player => (
          <PlayerCardWithControls key={player.id} player={player} />
        ))}
        
        {/* Fill with empty slots if less than 5 players */}
        {Array.from({ length: Math.max(0, 5 - bottomRowPlayers.length) }).map((_, i) => (
          <div key={`empty-bottom-${i}`} className="h-36 rounded-lg border border-white/10 bg-black/30 flex items-center justify-center text-white/30">
            Slot {5 + bottomRowPlayers.length + i + 1}
          </div>
        ))}
      </div>
    </>
  );
};

export default PlayersGrid;
