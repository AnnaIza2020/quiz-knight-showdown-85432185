import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PlayerAvailabilitySlot, AvailabilityStatus } from '@/types/availability-types';
import { toast } from 'sonner';

export function useAvailability() {
  const [playerAvailability, setPlayerAvailability] = useState<PlayerAvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAvailability = async (): Promise<PlayerAvailabilitySlot[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First check if the table exists
      const { exists, error: checkError } = await checkTableExists('player_availability');
      
      if (checkError) throw new Error(checkError);
      
      if (!exists) {
        // Table doesn't exist yet, return empty data
        console.log('player_availability table does not exist yet');
        return [];
      }
      
      // Using any type temporarily to bypass type checking for dynamic table
      // This is necessary until we update the Supabase generated types
      const { data, error } = await (supabase
        .from('player_availability' as any)
        .select('*'));
      
      if (error) throw error;
      
      // Transform data to the expected format
      const formattedData: PlayerAvailabilitySlot[] = (data || []).map(item => ({
        id: item.id,
        playerId: item.player_id,
        date: item.date,
        timeSlots: item.time_slots || {},
        player_id: item.player_id,
        time_slots: item.time_slots
      }));
      
      setPlayerAvailability(formattedData);
      return formattedData;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Błąd podczas pobierania dostępności graczy');
      console.error('Error fetching availability:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const updateAvailability = async (playerId: string, slot: PlayerAvailabilitySlot): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First check if the table exists, create if not
      const { exists, error: checkError } = await checkTableExists('player_availability');
      
      if (checkError) throw new Error(checkError);
      
      if (!exists) {
        // Table doesn't exist, we should create it first
        console.log('player_availability table does not exist yet');
        // Return false as we can't update a non-existent table
        return false;
      }
      
      // Using any type temporarily to bypass type checking for dynamic table
      const { error } = await (supabase
        .from('player_availability' as any)
        .upsert({
          player_id: playerId,
          date: slot.date,
          time_slots: slot.timeSlots
        }));
      
      if (error) throw error;
      
      // Update local state
      setPlayerAvailability(prev => {
        const playerIndex = prev.findIndex(p => p.playerId === playerId);
        
        if (playerIndex >= 0) {
          const updatedSlots = [...prev[playerIndex].slots];
          const slotIndex = updatedSlots.findIndex(s => s.date === slot.date);
          
          if (slotIndex >= 0) {
            updatedSlots[slotIndex] = slot;
          } else {
            updatedSlots.push(slot);
          }
          
          const updatedAvailability = [...prev];
          updatedAvailability[playerIndex] = {
            ...prev[playerIndex],
            slots: updatedSlots
          };
          
          return updatedAvailability;
        }
        
        // If player doesn't exist, add new entry
        return [...prev, {
          playerId,
          slots: [slot]
        }];
      });
      
      toast.success('Dostępność zaktualizowana');
      return true;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Błąd podczas aktualizacji dostępności');
      console.error('Error updating availability:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to transform raw DB data to our format
  const transformAvailabilityData = (data: any[]): PlayerAvailabilitySlot[] => {
    return data.map(item => ({
      id: item.id,
      playerId: item.player_id,
      date: item.date,
      timeSlots: item.time_slots || {},
      player_id: item.player_id,
      time_slots: item.time_slots
    }));
  };

  // Helper function to check if a table exists
  const checkTableExists = async (tableName: string) => {
    try {
      // Try to get a single row from the table
      await supabase
        .from(tableName as any)
        .select('*', { count: 'exact', head: true });
        
      // If we get here without error, the table exists
      return { exists: true, error: null };
    } catch (err: any) {
      // If the error is about the table not existing
      if (err.message && err.message.includes('relation') && err.message.includes('does not exist')) {
        return { exists: false, error: null };
      }
      return { exists: false, error: 'Unknown error checking table' };
    }
  };

  return {
    playerAvailability,
    isLoading,
    error,
    fetchAvailability,
    updateAvailability
  };
}
