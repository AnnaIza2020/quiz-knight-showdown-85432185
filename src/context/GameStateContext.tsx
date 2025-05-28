
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameState as GameStateInterface } from '@/types/interfaces';

interface GameStateContextType {
  gameState: GameStateInterface;
  updateGameState: (state: Partial<GameStateInterface>) => void;
  resetGameState: () => void;
}

const defaultGameState: GameStateInterface = {
  currentRound: 'setup',
  currentPhase: 'waiting',
  currentQuestion: null,
  activePlayerId: null,
  timerRunning: false,
  timerSeconds: 30,
  gameStarted: false,
  gamePaused: false
};

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const useGameStateContext = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameStateContext must be used within a GameStateContextProvider');
  }
  return context;
};

interface GameStateContextProviderProps {
  children: ReactNode;
}

export const GameStateContextProvider: React.FC<GameStateContextProviderProps> = ({ children }) => {
  const [gameState, setGameState] = useState<GameStateInterface>(defaultGameState);

  const updateGameState = (state: Partial<GameStateInterface>) => {
    setGameState(prev => ({ ...prev, ...state }));
  };

  const resetGameState = () => {
    setGameState(defaultGameState);
  };

  const value: GameStateContextType = {
    gameState,
    updateGameState,
    resetGameState
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};
