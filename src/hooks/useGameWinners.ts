
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Player } from '@/types/game-types';
import { toast } from 'sonner';

interface GameWinner {
  id: string;
  player_name: string;
  player_id: string;
  round: number;
  score: number;
  created_at: string;
}

export const useGameWinners = () => {
  const [loading, setLoading] = useState(false);
  
  // Record a new winner
  const recordWinner = async (player: Player, round: number): Promise<boolean> => {
    if (!player) return false;
    
    setLoading(true);
    try {
      // Record the winner in the database
      const { error } = await supabase
        .from('game_winners')
        .insert({
          player_name: player.name,
          player_id: player.id,
          round: round,
          score: player.points
        });
      
      if (error) {
        console.error('Error recording winner:', error);
        toast.error('Nie udało się zapisać zwycięzcy');
        return false;
      }
      
      toast.success(`${player.name} został zapisany jako zwycięzca!`);
      return true;
    } catch (err) {
      console.error('Unexpected error recording winner:', err);
      toast.error('Wystąpił błąd podczas zapisywania zwycięzcy');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Get recent winners
  const getRecentWinners = async (limit = 5): Promise<GameWinner[]> => {
    try {
      const { data, error } = await supabase
        .from('game_winners')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching winners:', error);
        return [];
      }
      
      return data || [];
    } catch (err) {
      console.error('Unexpected error fetching winners:', err);
      return [];
    }
  };
  
  return {
    recordWinner,
    getRecentWinners,
    loading
  };
};
