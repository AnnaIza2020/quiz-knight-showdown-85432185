
import React from 'react';
import { Player } from '@/types/game-types';
import { useGameContext } from '@/context/GameContext';
import { Plus, Minus, Award, Trash, Heart } from 'lucide-react';

interface PlayerCardWithControlsProps {
  player: Player;
  isCompact?: boolean;
}

const PlayerCardWithControls: React.FC<PlayerCardWithControlsProps> = ({ 
  player,
  isCompact = false
}) => {
  const { 
    activePlayerId, 
    setActivePlayer, 
    awardPoints, 
    deductHealth, 
    eliminatePlayer,
    round,
    deductLife
  } = useGameContext();
  
  const isActive = activePlayerId === player.id;
  
  const handleActivate = () => {
    // Toggle active state
    setActivePlayer(isActive ? null : player.id);
  };
  
  const handleAwardPoints = (e: React.MouseEvent) => {
    e.stopPropagation();
    awardPoints(player.id, 5); // Give 5 points by default with quick button
  };
  
  const handleDeductHealth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (round === 'round_one') {
      deductHealth(player.id, 20);
    } else {
      deductLife(player.id);
    }
  };
  
  const handleEliminate = (e: React.MouseEvent) => {
    e.stopPropagation();
    eliminatePlayer(player.id);
  };

  if (player.isEliminated) {
    return (
      <div className="h-36 relative rounded-lg border border-red-900/50 bg-black/40 flex flex-col overflow-hidden opacity-60">
        <div className="absolute inset-0 flex items-center justify-center text-red-500 font-bold text-lg">
          WYELIMINOWANY
        </div>
        <div className="p-2 mt-auto bg-black/60">
          <div className="text-white/40 font-bold truncate">{player.name}</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleActivate}
      className={`h-36 rounded-lg border overflow-hidden cursor-pointer transition-all ${
        isActive 
          ? 'border-neon-green shadow-[0_0_10px_rgba(74,222,128,0.5)]' 
          : 'border-white/10 hover:border-white/30'
      }`}
    >
      {/* Player video */}
      <div className="relative h-[60%] bg-black">
        {player.cameraUrl ? (
          <iframe 
            src={player.cameraUrl}
            title={`Player ${player.name} camera`}
            className="w-full h-full"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/20">
            <span className="text-white/50">Brak kamery</span>
          </div>
        )}
        
        {/* Player stats overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 flex justify-between items-center">
          <div className="flex gap-1">
            {/* Health or lives */}
            {round === 'round_one' ? (
              <div className="bg-neon-green/70 text-black text-xs font-bold px-1 rounded">
                {player.health}HP
              </div>
            ) : (
              <div className="flex">
                {Array.from({ length: player.lives }).map((_, i) => (
                  <Heart key={i} size={12} className="text-red-500 fill-red-500" />
                ))}
              </div>
            )}
          </div>
          
          {/* Points */}
          <div className="bg-yellow-500/70 text-black text-xs font-bold px-1 rounded">
            {player.points}p
          </div>
        </div>
      </div>
      
      {/* Player info & controls */}
      <div className="h-[40%] bg-black/40 p-1 flex flex-col">
        <div className="font-bold text-white truncate">{player.name}</div>
        
        <div className="flex justify-between mt-auto">
          <button 
            onClick={handleDeductHealth}
            className="p-1 bg-black/40 rounded hover:bg-red-900/40 text-red-400"
            title={round === 'round_one' ? "Odejmij HP" : "Odejmij życie"}
          >
            <Minus size={16} />
          </button>
          
          <button
            onClick={handleAwardPoints}
            className="p-1 bg-black/40 rounded hover:bg-yellow-900/40 text-yellow-400"
            title="Dodaj punkty"
          >
            <Plus size={16} />
          </button>
          
          <button
            onClick={handleEliminate}
            className="p-1 bg-black/40 rounded hover:bg-red-900/40 text-red-500"
            title="Wyeliminuj gracza"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
      
      {/* Active indicator */}
      {isActive && (
        <div className="absolute inset-0 border-2 border-neon-green pointer-events-none" />
      )}
    </div>
  );
};

export default PlayerCardWithControls;
