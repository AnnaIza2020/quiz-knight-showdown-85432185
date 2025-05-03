
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Player, GameRound } from '@/types/game-types';
import { Heart, Award, Trash2, Shield, Zap } from 'lucide-react';
import { getRandomNeonColor } from '@/utils/utils';

interface PlayerCardWithControlsProps {
  player: Player;
  showControls?: boolean;
  isActive?: boolean;
  onSelected?: (player: Player) => void;
  onGivePoints?: (player: Player) => void;
  onRemoveLife?: (player: Player) => void;
  onEliminate?: (player: Player) => void;
  onBoost?: (player: Player) => void;
  round?: GameRound;
}

const PlayerCardWithControls: React.FC<PlayerCardWithControlsProps> = ({
  player,
  showControls = false,
  isActive = false,
  onSelected,
  onGivePoints,
  onRemoveLife,
  onEliminate,
  onBoost,
  round = GameRound.SETUP
}) => {
  // Generate a random color for the player if one doesn't exist
  const playerColor = player.color || getRandomNeonColor();
  
  // Calculate health bar width based on player health
  const healthWidth = `${Math.max(0, Math.min(100, player.health))}%`;
  
  // Calculate lives display (hearts)
  const livesDisplay = Array(player.lives).fill(0).map((_, i) => (
    <Heart key={i} className="w-4 h-4 fill-red-500 text-red-500" />
  ));
  
  // Handle click on the player card
  const handleClick = () => {
    if (onSelected) {
      onSelected(player);
    }
  };
  
  return (
    <div 
      className={`relative rounded-lg overflow-hidden transition-all ${
        isActive ? 'ring-2 ring-offset-1' : ''
      }`}
      style={{ 
        boxShadow: `0 0 8px ${playerColor}`,
        borderColor: playerColor,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        ...(isActive ? { ringColor: playerColor } : {})
      }}
    >
      {/* Player status badges */}
      <div className="absolute top-2 right-2 space-x-1">
        {player.isEliminated && (
          <span className="inline-flex items-center rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white shadow-sm">
            Wyeliminowany
          </span>
        )}
        
        {round === GameRound.ROUND_ONE && (
          <span className="inline-flex items-center rounded-full bg-blue-500 px-2 py-1 text-xs font-medium text-white shadow-sm">
            R1
          </span>
        )}
        
        {round === GameRound.ROUND_TWO && (
          <span className="inline-flex items-center rounded-full bg-yellow-500 px-2 py-1 text-xs font-medium text-white shadow-sm">
            R2
          </span>
        )}
        
        {round === GameRound.ROUND_THREE && (
          <span className="inline-flex items-center rounded-full bg-purple-500 px-2 py-1 text-xs font-medium text-white shadow-sm">
            R3
          </span>
        )}
      </div>
      
      {/* Player card content */}
      <div 
        className={`p-3 cursor-pointer transition-colors ${
          isActive ? 'bg-black/60' : 'hover:bg-black/40'
        }`}
        onClick={handleClick}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2" style={{ borderColor: playerColor }}>
            <AvatarImage src={player.avatar || ''} alt={player.name} />
            <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-grow min-w-0">
            <h3 className="font-bold text-white truncate">{player.name}</h3>
            <div className="flex items-center gap-1 text-xs text-white/70">
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                {player.points} pkt
              </span>
              
              {round === GameRound.ROUND_ONE && (
                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-red-500 h-1.5 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: healthWidth }}
                  />
                </div>
              )}
              
              {(round === GameRound.ROUND_TWO || round === GameRound.ROUND_THREE) && (
                <div className="flex ml-2">
                  {livesDisplay}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      {showControls && !player.isEliminated && (
        <div className="flex justify-between bg-black/30 p-1 space-x-1">
          {onGivePoints && (
            <Button 
              size="sm" 
              variant="outline"
              className="flex-1 h-7 py-0 text-xs border-green-500 text-green-500 hover:text-white hover:bg-green-500"
              onClick={() => onGivePoints(player)}
            >
              <Award className="w-3 h-3 mr-1" /> +Pkt
            </Button>
          )}
          
          {onRemoveLife && (
            <Button 
              size="sm" 
              variant="outline"
              className="flex-1 h-7 py-0 text-xs border-red-500 text-red-500 hover:text-white hover:bg-red-500"
              onClick={() => onRemoveLife(player)}
            >
              <Heart className="w-3 h-3 mr-1" /> -Życie
            </Button>
          )}
          
          {onBoost && (
            <Button 
              size="sm" 
              variant="outline"
              className="flex-1 h-7 py-0 text-xs border-purple-500 text-purple-500 hover:text-white hover:bg-purple-500"
              onClick={() => onBoost(player)}
            >
              <Zap className="w-3 h-3 mr-1" /> Boost
            </Button>
          )}
          
          {onEliminate && (
            <Button 
              size="sm" 
              variant="outline"
              className="flex-1 h-7 py-0 text-xs border-red-500 text-red-500 hover:text-white hover:bg-red-500"
              onClick={() => onEliminate(player)}
            >
              <Trash2 className="w-3 h-3 mr-1" /> Eliminuj
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerCardWithControls;
