import React, { useEffect, useCallback, useMemo } from 'react';
import { useGameContext } from '@/context/GameContext';
import { GameRound, Player } from '@/types/game-types';
import GameHeader from '@/components/host/GameHeader';
import PlayerSelection from '@/components/host/PlayerSelection';
import GameControls from '@/components/host/GameControls';
import PlayerActions from '@/components/host/PlayerActions';
import GameSaveManager from '@/components/host/GameSaveManager';
import { useGameWinners } from '@/hooks/useGameWinners';
import { toast } from 'sonner';
import RoundStatus from '@/components/host/RoundStatus';

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
    winnerIds,
    undoLastAction,
    hasUndoHistory,
    roundSettings,
    addManualPoints,
    adjustHealthManually,
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
  }, [round, winnerIds, players, recordWinner]);
  
  // Memoize active player list to avoid unnecessary renders
  const activePlayers = useMemo(() => {
    return players.filter(p => !p.isEliminated);
  }, [players]);
  
  const eliminatedPlayers = useMemo(() => {
    return players.filter(p => p.isEliminated);
  }, [players]);
  
  // Get active player object
  const activePlayer = useMemo(() => {
    return players.find(p => p.id === activePlayerId) || null;
  }, [players, activePlayerId]);
  
  // Player selection callback
  const handleSelectPlayer = useCallback((player: Player) => {
    if (player.isEliminated) return;
    
    // Toggle active player
    if (activePlayerId === player.id) {
      setActivePlayer(null);
    } else {
      setActivePlayer(player.id);
    }
  }, [activePlayerId, setActivePlayer]);
  
  // Award points for correct answer
  const handleAwardPoints = useCallback(() => {
    if (!activePlayerId || !currentQuestion) return;
    
    awardPoints(activePlayerId, currentQuestion.difficulty);
    
    // Play success sound
    playSound('success');
  }, [activePlayerId, currentQuestion, awardPoints, playSound]);
  
  // Deduct health for wrong answer
  const handleDeductHealth = useCallback(() => {
    if (!activePlayerId) return;
    
    // Different behavior based on round
    if (round === GameRound.ROUND_ONE) {
      // In Round 1, deduct health percentage
      const penaltyAmount = roundSettings.lifePenalties.round1;
      deductHealth(activePlayerId, penaltyAmount);
      
      // Check if player reached 0 health
      const player = players.find(p => p.id === activePlayerId);
      if (player && player.health <= 0) {
        eliminatePlayer(activePlayerId);
        
        // Check if we have 5 eliminated players (time to advance to Round 2)
        const eliminatedCount = players.filter(p => p.health <= 0 || p.isEliminated).length;
        if (eliminatedCount >= 5) {
          toast.info("5 graczy zostało wyeliminowanych! Możesz przejść do Rundy 2.");
        }
      }
    } else if (round === GameRound.ROUND_TWO) {
      // In Round 2, deduct a life
      deductLife(activePlayerId);
      
      // Check if player has no lives left
      const player = players.find(p => p.id === activePlayerId);
      if (player && player.lives <= 0) {
        eliminatePlayer(activePlayerId);
        
        // Count remaining players
        const remainingPlayers = players.filter(p => !p.isEliminated && p.lives > 0).length;
        
        // If only 3 players remain, suggest advancing to Round 3
        if (remainingPlayers <= 3) {
          toast.info(`Pozostało ${remainingPlayers} graczy! Możesz przejść do Rundy 3.`);
        }
      }
    } else if (round === GameRound.ROUND_THREE) {
      // In Round 3, deduct a life
      deductLife(activePlayerId);
      
      // Check if player has no lives left
      const player = players.find(p => p.id === activePlayerId);
      if (player && player.lives <= 0) {
        eliminatePlayer(activePlayerId);
        
        // Check if Round 3 has ended (all but one lost all lives)
        checkRoundThreeEnd();
      }
    }
    
    // Play fail sound
    playSound('fail');
  }, [activePlayerId, round, players, deductHealth, deductLife, eliminatePlayer, checkRoundThreeEnd, playSound, roundSettings]);
  
  // Add bonus points
  const handleBonusPoints = useCallback(() => {
    if (!activePlayerId) return;
    
    // Add 5 bonus points
    addManualPoints(activePlayerId, 5);
    
    // Play bonus sound
    playSound('bonus');
  }, [activePlayerId, addManualPoints, playSound]);
  
  // Eliminate player manually
  const handleEliminatePlayer = useCallback(() => {
    if (!activePlayerId) return;
    
    eliminatePlayer(activePlayerId);
    
    // Check if Round 3 has ended (all lost life)
    if (round === GameRound.ROUND_THREE) {
      checkRoundThreeEnd();
    }
    
    // Play eliminate sound
    playSound('eliminate');
  }, [activePlayerId, eliminatePlayer, round, checkRoundThreeEnd, playSound]);
  
  // End the game and determine winner
  const handleFinishGame = useCallback(() => {
    // Check if Round 3 has ended automatically first
    if (round === GameRound.ROUND_THREE) {
      const isRoundEnded = checkRoundThreeEnd();
      // Don't proceed if round ended automatically
      if (isRoundEnded === true) return;
    }
    
    // Sort players by points to determine winner
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
  }, [round, activePlayers, checkRoundThreeEnd, finishGame, playSound]);
  
  // Handle manual point changes
  const handleManualPoints = useCallback((points: number) => {
    if (!activePlayerId) return;
    addManualPoints(activePlayerId, points);
  }, [activePlayerId, addManualPoints]);
  
  // Handle manual health changes
  const handleManualHealth = useCallback((healthPercent: number) => {
    if (!activePlayerId) return;
    adjustHealthManually(activePlayerId, healthPercent);
  }, [activePlayerId, adjustHealthManually]);
  
  // Helper to get numerical round for recording winners
  const getRoundNumber = (round: GameRound): number => {
    switch(round) {
      case GameRound.ROUND_ONE: return 1;
      case GameRound.ROUND_TWO: return 2;
      case GameRound.ROUND_THREE: return 3;
      default: return 0;
    }
  };
  
  // Calculate flags only when dependencies change
  const canAdvanceToRoundTwo = useMemo(() => {
    // Can advance if at least 5 players are eliminated in Round 1
    const eliminatedCount = players.filter(p => p.health <= 0 || p.isEliminated).length;
    return round === GameRound.ROUND_ONE && eliminatedCount >= 5;
  }, [round, players]);
  
  const canAdvanceToRoundThree = useMemo(() => {
    // Can advance if only 3 or fewer players remain active in Round 2
    const remainingPlayers = players.filter(p => !p.isEliminated && p.lives > 0).length;
    return round === GameRound.ROUND_TWO && remainingPlayers <= 3;
  }, [round, players]);
  
  const canFinishGame = useMemo(() => {
    // Can finish if in Round 3 and at least one player is active
    return round === GameRound.ROUND_THREE && activePlayers.length > 0;
  }, [round, activePlayers.length]);
  
  
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
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
        {/* Left column - Players */}
        <div className="space-y-6">
          <PlayerSelection 
            activePlayers={activePlayers}
            eliminatedPlayers={eliminatedPlayers}
            activePlayerId={activePlayerId}
            onSelectPlayer={handleSelectPlayer}
          />
          
          {/* Round status */}
          <RoundStatus
            round={round}
            activePlayers={activePlayers}
            eliminatedPlayers={eliminatedPlayers}
            roundSettings={roundSettings}
          />
          
          {/* Game save manager */}
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
            roundSettings={roundSettings}
          />
          
          {/* Player actions */}
          <PlayerActions 
            activePlayerId={activePlayerId}
            activePlayer={activePlayer}
            currentQuestion={currentQuestion}
            round={round}
            roundSettings={roundSettings}
            hasUndoHistory={hasUndoHistory()}
            handleAwardPoints={handleAwardPoints}
            handleDeductHealth={handleDeductHealth}
            handleBonusPoints={handleBonusPoints}
            handleEliminatePlayer={handleEliminatePlayer}
            handleUndoLastAction={undoLastAction}
            handleManualPoints={handleManualPoints}
            handleManualHealth={handleManualHealth}
          />
        </div>
      </div>
    </div>
  );
};

export default Host;
