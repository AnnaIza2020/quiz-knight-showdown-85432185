
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GameRound } from '@/types/game-types';
import { Play, Pause, RotateCcw, Save, Download, VolumeX, Volume2, Settings } from 'lucide-react';

interface GameActionsProps {
  round: GameRound;
  startGame: () => void;
  startNewGame: () => void;
  handleSaveLocal: () => void;
  handleLoadLocal: () => void;
  soundMuted: boolean;
  toggleSound: () => void;
}

const GameActions: React.FC<GameActionsProps> = ({
  round,
  startGame,
  startNewGame,
  handleSaveLocal,
  handleLoadLocal,
  soundMuted,
  toggleSound
}) => {
  return (
    <Card className="bg-black/40 border border-white/10 mb-4">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2 justify-between">
          {/* Game Control Buttons */}
          <div className="flex gap-2">
            {round === GameRound.SETUP && (
              <Button
                onClick={startGame}
                className="bg-neon-green hover:bg-neon-green/80 text-black font-bold"
              >
                <Play className="w-4 h-4 mr-2" />
                Rozpocznij Grę
              </Button>
            )}
            
            <Button
              onClick={startNewGame}
              variant="outline"
              className="border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Nowa Gra
            </Button>
          </div>

          {/* Settings and Save/Load */}
          <div className="flex gap-2">
            <Button
              onClick={handleSaveLocal}
              variant="outline"
              className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black"
            >
              <Save className="w-4 h-4 mr-2" />
              Zapisz
            </Button>
            
            <Button
              onClick={handleLoadLocal}
              variant="outline"
              className="border-neon-gold text-neon-gold hover:bg-neon-gold hover:text-black"
            >
              <Download className="w-4 h-4 mr-2" />
              Wczytaj
            </Button>
            
            <Button
              onClick={toggleSound}
              variant="outline"
              className={`border-gray-400 ${soundMuted ? 'text-red-400' : 'text-green-400'} hover:bg-gray-700`}
            >
              {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameActions;
