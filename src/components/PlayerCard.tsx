import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Player } from '@/types/game-types';
import { Heart } from 'lucide-react';
import { getRandomNeonColor } from '@/utils/utils';

export interface PlayerCardProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg';
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, size = 'md' }) => {
  const { playSound } = useGameContext();
  
  // Format health percentage for display
  const formatHealth = (health: number) => {
    return Math.max(0, Math.min(100, health)) + '%';
  };
  
  // Get appropriate color for health bar
  const getHealthColor = (health: number) => {
    if (health > 70) return 'bg-green-500';
    if (health > 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Get appropriate text for lives
  const getLivesText = (lives: number) => {
    if (lives === 0) return 'Brak żyć';
    if (lives === 1) return '1 życie';
    if (lives < 5) return `${lives} życia`;
    return `${lives} żyć`;
  };
  
  // Handle player status indicator
  const getStatusColor = () => {
    if (player.isEliminated) {
      return 'bg-red-500';
    } else if (player.isActive) {
      playSound('success');
      return 'bg-green-500 animate-pulse';
    } else {
      return 'bg-blue-500';
    }
  };
  
  // Get player's camera stream if available
  const renderCamera = () => {
    if (player.cameraUrl || player.camera_url) {
      const url = player.cameraUrl || player.camera_url;
      return (
        <div className="mb-2 aspect-video overflow-hidden rounded-md bg-black">
          <iframe 
            src={url}
            title={`${player.name}'s camera`}
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      );
    }
    return null;
  };
  
  // Render player avatar
  const renderAvatar = () => {
    const avatarUrl = player.avatar || player.avatar_url;
    const initials = player.name.substring(0, 2).toUpperCase();
    const bgColor = player.color || getRandomNeonColor();
    
    return (
      <Avatar className="h-16 w-16 border-2 border-white/20">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={player.name} />
        ) : (
          <AvatarFallback style={{ backgroundColor: bgColor }}>
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
    );
  };
  
  return (
    <motion.div 
      className={`bg-black/40 backdrop-blur-sm border rounded-lg overflow-hidden
        ${player.isEliminated ? 'border-red-500/30 opacity-70' : isSelected ? 'border-neon-green' : 'border-white/10'}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      {/* Player status indicator */}
      <div className="flex justify-between items-center p-2 border-b border-white/10">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()} mr-2`} />
          <h3 className="font-medium truncate">{player.name}</h3>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-xs font-mono bg-black/30 px-1.5 py-0.5 rounded">
            {player.lives > 0 ? getLivesText(player.lives) : (
              <span className="text-red-400">Brak żyć</span>
            )}
          </span>
        </div>
      </div>
      
      {/* Player camera if available */}
      {renderCamera()}
      
      {/* Player info */}
      <div className="p-3">
        <div className="flex items-center space-x-3 mb-3">
          {renderAvatar()}
          
          <div className="flex-1">
            <div className="flex justify-between">
              <div className="text-xl font-bold text-white">{player.points}</div>
              <div className="text-xs opacity-70">punkty</div>
            </div>
          </div>
        </div>
        
        {/* Health bar */}
        <div className="mt-1">
          <div className="flex justify-between text-xs mb-1">
            <span>Życie</span>
            <span>{formatHealth(player.health)}</span>
          </div>
          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getHealthColor(player.health)} transition-all duration-500`}
              style={{ width: formatHealth(player.health) }}
            />
          </div>
        </div>
        
        {/* Special cards section - would be implemented separately */}
      </div>
    </motion.div>
  );
};

export default PlayerCard;
