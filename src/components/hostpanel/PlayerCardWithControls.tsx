
import React from 'react';
import { Player } from '@/types/game-types';
import PlayerCard from '@/components/PlayerCard';
import { useGameContext } from '@/context/GameContext';
import { MinusCircle, CircleCheck } from 'lucide-react';

interface PlayerCardWithControlsProps {
  player: Player;
}

const PlayerCardWithControls = ({ player }: PlayerCardWithControlsProps) => {
  const { 
    deductHealth, 
    awardPoints, 
    currentQuestion, 
    round, 
    playSound 
  } = useGameContext();

  const handleUseCard = () => {
    // Will be implemented in a future update
    // This button is a placeholder for the card functionality
    playSound('card-reveal');
    // TODO: Implement a modal or dropdown to select which card to use
  };

  const handleDeductHealth = () => {
    deductHealth(player.id, round === 'round_one' ? 20 : 1);
    playSound('fail');
  };

  return (
    <div className="relative">
      <PlayerCard player={player} />
      <div className="absolute bottom-0 right-0 left-0 flex justify-center gap-1 p-1 bg-black/70">
        <button 
          className="px-2 py-1 text-xs bg-neon-yellow/20 text-neon-yellow rounded hover:bg-neon-yellow/40 flex items-center"
          onClick={handleUseCard}
        >
          <CircleCheck size={14} className="mr-1" /> Karta
        </button>
        <button 
          className="px-2 py-1 text-xs bg-neon-red/20 text-neon-red rounded hover:bg-neon-red/40 flex items-center"
          onClick={handleDeductHealth}
        >
          <MinusCircle size={14} className="mr-1" /> -HP
        </button>
      </div>
    </div>
  );
};

export default PlayerCardWithControls;
