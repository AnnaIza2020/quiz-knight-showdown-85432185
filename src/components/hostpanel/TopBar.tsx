
import React from 'react';
import { useGameContext } from '@/context/GameContext';
import { Badge } from '@/components/ui/badge';
import { GameRound } from '@/types/game-types';
import { Users, Clock, Trophy } from 'lucide-react';

const TopBar: React.FC = () => {
  const { 
    round, 
    players, 
    timerSeconds, 
    timerRunning,
    gameTitle 
  } = useGameContext();

  const activePlayers = players.filter(p => !p.isEliminated);
  const totalPoints = players.reduce((sum, p) => sum + p.points, 0);

  const getRoundName = () => {
    switch (round) {
      case GameRound.SETUP: return 'Przygotowanie';
      case GameRound.ROUND_ONE: return 'Runda 1';
      case GameRound.ROUND_TWO: return 'Runda 2'; 
      case GameRound.ROUND_THREE: return 'Runda 3';
      case GameRound.FINISHED: return 'Zakończona';
      default: return 'Nieznana';
    }
  };

  const getRoundColor = () => {
    switch (round) {
      case GameRound.SETUP: return 'bg-gray-500';
      case GameRound.ROUND_ONE: return 'bg-neon-blue';
      case GameRound.ROUND_TWO: return 'bg-neon-purple';
      case GameRound.ROUND_THREE: return 'bg-neon-gold';
      case GameRound.FINISHED: return 'bg-neon-green';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-black/50 border-b border-white/10 p-4 mb-4">
      <div className="flex items-center justify-between">
        {/* Game Title */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white">
            {gameTitle || 'Discord Game Show'}
          </h1>
          <Badge className={`${getRoundColor()} text-white font-bold px-3 py-1`}>
            {getRoundName()}
          </Badge>
        </div>

        {/* Game Stats */}
        <div className="flex items-center space-x-6">
          {/* Players Count */}
          <div className="flex items-center space-x-2 text-neon-green">
            <Users className="w-5 h-5" />
            <span className="font-bold">{activePlayers.length}/{players.length}</span>
            <span className="text-gray-400 text-sm">graczy</span>
          </div>

          {/* Timer */}
          <div className="flex items-center space-x-2">
            <Clock className={`w-5 h-5 ${timerRunning ? 'text-neon-gold animate-pulse' : 'text-gray-400'}`} />
            <span className={`font-bold ${timerRunning ? 'text-neon-gold' : 'text-gray-400'}`}>
              {timerRunning ? `${timerSeconds}s` : '--'}
            </span>
          </div>

          {/* Total Points */}
          <div className="flex items-center space-x-2 text-neon-purple">
            <Trophy className="w-5 h-5" />
            <span className="font-bold">{totalPoints}</span>
            <span className="text-gray-400 text-sm">pkt</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
