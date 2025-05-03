import React, { useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { GameRound, Player } from '@/types/game-types';
import GameHeader from '@/components/host/GameHeader';
import PlayerSelection from '@/components/host/PlayerSelection';
import GameControls from '@/components/host/GameControls';
import PlayerActions from '@/components/host/PlayerActions';
import GameSaveManager from '@/components/host/GameSaveManager';
import { useGameWinners } from '@/hooks/useGameWinners';
import { toast } from 'sonner';

const Host = () => {
  const { 
    round, 
    players, 
    activePlayerId,
    setActivePlayer,
    advanceToRoundTwo,
    advanceToRoundThree,
    finishGame,
    checkRoundThreeEnd,
    awardPoints,
    deductHealth,
    deductLife,
    eliminatePlayer,
    startTimer,
    stopTimer,
    timerRunning,
    currentQuestion,
    resetGame,
    playSound,
    winnerIds
  } = useGameContext();
  
  // Winners management
  const { recordWinner } = useGameWinners();
  
  // Record winners when game is finished
  useEffect(() => {
    if (round === GameRound.FINISHED && winnerIds.length > 0) {
      // Get the winner player objects
      const winningPlayers = players.filter(p => winnerIds.includes(p.id));
      
      // Record each winner in the database
      winningPlayers.forEach(async (player) => {
        await recordWinner(player, getRoundNumber(round));
      });
    }
  }, [round, winnerIds, players]);
  
  const activePlayers = players.filter(p => !p.isEliminated);
  const eliminatedPlayers = players.filter(p => p.isEliminated);
  
  const handleSelectPlayer = (player: Player) => {
    if (player.isEliminated) return;
    
    // Toggle active player
    if (activePlayerId === player.id) {
      setActivePlayer(null);
    } else {
      setActivePlayer(player.id);
    }
  };
  
  const handleAwardPoints = () => {
    if (!activePlayerId || !currentQuestion) return;
    
    awardPoints(activePlayerId, currentQuestion.difficulty);
    
    // Play success sound using the new hook
    playSound('success');
  };
  
  const handleDeductHealth = () => {
    if (!activePlayerId) return;
    
    // W zależności od rundy, różne zachowanie
    if (round === GameRound.ROUND_ONE) {
      deductHealth(activePlayerId, 20);
    } else if (round === GameRound.ROUND_TWO) {
      deductLife(activePlayerId);
      
      // Sprawdź czy gracz ma życia
      const player = players.find(p => p.id === activePlayerId);
      if (player && player.lives <= 1) {
        eliminatePlayer(activePlayerId);
      }
    } else if (round === GameRound.ROUND_THREE) {
      deductLife(activePlayerId);
      
      // Sprawdź czy gracz ma życia
      const player = players.find(p => p.id === activePlayerId);
      if (player && player.lives <= 1) {
        eliminatePlayer(activePlayerId);
        
        // Sprawdź czy wszyscy zostali wyeliminowani
        checkRoundThreeEnd();
      }
    }
    
    // Play fail sound using the new hook
    playSound('fail');
  };
  
  const handleBonusPoints = () => {
    if (!activePlayerId) return;
    
    // Add 5 bonus points
    awardPoints(activePlayerId, 5);
    
    // Play bonus sound using the new hook
    playSound('bonus');
  };
  
  const handleEliminatePlayer = () => {
    if (!activePlayerId) return;
    
    eliminatePlayer(activePlayerId);
    
    // Sprawdź czy runda 3 się zakończyła (wszyscy stracili życie)
    if (round === GameRound.ROUND_THREE) {
      checkRoundThreeEnd();
    }
    
    // Play eliminate sound using the new hook
    playSound('eliminate');
  };
  
  const handleFinishGame = () => {
    // Sprawdź czy runda 3 się zakończyła (wszyscy stracili życie)
    if (round === GameRound.ROUND_THREE) {
      const isRoundEnded = checkRoundThreeEnd();
      // Only return if the round has ended automatically
      if (isRoundEnded === true) return;
    }
    
    // Sort players by points to determine the winner
    const sortedPlayers = [...activePlayers].sort((a, b) => b.points - a.points);
    if (sortedPlayers.length > 0) {
      const winnerIds = [sortedPlayers[0].id];
      finishGame(winnerIds);
      
      // Play victory sound
      playSound('victory');
      
      // Show toast notification
      toast.success(`${sortedPlayers[0].name} wygrywa grę!`, {
        description: `z wynikiem ${sortedPlayers[0].points} punktów`
      });
    }
  };
  
  // Helper to get numerical round for recording winners
  const getRoundNumber = (round: GameRound): number => {
    switch(round) {
      case GameRound.ROUND_ONE: return 1;
      case GameRound.ROUND_TWO: return 2;
      case GameRound.ROUND_THREE: return 3;
      default: return 0;
    }
  };
  
  // Calculate if we can advance to the next round
  const canAdvanceToRoundTwo = round === GameRound.ROUND_ONE && players.length >= 6;
  const canAdvanceToRoundThree = round === GameRound.ROUND_TWO && activePlayers.length >= 3;
  const canFinishGame = round === GameRound.ROUND_THREE && activePlayers.length > 0;
  
  return (
    <div className="min-h-screen bg-neon-background p-4">
      <GameHeader 
        round={round}
        canAdvanceToRoundTwo={canAdvanceToRoundTwo}
        canAdvanceToRoundThree={canAdvanceToRoundThree}
        canFinishGame={canFinishGame}
        advanceToRoundTwo={advanceToRoundTwo}
        advanceToRoundThree={advanceToRoundThree}
        handleFinishGame={handleFinishGame}
        resetGame={resetGame}
      />
      
      <div className="grid grid-cols-[1fr_2fr] gap-6">
        {/* Left column - Players */}
        <div className="space-y-6">
          <PlayerSelection 
            activePlayers={activePlayers}
            eliminatedPlayers={eliminatedPlayers}
            activePlayerId={activePlayerId}
            onSelectPlayer={handleSelectPlayer}
          />
          
          {/* Add GameSaveManager component */}
          <GameSaveManager />
        </div>
        
        {/* Right column - Game controls */}
        <div>
          {/* Timer controls and questions */}
          <GameControls 
            round={round}
            timerRunning={timerRunning}
            startTimer={startTimer}
            stopTimer={stopTimer}
          />
          
          {/* Player actions */}
          <PlayerActions 
            activePlayerId={activePlayerId}
            currentQuestion={currentQuestion}
            round={round}
            handleAwardPoints={handleAwardPoints}
            handleDeductHealth={handleDeductHealth}
            handleBonusPoints={handleBonusPoints}
            handleEliminatePlayer={handleEliminatePlayer}
          />
        </div>
      </div>
    </div>
  );
};

export default Host;
