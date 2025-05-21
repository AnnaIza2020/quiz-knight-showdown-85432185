
import React, { createContext, useContext, ReactNode } from 'react';
import { SpecialCard, CardSize } from '@/types/card-types';
import { Player, SpecialCardAwardRule, SoundEffect } from '@/types/game-types';
import { useSpecialCards } from '@/hooks/useSpecialCards';
import { useGameContext } from './GameContext';

// Define the Special Cards Context type
interface SpecialCardsContextType {
  specialCards: SpecialCard[];
  specialCardRules: SpecialCardAwardRule[];
  
  // Special cards methods
  addSpecialCard: (card: SpecialCard) => void;
  updateSpecialCard: (cardId: string, updates: Partial<SpecialCard>) => void;
  removeSpecialCard: (cardId: string) => void;
  addSpecialCardRule: (rule: SpecialCardAwardRule) => void;
  updateSpecialCardRule: (ruleId: string, updates: Partial<SpecialCardAwardRule>) => void;
  removeSpecialCardRule: (ruleId: string) => void;
  giveCardToPlayer: (playerId: string, cardId: string) => void;
  usePlayerCard: (playerId: string, cardId: string) => void;
}

const SpecialCardsContext = createContext<SpecialCardsContextType | undefined>(undefined);

export const useSpecialCardsContext = () => {
  const context = useContext(SpecialCardsContext);
  if (!context) {
    throw new Error('useSpecialCardsContext must be used within a SpecialCardsProvider');
  }
  return context;
};

interface SpecialCardsProviderProps {
  children: ReactNode;
}

export const SpecialCardsProvider: React.FC<SpecialCardsProviderProps> = ({ children }) => {
  // Get game context data
  const gameCtx = useGameContext();
  
  // Safely access properties with defaults
  const players = gameCtx?.players || [];
  const setPlayers = gameCtx?.setPlayers || (() => {});
  const specialCards = gameCtx?.specialCards || [];
  const setSpecialCards = gameCtx?.setSpecialCards || (() => {});
  const specialCardRules = gameCtx?.specialCardRules || [];
  const setSpecialCardRules = gameCtx?.setSpecialCardRules || (() => {});
  const playSound = gameCtx?.playSound || (() => {});

  // Use the special cards hook
  const specialCardsHook = useSpecialCards(
    players, 
    setPlayers, 
    specialCards, 
    setSpecialCards, 
    specialCardRules, 
    setSpecialCardRules, 
    playSound as (sound: SoundEffect, volume?: number) => void
  );

  // Value to provide to consumers
  const value: SpecialCardsContextType = {
    specialCards,
    specialCardRules,
    ...specialCardsHook
  };

  return <SpecialCardsContext.Provider value={value}>{children}</SpecialCardsContext.Provider>;
};
