
import React, { useEffect, memo } from 'react';
import { Player } from '@/types/game-types';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameContext } from '@/context/GameContext';

interface PlayerCardProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg';
  showHealthBar?: boolean;
  showLives?: boolean;
  className?: string;
}

// Używamy memo do optymalizacji renderowania komponentu
const PlayerCard: React.FC<PlayerCardProps> = memo(({
  player,
  size = 'md',
  showHealthBar = true,
  showLives = true,
  className
}) => {
  const { playSound } = useGameContext();
  
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
    borderStyle = 'border-neon-red/50';
  }
  
  // Play elimination sound when player gets eliminated
  useEffect(() => {
    if (player.isEliminated || player.health === 0 || player.lives === 0) {
      playSound('failure');
    }
  }, [player.isEliminated, player.health, player.lives, playSound]);
  
  return (
    <motion.div 
      className={cn(
        cardSizes[size], 
        'rounded-md overflow-hidden border-2',
        borderStyle,
        'bg-black/60 backdrop-blur-sm flex flex-col',
        'transition-all duration-300',
        player.isEliminated ? 'grayscale opacity-60' : '',
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Player camera */}
      <div className="relative flex-grow bg-black/30">
        {player.cameraUrl ? (
          <iframe 
            src={player.cameraUrl} 
            title={`Player ${player.name}`} 
            className="w-full h-full"
            allowFullScreen
            loading="lazy" // Dodajemy lazy loading dla iframes
          />
        ) : player.avatar ? (
          <img 
            src={player.avatar} 
            alt={player.name} 
            className="w-full h-full object-cover"
            loading="lazy" // Dodajemy lazy loading dla obrazów
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/20">
            <span className={cn(fontSizes[size], 'text-white/30')}>No Camera</span>
          </div>
        )}
        
        {/* Player status indicator */}
        {player.isActive && (
          <motion.div 
            className="absolute top-2 right-2 w-3 h-3 rounded-full bg-neon-green"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        
        {/* Lives display - show in all rounds except round 1 */}
        {showLives && player.lives > 0 && (
          <div className="absolute bottom-2 right-2 flex">
            <AnimatePresence>
              {Array.from({ length: player.lives }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className={cn(
                    'ml-0.5',
                    size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
                  )}
                >
                  <Heart 
                    className={cn(
                      'fill-neon-red text-neon-red',
                      size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
                    )}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
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
            <motion.div 
              className={cn('transition-all', healthBarSizes[size], healthColor)}
              initial={{ width: 0 }}
              animate={{ width: `${healthPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
      </div>
      
      {/* Eliminated overlay */}
      {player.isEliminated && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <span className={cn('font-bold text-neon-red', fontSizes[size])}>WYELIMINOWANY</span>
        </div>
      )}
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Optymalizacja renderowania - porównanie istotnych właściwości
  return (
    prevProps.player.id === nextProps.player.id &&
    prevProps.player.name === nextProps.player.name &&
    prevProps.player.points === nextProps.player.points &&
    prevProps.player.health === nextProps.player.health &&
    prevProps.player.lives === nextProps.player.lives &&
    prevProps.player.isActive === nextProps.player.isActive &&
    prevProps.player.isEliminated === nextProps.player.isEliminated &&
    prevProps.size === nextProps.size &&
    prevProps.showHealthBar === nextProps.showHealthBar &&
    prevProps.showLives === nextProps.showLives
  );
});

export default PlayerCard;
