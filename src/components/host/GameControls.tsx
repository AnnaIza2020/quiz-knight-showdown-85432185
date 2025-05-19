
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GameRound, Question } from '@/types/game-types';
import { RoundSettings } from '@/hooks/useGameLogic';
import { Timer, AlarmClock, Clock, Pause, Play, RefreshCw } from 'lucide-react';
import QuestionBoard from '@/components/QuestionBoard';
import CountdownTimer from '@/components/CountdownTimer';
import FortuneWheel from '@/components/FortuneWheel';
import { useGameContext } from '@/context/GameContext';

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
  roundSettings,
}) => {
  const { currentQuestion, categories } = useGameContext();
  const [wheelSpinning, setWheelSpinning] = useState(false);
  
  // Get the default timer for the current round
  const getDefaultTimer = useCallback(() => {
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
  }, [round, roundSettings]);
  
  // Spin the wheel in Round 3
  const handleSpinWheel = useCallback(() => {
    if (wheelSpinning) return;
    
    setWheelSpinning(true);
    setTimeout(() => {
      setWheelSpinning(false);
    }, 3000);
  }, [wheelSpinning]);

  return (
    <div className="grid grid-cols-[2fr_1fr] gap-4 mb-6">
      <Card className="bg-black/40 border border-white/10">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">
            {round === GameRound.ROUND_ONE && "Pytania wiedzy ogólnej"}
            {round === GameRound.ROUND_TWO && "Pytania 5 sekund"}
            {round === GameRound.ROUND_THREE && "Koło Fortuny - kategorie"}
            {(round === GameRound.SETUP || round === GameRound.FINISHED) && "Pytania i kategorie"}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {round === GameRound.ROUND_THREE ? (
            <div className="grid grid-cols-2 gap-4">
              {/* Fortune Wheel */}
              <div className="flex flex-col items-center justify-center">
                <FortuneWheel 
                  categories={categories.map(c => c.name)}
                  isSpinning={wheelSpinning}
                />
                <Button
                  className="mt-4 bg-neon-purple hover:bg-neon-purple/80 text-white"
                  onClick={handleSpinWheel}
                  disabled={wheelSpinning || categories.length < 2}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Losuj kategorię
                </Button>
              </div>
              
              {/* Question display */}
              <QuestionBoard question={currentQuestion} />
            </div>
          ) : (
            <QuestionBoard question={currentQuestion} />
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-black/40 border border-white/10">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Timer i narzędzia</CardTitle>
        </CardHeader>
        
        <CardContent>
          {/* Timer display */}
          <div className="mb-6 flex flex-col items-center">
            <CountdownTimer size="lg" />
            
            {/* Timer controls */}
            <div className="grid grid-cols-3 gap-2 mt-4 w-full">
              <Button
                className={`flex items-center justify-center ${
                  round === GameRound.ROUND_ONE 
                    ? "bg-neon-blue hover:bg-neon-blue/80" 
                    : "bg-black/50 border border-neon-blue text-neon-blue hover:bg-neon-blue/20"
                }`}
                onClick={() => startTimer(getDefaultTimer())}
                disabled={timerRunning}
              >
                {round === GameRound.ROUND_ONE ? (
                  <>
                    <Timer className="h-4 w-4 mr-1" />
                    {roundSettings.timerDurations.round1}s
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 mr-1" />
                    Standard
                  </>
                )}
              </Button>
              
              <Button
                className={`flex items-center justify-center ${
                  round === GameRound.ROUND_TWO 
                    ? "bg-neon-yellow hover:bg-neon-yellow/80 text-black" 
                    : "bg-black/50 border border-neon-yellow text-neon-yellow hover:bg-neon-yellow/20"
                }`}
                onClick={() => startTimer(roundSettings.timerDurations.round2)}
                disabled={timerRunning}
              >
                <AlarmClock className="h-4 w-4 mr-1" />
                {roundSettings.timerDurations.round2}s
              </Button>
              
              {timerRunning ? (
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={stopTimer}
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Stop
                </Button>
              ) : (
                <Button
                  className="bg-neon-green hover:bg-neon-green/80 text-black"
                  onClick={() => startTimer(5)}
                  disabled={timerRunning}
                >
                  <Play className="h-4 w-4 mr-1" />
                  5s
                </Button>
              )}
            </div>
            
            {/* Custom timer buttons */}
            <div className="grid grid-cols-4 gap-2 mt-2 w-full">
              {[10, 15, 20, 30].map((seconds) => (
                <Button
                  key={seconds}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => startTimer(seconds)}
                  disabled={timerRunning}
                >
                  {seconds}s
                </Button>
              ))}
            </div>
          </div>
          
          {/* Round-specific tools */}
          {round === GameRound.ROUND_THREE && (
            <div className="p-3 rounded-lg border border-neon-purple/30 bg-black/20">
              <h3 className="font-semibold text-neon-purple mb-2">Koło Fortuny</h3>
              <p className="text-sm text-white/70 mb-2">
                Wylosuj kategorię, a następnie pytanie z tej kategorii.
              </p>
              <div className="text-xs text-white/50">
                Dostępnych kategorii: {categories.length}
              </div>
            </div>
          )}
          
          {round === GameRound.ROUND_TWO && (
            <div className="p-3 rounded-lg border border-neon-yellow/30 bg-black/20">
              <h3 className="font-semibold text-neon-yellow mb-2">Runda 5 Sekund</h3>
              <p className="text-sm text-white/70">
                Gracze mają {roundSettings.timerDurations.round2} sekund na odpowiedź.
                Za poprawną odpowiedź gracz otrzymuje {roundSettings.pointValues.round2} punktów.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GameControls;
