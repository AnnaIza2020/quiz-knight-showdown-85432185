
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from 'uuid';
import { useGameContext } from '@/context/GameContext';
import { Player, GameRound } from '@/types/game-types';
import PlayerCardWithControls from './PlayerCardWithControls';
import { User, UserPlus, AlertCircle } from 'lucide-react';
import { getRandomName } from '@/utils/name-generator';
import { getRandomNeonColor } from '@/utils/utils';

interface PreparationViewProps {
  onStartGameClicked: () => void;
}

const PreparationView: React.FC<PreparationViewProps> = ({ onStartGameClicked }) => {
  const { players, addPlayer, removePlayer, setPlayers } = useGameContext();
  const [newPlayerName, setNewPlayerName] = useState('');

  // Add a new player
  const handleAddPlayer = () => {
    const name = newPlayerName.trim() || getRandomName();
    
    const newPlayer: Player = {
      id: uuidv4(),
      name,
      points: 0,
      health: 100,
      lives: 3,
      isEliminated: false,
      specialCards: [],
      color: getRandomNeonColor(),
      isActive: true
    };
    
    addPlayer(newPlayer);
    setNewPlayerName('');
  };
  
  // Random player generator
  const handleAddRandomPlayers = (count: number) => {
    const newPlayers: Player[] = [];
    
    for (let i = 0; i < count; i++) {
      newPlayers.push({
        id: uuidv4(),
        name: getRandomName(),
        points: 0,
        health: 100,
        lives: 3,
        isEliminated: false,
        specialCards: [],
        color: getRandomNeonColor(),
        isActive: true
      });
    }
    
    // Add all new players at once
    setPlayers([...players, ...newPlayers]);
  };
  
  // Clear all players
  const handleClearAllPlayers = () => {
    setPlayers([]);
  };

  // Handle keypress for adding player
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPlayer();
    }
  };

  return (
    <>
      <div className="flex gap-4 mb-6">
        {/* Left column - Player management */}
        <div className="flex-1 bg-black/30 rounded-lg border border-white/10 p-4">
          <h2 className="text-xl font-semibold text-white mb-4">Gracze ({players.length})</h2>
          
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Nazwa gracza"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-black/50 text-white"
            />
            <Button
              onClick={handleAddPlayer}
              className="whitespace-nowrap"
            >
              <UserPlus className="h-4 w-4 mr-1" /> Dodaj
            </Button>
          </div>
          
          <div className="flex gap-2 mb-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => handleAddRandomPlayers(1)}
            >
              +1 Losowy
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => handleAddRandomPlayers(6)}
            >
              +6 Losowych
            </Button>
            <Button 
              variant="destructive" 
              className="flex-1"
              onClick={handleClearAllPlayers}
            >
              Wyczyść
            </Button>
          </div>
          
          {/* Player list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {players.map((player) => (
              <PlayerCardWithControls
                key={player.id}
                player={player}
                onEliminate={removePlayer}
              />
            ))}
            
            {players.length === 0 && (
              <div className="col-span-2 text-center p-4 text-gray-400 bg-black/20 rounded border border-gray-700">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Dodaj graczy, aby rozpocząć grę</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Right column - Game settings */}
        <div className="w-80 bg-black/30 rounded-lg border border-white/10 p-4">
          <h2 className="text-xl font-semibold text-white mb-4">Rozpocznij Grę</h2>
          
          <div className="text-white/80 mb-6 space-y-2">
            <div className="flex justify-between">
              <span>Ilość graczy:</span>
              <span className={players.length < 6 ? "text-yellow-500" : "text-green-500"}>
                {players.length}/10
              </span>
            </div>
            <div className="flex justify-between">
              <span>Kategorie:</span>
              <span className="text-green-500">Gotowe</span>
            </div>
          </div>
          
          <Button
            onClick={onStartGameClicked}
            size="lg"
            disabled={players.length < 1}
            className="w-full bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90"
          >
            <User className="h-4 w-4 mr-2" /> 
            Rozpocznij Grę
          </Button>
          
          {players.length < 6 && (
            <div className="mt-4 text-sm text-yellow-500">
              <AlertCircle className="h-4 w-4 inline mr-1" />
              Zalecane minimum 6 graczy
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PreparationView;
