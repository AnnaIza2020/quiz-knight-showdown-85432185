
import { useState } from 'react';
import { Player, Question } from '@/types/game-types';

interface GameAction {
  type: 'AWARD_POINTS' | 'DEDUCT_HEALTH' | 'DEDUCT_LIFE' | 'ELIMINATE_PLAYER' | 'SELECT_QUESTION' | 'ACTIVATE_CARD';
  timestamp: number;
  playerId?: string;
  points?: number;
  health?: number;
  question?: Question | null;
  cardId?: string;
  previousState?: any;
}

export function useUndoHistory({
  players,
  setPlayers,
  selectQuestion,
  playSound
}: {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  selectQuestion: (question: Question | null) => void;
  playSound: (sound: string, volume?: number) => void;
}) {
  const [actionHistory, setActionHistory] = useState<GameAction[]>([]);
  
  // Add action to history
  const addAction = (action: GameAction) => {
    setActionHistory(prevActions => [action, ...prevActions.slice(0, 19)]); // Keep last 20 actions
  };
  
  // Record point award
  const recordPointAward = (playerId: string, points: number) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    addAction({
      type: 'AWARD_POINTS',
      timestamp: Date.now(),
      playerId,
      points,
      previousState: { points: player.points }
    });
  };
  
  // Record health deduction
  const recordHealthDeduction = (playerId: string, healthPercentage: number) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    addAction({
      type: 'DEDUCT_HEALTH',
      timestamp: Date.now(),
      playerId,
      health: healthPercentage,
      previousState: { health: player.health }
    });
  };
  
  // Record life deduction
  const recordLifeDeduction = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    addAction({
      type: 'DEDUCT_LIFE',
      timestamp: Date.now(),
      playerId,
      previousState: { lives: player.lives }
    });
  };
  
  // Record player elimination
  const recordPlayerElimination = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    addAction({
      type: 'ELIMINATE_PLAYER',
      timestamp: Date.now(),
      playerId,
      previousState: { isEliminated: player.isEliminated }
    });
  };
  
  // Record question selection
  const recordQuestionSelection = (question: Question | null) => {
    addAction({
      type: 'SELECT_QUESTION',
      timestamp: Date.now(),
      question
    });
  };
  
  // Record card activation
  const recordCardActivation = (playerId: string, cardId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    addAction({
      type: 'ACTIVATE_CARD',
      timestamp: Date.now(),
      playerId,
      cardId,
      previousState: { specialCards: [...(player.specialCards || [])] }
    });
  };
  
  // Undo last action
  const undoLastAction = () => {
    if (actionHistory.length === 0) return false;
    
    const lastAction = actionHistory[0];
    
    switch (lastAction.type) {
      case 'AWARD_POINTS':
        if (lastAction.playerId && lastAction.previousState) {
          // Find player
          const playerIndex = players.findIndex(p => p.id === lastAction.playerId);
          if (playerIndex === -1) return false;
          
          // Restore previous state
          const updatedPlayers = [...players];
          updatedPlayers[playerIndex] = {
            ...updatedPlayers[playerIndex],
            points: lastAction.previousState.points
          };
          
          // Update players
          setPlayers(updatedPlayers);
          playSound('click');
        }
        break;
        
      case 'DEDUCT_HEALTH':
        if (lastAction.playerId && lastAction.previousState) {
          // Find player
          const playerIndex = players.findIndex(p => p.id === lastAction.playerId);
          if (playerIndex === -1) return false;
          
          // Restore previous state
          const updatedPlayers = [...players];
          updatedPlayers[playerIndex] = {
            ...updatedPlayers[playerIndex],
            health: lastAction.previousState.health
          };
          
          // Update players
          setPlayers(updatedPlayers);
          playSound('click');
        }
        break;
        
      case 'DEDUCT_LIFE':
        if (lastAction.playerId && lastAction.previousState) {
          // Find player
          const playerIndex = players.findIndex(p => p.id === lastAction.playerId);
          if (playerIndex === -1) return false;
          
          // Restore previous state
          const updatedPlayers = [...players];
          updatedPlayers[playerIndex] = {
            ...updatedPlayers[playerIndex],
            lives: lastAction.previousState.lives
          };
          
          // Update players
          setPlayers(updatedPlayers);
          playSound('click');
        }
        break;
        
      case 'ELIMINATE_PLAYER':
        if (lastAction.playerId && lastAction.previousState) {
          // Find player
          const playerIndex = players.findIndex(p => p.id === lastAction.playerId);
          if (playerIndex === -1) return false;
          
          // Restore previous state
          const updatedPlayers = [...players];
          updatedPlayers[playerIndex] = {
            ...updatedPlayers[playerIndex],
            isEliminated: lastAction.previousState.isEliminated
          };
          
          // Update players
          setPlayers(updatedPlayers);
          playSound('click');
        }
        break;
        
      case 'SELECT_QUESTION':
        // Restore previous question
        selectQuestion(null);
        playSound('click');
        break;
        
      case 'ACTIVATE_CARD':
        if (lastAction.playerId && lastAction.cardId && lastAction.previousState) {
          // Find player
          const playerIndex = players.findIndex(p => p.id === lastAction.playerId);
          if (playerIndex === -1) return false;
          
          // Restore previous cards
          const updatedPlayers = [...players];
          updatedPlayers[playerIndex] = {
            ...updatedPlayers[playerIndex],
            specialCards: lastAction.previousState.specialCards
          };
          
          // Update players
          setPlayers(updatedPlayers);
          playSound('click');
        }
        break;
    }
    
    // Remove action from history
    setActionHistory(prev => prev.slice(1));
    
    return true;
  };
  
  return {
    recordPointAward,
    recordHealthDeduction,
    recordLifeDeduction,
    recordPlayerElimination,
    recordQuestionSelection,
    recordCardActivation,
    undoLastAction,
    hasUndoHistory: actionHistory.length > 0
  };
}
