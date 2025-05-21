
import React, { createContext, useContext, ReactNode, useState } from 'react';
import { SpecialCard, CardSize } from '@/types/card-types';
import { Player, SpecialCardAwardRule, SoundEffect } from '@/types/game-types';
import { useSpecialCards } from '@/hooks/useSpecialCards';

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
  const { 
    players, setPlayers, 
    specialCards, setSpecialCards, 
    specialCardRules, setSpecialCardRules,
    playSound
  } = useContext(GameContext) || {
    players: [],
    setPlayers: () => {},
    specialCards: [],
    setSpecialCards: () => {},
    specialCardRules: [],
    setSpecialCardRules: () => {},
    playSound: () => {}
  };

  // Use the special cards hook
  const specialCardsHook = useSpecialCards(
    players, 
    setPlayers, 
    specialCards, 
    setSpecialCards, 
    specialCardRules, 
    setSpecialCardRules, 
    playSound
  );

  // Value to provide to consumers
  const value: SpecialCardsContextType = {
    specialCards,
    specialCardRules,
    ...specialCardsHook
  };

  return <SpecialCardsContext.Provider value={value}>{children}</SpecialCardsContext.Provider>;
};

// Import this at the top, but due to circular dependency we have to define it here
import { GameContext } from './GameContext';
