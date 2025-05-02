
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, RefreshCw, Download, Upload } from 'lucide-react';
import { GameRound } from '@/types/game-types';

interface GameActionButtonsProps {
  round: GameRound;
  isIntroPlaying: boolean;
  startGameWithIntro: () => void;
  startNewGame: () => void;
  handleSaveLocal: () => void;
  handleLoadLocal: () => void;
}

const GameActionButtons: React.FC<GameActionButtonsProps> = ({
  round,
  isIntroPlaying,
  startGameWithIntro,
  startNewGame,
  handleSaveLocal,
  handleLoadLocal
}) => {
  return (
    <div className="mb-4 flex gap-2">
      {round === GameRound.SETUP && (
        <Button
          variant="default"
          className="bg-neon-green text-black hover:bg-neon-green/80"
          onClick={startGameWithIntro}
          disabled={isIntroPlaying}
        >
          <PlayCircle size={18} className="mr-2" />
          Start gry
        </Button>
      )}
      
      <Button
        variant="outline"
        className="border-neon-blue text-neon-blue hover:bg-neon-blue/20"
        onClick={startNewGame}
      >
        <RefreshCw size={18} className="mr-2" />
        Nowa gra
      </Button>
      
      <Button
        variant="outline"
        className="border-neon-yellow text-neon-yellow hover:bg-neon-yellow/20"
        onClick={handleSaveLocal}
      >
        <Download size={18} className="mr-2" />
        Zapisz lokalnie
      </Button>
      
      <Button
        variant="outline"
        className="border-neon-purple text-neon-purple hover:bg-neon-purple/20"
        onClick={handleLoadLocal}
      >
        <Upload size={18} className="mr-2" />
        Wczytaj lokalnie
      </Button>
    </div>
  );
};

export default GameActionButtons;
