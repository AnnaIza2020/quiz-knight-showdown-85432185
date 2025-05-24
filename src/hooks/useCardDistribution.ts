
import { useState, useEffect } from 'react';
import { GameRound, Player, SpecialCard, SpecialCardAwardRule } from '@/types/game-types';
import { toast } from 'sonner';

interface CardDistributionHookProps {
  players: Player[];
  specialCards: SpecialCard[];
  specialCardRules: SpecialCardAwardRule[];
  round: GameRound;
  updatePlayer: (player: Player) => void;
  playSound: (sound: string, volume?: number) => void;
}

export function useCardDistribution({
  players,
  specialCards,
  specialCardRules,
  round,
  updatePlayer,
  playSound
}: CardDistributionHookProps) {
  const [usedCardIds, setUsedCardIds] = useState<string[]>([]);
  const [consecutiveCorrectAnswers, setConsecutiveCorrectAnswers] = useState<Record<string, number>>({});
  const [lastUpdateId, setLastUpdateId] = useState<string | null>(null);
  
  const MAX_CARDS_PER_PLAYER = 3;
  
  // Check for milestone-based card awards
  useEffect(() => {
    // Skip if no player update happened
    if (!lastUpdateId) return;
    
    // Find player who was updated
    const player = players.find(p => p.id === lastUpdateId);
    if (!player) return;
    
    // Check active rules
    const activeRules = specialCardRules.filter(rule => {
      // Only process enabled rules
      if (rule.isEnabled === false) return false;
      
      // Check if rule applies to current round
      if (rule.roundApplicable && rule.roundApplicable.length > 0 && !rule.roundApplicable.includes(round)) {
        return false;
      }
      
      return true;
    });
    
    // Process milestone rules
    activeRules.forEach(rule => {
      // Skip if player already has max cards
      if (player.specialCards && player.specialCards.length >= MAX_CARDS_PER_PLAYER) return;
      
      // Process based on rule condition
      switch (rule.condition) {
        case 'points_milestone':
          // Check if player has reached the points threshold
          if (player.points >= rule.threshold) {
            // Award card
            awardCard(player, rule);
          }
          break;
          
        case 'consecutive_correct':
          // Check consecutive correct answers
          if (consecutiveCorrectAnswers[player.id] >= rule.threshold) {
            // Award card and reset counter
            awardCard(player, rule);
            // Reset counter
            setConsecutiveCorrectAnswers(prev => ({
              ...prev,
              [player.id]: 0
            }));
          }
          break;
          
        case 'survive_round':
          // This is checked when advancing rounds
          break;
          
        case 'lowest_score':
          // Find player with lowest score
          const activePlayers = players.filter(p => !p.isEliminated);
          const lowestScorePlayer = activePlayers.reduce((lowest, current) => 
            current.points < lowest.points ? current : lowest, activePlayers[0]);
            
          if (lowestScorePlayer && lowestScorePlayer.id === player.id) {
            // Award card to lowest score player
            awardCard(player, rule);
          }
          break;
      }
    });
    
    // Reset last update ID
    setLastUpdateId(null);
    
  }, [lastUpdateId, players, specialCardRules]);
  
  // Register a correct answer
  const registerCorrectAnswer = (playerId: string) => {
    // Increment consecutive correct answers
    setConsecutiveCorrectAnswers(prev => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + 1
    }));
    
    // Set last update ID
    setLastUpdateId(playerId);
  };
  
  // Register an incorrect answer
  const registerIncorrectAnswer = (playerId: string) => {
    // Reset consecutive correct answers
    setConsecutiveCorrectAnswers(prev => ({
      ...prev,
      [playerId]: 0
    }));
  };
  
  // Register a round advancement
  const registerRoundAdvancement = (newRound: GameRound) => {
    // Process "survive_round" rules
    players.forEach(player => {
      // Skip eliminated players
      if (player.isEliminated) return;
      
      // Skip if player already has max cards
      if (player.specialCards && player.specialCards.length >= MAX_CARDS_PER_PLAYER) return;
      
      // Find applicable rules - properly handle GameRound enum
      const surviveRules = specialCardRules.filter(rule => {
        if (rule.condition !== 'survive_round') return false;
        if (rule.isEnabled === false) return false;
        
        // Check if rule applies to previous round
        if (rule.roundApplicable && rule.roundApplicable.length > 0) {
          // Get previous round value (newRound - 1 as GameRound)
          const prevRoundValue = Object.values(GameRound)[Object.values(GameRound).indexOf(newRound) - 1];
          return rule.roundApplicable.includes(prevRoundValue);
        }
        
        return true;
      });
      
      // Award card based on first matching rule
      if (surviveRules.length > 0) {
        awardCard(player, surviveRules[0]);
      }
    });
  };
  
  // Award a card based on a rule
  const awardCard = (player: Player, rule: SpecialCardAwardRule) => {
    // Get card from rule
    const card = specialCards.find(c => c.id === rule.cardId);
    if (!card) return;
    
    // Check probability
    if (rule.probability && rule.probability < 100) {
      const roll = Math.random() * 100;
      if (roll > rule.probability) {
        // Probability check failed
        return;
      }
    }
    
    // Check if card is already used
    if (usedCardIds.includes(card.id)) {
      // Card already used
      return;
    }
    
    // Award card to player
    const updatedPlayer = {
      ...player,
      specialCards: [...(player.specialCards || []), card.id]
    };
    
    // Update player
    updatePlayer(updatedPlayer);
    
    // Add card to used cards
    setUsedCardIds(prev => [...prev, card.id]);
    
    // Play sound
    playSound('card-reveal');
    
    // Show notification
    toast.success(`${player.name} otrzymuje kartę ${card.name}!`, {
      description: card.description
    });
  };
  
  // Reset card distribution state
  const resetCardDistribution = () => {
    setUsedCardIds([]);
    setConsecutiveCorrectAnswers({});
    setLastUpdateId(null);
  };
  
  return {
    registerCorrectAnswer,
    registerIncorrectAnswer,
    registerRoundAdvancement,
    resetCardDistribution,
    usedCardIds
  };
}
