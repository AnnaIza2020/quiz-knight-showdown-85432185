
import React from 'react';
import { useGameContext } from '@/context/GameContext';
import { GameRound, Player } from '@/types/game-types';
import GameHeader from '@/components/host/GameHeader';
import PlayerSelection from '@/components/host/PlayerSelection';
import GameControls from '@/components/host/GameControls';
import PlayerActions from '@/components/host/PlayerActions';

const Host = () => {
  const { 
    round, 
    players, 
    activePlayerId,
    setActivePlayer,
    advanceToRoundTwo,
    advanceToRoundThree,
    finishGame,
    awardPoints,
    deductHealth,
    deductLife,
    eliminatePlayer,
    startTimer,
    stopTimer,
    timerRunning,
    currentQuestion,
    resetGame
  } = useGameContext();
  
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
    
    // Play success sound
    const successSound = new Audio('/sounds/success.mp3');
    successSound.volume = 0.5;
    successSound.play().catch(e => console.log('Error playing sound:', e));
  };
  
  const handleDeductHealth = () => {
    if (!activePlayerId) return;
    
    // In round 1, deduct 20 health points
    if (round === GameRound.ROUND_ONE) {
      deductHealth(activePlayerId, 20);
    }
    
    // In round 2, deduct 1 life
    if (round === GameRound.ROUND_TWO) {
      deductLife(activePlayerId);
      
      // Check if player has no lives left
      const player = players.find(p => p.id === activePlayerId);
      if (player && player.lives <= 1) {
        eliminatePlayer(activePlayerId);
      }
    }
    
    // Play fail sound
    const failSound = new Audio('/sounds/fail.mp3');
    failSound.volume = 0.5;
    failSound.play().catch(e => console.log('Error playing sound:', e));
  };
  
  const handleBonusPoints = () => {
    if (!activePlayerId) return;
    
    // Add 5 bonus points
    awardPoints(activePlayerId, 5);
    
    // Play sound
    const bonusSound = new Audio('/sounds/bonus.mp3');
    bonusSound.volume = 0.5;
    bonusSound.play().catch(e => console.log('Error playing sound:', e));
  };
  
  const handleEliminatePlayer = () => {
    if (!activePlayerId) return;
    
    eliminatePlayer(activePlayerId);
    
    // Play sound
    const eliminateSound = new Audio('/sounds/eliminate.mp3');
    eliminateSound.volume = 0.7;
    eliminateSound.play().catch(e => console.log('Error playing sound:', e));
  };
  
  const handleFinishGame = () => {
    // Sort players by points to determine the winner
    const sortedPlayers = [...activePlayers].sort((a, b) => b.points - a.points);
    if (sortedPlayers.length > 0) {
      const winnerIds = [sortedPlayers[0].id];
      finishGame(winnerIds);
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
        <PlayerSelection 
          activePlayers={activePlayers}
          eliminatedPlayers={eliminatedPlayers}
          activePlayerId={activePlayerId}
          onSelectPlayer={handleSelectPlayer}
        />
        
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
