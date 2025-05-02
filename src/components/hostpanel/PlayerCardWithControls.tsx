
import React from 'react';
import { Player } from '@/types/game-types';
import PlayerCard from '@/components/PlayerCard';

interface PlayerCardWithControlsProps {
  player: Player;
}

const PlayerCardWithControls = ({ player }: PlayerCardWithControlsProps) => {
  return (
    <div className="relative">
      <PlayerCard player={player} />
      <div className="absolute bottom-0 right-0 left-0 flex justify-center gap-1 p-1 bg-black/70">
        <button className="px-2 py-1 text-xs bg-neon-yellow/20 text-neon-yellow rounded">
          Karta
        </button>
        <button className="px-2 py-1 text-xs bg-neon-red/20 text-neon-red rounded">
          -HP
        </button>
      </div>
    </div>
  );
};

export default PlayerCardWithControls;
