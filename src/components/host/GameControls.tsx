
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timer, Play, Square } from 'lucide-react';
import { GameRound } from '@/types/game-types';
import { RoundSettings } from '@/types/interfaces';

interface GameControlsProps {
  round: GameRound;
  timerRunning: boolean;
  startTimer: (seconds: number) => void;
  stopTimer: () => void;
  roundSettings: RoundSettings;
}

const GameControls: React.FC<GameControlsProps> = ({
  round,
  timerRunning,
  startTimer,
  stopTimer,
  roundSettings
}) => {
  const getTimerDuration = () => {
    switch (round) {
      case GameRound.ROUND_ONE:
        return roundSettings.timerDurations.round1;
      case GameRound.ROUND_TWO:
        return roundSettings.timerDurations.round2;
      case GameRound.ROUND_THREE:
        return roundSettings.timerDurations.round3;
      default:
        return 30;
    }
  };

  const getRoundName = () => {
    switch (round) {
      case GameRound.ROUND_ONE:
        return 'Runda 1: Wiedza z Internetu';
      case GameRound.ROUND_TWO:
        return 'Runda 2: 5 Sekund';
      case GameRound.ROUND_THREE:
        return 'Runda 3: Koło Fortuny';
      default:
        return 'Gra';
    }
  };

  const timerDuration = getTimerDuration();

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/20 mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-white flex items-center space-x-2">
            <Timer className="w-6 h-6 text-neon-blue" />
            <span>Kontrola Timera</span>
          </CardTitle>
          <Badge variant="outline" className="text-neon-green border-neon-green">
            {getRoundName()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4">
          <Button
            onClick={() => startTimer(timerDuration)}
            disabled={timerRunning}
            className="bg-neon-green hover:bg-neon-green/80 text-black flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Start ({timerDuration}s)</span>
          </Button>
          
          <Button
            onClick={stopTimer}
            disabled={!timerRunning}
            variant="destructive"
            className="flex items-center space-x-2"
          >
            <Square className="w-4 h-4" />
            <span>Stop</span>
          </Button>
          
          {round === GameRound.ROUND_TWO && (
            <Button
              onClick={() => startTimer(5)}
              disabled={timerRunning}
              className="bg-neon-purple hover:bg-neon-purple/80 text-white flex items-center space-x-2"
            >
              <Timer className="w-4 h-4" />
              <span>5 Sekund</span>
            </Button>
          )}
        </div>
        
        <div className="mt-4 text-sm text-white/60">
          {round === GameRound.ROUND_ONE && (
            <p>Standardowy czas na odpowiedź w pierwszej rundzie</p>
          )}
          {round === GameRound.ROUND_TWO && (
            <p>Szybkie odpowiedzi - tylko 5 sekund na pytanie!</p>
          )}
          {round === GameRound.ROUND_THREE && (
            <p>Finałowa runda z kołem fortuny</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GameControls;
