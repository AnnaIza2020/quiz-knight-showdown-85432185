
import React from 'react';
import { Player } from '@/types/game-types';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayerCardProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg';
  showHealthBar?: boolean;
  showLives?: boolean;
  className?: string;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  size = 'md',
  showHealthBar = true,
  showLives = true,
  className
}) => {
  // Card sizes
  const cardSizes = {
    sm: 'h-28',
    md: 'h-36',
    lg: 'h-48'
  };
  
  // Font sizes
  const fontSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };
  
  // Health bar sizes
  const healthBarSizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  // Calculate health percentage
  const healthPercentage = Math.max(0, Math.min(100, player.health));
  
  // Determine health bar color
  let healthColor = 'bg-neon-green';
  if (healthPercentage <= 25) {
    healthColor = 'bg-neon-red';
  } else if (healthPercentage <= 50) {
    healthColor = 'bg-neon-yellow';
  }
  
  // Border style based on player status
  let borderStyle = 'border-white/20';
  if (player.isActive) {
    borderStyle = 'border-neon-green shadow-[0_0_10px_rgba(0,255,0,0.5)]';
  } else if (player.isEliminated) {
    borderStyle = 'border-neon-red/50 opacity-60';
  }
  
  return (
    <div 
      className={cn(
        cardSizes[size], 
        'rounded-md overflow-hidden border-2',
        borderStyle,
        'bg-black/60 backdrop-blur-sm flex flex-col',
        'transition-all duration-300',
        player.isEliminated && 'grayscale',
        className
      )}
    >
      {/* Player camera */}
      <div className="relative flex-grow bg-black/30">
        {player.cameraUrl ? (
          <iframe 
            src={player.cameraUrl} 
            title={`Player ${player.name}`} 
            className="w-full h-full"
            allowFullScreen
          />
        ) : player.avatar ? (
          <img 
            src={player.avatar} 
            alt={player.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/20">
            <span className={cn(fontSizes[size], 'text-white/30')}>No Camera</span>
          </div>
        )}
        
        {/* Player status indicator */}
        {player.isActive && (
          <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-neon-green animate-pulse" />
        )}
        
        {/* Lives display - show in all rounds except round 1 */}
        {showLives && (
          <div className="absolute bottom-2 right-2 flex">
            {Array.from({ length: player.lives }).map((_, i) => (
              <Heart 
                key={i}
                className={cn(
                  'fill-neon-red text-neon-red ml-0.5',
                  size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
                )}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Player info bar */}
      <div className={cn('p-1', size === 'lg' ? 'p-2' : '')}>
        <div className="flex justify-between items-center">
          <span className={cn('font-bold text-white truncate', fontSizes[size])}>
            {player.name}
          </span>
          <span className={cn('text-neon-yellow font-bold', size === 'sm' ? 'text-xs' : fontSizes[size])}>
            {player.points} pts
          </span>
        </div>
        
        {/* Health bar for round 1 */}
        {showHealthBar && (
          <div className="mt-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={cn('transition-all', healthBarSizes[size], healthColor)} 
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
        )}
      </div>
      
      {/* Eliminated overlay */}
      {player.isEliminated && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <span className={cn('font-bold text-neon-red', fontSizes[size])}>ELIMINATED</span>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
