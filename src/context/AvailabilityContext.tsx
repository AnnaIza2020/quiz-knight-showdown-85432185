import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { PlayerAvailabilitySlot, AvailabilityContextType } from '@/types/availability-types';

// Create context with a default value
const AvailabilityContext = createContext<AvailabilityContextType>({
  availability: [],
  isLoading: false,
  error: null,
  fetchAvailability: async () => [],
  updateAvailability: async () => false
});

export const useAvailabilityContext = () => useContext(AvailabilityContext);

interface AvailabilityProviderProps {
  children: ReactNode;
}

export const AvailabilityProvider: React.FC<AvailabilityProviderProps> = ({ children }) => {
  const [availability, setAvailability] = useState<PlayerAvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchAvailability = async (): Promise<PlayerAvailabilitySlot[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('player_availability').select('*');

      if (error) throw error;

      // Transform the data to match our interface
      const transformedData: PlayerAvailabilitySlot[] = data.map(item => ({
        id: item.id,
        playerId: item.player_id,
        date: item.date,
        timeSlots: item.time_slots as Record<string, boolean>,
        created_at: item.created_at,
        updated_at: item.updated_at,
        // Keep original fields for compatibility
        player_id: item.player_id,
        time_slots: item.time_slots
      }));

      setAvailability(transformedData);
      setIsLoading(false);
      return transformedData;
    } catch (err) {
      setError(err);
      setIsLoading(false);
      console.error('Error fetching availability:', err);
      return [];
    }
  };

  const updateAvailability = async (data: PlayerAvailabilitySlot): Promise<boolean> => {
    try {
      // Convert to database format
      const dbData = {
        player_id: data.playerId,
        date: data.date,
        time_slots: data.timeSlots as any
      };

      if (data.id) {
        const { error } = await supabase
          .from('player_availability')
          .update(dbData)
          .eq('id', data.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('player_availability')
          .insert([dbData]);

        if (error) throw error;
      }

      // Refresh data
      await fetchAvailability();
      return true;
    } catch (err) {
      setError(err);
      console.error('Error updating availability:', err);
      return false;
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchAvailability();
  }, []);

  return (
    <AvailabilityContext.Provider
      value={{
        availability,
        isLoading,
        error,
        fetchAvailability,
        updateAvailability
      }}
    >
      {children}
    </AvailabilityContext.Provider>
  );
};
