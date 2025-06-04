
import React from 'react';
import { motion } from 'framer-motion';
import { Player } from '@/types/game-types';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Trophy, Zap } from 'lucide-react';

interface PlayerCameraGridProps {
  players: Player[];
  position: 'top' | 'bottom';
  activePlayerId?: string | null;
  lastActivePlayer?: string | null;
  latestPoints?: { playerId: string; points: number } | null;
}

const PlayerCameraGrid: React.FC<PlayerCameraGridProps> = ({
  players,
  position,
  activePlayerId,
  lastActivePlayer,
  latestPoints
}) => {
  const maxPlayers = 5;
  const startIndex = position === 'top' ? 0 : 5;
  const endIndex = position === 'top' ? 5 : 10;
  const positionPlayers = players.slice(startIndex, endIndex);
  
  // Fill empty slots
  const filledPlayers = [...positionPlayers];
  while (filledPlayers.length < maxPlayers) {
    filledPlayers.push(null);
  }

  return (
    <div className="grid grid-cols-5 gap-4 h-full">
      {filledPlayers.map((player, index) => (
        <motion.div
          key={player?.id || `empty-${position}-${index}`}
          className={`relative bg-black/50 border border-white/20 rounded-lg overflow-hidden ${
            player?.id === activePlayerId ? 'ring-2 ring-neon-green shadow-neon-green/50' : ''
          } ${
            player?.id === lastActivePlayer ? 'ring-2 ring-neon-blue shadow-neon-blue/50' : ''
          }`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          {player ? (
            <>
              {/* Player Camera */}
              <div className="aspect-video bg-gray-800 relative">
                {player.camera_url ? (
                  <iframe 
                    src={player.camera_url} 
                    className="w-full h-full" 
                    allowFullScreen
                    title={`${player.name} camera`}
                  />
                ) : player.avatar_url ? (
                  <img 
                    src={player.avatar_url} 
                    alt={player.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50">
                    <span className="text-4xl">👤</span>
                  </div>
                )}
                
                {/* Elimination overlay */}
                {player.isEliminated && (
                  <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">ELIMINOWANY</span>
                  </div>
                )}
              </div>
              
              {/* Player Info */}
              <div className="p-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-sm truncate">
                    {player.nickname || player.name}
                  </span>
                  
                  {player.id === activePlayerId && (
                    <Badge className="bg-neon-green text-black text-xs">
                      AKTYWNY
                    </Badge>
                  )}
                </div>
                
                {/* Points and Lives */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-3 h-3 text-neon-gold" />
                    <span className="text-white">{player.points}</span>
                    
                    {latestPoints?.playerId === player.id && (
                      <motion.span
                        className="text-neon-green font-bold"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        +{latestPoints.points}
                      </motion.span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3 text-red-500" />
                    <span className="text-white">{player.lives}</span>
                  </div>
                </div>
                
                {/* Health Bar */}
                <Progress 
                  value={player.health} 
                  className="h-1"
                />
                
                {/* Special Cards */}
                {player.specialCards && player.specialCards.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-neon-purple" />
                    <span className="text-neon-purple text-xs">
                      {player.specialCards.length} kart
                    </span>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Empty slot
            <div className="w-full h-full flex items-center justify-center text-white/30">
              <span className="text-sm">Wolne miejsce</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default PlayerCameraGrid;
