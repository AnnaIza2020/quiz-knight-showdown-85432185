
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SpecialCard } from '@/types/interfaces';

interface SpecialCardsContextType {
  specialCards: SpecialCard[];
  specialCardRules: any[];
  addSpecialCard: (card: SpecialCard) => void;
  updateSpecialCard: (cardId: string, updates: Partial<SpecialCard>) => void;
  removeSpecialCard: (cardId: string) => void;
  addSpecialCardRule: (rule: any) => void;
  updateSpecialCardRule: (ruleId: string, updates: any) => void;
  removeSpecialCardRule: (ruleId: string) => void;
  giveCardToPlayer: (playerId: string, cardId: string) => void;
  usePlayerCard: (playerId: string, cardId: string) => void;
}

const SpecialCardsContext = createContext<SpecialCardsContextType | undefined>(undefined);

export const useSpecialCardsContext = () => {
  const context = useContext(SpecialCardsContext);
  if (!context) {
    throw new Error('useSpecialCardsContext must be used within a SpecialCardsContextProvider');
  }
  return context;
};

interface SpecialCardsContextProviderProps {
  children: ReactNode;
}

export const SpecialCardsContextProvider: React.FC<SpecialCardsContextProviderProps> = ({ children }) => {
  const [specialCards, setSpecialCards] = useState<SpecialCard[]>([]);
  const [specialCardRules, setSpecialCardRules] = useState<any[]>([]);

  const addSpecialCard = (card: SpecialCard) => {
    setSpecialCards(prev => [...prev, card]);
  };

  const updateSpecialCard = (cardId: string, updates: Partial<SpecialCard>) => {
    setSpecialCards(prev => prev.map(card => card.id === cardId ? { ...card, ...updates } : card));
  };

  const removeSpecialCard = (cardId: string) => {
    setSpecialCards(prev => prev.filter(card => card.id !== cardId));
  };

  const addSpecialCardRule = (rule: any) => {
    setSpecialCardRules(prev => [...prev, rule]);
  };

  const updateSpecialCardRule = (ruleId: string, updates: any) => {
    setSpecialCardRules(prev => prev.map(rule => rule.id === ruleId ? { ...rule, ...updates } : rule));
  };

  const removeSpecialCardRule = (ruleId: string) => {
    setSpecialCardRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  const giveCardToPlayer = (playerId: string, cardId: string) => {
    console.log(`Giving card ${cardId} to player ${playerId}`);
  };

  const usePlayerCard = (playerId: string, cardId: string) => {
    console.log(`Player ${playerId} using card ${cardId}`);
  };

  const value: SpecialCardsContextType = {
    specialCards,
    specialCardRules,
    addSpecialCard,
    updateSpecialCard,
    removeSpecialCard,
    addSpecialCardRule,
    updateSpecialCardRule,
    removeSpecialCardRule,
    giveCardToPlayer,
    usePlayerCard
  };

  return (
    <SpecialCardsContext.Provider value={value}>
      {children}
    </SpecialCardsContext.Provider>
  );
};
