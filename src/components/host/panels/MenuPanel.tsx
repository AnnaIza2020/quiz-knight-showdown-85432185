
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Settings, Users, FileQuestion, Timer } from 'lucide-react';
import { GameRound } from '@/types/game-types';
import { Link } from 'react-router-dom';

interface MenuPanelProps {
  round: GameRound;
  soundMuted: boolean;
  toggleSound: () => void;
  startGame: () => void;
  startNewGame: () => void;
  handleSaveLocal: () => void;
  handleLoadLocal: () => void;
  players: any[];
}

const MenuPanel: React.FC<MenuPanelProps> = ({
  round,
  soundMuted,
  toggleSound,
  startGame,
  startNewGame,
  handleSaveLocal,
  handleLoadLocal,
  players,
}) => {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {round === GameRound.SETUP && (
        <Button
          className="bg-neon-green text-black hover:bg-neon-green/80 rounded-md px-4 py-2 flex items-center"
          onClick={startGame}
          disabled={players.length === 0}
        >
          <PlusCircle size={18} className="mr-2" />
          Start gry
        </Button>
      )}
      
      <Button
        className="border-neon-blue text-neon-blue hover:bg-neon-blue/20 border rounded-md px-4 py-2 flex items-center"
        onClick={startNewGame}
      >
        <FileQuestion size={18} className="mr-2" />
        Nowa gra
      </Button>
      
      <Button
        className="border-neon-yellow text-neon-yellow hover:bg-neon-yellow/20 border rounded-md px-4 py-2 flex items-center"
        onClick={handleSaveLocal}
      >
        <Timer size={18} className="mr-2" />
        Zapisz lokalnie
      </Button>
      
      <Button
        className="border-neon-purple text-neon-purple hover:bg-neon-purple/20 border rounded-md px-4 py-2 flex items-center"
        onClick={handleLoadLocal}
      >
        <Users size={18} className="mr-2" />
        Wczytaj lokalnie
      </Button>
      
      <Button
        className="border-neon-pink text-neon-pink hover:bg-neon-pink/20 border rounded-md px-4 py-2 flex items-center"
        onClick={toggleSound}
      >
        {soundMuted ? "Włącz dźwięk" : "Wycisz dźwięk"}
      </Button>

      <Link to="/settings">
        <Button
          className="border-neon-green text-neon-green hover:bg-neon-green/20 border rounded-md px-4 py-2 flex items-center"
        >
          <Settings size={18} className="mr-2" />
          Ustawienia
        </Button>
      </Link>
    </div>
  );
};

export default MenuPanel;
