
import React from 'react';
import { Clock, FastForward, Play, Square, Timer } from 'lucide-react';
import { GameRound } from '@/types/game-types';
import CountdownTimer from '../CountdownTimer';

interface TopBarProps {
  round: GameRound;
  handleStartTimer: (seconds: number) => void;
  stopTimer: () => void;
  handleAdvanceToRound: (round: GameRound) => void;
}

const TopBar: React.FC<TopBarProps> = ({
  round,
  handleStartTimer,
  stopTimer,
  handleAdvanceToRound
}) => {
  // Generate round name based on current round
  const getRoundName = () => {
    switch (round) {
      case GameRound.SETUP:
        return "Przygotowanie";
      case GameRound.ROUND_ONE:
        return "Runda 1: Zróżnicowana Wiedza z Polskiego Internetu";
      case GameRound.ROUND_TWO:
        return "Runda 2: 5 Sekund";
      case GameRound.ROUND_THREE:
        return "Runda 3: Koło Chaosu";
      case GameRound.FINISHED:
        return "Gra Zakończona";
    }
  };
  
  // Determine which timer buttons to show based on the current round
  const getTimerButtons = () => {
    if (round === GameRound.ROUND_ONE) {
      return (
        <>
          <button
            onClick={() => handleStartTimer(30)}
            className="bg-black border border-neon-blue text-neon-blue hover:bg-neon-blue/10 py-2 px-3 rounded-md flex items-center"
          >
            <Timer className="h-4 w-4 mr-1" />
            30s
          </button>
          <button
            onClick={() => handleStartTimer(60)}
            className="bg-black border border-neon-blue text-neon-blue hover:bg-neon-blue/10 py-2 px-3 rounded-md flex items-center"
          >
            <Timer className="h-4 w-4 mr-1" />
            60s
          </button>
        </>
      );
    }
    
    if (round === GameRound.ROUND_TWO) {
      return (
        <button
          onClick={() => handleStartTimer(5)}
          className="bg-black border border-neon-yellow text-neon-yellow hover:bg-neon-yellow/10 py-2 px-3 rounded-md flex items-center"
        >
          <Play className="h-4 w-4 mr-1" />
          5s
        </button>
      );
    }
    
    if (round === GameRound.ROUND_THREE) {
      return (
        <button
          onClick={() => handleStartTimer(30)}
          className="bg-black border border-neon-purple text-neon-purple hover:bg-neon-purple/10 py-2 px-3 rounded-md flex items-center"
        >
          <Timer className="h-4 w-4 mr-1" />
          30s
        </button>
      );
    }
    
    return null;
  };
  
  // Get the next round button if applicable
  const getNextRoundButton = () => {
    if (round === GameRound.ROUND_ONE) {
      return (
        <button
          onClick={() => handleAdvanceToRound(GameRound.ROUND_TWO)}
          className="bg-black border border-neon-green text-neon-green hover:bg-neon-green/10 py-2 px-3 rounded-md flex items-center"
        >
          <FastForward className="h-4 w-4 mr-1" />
          Przejdź do Rundy 2
        </button>
      );
    }
    
    if (round === GameRound.ROUND_TWO) {
      return (
        <button
          onClick={() => handleAdvanceToRound(GameRound.ROUND_THREE)}
          className="bg-black border border-neon-green text-neon-green hover:bg-neon-green/10 py-2 px-3 rounded-md flex items-center"
        >
          <FastForward className="h-4 w-4 mr-1" />
          Przejdź do Rundy 3
        </button>
      );
    }
    
    return null;
  };
  
  return (
    <div className="bg-black/70 backdrop-blur-md p-4 rounded-lg border border-white/10 mb-4 flex flex-wrap justify-between items-center gap-y-3">
      {/* Left section - Round info */}
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-white mr-2">
          {getRoundName()}
        </h1>
      </div>
      
      {/* Middle section - Timer */}
      <div className="flex gap-2">
        <CountdownTimer size="md" />
      </div>
      
      {/* Right section - Actions */}
      <div className="flex gap-2">
        {getTimerButtons()}
        
        <button
          onClick={stopTimer}
          className="bg-black border border-neon-red text-neon-red hover:bg-neon-red/10 py-2 px-3 rounded-md flex items-center"
        >
          <Square className="h-4 w-4 mr-1" />
          Stop
        </button>
        
        {getNextRoundButton()}
      </div>
    </div>
  );
};

export default TopBar;
