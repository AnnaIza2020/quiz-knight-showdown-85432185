
import React, { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import PlayerCardWithControls from './PlayerCardWithControls';
import WelcomeMessage from './WelcomeMessage';
import CountdownTimer from '@/components/CountdownTimer';
import { Player } from '@/types/game-types';

interface PreparationViewProps {
  players: Player[];
  addEvent: (event: string) => void;
  handleTimerStart: (seconds: number) => void;
  timerRunning: boolean;
  timerSeconds: number;
  stopTimer: () => void;
  startGame: () => void;
}

const PreparationView: React.FC<PreparationViewProps> = ({ 
  players, 
  addEvent,
  handleTimerStart,
  timerRunning,
  timerSeconds,
  stopTimer,
  startGame
}) => {
  const { addPlayer } = useGameContext();
  const [showWelcome, setShowWelcome] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerCamera, setNewPlayerCamera] = useState('');
  
  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) {
      return;
    }
    
    // Create a complete Player object with all required properties
    const newPlayer: Player = {
      id: uuidv4(), // Generate a unique ID
      name: newPlayerName,
      cameraUrl: newPlayerCamera,
      health: 100,
      lives: 3,
      points: 0,
      isActive: false,
      isEliminated: false
    };
    
    addPlayer(newPlayer);
    
    addEvent(`Dodano gracza: ${newPlayerName}`);
    
    setNewPlayerName('');
    setNewPlayerCamera('');
  };
  
  const dismissWelcome = () => {
    setShowWelcome(false);
  };
  
  return (
    <div className="grid grid-cols-1 gap-6">
      {showWelcome && (
        <WelcomeMessage 
          onDismiss={dismissWelcome} 
          onStartGame={startGame}
        />
      )}
      
      <div className="neon-card">
        <h2 className="text-xl font-bold mb-4 text-white">Dodawanie graczy</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Nazwa gracza</label>
            <Input
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Nazwa gracza"
              className="bg-black/50 border-white/20 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-white/70 mb-1">URL kamery (opcjonalnie)</label>
            <Input
              value={newPlayerCamera}
              onChange={(e) => setNewPlayerCamera(e.target.value)}
              placeholder="https://..."
              className="bg-black/50 border-white/20 text-white"
            />
          </div>
        </div>
        
        <Button 
          onClick={handleAddPlayer}
          className="w-full bg-neon-green text-black hover:bg-neon-green/80"
        >
          <PlusCircle size={18} className="mr-2" />
          Dodaj gracza
        </Button>
      </div>
      
      <div className="neon-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Lista graczy ({players.length}/10)</h2>
          
          <div className="flex items-center space-x-2">
            <CountdownTimer size="sm" />
            
            <div className="flex gap-1">
              {[5, 10, 30].map(seconds => (
                <Button
                  key={seconds}
                  variant="outline"
                  size="sm"
                  onClick={() => handleTimerStart(seconds)}
                  disabled={timerRunning}
                  className="text-neon-green border-neon-green hover:bg-neon-green/20"
                >
                  {seconds}s
                </Button>
              ))}
              
              {timerRunning && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={stopTimer}
                  className="text-neon-red border-neon-red hover:bg-neon-red/20"
                >
                  Stop
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {players.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player) => (
              <PlayerCardWithControls 
                key={player.id} 
                player={player}
                showControls={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-white/50">
            Brak graczy. Dodaj graczy powyżej.
          </div>
        )}
      </div>
      
      <div className="neon-card">
        <h2 className="text-xl font-bold mb-4 text-white">Przygotowanie do gry</h2>
        
        <div className="bg-black/30 p-4 rounded-lg mb-4">
          <div className="font-semibold text-white mb-2">Panel hosta Discord Game Show</div>
          <p className="text-white/70 text-sm">
            Dodaj co najmniej 6 graczy przed rozpoczęciem gry. Gra składa się z trzech rund:
          </p>
          <ul className="text-white/70 text-sm list-disc pl-5 mt-2">
            <li>Runda 1: Eliminacje - 10 graczy, system zdrowia</li>
            <li>Runda 2: 5 sekund - 6 graczy, 3 życia na gracza</li>
            <li>Runda 3: Koło fortuny - 3 graczy, losowe kategorie</li>
          </ul>
        </div>
        
        <Button 
          onClick={startGame}
          className="w-full bg-neon-green text-black hover:bg-neon-green/80 font-bold text-lg py-6"
          disabled={players.length === 0}
        >
          Rozpocznij grę
        </Button>
      </div>
    </div>
  );
};

export default PreparationView;
