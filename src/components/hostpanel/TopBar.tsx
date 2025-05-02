
import React, { useState } from 'react';
import { Timer, Play, Square, RotateCcw, ChevronDown } from 'lucide-react';
import { GameRound } from '@/types/game-types';
import { cn } from '@/lib/utils';

interface TopBarProps {
  round: GameRound;
  handleStartTimer: (seconds: number) => void;
  stopTimer: () => void;
  handleAdvanceToRound: (round: GameRound) => void;
}

const TopBar = ({ round, handleStartTimer, stopTimer, handleAdvanceToRound }: TopBarProps) => {
  const [showRoundMenu, setShowRoundMenu] = useState(false);

  const getRoundName = () => {
    switch (round) {
      case GameRound.ROUND_ONE:
        return "RUNDA 1: WIEDZA Z POLSKIEGO INTERNETU";
      case GameRound.ROUND_TWO:
        return "RUNDA 2: 5 SEKUND";
      case GameRound.ROUND_THREE:
        return "RUNDA 3: KOŁO FORTUNY";
      case GameRound.FINISHED:
        return "GRA ZAKOŃCZONA";
      default:
        return "PRZYGOTOWANIE GRY";
    }
  };

  return (
    <div className="bg-black/70 backdrop-blur-md p-4 rounded-lg border border-white/10 mb-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="mb-3 md:mb-0">
          <h1 className="text-3xl font-bold text-center md:text-left">
            <span className={cn(
              'neon-text',
              round === GameRound.ROUND_ONE ? 'text-neon-pink' :
              round === GameRound.ROUND_TWO ? 'text-neon-blue' :
              round === GameRound.ROUND_THREE ? 'text-neon-purple' : 'text-white'
            )}>
              {getRoundName()}
            </span>
          </h1>
        </div>
        
        <div className="grid grid-cols-3 md:flex md:items-center gap-3">
          {/* Timer Controls */}
          <div className="flex items-center justify-center space-x-2 bg-black/50 p-2 rounded-md border border-neon-green/30">
            <Timer className="text-neon-green" />
            <span className="text-neon-green font-mono text-xl">30s</span>
          </div>
          
          <button
            className="flex items-center justify-center p-2 bg-black border border-neon-green text-neon-green rounded-md hover:bg-neon-green/20"
            onClick={() => handleStartTimer(30)}
          >
            <Play size={18} className="mr-1" /> Start
          </button>
          
          <button
            className="flex items-center justify-center p-2 bg-black border border-neon-red text-neon-red rounded-md hover:bg-neon-red/20"
            onClick={() => stopTimer()}
          >
            <Square size={18} className="mr-1" /> Stop
          </button>
          
          <button
            className="flex items-center justify-center p-2 bg-black border border-white/30 text-white/70 rounded-md hover:bg-white/10"
            onClick={() => handleStartTimer(30)} // Restart timer
          >
            <RotateCcw size={18} className="mr-1" /> Reset
          </button>
          
          {/* Round Change Button */}
          <div className="relative col-span-3 md:col-span-1">
            <button 
              className="w-full flex items-center justify-center p-2 bg-black border border-neon-blue text-neon-blue rounded-md hover:bg-neon-blue/20"
              onClick={() => setShowRoundMenu(!showRoundMenu)}
            >
              Zmień rundę <ChevronDown size={18} className="ml-1" />
            </button>
            
            {showRoundMenu && (
              <div className="absolute w-full mt-1 bg-black border border-neon-blue/30 rounded-md shadow-lg z-10">
                <button 
                  className="w-full p-2 text-left hover:bg-neon-blue/20 text-neon-pink"
                  onClick={() => handleAdvanceToRound(GameRound.ROUND_ONE)}
                >
                  Runda 1: Wiedza z Internetu
                </button>
                <button 
                  className="w-full p-2 text-left hover:bg-neon-blue/20 text-neon-blue"
                  onClick={() => handleAdvanceToRound(GameRound.ROUND_TWO)}
                >
                  Runda 2: 5 Sekund
                </button>
                <button 
                  className="w-full p-2 text-left hover:bg-neon-blue/20 text-neon-purple"
                  onClick={() => handleAdvanceToRound(GameRound.ROUND_THREE)}
                >
                  Runda 3: Koło Fortuny
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
