
import { useState, useCallback } from 'react';
import { SpecialCard, Player, Question } from '@/types/game-types';
import { CardEffectType, CardEffect } from '@/types/card-types';
import { toast } from 'sonner';
import { useSubscription } from './useSubscription';

export interface CardEffectOptions {
  broadcast?: boolean;
  showToast?: boolean;
  playSound?: (sound: string) => void;
}

interface CardEffectPayload {
  type: string;
  effect: CardEffect;
  timestamp: number;
}

/**
 * Hook for managing special card effects during the game
 */
export function useSpecialCardEffects(options?: CardEffectOptions) {
  const [activeEffects, setActiveEffects] = useState<CardEffect[]>([]);
  const [effectHistory, setEffectHistory] = useState<CardEffect[]>([]);
  const [blockingEffects, setBlockingEffects] = useState<Record<string, CardEffect[]>>({});
  
  // Subscribe to card effect events from other components
  const { broadcast } = useSubscription('card_effects', 'apply_effect', 
    (payload: unknown) => {
      const cardPayload = payload as CardEffectPayload;
      if (cardPayload.effect) {
        addEffect(cardPayload.effect);
      }
    }, 
    { immediate: false }
  );
  
  // Add a new card effect
  const addEffect = useCallback((effect: CardEffect) => {
    setActiveEffects(prev => [...prev, effect]);
    
    // Add to history
    setEffectHistory(prev => [...prev, effect]);
    
    // Add to blocking effects if it's a blocking type
    if (['shield', 'counter', 'reflect'].includes(effect.type) && effect.sourcePlayerId) {
      setBlockingEffects(prev => ({
        ...prev,
        [effect.sourcePlayerId]: [
          ...(prev[effect.sourcePlayerId] || []),
          effect
        ]
      }));
    }
    
    // Broadcast to other components if enabled
    if (options?.broadcast) {
      broadcast({
        type: 'apply_effect',
        effect,
        timestamp: Date.now()
      });
    }
    
    // Show toast notification if enabled
    if (options?.showToast) {
      toast.success(`Karta ${getEffectName(effect.type)} aktywowana!`, {
        description: getEffectDescription(effect),
      });
    }
    
    // Play sound if enabled and available
    if (options?.playSound && effect.soundEffect) {
      options.playSound(effect.soundEffect);
    }
    
    // Return effect for chaining
    return effect;
  }, [options, broadcast]);
  
  // Remove an effect by its properties
  const removeEffect = useCallback((effectToRemove: CardEffect) => {
    setActiveEffects(prev => 
      prev.filter(effect => 
        !(effect.type === effectToRemove.type && 
          effect.sourcePlayerId === effectToRemove.sourcePlayerId &&
          effect.targetPlayerId === effectToRemove.targetPlayerId)
      )
    );
    
    // Also remove from blocking effects if necessary
    if (effectToRemove.sourcePlayerId) {
      setBlockingEffects(prev => {
        const playerEffects = prev[effectToRemove.sourcePlayerId];
        if (!playerEffects) return prev;
        
        return {
          ...prev,
          [effectToRemove.sourcePlayerId]: playerEffects.filter(effect => 
            !(effect.type === effectToRemove.type && 
              effect.targetPlayerId === effectToRemove.targetPlayerId)
          )
        };
      });
    }
  }, []);
  
  // Check if a player has a specific blocking effect
  const hasBlockingEffect = useCallback((playerId: string, effectType: CardEffectType) => {
    const playerEffects = blockingEffects[playerId] || [];
    return playerEffects.some(effect => effect.type === effectType);
  }, [blockingEffects]);
  
  // Use a blocking effect (e.g., shield to block a wrong answer)
  const useBlockingEffect = useCallback((
    playerId: string, 
    effectType: CardEffectType,
    targetPlayerId?: string
  ) => {
    const playerEffects = blockingEffects[playerId] || [];
    const effectToUse = playerEffects.find(effect => 
      effect.type === effectType && 
      (!targetPlayerId || effect.targetPlayerId === targetPlayerId)
    );
    
    if (effectToUse) {
      removeEffect(effectToUse);
      
      // Notify with toast
      if (options?.showToast) {
        toast.info(`Gracz użył karty ${getEffectName(effectType)}!`);
      }
      
      // Play sound if available
      if (options?.playSound && effectToUse.soundEffect) {
        options.playSound(effectToUse.soundEffect);
      }
      
      return true;
    }
    
    return false;
  }, [blockingEffects, removeEffect, options]);
  
  // Get all active effects for a player
  const getPlayerEffects = useCallback((playerId: string) => {
    return activeEffects.filter(effect => effect.sourcePlayerId === playerId);
  }, [activeEffects]);
  
  // Create a card effect from a special card
  const createCardEffect = useCallback((card: SpecialCard, sourcePlayer: Player, targetPlayer?: Player): CardEffect => {
    const baseEffect: CardEffect = {
      type: getEffectTypeFromCard(card),
      sourcePlayerId: sourcePlayer.id,
      targetPlayerId: targetPlayer?.id,
      soundEffect: card.soundEffect || 'card-reveal',
      animationDuration: 2000
    };
    
    // Add type-specific properties
    switch (baseEffect.type) {
      case 'bonus':
        return {
          ...baseEffect,
          points: 10 // Default bonus points
        };
      default:
        return baseEffect;
    }
  }, []);
  
  // Helper function to determine effect type from card
  const getEffectTypeFromCard = (card: SpecialCard): CardEffectType => {
    const name = card.name.toLowerCase();
    
    if (name.includes('shield')) return 'shield';
    if (name.includes('reflect')) return 'reflect';
    if (name.includes('counter')) return 'counter';
    if (name.includes('wildcard')) return 'wildcard';
    if (name.includes('bonus')) return 'bonus';
    if (name.includes('life')) return 'life';
    if (name.includes('skip')) return 'skip';
    
    return name as CardEffectType; // Fallback to name
  };
  
  // Helper function to get human-readable effect name
  const getEffectName = (type: CardEffectType): string => {
    switch (type) {
      case 'shield': return 'Tarcza';
      case 'reflect': return 'Odbicie';
      case 'counter': return 'Kontra';
      case 'wildcard': return 'Joker';
      case 'bonus': return 'Bonus';
      case 'life': return 'Życie';
      case 'skip': return 'Pominięcie';
      default: return type;
    }
  };
  
  // Helper function to get effect description
  const getEffectDescription = (effect: CardEffect): string => {
    switch (effect.type) {
      case 'shield':
        return 'Chroni przed jedną błędną odpowiedzią';
      case 'reflect':
        return effect.targetPlayerId 
          ? `Przekierowuje pytanie do innego gracza` 
          : 'Przekierowuje pytanie';
      case 'counter':
        return 'Zwraca negatywne efekty do nadawcy';
      case 'wildcard':
        return 'Pozwala na wybór dowolnej odpowiedzi';
      case 'bonus':
        return `Daje ${effect.points || 10} dodatkowych punktów`;
      case 'life':
        return 'Zapewnia dodatkowe życie';
      case 'skip':
        return 'Pozwala pominąć pytanie';
      default:
        return `Efekt karty ${effect.type}`;
    }
  };
  
  return {
    activeEffects,
    effectHistory,
    blockingEffects,
    addEffect,
    removeEffect,
    hasBlockingEffect,
    useBlockingEffect,
    getPlayerEffects,
    createCardEffect,
    getEffectName,
    getEffectDescription,
    getEffectTypeFromCard
  };
}
