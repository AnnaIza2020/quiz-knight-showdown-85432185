
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Player, GameState, Question, RoundSettings, AppSettings } from '@/types/interfaces';
import { useGameStateManagement } from '@/hooks/useGameStateManagement';

interface GameContextType {
  // Game State Management
  round: string;
  setRound: (round: string) => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  categories: any[];
  setCategories: (categories: any[]) => void;
  currentQuestion: Question | null;
  activePlayerId: string | null;
  timerRunning: boolean;
  setTimerRunning: (running: boolean) => void;
  timerSeconds: number;
  setTimerSeconds: (seconds: number) => void;
  winnerIds: string[];
  setWinnerIds: (ids: string[]) => void;
  specialCards: any[];
  setSpecialCards: (cards: any[]) => void;
  specialCardRules: any[];
  setSpecialCardRules: (rules: any[]) => void;
  
  // Settings
  gameLogo: string | null;
  setGameLogo: (logo: string | null) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
  hostCameraUrl: string;
  setHostCameraUrl: (url: string) => void;
  
  // Methods
  addPlayer: (player: Player) => void;
  updatePlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  addCategory: (category: any) => void;
  removeCategory: (categoryId: string) => void;
  selectQuestion: (question: Question | null) => void;
  setActivePlayer: (playerId: string | null) => void;
  startTimer: (seconds: number) => void;
  stopTimer: () => void;
  loadGameData: () => void;
  saveGameData: () => void;
  
  // Special Cards Methods
  addSpecialCard: (card: any) => void;
  updateSpecialCard: (cardId: string, card: any) => void;
  removeSpecialCard: (cardId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameContextProvider');
  }
  return context;
};

interface GameContextProviderProps {
  children: ReactNode;
}

export const GameContextProvider: React.FC<GameContextProviderProps> = ({ children }) => {
  const gameStateManagement = useGameStateManagement();

  // Special Cards Methods
  const addSpecialCard = (card: any) => {
    gameStateManagement.setSpecialCards(prev => [...prev, card]);
  };

  const updateSpecialCard = (cardId: string, updatedCard: any) => {
    gameStateManagement.setSpecialCards(prev =>
      prev.map(card => card.id === cardId ? updatedCard : card)
    );
  };

  const removeSpecialCard = (cardId: string) => {
    gameStateManagement.setSpecialCards(prev =>
      prev.filter(card => card.id !== cardId)
    );
  };

  // Auto-save data when it changes
  useEffect(() => {
    gameStateManagement.saveGameData();
  }, [
    gameStateManagement.players,
    gameStateManagement.categories,
    gameStateManagement.specialCards,
    gameStateManagement.specialCardRules,
    gameStateManagement.primaryColor,
    gameStateManagement.secondaryColor,
    gameStateManagement.gameLogo,
    gameStateManagement.hostCameraUrl
  ]);

  // Load data on mount
  useEffect(() => {
    gameStateManagement.loadGameData();
  }, []);

  const value: GameContextType = {
    ...gameStateManagement,
    addSpecialCard,
    updateSpecialCard,
    removeSpecialCard,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
