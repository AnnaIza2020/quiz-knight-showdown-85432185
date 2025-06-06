
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGameContext } from '@/context/GameContext';
import { GameRound } from '@/types/game-types';
import { Play, Pause, SkipForward, RotateCcw, Trophy } from 'lucide-react';
import { toast } from 'sonner';

const GameControlPanel: React.FC = () => {
  const {
    round,
    setRound,
    timerRunning,
    timerSeconds,
    startTimer,
    stopTimer,
    currentQuestion,
    selectQuestion,
    categories,
    finishGame,
    winnerIds,
    players,
    resetGame
  } = useGameContext();

  const handleStartRound = () => {
    if (round === GameRound.SETUP) {
      setRound(GameRound.ROUND_ONE);
      toast.success('Rozpoczęto Rundę 1');
    } else if (round === GameRound.ROUND_ONE) {
      setRound(GameRound.ROUND_TWO);
      toast.success('Rozpoczęto Rundę 2');
    } else if (round === GameRound.ROUND_TWO) {
      setRound(GameRound.ROUND_THREE);
      toast.success('Rozpoczęto Rundę 3');
    }
  };

  const handleStartTimer = () => {
    let defaultTime = 30;
    if (round === GameRound.ROUND_TWO) {
      defaultTime = 5;
    }
    startTimer(defaultTime);
    toast.info(`Timer uruchomiony - ${defaultTime}s`);
  };

  const handleStopTimer = () => {
    stopTimer();
    toast.info('Timer zatrzymany');
  };

  const handleSkipQuestion = () => {
    selectQuestion(null);
    stopTimer();
    toast.info('Pytanie pominięte');
  };

  const handleFinishGame = () => {
    const activePlayers = players.filter(p => !p.isEliminated);
    if (activePlayers.length > 0) {
      // Find player with highest points
      const winner = activePlayers.reduce((prev, current) => 
        (prev.points > current.points) ? prev : current
      );
      finishGame([winner.id]);
      toast.success(`Gra zakończona! Zwycięzca: ${winner.name}`);
    } else {
      toast.error('Brak aktywnych graczy do wyłonienia zwycięzcy');
    }
  };

  const handleResetGame = () => {
    resetGame();
    toast.info('Gra zresetowana');
  };

  const getRoundName = () => {
    switch (round) {
      case GameRound.SETUP:
        return 'Przygotowanie';
      case GameRound.ROUND_ONE:
        return 'Runda 1';
      case GameRound.ROUND_TWO:
        return 'Runda 2';
      case GameRound.ROUND_THREE:
        return 'Runda 3';
      case GameRound.FINISHED:
        return 'Zakończona';
      default:
        return 'Nieznana';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Panel Sterowania Grą
          <Badge variant="outline" className="text-neon-blue border-neon-blue">
            {getRoundName()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Round Control */}
        <div className="flex gap-2">
          {round !== GameRound.FINISHED && (
            <Button 
              onClick={handleStartRound}
              className="flex-1"
              disabled={round === GameRound.ROUND_THREE}
            >
              {round === GameRound.SETUP ? 'Rozpocznij Rundę 1' :
               round === GameRound.ROUND_ONE ? 'Przejdź do Rundy 2' :
               round === GameRound.ROUND_TWO ? 'Przejdź do Rundy 3' :
               'Runda 3 Aktywna'}
            </Button>
          )}
          
          {round === GameRound.ROUND_THREE && (
            <Button 
              onClick={handleFinishGame}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Zakończ Grę
            </Button>
          )}
        </div>

        {/* Timer Control */}
        <div className="flex gap-2">
          <Button 
            onClick={handleStartTimer}
            disabled={timerRunning}
            variant="outline"
            className="flex-1"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Timer ({round === GameRound.ROUND_TWO ? '5s' : '30s'})
          </Button>
          
          <Button 
            onClick={handleStopTimer}
            disabled={!timerRunning}
            variant="outline"
            className="flex-1"
          >
            <Pause className="w-4 h-4 mr-2" />
            Stop Timer
          </Button>
        </div>

        {/* Timer Display */}
        {timerRunning && (
          <div className="text-center p-4 bg-black/20 rounded-lg">
            <div className="text-3xl font-bold text-neon-gold">
              {timerSeconds}s
            </div>
            <div className="text-sm text-gray-400">
              Timer aktywny
            </div>
          </div>
        )}

        {/* Question Control */}
        {currentQuestion && (
          <div className="space-y-2">
            <div className="p-3 bg-black/20 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Aktualne pytanie:</div>
              <div className="text-white font-medium">
                {currentQuestion.text}
              </div>
            </div>
            
            <Button 
              onClick={handleSkipQuestion}
              variant="outline"
              className="w-full"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Pomiń Pytanie
            </Button>
          </div>
        )}

        {/* Reset Game */}
        <div className="pt-4 border-t border-white/10">
          <Button 
            onClick={handleResetGame}
            variant="destructive"
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Gry
          </Button>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-2 bg-black/20 rounded">
            <div className="text-gray-400">Aktywni gracze</div>
            <div className="text-white font-bold">
              {players.filter(p => !p.isEliminated).length}
            </div>
          </div>
          
          <div className="text-center p-2 bg-black/20 rounded">
            <div className="text-gray-400">Kategorie</div>
            <div className="text-white font-bold">
              {categories.length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameControlPanel;
