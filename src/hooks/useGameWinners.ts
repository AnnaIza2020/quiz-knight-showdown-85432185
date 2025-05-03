
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Player } from '@/types/game-types';
import { toast } from 'sonner';
import { ExtendedDatabase } from '@/types/supabase-custom-types';

export interface GameWinner {
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
      // Create winner record
      const winner: Omit<GameWinner, 'id'> = {
        player_name: player.name,
        player_id: player.id,
        round: round,
        score: player.points,
        created_at: new Date().toISOString()
      };

      // Try to insert into Supabase
      const { error } = await supabase
        .from('game_winners')
        .insert(winner);

      if (error) {
        console.error('Error storing winner in Supabase:', error);
        
        // Fallback to localStorage
        try {
          const existingWinners = JSON.parse(localStorage.getItem('gameWinners') || '[]');
          const localWinner = {
            ...winner,
            id: crypto.randomUUID()
          };
          existingWinners.push(localWinner);
          localStorage.setItem('gameWinners', JSON.stringify(existingWinners));
        } catch (err) {
          console.error('Error storing winner in localStorage:', err);
        }
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
      // Try to get from Supabase first
      // Use the "any" type temporarily to work around the type issue
      // until the database schema is properly synchronized
      const { data, error } = await (supabase as any)
        .from('game_winners')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching winners from Supabase:', error);
        // Fallback to localStorage
        const localWinners = JSON.parse(localStorage.getItem('gameWinners') || '[]');
        return localWinners.slice(0, limit);
      }
      
      return data as GameWinner[] || [];
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
