
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Player } from '@/types/game-types';
import { toast } from 'sonner';

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
      // Since we can't directly insert into game_winners, we'll create a custom endpoint or function
      // For now, we'll use localStorage as a fallback
      const winner = {
        player_name: player.name,
        player_id: player.id,
        round: round,
        score: player.points,
        created_at: new Date().toISOString(),
        id: crypto.randomUUID()
      };
      
      // Try to store in localStorage
      try {
        const existingWinners = JSON.parse(localStorage.getItem('gameWinners') || '[]');
        existingWinners.push(winner);
        localStorage.setItem('gameWinners', JSON.stringify(existingWinners));
      } catch (err) {
        console.error('Error storing winner in localStorage:', err);
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
      // For now, we'll use localStorage as a fallback
      const localWinners = JSON.parse(localStorage.getItem('gameWinners') || '[]');
      return localWinners.slice(0, limit);
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
