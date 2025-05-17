
import React, { createContext, useContext, ReactNode } from 'react';
import { SpecialCard, SpecialCardAwardRule, Player, SoundEffect } from '@/types/game-types';
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
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  specialCards: SpecialCard[];
  setSpecialCards: React.Dispatch<React.SetStateAction<SpecialCard[]>>;
  specialCardRules: SpecialCardAwardRule[];
  setSpecialCardRules: React.Dispatch<React.SetStateAction<SpecialCardAwardRule[]>>;
  playSound: (sound: SoundEffect, volume?: number) => void;
}

export const SpecialCardsProvider: React.FC<SpecialCardsProviderProps> = ({ 
  children,
  players,
  setPlayers,
  specialCards,
  setSpecialCards,
  specialCardRules,
  setSpecialCardRules,
  playSound
}) => {
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
