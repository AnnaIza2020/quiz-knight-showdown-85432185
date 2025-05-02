
import React from 'react';
import QuestionBoard from '@/components/QuestionBoard';
import CountdownTimer from '@/components/CountdownTimer';
import FortuneWheel from '@/components/FortuneWheel';
import { GameRound, Question } from '@/types/game-types';

interface GameControlsProps {
  round: GameRound;
  timerRunning: boolean;
  startTimer: (seconds: number) => void;
  stopTimer: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  round,
  timerRunning,
  startTimer,
  stopTimer,
}) => {
  return (
    <div className="grid grid-cols-[2fr_1fr] gap-6 mb-6">
      <div className="neon-card">
        <h2 className="text-xl font-bold mb-4 text-white">Pytania i kategorie</h2>
        <QuestionBoard />
      </div>
      
      <div className="neon-card">
        <h2 className="text-xl font-bold mb-4 text-white">Narzędzia</h2>
        
        {/* Timer display */}
        <div className="mb-4 flex flex-col items-center">
          <CountdownTimer size="md" />
          
          <div className="flex gap-2 mt-2">
            {[5, 10, 15, 30].map(seconds => (
              <button
                key={seconds}
                className="py-1 px-2 bg-black border border-neon-green text-neon-green rounded hover:bg-neon-green/20"
                onClick={() => startTimer(seconds)}
                disabled={timerRunning}
              >
                {seconds}s
              </button>
            ))}
            
            {timerRunning && (
              <button
                className="py-1 px-2 bg-black border border-neon-red text-neon-red rounded hover:bg-neon-red/20"
                onClick={stopTimer}
              >
                Stop
              </button>
            )}
          </div>
        </div>
        
        {/* Round specific tools */}
        {round === GameRound.ROUND_THREE && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2 text-neon-purple">Koło Fortuny</h3>
            <FortuneWheel className="w-full max-w-xs mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
};

export default GameControls;
