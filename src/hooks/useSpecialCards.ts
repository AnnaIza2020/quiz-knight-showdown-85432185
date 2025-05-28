
import { toast } from 'sonner';
import { Player, SpecialCard, SpecialCardAwardRule, SoundEffect } from '@/types/game-types';

export const useSpecialCards = (
  players: Player[],
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>,
  specialCards: SpecialCard[],
  setSpecialCards: React.Dispatch<React.SetStateAction<SpecialCard[]>>,
  specialCardRules: SpecialCardAwardRule[],
  setSpecialCardRules: React.Dispatch<React.SetStateAction<SpecialCardAwardRule[]>>,
  playSound: (sound: SoundEffect, volume?: number) => void
) => {
  // Dodaj nową kartę specjalną
  const addSpecialCard = (card: SpecialCard) => {
    // Ensure card has all required fields
    const validCard: SpecialCard = {
      id: card.id || crypto.randomUUID(),
      name: card.name,
      description: card.description || '',
      soundEffect: card.soundEffect || 'card-reveal',
      iconName: card.iconName || '',
      animationStyle: card.animationStyle || 'glow',
      type: card.type,
      defaultQuantity: card.defaultQuantity || 1,
      ...card
    };
    
    setSpecialCards(prevCards => [...prevCards, validCard]);
    return validCard;
  };

  // Aktualizuj istniejącą kartę specjalną
  const updateSpecialCard = (cardId: string, updates: Partial<SpecialCard>) => {
    setSpecialCards(prevCards =>
      prevCards.map(card => (card.id === cardId ? { ...card, ...updates } : card))
    );
    
    // Return the updated card for better UI feedback
    return specialCards.find(card => card.id === cardId);
  };

  // Usuń kartę specjalną
  const removeSpecialCard = (cardId: string) => {
    // Check if card exists before proceeding
    const cardExists = specialCards.some(c => c.id === cardId);
    if (!cardExists) {
      toast.error("Karta nie istnieje");
      return false;
    }
    
    setSpecialCards(prevCards => prevCards.filter(c => c.id !== cardId));
    
    // Usuń również wszystkie reguły związane z tą kartą
    setSpecialCardRules(prevRules =>
      prevRules.filter(rule => rule.cardId !== cardId)
    );
    
    // Usuń kartę od graczy, którzy ją posiadają
    setPlayers(prevPlayers =>
      prevPlayers.map(player => ({
        ...player,
        specialCards: player.specialCards?.filter(id => id !== cardId) || []
      }))
    );
    
    return true;
  };

  // Dodaj nową regułę przyznawania karty
  const addSpecialCardRule = (rule: SpecialCardAwardRule) => {
    // Ensure rule has all required fields
    const validRule: SpecialCardAwardRule = {
      id: rule.id || crypto.randomUUID(),
      name: rule.name || '',
      description: rule.description || '',
      applies_to: rule.applies_to || [],
      priority: rule.priority || 1,
      active: rule.active !== undefined ? rule.active : true,
      effect: rule.effect || '',
      cardId: rule.cardId,
      condition: rule.condition,
      probability: rule.probability || 100,
      roundApplicable: rule.roundApplicable || [],
      isEnabled: rule.isEnabled !== undefined ? rule.isEnabled : true,
      ...rule
    };
    
    setSpecialCardRules(prevRules => [...prevRules, validRule]);
    return validRule;
  };

  // Aktualizuj istniejącą regułę
  const updateSpecialCardRule = (ruleId: string, updates: Partial<SpecialCardAwardRule>) => {
    setSpecialCardRules(prevRules =>
      prevRules.map(rule => (rule.id === ruleId ? { ...rule, ...updates } : rule))
    );
    
    // Return the updated rule for better UI feedback
    return specialCardRules.find(rule => rule.id === ruleId);
  };

  // Usuń regułę przyznawania karty
  const removeSpecialCardRule = (ruleId: string) => {
    // Check if rule exists before proceeding
    const ruleExists = specialCardRules.some(r => r.id === ruleId);
    if (!ruleExists) {
      toast.error("Reguła nie istnieje");
      return false;
    }
    
    setSpecialCardRules(prevRules =>
      prevRules.filter(rule => rule.id !== ruleId)
    );
    
    return true;
  };

  // Przyznaj kartę graczowi
  const giveCardToPlayer = (playerId: string, cardId: string) => {
    // Znajdź gracza
    const playerIndex = players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) {
      toast.error("Gracz nie istnieje");
      return false;
    }

    // Sprawdź czy karta istnieje
    const card = specialCards.find(card => card.id === cardId);
    if (!card) {
      toast.error("Karta nie istnieje");
      return false;
    }

    // Dodaj kartę do gracza
    setPlayers(prevPlayers => {
      const updatedPlayers = [...prevPlayers];
      const player = { ...updatedPlayers[playerIndex] };
      
      // Inicjalizuj tablicę specialCards jeśli nie istnieje
      if (!player.specialCards) {
        player.specialCards = [];
      }
      
      // Dodaj kartę tylko jeśli gracz jej jeszcze nie ma
      if (!player.specialCards.includes(cardId)) {
        player.specialCards = [...player.specialCards, cardId];
        
        // Show feedback toast
        toast.success(`${player.name} otrzymuje kartę "${card.name}"!`);
      } else {
        toast.warning(`${player.name} już posiada kartę "${card.name}"`);
        return prevPlayers; // No change if player already has the card
      }
      
      updatedPlayers[playerIndex] = player;
      return updatedPlayers;
    });

    // Znajdź kartę aby odegrać dźwięk
    if (card.soundEffect) {
      playSound(card.soundEffect);
    } else {
      // Domyślny dźwięk jeśli karta nie ma własnego
      playSound('card-reveal');
    }
    
    return true;
  };

  // Użyj karty gracza
  const usePlayerCard = (playerId: string, cardId: string) => {
    // Znajdź gracza
    const playerIndex = players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) {
      toast.error("Gracz nie istnieje");
      return false;
    }

    // Sprawdź czy gracz ma tę kartę
    const player = players[playerIndex];
    if (!player.specialCards?.includes(cardId)) {
      toast.error(`${player.name} nie posiada tej karty`);
      return false;
    }
    
    // Find the card
    const card = specialCards.find(c => c.id === cardId);
    if (!card) {
      toast.error("Karta nie istnieje");
      return false;
    }

    // Usuń kartę od gracza (zużycie karty)
    setPlayers(prevPlayers => {
      const updatedPlayers = [...prevPlayers];
      const updatedPlayer = { ...updatedPlayers[playerIndex] };
      
      updatedPlayer.specialCards = updatedPlayer.specialCards?.filter(id => id !== cardId) || [];
      
      updatedPlayers[playerIndex] = updatedPlayer;
      
      // Show feedback toast
      toast.success(`${player.name} używa karty "${card.name}"!`);
      
      return updatedPlayers;
    });

    // Znajdź kartę aby odegrać dźwięk
    if (card.soundEffect) {
      playSound(card.soundEffect);
    } else {
      playSound('card-reveal');
    }

    // Return the card details for processing by the game logic
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
