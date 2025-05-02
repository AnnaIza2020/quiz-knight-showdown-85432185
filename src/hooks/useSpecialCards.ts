
import { useState, useCallback } from 'react';
import { SpecialCard, SpecialCardAwardRule, Player } from '@/types/game-types';
import { SoundEffect } from '@/hooks/useSoundEffects';

export const useSpecialCards = (
  players: Player[],
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>,
  specialCards: SpecialCard[],
  setSpecialCards: React.Dispatch<React.SetStateAction<SpecialCard[]>>,
  specialCardRules: SpecialCardAwardRule[],
  setSpecialCardRules: React.Dispatch<React.SetStateAction<SpecialCardAwardRule[]>>,
  playSound: (sound: SoundEffect, volume?: number) => void
) => {
  
  // Add a new special card
  const addSpecialCard = useCallback((card: SpecialCard) => {
    setSpecialCards(prev => {
      // Check if card with this ID already exists
      const exists = prev.find(c => c.id === card.id);
      if (exists) {
        return prev.map(c => c.id === card.id ? card : c);
      }
      return [...prev, card];
    });
  }, [setSpecialCards]);
  
  // Update an existing special card
  const updateSpecialCard = useCallback((card: SpecialCard) => {
    setSpecialCards(prev => prev.map(c => c.id === card.id ? card : c));
  }, [setSpecialCards]);
  
  // Remove a special card by ID
  const removeSpecialCard = useCallback((cardId: string) => {
    setSpecialCards(prev => prev.filter(card => card.id !== cardId));
    
    // Also remove any rules that are associated with this card
    setSpecialCardRules(prev => prev.filter(rule => rule.cardId !== cardId));
    
    // Remove this card from any players who have it
    setPlayers(prev => prev.map(player => {
      if (player.specialCards && player.specialCards.includes(cardId)) {
        return {
          ...player,
          specialCards: player.specialCards.filter(id => id !== cardId)
        };
      }
      return player;
    }));
  }, [setSpecialCards, setSpecialCardRules, setPlayers]);
  
  // Add a new special card award rule
  const addSpecialCardRule = useCallback((rule: SpecialCardAwardRule) => {
    setSpecialCardRules(prev => {
      // Check if rule with this ID already exists
      const exists = prev.find(r => r.id === rule.id);
      if (exists) {
        return prev.map(r => r.id === rule.id ? rule : r);
      }
      return [...prev, rule];
    });
  }, [setSpecialCardRules]);
  
  // Update an existing special card award rule
  const updateSpecialCardRule = useCallback((rule: SpecialCardAwardRule) => {
    setSpecialCardRules(prev => prev.map(r => r.id === rule.id ? rule : r));
  }, [setSpecialCardRules]);
  
  // Remove a special card award rule by ID
  const removeSpecialCardRule = useCallback((ruleId: string) => {
    setSpecialCardRules(prev => prev.filter(rule => rule.id !== ruleId));
  }, [setSpecialCardRules]);
  
  // Give a card to a player
  const giveCardToPlayer = useCallback((cardId: string, playerId: string) => {
    setPlayers(prev => prev.map(player => {
      if (player.id === playerId) {
        // Make sure player has specialCards array and doesn't already have this card
        const currentCards = player.specialCards || [];
        if (!currentCards.includes(cardId)) {
          // Play sound effect for getting a card
          playSound('card-reveal');
          
          // Limit to max 3 cards per player
          const updatedCards = [...currentCards, cardId].slice(0, 3);
          
          return {
            ...player,
            specialCards: updatedCards
          };
        }
      }
      return player;
    }));
  }, [setPlayers, playSound]);
  
  // Use a card from a player
  const usePlayerCard = useCallback((cardId: string, playerId: string) => {
    // Find the player
    const player = players.find(p => p.id === playerId);
    if (!player || !player.specialCards || !player.specialCards.includes(cardId)) {
      return;
    }
    
    // Find the card to get its sound effect
    const card = specialCards.find(c => c.id === cardId);
    if (card && card.soundEffect) {
      playSound(card.soundEffect);
    } else {
      playSound('card-reveal'); // Default sound if no specific one set
    }
    
    // Remove the card from the player
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        return {
          ...p,
          specialCards: p.specialCards?.filter(id => id !== cardId) || []
        };
      }
      return p;
    }));
  }, [players, specialCards, setPlayers, playSound]);
  
  return {
    addSpecialCard,
    updateSpecialCard,
    removeSpecialCard,
    addSpecialCardRule,
    updateSpecialCardRule,
    removeSpecialCardRule,
    giveCardToPlayer,
    usePlayerCard
  };
};
