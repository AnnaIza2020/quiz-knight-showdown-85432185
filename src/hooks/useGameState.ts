
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
          .from('game_state')
          .select('*')
          .single();

        if (error) throw error;

        if (gameData) {
          setGameState(prevState => ({
            ...prevState,
            currentRound: mapDatabaseRoundToEnum(gameData.current_round) || GameRound.SETUP,
            activePlayerId: gameData.active_player_id || null,
            currentQuestion: gameData.current_question || null,
            timerRunning: gameData.timer_running || false,
            timerSeconds: gameData.timer_duration || 0,
            winnerIds: [], // We'll handle this differently
            isLoading: false
          }));
        }

        // Load players
        const { data: playersData, error: playersError } = await supabase
          .from('players')
          .select('*');

        if (playersError) throw playersError;

        if (playersData) {
          const mappedPlayers: Player[] = playersData.map(p => ({
            id: p.id,
            name: p.nickname,
            cameraUrl: p.camera_url || '',
            points: p.points || 0,
            health: p.life_percent || 100,
            lives: 3, // Default value
            isActive: p.is_active || false,
            isEliminated: p.status === 'eliminated',
            avatar: p.avatar_url,
            color: p.color,
            uniqueLinkToken: p.unique_link_token
          }));

          setGameState(prevState => ({
            ...prevState,
            players: mappedPlayers
          }));
        }

        // For now, let's mock categories
        // In the future, you should create a categories table in your database
        setGameState(prevState => ({
          ...prevState,
          categories: [],
          isLoading: false
        }));
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

  // Map database round number to GameRound enum
  const mapDatabaseRoundToEnum = (round?: number): GameRound => {
    if (!round) return GameRound.SETUP;
    
    switch (round) {
      case 1: return GameRound.ROUND_ONE;
      case 2: return GameRound.ROUND_TWO;
      case 3: return GameRound.ROUND_THREE;
      case 4: return GameRound.FINISHED;
      default: return GameRound.SETUP;
    }
  };

  // Map GameRound enum to database round number
  const mapEnumToRoundNumber = (round: GameRound): number => {
    switch (round) {
      case GameRound.SETUP: return 0;
      case GameRound.ROUND_ONE: return 1;
      case GameRound.ROUND_TWO: return 2;
      case GameRound.ROUND_THREE: return 3;
      case GameRound.FINISHED: return 4;
      default: return 0;
    }
  };

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
      if (update.currentRound !== undefined || 
          update.activePlayerId !== undefined || 
          update.timerRunning !== undefined ||
          update.timerSeconds !== undefined) {
        
        const dbUpdate: any = {};
        
        if (update.currentRound !== undefined) {
          dbUpdate.current_round = mapEnumToRoundNumber(update.currentRound);
        }
        
        if (update.activePlayerId !== undefined) {
          dbUpdate.active_player_id = update.activePlayerId;
        }
        
        if (update.timerRunning !== undefined) {
          dbUpdate.timer_running = update.timerRunning;
        }
        
        if (update.timerSeconds !== undefined) {
          dbUpdate.timer_duration = update.timerSeconds;
        }
        
        if (update.currentQuestion !== undefined) {
          dbUpdate.current_question = update.currentQuestion;
        }
        
        await supabase
          .from('game_state')
          .update(dbUpdate)
          .eq('id', gameId);
      }

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
