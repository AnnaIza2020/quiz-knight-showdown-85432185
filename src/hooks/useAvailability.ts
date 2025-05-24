
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PlayerAvailabilitySlot, AvailabilityStatus } from '@/types/availability-types';

export const useAvailability = () => {
  const [availability, setAvailability] = useState<PlayerAvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use RPC call to get availability data
      const { data, error } = await supabase.rpc('load_game_data', { 
        key: 'player_availability_data' 
      });
      
      if (error) {
        throw error;
      }
      
      if (data && Array.isArray(data)) {
        // Transform data to match our type
        const transformedData: PlayerAvailabilitySlot[] = data.map((item: any) => ({
          id: item.id,
          playerId: item.player_id || item.playerId,
          date: item.date,
          timeSlots: item.time_slots || item.timeSlots || {}
        }));
        
        setAvailability(transformedData);
      } else {
        setAvailability([]);
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
      // Get current availability data
      const { data: currentData } = await supabase.rpc('load_game_data', { 
        key: 'player_availability_data' 
      });
      
      let availabilityList = Array.isArray(currentData) ? currentData : [];
      
      // Update or add the availability record
      const existingIndex = availabilityList.findIndex((item: any) => item.id === data.id);
      if (existingIndex >= 0) {
        availabilityList[existingIndex] = {
          id: data.id,
          player_id: data.playerId,
          date: data.date,
          time_slots: data.timeSlots
        };
      } else {
        availabilityList.push({
          id: data.id || crypto.randomUUID(),
          player_id: data.playerId,
          date: data.date,
          time_slots: data.timeSlots
        });
      }
      
      // Save updated data
      const { error } = await supabase.rpc('save_game_data', {
        key: 'player_availability_data',
        value: availabilityList
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
      // Get current availability data
      const { data: currentData } = await supabase.rpc('load_game_data', { 
        key: 'player_availability_data' 
      });
      
      let availabilityList = Array.isArray(currentData) ? currentData : [];
      availabilityList = availabilityList.filter((item: any) => item.id !== id);
      
      // Save updated data
      const { error } = await supabase.rpc('save_game_data', {
        key: 'player_availability_data',
        value: availabilityList
      });
      
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
