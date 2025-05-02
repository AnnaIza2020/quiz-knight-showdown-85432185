
import { Dispatch, SetStateAction } from 'react';
import { Player, SpecialCard, SpecialCardAwardRule } from '@/types/game-types';
import { SoundEffect } from './useSoundEffects';

export const useSpecialCards = (
  players: Player[],
  setPlayers: Dispatch<SetStateAction<Player[]>>,
  specialCards: SpecialCard[],
  setSpecialCards: Dispatch<SetStateAction<SpecialCard[]>>,
  specialCardRules: SpecialCardAwardRule[],
  setSpecialCardRules: Dispatch<SetStateAction<SpecialCardAwardRule[]>>,
  playSound: (sound: SoundEffect, volume?: number) => void
) => {

  // Add a new special card to the game
  const addSpecialCard = (card: SpecialCard) => {
    setSpecialCards(prev => {
      // Check if card with this ID already exists
      if (prev.some(c => c.id === card.id)) {
        return prev.map(c => c.id === card.id ? card : c);
      }
      return [...prev, card];
    });
  };

  // Update an existing special card
  const updateSpecialCard = (card: SpecialCard) => {
    setSpecialCards(prev => 
      prev.map(c => c.id === card.id ? card : c)
    );
  };

  // Remove a special card from the game
  const removeSpecialCard = (cardId: string) => {
    setSpecialCards(prev => prev.filter(c => c.id !== cardId));
    
    // Also remove any rules associated with this card
    setSpecialCardRules(prev => prev.filter(rule => rule.cardId !== cardId));
    
    // Remove the card from any players who have it
    setPlayers(prev => 
      prev.map(player => ({
        ...player,
        specialCards: player.specialCards?.filter(id => id !== cardId) || []
      }))
    );
  };

  // Add a new award rule for special cards
  const addSpecialCardRule = (rule: SpecialCardAwardRule) => {
    setSpecialCardRules(prev => {
      if (prev.some(r => r.id === rule.id)) {
        return prev.map(r => r.id === rule.id ? rule : r);
      }
      return [...prev, rule];
    });
  };

  // Update an existing award rule
  const updateSpecialCardRule = (rule: SpecialCardAwardRule) => {
    setSpecialCardRules(prev =>
      prev.map(r => r.id === rule.id ? rule : r)
    );
  };

  // Remove an award rule
  const removeSpecialCardRule = (ruleId: string) => {
    setSpecialCardRules(prev => prev.filter(r => r.id !== ruleId));
  };

  // Give a special card to a player
  const giveCardToPlayer = (cardId: string, playerId: string) => {
    // Find the card to get its details
    const card = specialCards.find(c => c.id === cardId);
    if (!card) return;
    
    // Update player's cards
    setPlayers(prev =>
      prev.map(player => {
        if (player.id === playerId) {
          const existingCards = player.specialCards || [];
          return {
            ...player,
            specialCards: [...existingCards, cardId]
          };
        }
        return player;
      })
    );
    
    // Play a sound effect
    if (card.soundEffect) {
      playSound(card.soundEffect);
    } else {
      playSound('bonus');
    }
  };

  // Use a card from player's inventory
  const usePlayerCard = (cardId: string, playerId: string) => {
    // Find the card to get its details
    const card = specialCards.find(c => c.id === cardId);
    if (!card) return;
    
    // Remove the card from player's inventory
    setPlayers(prev =>
      prev.map(player => {
        if (player.id === playerId) {
          const updatedCards = player.specialCards?.filter(id => id !== cardId) || [];
          return {
            ...player,
            specialCards: updatedCards
          };
        }
        return player;
      })
    );
    
    // Play a sound effect
    if (card.soundEffect) {
      playSound(card.soundEffect);
    } else {
      playSound('bonus');
    }
    
    // Return card info for any UI effects
    return card;
  };

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
