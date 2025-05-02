
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Player, GameRound, Category, Question } from '@/types/game-types';
import { useSubscription } from './useSubscription';
import { toast } from 'sonner';

export interface GameState {
  players: Player[];
  currentRound: GameRound;
  currentQuestion: Question | null;
  activePlayerId: string | null;
  categories: Category[];
  timerRunning: boolean;
  timerSeconds: number;
  winnerIds: string[];
  isLoading: boolean;
  error: Error | null;
}

export const useGameState = (gameId: string) => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentRound: GameRound.SETUP,
    currentQuestion: null,
    activePlayerId: null,
    categories: [],
    timerRunning: false,
    timerSeconds: 0,
    winnerIds: [],
    isLoading: true,
    error: null
  });

  // Load initial game state
  useEffect(() => {
    const loadGameState = async () => {
      try {
        const { data: gameData, error } = await supabase
          .from('games')
          .select('*')
          .eq('id', gameId)
          .single();

        if (error) throw error;

        if (gameData) {
          setGameState(prevState => ({
            ...prevState,
            currentRound: gameData.round || GameRound.SETUP,
            activePlayerId: gameData.activePlayerId || null,
            winnerIds: gameData.winnerIds || [],
            isLoading: false
          }));
        }

        // Load players
        const { data: playersData, error: playersError } = await supabase
          .from('players')
          .select('*')
          .eq('gameId', gameId);

        if (playersError) throw playersError;

        if (playersData) {
          setGameState(prevState => ({
            ...prevState,
            players: playersData as Player[]
          }));
        }

        // Load categories and questions
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*, questions(*)')
          .eq('gameId', gameId);

        if (categoriesError) throw categoriesError;

        if (categoriesData) {
          setGameState(prevState => ({
            ...prevState,
            categories: categoriesData as Category[],
            isLoading: false
          }));
        }
      } catch (err) {
        console.error('Error loading game state:', err);
        setGameState(prevState => ({
          ...prevState,
          error: err instanceof Error ? err : new Error(String(err)),
          isLoading: false
        }));
      }
    };

    loadGameState();
  }, [gameId]);

  // Subscribe to game state updates with enhanced options
  const { broadcast } = useSubscription<Partial<GameState>>(
    `game:${gameId}`,
    'game_state_update',
    (updatedState) => {
      setGameState(prevState => ({
        ...prevState,
        ...updatedState
      }));
      
      // Show toast notifications for important updates
      if (updatedState.currentRound !== undefined && 
          updatedState.currentRound !== gameState.currentRound) {
        toast.info(`Runda zmieniona na: ${updatedState.currentRound}`);
      }
      
      if (updatedState.activePlayerId !== undefined && 
          updatedState.activePlayerId !== gameState.activePlayerId) {
        const player = gameState.players.find(p => p.id === updatedState.activePlayerId);
        if (player) {
          toast.info(`Aktywny gracz: ${player.name}`);
        }
      }
      
      if (updatedState.currentQuestion !== null && 
          updatedState.currentQuestion !== gameState.currentQuestion) {
        toast.info('Nowe pytanie');
      }
    },
    {
      reconnect: true,
      retryInterval: 3000
    }
  );

  // Update game state function
  const updateGameState = async (update: Partial<GameState>) => {
    try {
      setGameState(prevState => ({
        ...prevState,
        ...update
      }));

      // Save changes to the database
      await supabase
        .from('games')
        .update({
          round: update.currentRound || gameState.currentRound,
          activePlayerId: update.activePlayerId || gameState.activePlayerId,
          winnerIds: update.winnerIds || gameState.winnerIds,
          updatedAt: new Date().toISOString()
        })
        .eq('id', gameId);

      // Broadcast update to other clients
      await broadcast(update);
      
      // Broadcast game events for overlay and other listeners
      if (update.activePlayerId && update.activePlayerId !== gameState.activePlayerId) {
        await supabase
          .channel('game_events')
          .send({
            type: 'broadcast',
            event: 'new_event',
            payload: {
              type: 'player_active',
              playerId: update.activePlayerId,
              event: `Gracz aktywny: ${gameState.players.find(p => p.id === update.activePlayerId)?.name || 'Nieznany'}`
            }
          });
      }

      return true;
    } catch (err) {
      console.error('Error updating game state:', err);
      setGameState(prevState => ({
        ...prevState,
        error: err instanceof Error ? err : new Error(String(err))
      }));
      return false;
    }
  };

  return {
    ...gameState,
    updateGameState
  };
};
