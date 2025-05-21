
import React, { createContext, useContext, ReactNode } from 'react';
import { SpecialCard } from '@/types/card-types';
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
  
  // Safely access properties
  const players = gameCtx.players || [];
  const setPlayers = gameCtx.setPlayers || (() => {});
  const specialCards = gameCtx.specialCards || [];
  const specialCardRules = gameCtx.specialCardRules || [];
  const playSound = gameCtx.playSound || (() => {});
  
  // Since GameContext doesn't expose these setters, we need to use methods
  const addSpecialCardToGame = gameCtx.addSpecialCard || (() => {});
  const updateSpecialCardInGame = gameCtx.updateSpecialCard || (() => {});
  const removeSpecialCardFromGame = gameCtx.removeSpecialCard || (() => {});
  const addSpecialCardRuleToGame = gameCtx.addSpecialCardRule || (() => {});
  const updateSpecialCardRuleInGame = gameCtx.updateSpecialCardRule || (() => {});
  const removeSpecialCardRuleFromGame = gameCtx.removeSpecialCardRule || (() => {});

  // Use the special cards hook
  const specialCardsHook = useSpecialCards(
    players, 
    setPlayers, 
    specialCards, 
    (newCards: SpecialCard[]) => {
      // Since we can't directly access setSpecialCards, 
      // we need to handle updates differently
      // This is a simplified approach - in production, consider using
      // the GameContext methods like addSpecialCard directly
      newCards.forEach(card => {
        if (!specialCards.some(c => c.id === card.id)) {
          addSpecialCardToGame(card);
        }
      });
    }, 
    specialCardRules, 
    (newRules: SpecialCardAwardRule[]) => {
      // Similar approach for rules
      newRules.forEach(rule => {
        if (!specialCardRules.some(r => r.id === rule.id)) {
          addSpecialCardRuleToGame(rule);
        }
      });
    }, 
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
