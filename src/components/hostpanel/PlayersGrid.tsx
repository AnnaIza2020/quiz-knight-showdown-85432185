
import React from 'react';
import { Player } from '@/types/game-types';
import PlayerCard from '../PlayerCard';
import { useGameContext } from '@/context/GameContext';

interface PlayersGridProps {
  activePlayers: Player[];
  gridSize?: number;
}

const PlayersGrid: React.FC<PlayersGridProps> = ({
  activePlayers,
  gridSize = 10
}) => {
  const { activePlayerId, setActivePlayer } = useGameContext();
  
  // Handle player selection for host
  const handlePlayerClick = (playerId: string) => {
    if (activePlayerId === playerId) {
      setActivePlayer(null);
    } else {
      setActivePlayer(playerId);
    }
  };
  
  // Calculate number of rows based on the number of players
  const getGridColsClass = () => {
    if (activePlayers.length <= 5) return 'grid-cols-5';
    if (activePlayers.length <= 8) return 'grid-cols-4';
    return 'grid-cols-5';
  };
  
  return (
    <div className={`grid ${getGridColsClass()} gap-4`}>
      {activePlayers.map((player) => (
        <div
          key={player.id}
          className="cursor-pointer transform transition-transform hover:scale-105"
          onClick={() => handlePlayerClick(player.id)}
        >
          <PlayerCard 
            player={{
              ...player,
              isActive: player.id === activePlayerId
            }}
            size="sm"
          />
        </div>
      ))}
      
      {/* Empty slots for visually maintaining grid */}
      {activePlayers.length < gridSize && (
        Array.from({ length: gridSize - activePlayers.length }).map((_, i) => (
          <div 
            key={`empty-${i}`}
            className="h-28 rounded-md border border-white/10 bg-black/20 flex items-center justify-center"
          >
            <span className="text-xs text-white/30">Brak gracza</span>
          </div>
        ))
      )}
    </div>
  );
};

export default PlayersGrid;
