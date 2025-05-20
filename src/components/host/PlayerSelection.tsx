
import React from 'react';
import { Player } from '@/types/game-types';
import PlayerCard from '@/components/PlayerCard';

interface PlayerSelectionProps {
  activePlayers: Player[];
  eliminatedPlayers: Player[];
  activePlayerId: string | null;
  onSelectPlayer: (player: Player) => void;
}

const PlayerSelection: React.FC<PlayerSelectionProps> = ({
  activePlayers,
  eliminatedPlayers,
  activePlayerId,
  onSelectPlayer,
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white">
        Gracze {activePlayerId ? '- Wybrano gracza' : '- Wybierz gracza'}
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {activePlayers.map(player => {
          // Create a copy of the player with isActive property
          const playerWithActive = {
            ...player,
            isActive: activePlayerId === player.id
          };
          
          return (
            <div
              key={player.id} 
              onClick={() => onSelectPlayer(player)}
              className={`cursor-pointer transition-transform hover:scale-105 ${
                activePlayerId === player.id ? 'scale-105' : ''
              }`}
            >
              <PlayerCard player={playerWithActive} />
            </div>
          );
        })}
      </div>
      
      {eliminatedPlayers.length > 0 && (
        <>
          <h3 className="text-lg font-bold mb-2 text-neon-red">Wyeliminowani gracze</h3>
          <div className="grid grid-cols-2 gap-4 opacity-60">
            {eliminatedPlayers.map(player => (
              <div key={player.id}>
                <PlayerCard player={player} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerSelection;
