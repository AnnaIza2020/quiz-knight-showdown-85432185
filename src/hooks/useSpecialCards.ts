
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
    setSpecialCards(prevCards => [...prevCards, card]);
  };

  // Aktualizuj istniejącą kartę specjalną
  const updateSpecialCard = (cardId: string, updates: Partial<SpecialCard>) => {
    setSpecialCards(prevCards =>
      prevCards.map(card => (card.id === cardId ? { ...card, ...updates } : card))
    );
  };

  // Usuń kartę specjalną
  const removeSpecialCard = (cardId: string) => {
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
  };

  // Dodaj nową regułę przyznawania karty
  const addSpecialCardRule = (rule: SpecialCardAwardRule) => {
    setSpecialCardRules(prevRules => [...prevRules, rule]);
  };

  // Aktualizuj istniejącą regułę
  const updateSpecialCardRule = (ruleId: string, updates: Partial<SpecialCardAwardRule>) => {
    setSpecialCardRules(prevRules =>
      prevRules.map(rule => (rule.id === ruleId ? { ...rule, ...updates } : rule))
    );
  };

  // Usuń regułę przyznawania karty
  const removeSpecialCardRule = (ruleId: string) => {
    setSpecialCardRules(prevRules =>
      prevRules.filter(rule => rule.id !== ruleId)
    );
  };

  // Przyznaj kartę graczowi
  const giveCardToPlayer = (playerId: string, cardId: string) => {
    // Znajdź gracza
    const playerIndex = players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return;

    // Sprawdź czy karta istnieje
    const cardExists = specialCards.some(card => card.id === cardId);
    if (!cardExists) return;

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
      }
      
      updatedPlayers[playerIndex] = player;
      return updatedPlayers;
    });

    // Znajdź kartę aby odegrać dźwięk
    const card = specialCards.find(c => c.id === cardId);
    if (card?.soundEffect) {
      playSound(card.soundEffect);
    } else {
      // Domyślny dźwięk jeśli karta nie ma własnego
      playSound('card-reveal');
    }
  };

  // Użyj karty gracza
  const usePlayerCard = (playerId: string, cardId: string) => {
    // Znajdź gracza
    const playerIndex = players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return;

    // Sprawdź czy gracz ma tę kartę
    const player = players[playerIndex];
    if (!player.specialCards?.includes(cardId)) return;

    // Usuń kartę od gracza (zużycie karty)
    setPlayers(prevPlayers => {
      const updatedPlayers = [...prevPlayers];
      const updatedPlayer = { ...updatedPlayers[playerIndex] };
      
      updatedPlayer.specialCards = updatedPlayer.specialCards?.filter(id => id !== cardId) || [];
      
      updatedPlayers[playerIndex] = updatedPlayer;
      return updatedPlayers;
    });

    // Znajdź kartę aby odegrać dźwięk
    const card = specialCards.find(c => c.id === cardId);
    if (card?.soundEffect) {
      playSound(card.soundEffect);
    }

    // Tu można dodać efekty specjalne karty, np. dodanie punktów, życia itp.
    // Zależy od implementacji konkretnej karty
  };

  return {
    addSpecialCard,
    updateSpecialCard,
    removeSpecialCard,
    addSpecialCardRule,
    updateSpecialCardRule,
    removeSpecialCardRule,
    giveCardToPlayer,
    usePlayerCard,
  };
};
