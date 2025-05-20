
import React from 'react';
import { GameRound } from '@/types/game-types';
import { useGameContext } from '@/context/GameContext';
import RoundControlPanel from '../rounds/RoundControlPanel';
import PlayerGridContainer from '../rounds/PlayerGridContainer';

interface RoundControlsProps {
  round: GameRound;
  handleStartTimer: (seconds: number) => void;
}

const RoundControls: React.FC<RoundControlsProps> = ({
  round,
  handleStartTimer
}) => {
  const { 
    categories, 
    currentQuestion, 
    players, 
    activePlayerId,
    timerRunning,
    timerSeconds,
    usedQuestionIds,
    roundSettings
  } = useGameContext();
  
  // Get only active players (non-eliminated)
  const activePlayers = players.filter(player => !player.isEliminated);
  
  return (
    <div className="mt-6 space-y-6">
      {/* Player grid for selecting active player */}
      <PlayerGridContainer 
        players={players}
        round={round}
        activePlayerId={activePlayerId}
      />
      
      {/* Round specific controls */}
      <RoundControlPanel
        round={round}
        activePlayers={activePlayers}
        currentQuestion={currentQuestion}
        activePlayerId={activePlayerId}
        timerRunning={timerRunning}
        timerSeconds={timerSeconds}
        usedQuestionIds={usedQuestionIds || []}
        roundSettings={roundSettings}
      />
    </div>
  );
};

export default RoundControls;
