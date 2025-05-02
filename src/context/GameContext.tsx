
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { GameContextType } from '@/types/game-types';
import { useGameStateManagement } from '@/hooks/useGameStateManagement';
import { useGameLogic } from '@/hooks/useGameLogic';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

// Re-export the types from the types file for convenience
export * from '@/types/game-types';

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const {
    // State
    round,
    setRound,
    players,
    setPlayers,
    categories,
    setCategories,
    currentQuestion,
    activePlayerId,
    timerRunning,
    setTimerRunning,
    timerSeconds,
    setTimerSeconds,
    winnerIds,
    setWinnerIds,
    gameLogo,
    setGameLogo,
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    hostCameraUrl,
    setHostCameraUrl,
    
    // Methods
    addPlayer,
    updatePlayer,
    removePlayer,
    addCategory,
    removeCategory,
    selectQuestion,
    setActivePlayer,
    startTimer,
    stopTimer,
  } = useGameStateManagement();

  const {
    awardPoints,
    deductHealth,
    deductLife,
    eliminatePlayer,
    advanceToRoundTwo,
    advanceToRoundThree,
    finishGame,
    resetGame
  } = useGameLogic(players, setPlayers, setRound, setWinnerIds);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
      // Play timeout sound effect here
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerSeconds, setTimerSeconds, setTimerRunning]);

  const value: GameContextType = {
    // State
    round,
    players,
    categories,
    currentQuestion,
    activePlayerId,
    timerRunning,
    timerSeconds,
    winnerIds,
    gameLogo,
    primaryColor,
    secondaryColor,
    hostCameraUrl,
    
    // Methods
    setRound,
    addPlayer,
    updatePlayer,
    removePlayer,
    setPlayers,
    setCategories,
    addCategory,
    removeCategory,
    selectQuestion,
    setActivePlayer,
    startTimer,
    stopTimer,
    awardPoints,
    deductHealth,
    deductLife,
    eliminatePlayer,
    advanceToRoundTwo,
    advanceToRoundThree,
    finishGame,
    resetGame,
    setGameLogo,
    setPrimaryColor,
    setSecondaryColor,
    setHostCameraUrl,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
