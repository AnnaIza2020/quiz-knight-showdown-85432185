import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameRound, Player } from '@/types/game-types';
import PlayerCard from '@/components/PlayerCard';
import { useGameContext } from '@/context/GameContext';

interface PlayerGridContainerProps {
  players: Player[];
  round: GameRound;
  activePlayerId?: string | null;
}

const PlayerGridContainer: React.FC<PlayerGridContainerProps> = ({
  players,
  round,
  activePlayerId
}) => {
  // Use the GameContext to get necessary data and functions
  const { setActivePlayer } = useGameContext();
  
  // State to track filtered players based on the round
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  
  // Effect to update filtered players when round or players change
  useEffect(() => {
    // Create a copy of players to work with
    let playersList = [...players];
    
    // Filter based on the round
    switch(round) {
      case GameRound.ROUND_ONE:
        // Show all non-eliminated players
        playersList = playersList.filter(p => !p.isEliminated);
        break;
      case GameRound.ROUND_TWO:
        // Show all non-eliminated players in Round 2
        playersList = playersList.filter(p => !p.isEliminated);
        break;
      case GameRound.ROUND_THREE:
        // Show all non-eliminated players in Round 3
        playersList = playersList.filter(p => !p.isEliminated);
        break;
      case GameRound.FINISHED:
        // Could show all players or just the winners
        playersList = playersList.sort((a, b) => b.points - a.points);
        break;
      default:
        // For SETUP or any other state, show all players
        break;
    }
    
    setFilteredPlayers(playersList);
  }, [players, round]);
  
  // Function to handle player selection
  const handlePlayerClick = (playerId: string) => {
    if (activePlayerId === playerId) {
      // If already selected, deselect
      setActivePlayer(null);
    } else {
      // Otherwise select this player
      setActivePlayer(playerId);
    }
  };
  
  // Determine the layout based on the round
  const getGridLayout = () => {
    switch(round) {
      case GameRound.ROUND_ONE:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
      case GameRound.ROUND_TWO:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
      case GameRound.ROUND_THREE:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
      default:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
  };
  
  // Function to group players for Round 2's specific layout
  const getGroupedPlayers = () => {
    if (round === GameRound.ROUND_TWO && filteredPlayers.length > 3) {
      // Get up to 6 players, split into two rows of 3
      const topRow = filteredPlayers.slice(0, 3);
      const bottomRow = filteredPlayers.slice(3, 6);
      return { topRow, bottomRow };
    }
    return { topRow: filteredPlayers, bottomRow: [] };
  };
  
  // If it's Round 2, use the special layout
  if (round === GameRound.ROUND_TWO) {
    const { topRow, bottomRow } = getGroupedPlayers();
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-2">Gracze ({filteredPlayers.length})</h3>
        
        {/* Top row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AnimatePresence>
            {topRow.map((player) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <div 
                  className={`cursor-pointer ${player.id === activePlayerId ? 'ring-2 ring-neon-green' : ''}`}
                  onClick={() => handlePlayerClick(player.id)}
                >
                  <PlayerCard 
                    player={player} 
                    isSelected={player.id === activePlayerId}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {/* Bottom row */}
        {bottomRow.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <AnimatePresence>
              {bottomRow.map((player) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <div 
                    className={`cursor-pointer ${player.id === activePlayerId ? 'ring-2 ring-neon-green' : ''}`}
                    onClick={() => handlePlayerClick(player.id)}
                  >
                    <PlayerCard 
                      player={player}
                      isSelected={player.id === activePlayerId}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  }
  
  // For other rounds, use the standard grid layout
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Gracze ({filteredPlayers.length})</h3>
      
      <div className={`grid ${getGridLayout()} gap-4`}>
        <AnimatePresence>
          {filteredPlayers.map((player) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <div 
                className={`cursor-pointer ${player.id === activePlayerId ? 'ring-2 ring-neon-green' : ''}`}
                onClick={() => handlePlayerClick(player.id)}
              >
                <PlayerCard 
                  player={player}
                  isSelected={player.id === activePlayerId}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlayerGridContainer;
