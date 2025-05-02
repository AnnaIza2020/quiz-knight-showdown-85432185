
import React from 'react';
import { Player } from '@/types/game-types';
import PlayerCard from '@/components/PlayerCard';

interface WinnerDisplayProps {
  show: boolean;
  winners: Player[];
}

const WinnerDisplay = ({ show, winners }: WinnerDisplayProps) => {
  if (!show || winners.length === 0) return null;

  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 animate-fade-in">
      <h1 className="text-5xl font-bold mb-8 neon-text">ZWYCIĘZCA</h1>
      
      <div className="flex flex-wrap justify-center gap-8 max-w-4xl">
        {winners.map(winner => (
          <div key={winner.id} className="animate-bounce-in">
            <PlayerCard 
              player={winner} 
              size="lg" 
              className="border-neon-yellow shadow-[0_0_30px_rgba(255,255,0,0.7)]"
            />
            <div className="mt-4 text-center">
              <div className="text-3xl font-bold text-neon-yellow">{winner.name}</div>
              <div className="text-xl text-white">{winner.points} punktów</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WinnerDisplay;
