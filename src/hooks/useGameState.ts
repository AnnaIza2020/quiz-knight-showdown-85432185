
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { GameRound, Player, Question } from '@/types/game-types';

interface GameState {
  currentRound: GameRound;
  activePlayerId: string | null;
  currentQuestion: Question | null;
  timerRunning: boolean;
  timerSeconds: number;
  players: Player[];
  winnerIds: string[];
  error: Error | null;
}

export const useGameState = () => {
  // Initial game state
  const initialState: GameState = {
    currentRound: GameRound.SETUP,
    activePlayerId: null,
    currentQuestion: null,
    timerRunning: false,
    timerSeconds: 0,
    players: [],
    winnerIds: [],
    error: null,
  };

  // State for the game
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load game state from localStorage
  const loadGameState = useCallback(() => {
    try {
      const savedState = localStorage.getItem('gameState');
      if (savedState) {
        // Parse the saved state and cast it properly
        const parsedState = JSON.parse(savedState) as GameState;
        
        // Make sure we have a valid state structure
        if (parsedState && typeof parsedState === 'object') {
          setGameState(prevState => ({
            ...prevState,
            ...parsedState,
            // Ensure required properties exist
            currentRound: parsedState.currentRound || GameRound.SETUP,
            activePlayerId: parsedState.activePlayerId || null,
            currentQuestion: parsedState.currentQuestion || null,
            timerRunning: parsedState.timerRunning || false,
            timerSeconds: parsedState.timerSeconds || 0,
            players: parsedState.players || [],
            winnerIds: parsedState.winnerIds || [],
            error: null,
          }));
        }
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading game state:', error);
      setGameState(prevState => ({
        ...prevState,
        error: error instanceof Error ? error : new Error('Failed to load game state'),
      }));
      setIsLoaded(true);
    }
  }, []);
  
  // Save game state to localStorage
  const saveGameState = useCallback(() => {
    try {
      localStorage.setItem('gameState', JSON.stringify(gameState));
    } catch (error) {
      console.error('Error saving game state:', error);
      toast.error('Failed to save game state');
    }
  }, [gameState]);
  
  // Save state when it changes
  useEffect(() => {
    if (isLoaded) {
      saveGameState();
    }
  }, [gameState, isLoaded, saveGameState]);
  
  // Load state on initial render
  useEffect(() => {
    loadGameState();
  }, [loadGameState]);
  
  return {
    gameState,
    setGameState,
    isLoaded,
    loadGameState,
    saveGameState,
    resetGameState: () => setGameState(initialState),
  };
};

export default useGameState;
