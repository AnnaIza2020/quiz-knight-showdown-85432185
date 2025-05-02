
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Player, GameRound, Category, Question } from '@/types/game-types';
import { useSubscription } from './useSubscription';

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

  // Załaduj początkowy stan gry
  useEffect(() => {
    const loadGameState = async () => {
      try {
        // Przykład - w rzeczywistości pobieraj dane z Supabase
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

        // Pobierz graczy
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

        // Pobierz kategorie i pytania
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
        console.error('Błąd podczas ładowania stanu gry:', err);
        setGameState(prevState => ({
          ...prevState,
          error: err instanceof Error ? err : new Error(String(err)),
          isLoading: false
        }));
      }
    };

    loadGameState();
  }, [gameId]);

  // Subskrybuj zmiany w stanie gry
  useSubscription<Partial<GameState>>(
    `game:${gameId}`,
    'game_state_update',
    (updatedState) => {
      setGameState(prevState => ({
        ...prevState,
        ...updatedState
      }));
    }
  );

  // Funkcje do aktualizacji stanu gry
  const updateGameState = async (update: Partial<GameState>) => {
    try {
      setGameState(prevState => ({
        ...prevState,
        ...update
      }));

      // Zapisz zmiany w bazie danych
      await supabase
        .from('games')
        .update({
          round: update.currentRound || gameState.currentRound,
          activePlayerId: update.activePlayerId || gameState.activePlayerId,
          winnerIds: update.winnerIds || gameState.winnerIds,
          updatedAt: new Date().toISOString()
        })
        .eq('id', gameId);

      // Nadaj aktualizację do innych klientów
      await supabase
        .channel(`game:${gameId}`)
        .send({
          type: 'broadcast',
          event: 'game_state_update',
          payload: update
        });

      return true;
    } catch (err) {
      console.error('Błąd podczas aktualizacji stanu gry:', err);
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
