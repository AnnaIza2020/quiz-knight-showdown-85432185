
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PlayerAvailabilitySlot, AvailabilityStatus } from '@/types/availability-types';

export const useAvailability = () => {
  const [availability, setAvailability] = useState<PlayerAvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('player_availability')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Transform data to match our type
        const transformedData: PlayerAvailabilitySlot[] = data.map(item => ({
          id: item.id,
          playerId: item.player_id,
          date: item.date,
          timeSlots: item.time_slots as Record<string, AvailabilityStatus>
        }));
        
        setAvailability(transformedData);
      }
    } catch (err) {
      console.error('Error fetching availability:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const updateAvailability = async (data: PlayerAvailabilitySlot) => {
    try {
      const { error } = await supabase
        .from('player_availability')
        .upsert({
          id: data.id,
          player_id: data.playerId,
          date: data.date,
          time_slots: data.timeSlots
        });
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setAvailability(prev => {
        const existingIndex = prev.findIndex(item => item.id === data.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = data;
          return updated;
        } else {
          return [...prev, data];
        }
      });
      
      return { success: true };
    } catch (err) {
      console.error('Error updating availability:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return { success: false };
    }
  };

  const deleteAvailability = async (id: string) => {
    try {
      const { error } = await supabase
        .from('player_availability')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setAvailability(prev => prev.filter(item => item.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting availability:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return { success: false };
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  return {
    availability,
    loading,
    error,
    fetchAvailability,
    updateAvailability,
    deleteAvailability
  };
};
