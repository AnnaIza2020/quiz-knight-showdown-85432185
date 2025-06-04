
import React from 'react';
import { useGameContext } from '@/context/GameContext';
import { GameRound } from '@/types/game-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Timer, Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const GameControlPanel: React.FC = () => {
  const {
    round,
    setRound,
    players,
    timerRunning,
    timerSeconds,
    startTimer,
    stopTimer,
    currentQuestion,
    selectQuestion,
    categories,
    usedQuestionIds,
    activePlayerId,
    setActivePlayer,
    playSound
  } = useGameContext();

  const activePlayers = players.filter(p => !p.isEliminated);

  const handleAdvanceRound = () => {
    if (round === GameRound.SETUP) {
      setRound(GameRound.ROUND_ONE);
      toast.success('Rozpoczęto Rundę 1');
      playSound('round-start');
    } else if (round === GameRound.ROUND_ONE) {
      setRound(GameRound.ROUND_TWO);
      toast.success('Rozpoczęto Rundę 2');
      playSound('round-start');
    } else if (round === GameRound.ROUND_TWO) {
      setRound(GameRound.ROUND_THREE);
      toast.success('Rozpoczęto Rundę 3');
      playSound('round-start');
    }
  };

  const handleStartTimer = () => {
    let duration = 30; // default
    if (round === GameRound.ROUND_TWO) duration = 5;
    else if (round === GameRound.ROUND_THREE) duration = 30;
    else if (round === GameRound.ROUND_ONE) duration = 30;
    
    startTimer(duration);
    toast.info(`Timer uruchomiony: ${duration}s`);
  };

  const handleStopTimer = () => {
    stopTimer();
    toast.info('Timer zatrzymany');
  };

  const handleRandomQuestion = () => {
    const roundCategories = categories.filter(cat => {
      if (round === GameRound.ROUND_ONE) return cat.round === 1;
      if (round === GameRound.ROUND_TWO) return cat.round === 2;
      if (round === GameRound.ROUND_THREE) return cat.round === 3;
      return false;
    });

    const allQuestions = roundCategories.flatMap(cat => cat.questions || []);
    const availableQuestions = allQuestions.filter(q => !usedQuestionIds.includes(q.id));

    if (availableQuestions.length === 0) {
      toast.error('Brak dostępnych pytań dla tej rundy');
      return;
    }

    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    selectQuestion(randomQuestion);
    toast.success('Wylosowano nowe pytanie');
  };

  const handleSkipQuestion = () => {
    selectQuestion(null);
    toast.info('Pytanie pominięte');
  };

  const getRoundName = () => {
    switch (round) {
      case GameRound.SETUP: return 'Przygotowanie';
      case GameRound.ROUND_ONE: return 'Runda 1: Wiedza z Internetu';
      case GameRound.ROUND_TWO: return 'Runda 2: 5 Sekund';
      case GameRound.ROUND_THREE: return 'Runda 3: Koło Fortuny';
      case GameRound.FINISHED: return 'Gra Zakończona';
      default: return 'Nieznana runda';
    }
  };

  return (
    <div className="space-y-6">
      {/* Round Status */}
      <Card className="bg-black/40 border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Status Gry</span>
            <Badge variant="outline" className="text-neon-blue border-neon-blue">
              {getRoundName()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-green">{activePlayers.length}</div>
              <div className="text-sm text-gray-400">Aktywni gracze</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-blue">
                {timerRunning ? `${timerSeconds}s` : '--'}
              </div>
              <div className="text-sm text-gray-400">Timer</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-purple">
                {currentQuestion ? 'TAK' : 'NIE'}
              </div>
              <div className="text-sm text-gray-400">Pytanie aktywne</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Round Controls */}
      <Card className="bg-black/40 border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Kontrola Rund</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={handleAdvanceRound}
              disabled={round === GameRound.FINISHED}
              className="bg-neon-blue hover:bg-neon-blue/80"
            >
              {round === GameRound.SETUP ? 'Rozpocznij Grę' : 'Następna Runda'}
            </Button>
            
            <Button
              onClick={() => setRound(GameRound.SETUP)}
              variant="outline"
              className="border-gray-600 text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timer Controls */}
      <Card className="bg-black/40 border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Timer className="w-5 h-5 mr-2" />
            Kontrola Timera
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={handleStartTimer}
              disabled={timerRunning}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Timer
            </Button>
            
            <Button
              onClick={handleStopTimer}
              disabled={!timerRunning}
              className="bg-red-600 hover:bg-red-700"
            >
              <Pause className="w-4 h-4 mr-2" />
              Stop Timer
            </Button>
          </div>
          
          {timerRunning && (
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {timerSeconds}s
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-neon-green h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${(timerSeconds / (round === GameRound.ROUND_TWO ? 5 : 30)) * 100}%` 
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Question Controls */}
      <Card className="bg-black/40 border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Kontrola Pytań</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={handleRandomQuestion}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Losuj Pytanie
            </Button>
            
            <Button
              onClick={handleSkipQuestion}
              variant="outline"
              className="border-gray-600 text-white"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Pomiń
            </Button>
          </div>
          
          {currentQuestion && (
            <div className="p-4 bg-black/20 rounded border border-white/10">
              <div className="text-white">
                <div className="font-semibold mb-2">Aktualne pytanie:</div>
                <div className="text-sm">{currentQuestion.text}</div>
                <div className="text-xs text-gray-400 mt-2">
                  Kategoria: {currentQuestion.category} | Trudność: {currentQuestion.difficulty}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GameControlPanel;
