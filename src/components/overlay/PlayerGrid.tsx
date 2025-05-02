
import React from 'react';
import { Player } from '@/types/game-types';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayerGridProps {
  players: Player[];
  maxPlayers: number;
  position: 'top' | 'bottom';
  activePlayerId: string | null;
  lastActivePlayer?: string | null;
  latestPoints?: { playerId: string, points: number } | null;
}

const PlayerGrid: React.FC<PlayerGridProps> = ({ 
  players, 
  maxPlayers, 
  position,
  activePlayerId,
  lastActivePlayer,
  latestPoints
}) => {
  const displayCount = Math.min(players.length, Math.ceil(maxPlayers / 2));
  let displayPlayers = position === 'top'
    ? players.slice(0, displayCount)
    : players.slice(displayCount, maxPlayers);
  
  // Fill with empty slots if needed
  const emptySlots = Math.max(0, Math.ceil(maxPlayers / 2) - displayPlayers.length);
  const emptyArray = Array(emptySlots).fill(null);
  
  return (
    <div className="grid grid-cols-5 gap-4 w-full">
      {displayPlayers.map((player) => (
        <div key={player.id} className="relative aspect-video">
          {/* Player Camera Frame */}
          <motion.div
            className={`absolute inset-0 flex flex-col rounded-lg overflow-hidden
              ${activePlayerId === player.id ? 'ring-4' : 'ring-1'}
              ${activePlayerId === player.id ? 'ring-white' : 'ring-white/20'}
              ${player.isEliminated ? 'grayscale opacity-40' : ''}`}
            animate={{
              boxShadow: activePlayerId === player.id || lastActivePlayer === player.id
                ? [
                    `0 0 0px ${player.isEliminated ? 'rgba(255,0,0,0)' : 'rgba(255,255,255,0)'}`,
                    `0 0 20px ${player.isEliminated ? 'rgba(255,0,0,0.8)' : 'rgba(255,255,255,0.8)'}`,
                    `0 0 0px ${player.isEliminated ? 'rgba(255,0,0,0)' : 'rgba(255,255,255,0)'}`
                  ]
                : '0 0 0px rgba(255,255,255,0)'
            }}
            transition={{
              duration: 1.5,
              repeat: activePlayerId === player.id ? Infinity : 0,
              repeatType: 'reverse'
            }}
          >
            {/* Player Camera */}
            <div className="flex-grow bg-black overflow-hidden">
              {player.cameraUrl ? (
                <iframe 
                  src={player.cameraUrl}
                  title={`Player ${player.name} camera`}
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              ) : player.avatar ? (
                <img 
                  src={player.avatar} 
                  alt={player.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/30">
                  No Camera
                </div>
              )}
            </div>
            
            {/* Player Info Bar */}
            <div className="bg-black/80 backdrop-blur-sm p-2 flex items-center justify-between">
              <div>
                <div className="text-white text-sm font-bold truncate">{player.name}</div>
                <div className="flex items-center space-x-1">
                  <div className="text-xs text-white/70">{player.points} pkt</div>
                  {player.lives > 0 && (
                    <div className="flex">
                      {Array(player.lives).fill(0).map((_, i) => (
                        <span key={i} className="text-red-500">❤️</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {player.health > 0 && !player.isEliminated && (
                <div 
                  className="h-2 w-12 bg-gray-700 rounded-full overflow-hidden"
                  title={`Health: ${player.health}%`}
                >
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-lime-500"
                    style={{ width: `${player.health}%` }}
                  />
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Points animation when points are awarded */}
          <AnimatePresence>
            {latestPoints && latestPoints.playerId === player.id && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-10"
                initial={{ opacity: 0, scale: 2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div 
                  className="text-4xl font-bold"
                  style={{
                    color: latestPoints.points > 0 ? '#4ade80' : '#ef4444',
                    textShadow: `0 0 10px ${latestPoints.points > 0 ? '#4ade80' : '#ef4444'}`
                  }}
                >
                  {latestPoints.points > 0 ? '+' : ''}{latestPoints.points}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
      
      {/* Empty slots */}
      {emptyArray.map((_, index) => (
        <div
          key={`empty-${index}`}
          className="relative aspect-video rounded-lg bg-black/20 border border-white/10"
        />
      ))}
    </div>
  );
};

export default PlayerGrid;
