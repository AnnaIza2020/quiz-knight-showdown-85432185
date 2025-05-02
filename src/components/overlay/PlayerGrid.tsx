
import React from 'react';
import { Player } from '@/types/game-types';
import { motion } from 'framer-motion';

interface PlayerGridProps {
  players: Player[];
  maxPlayers: number;
  position: 'top' | 'bottom';
  activePlayerId?: string | null;
}

const PlayerGrid: React.FC<PlayerGridProps> = ({ 
  players, 
  maxPlayers, 
  position, 
  activePlayerId 
}) => {
  // Calculate number of players to display based on position
  // Each row shows a maximum of maxPlayers / 2 players
  const maxPlayersPerRow = Math.ceil(maxPlayers / 2);
  
  // Get players for this row
  const displayPlayers = position === 'top'
    ? players.slice(0, maxPlayersPerRow)
    : players.slice(maxPlayersPerRow, maxPlayers);
  
  // Make sure we don't exceed maxPlayersPerRow players
  const gridPlayers = displayPlayers.slice(0, maxPlayersPerRow);
  
  // Fill in empty slots to maintain grid layout
  while (gridPlayers.length < maxPlayersPerRow) {
    gridPlayers.push({ id: `empty-${gridPlayers.length}`, name: '', cameraUrl: '', points: 0, health: 0, lives: 0, isActive: false, isEliminated: true });
  }
  
  // Calculate grid template columns based on number of players
  const gridTemplateColumns = `repeat(${maxPlayersPerRow}, 1fr)`;
  
  return (
    <div className="w-full" style={{ gridTemplateColumns }}>
      <div className="grid" style={{ gridTemplateColumns }}>
        {gridPlayers.map((player) => (
          <div 
            key={player.id} 
            className={`p-2 ${!player.name ? 'opacity-0' : ''}`}
          >
            <motion.div 
              className="relative aspect-video bg-black/30 rounded-lg overflow-hidden"
              initial={false}
              animate={{ 
                boxShadow: player.id === activePlayerId 
                  ? `0 0 0 4px #4ade80, 0 0 20px rgba(74, 222, 128, 0.7)` 
                  : 'none'
              }}
              transition={{ duration: 0.3 }}
            >
              {player.name && (
                <>
                  <div className="w-full h-full bg-black/50">
                    {player.cameraUrl ? (
                      <iframe 
                        src={player.cameraUrl}
                        className="w-full h-full"
                        allow="camera; microphone; fullscreen; display-capture"
                        title={`Player ${player.name} camera`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white/50">No camera</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 flex justify-between items-center">
                    <span className="font-bold text-white">{player.name}</span>
                    <span className="text-neon-green font-bold">{player.points}p</span>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerGrid;
