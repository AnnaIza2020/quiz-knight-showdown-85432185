
import React, { createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { PlayerAvailabilitySlot, AvailabilityStatus, AvailabilityContextType } from '@/types/availability-types';

const AvailabilityContext = createContext<AvailabilityContextType | undefined>(undefined);

export const useAvailabilityContext = () => {
  const context = useContext(AvailabilityContext);
  if (!context) {
    throw new Error('useAvailabilityContext must be used within an AvailabilityProvider');
  }
  return context;
};

interface AvailabilityProviderProps {
  children: ReactNode;
}

export const AvailabilityProvider: React.FC<AvailabilityProviderProps> = ({ children }) => {
  const fetchAvailability = async (): Promise<PlayerAvailabilitySlot[]> => {
    try {
      const { data, error } = await supabase
        .from('player_availability')
        .select('*');

      if (error) throw error;

      const transformedData: PlayerAvailabilitySlot[] = data.map(item => ({
        id: item.id,
        playerId: item.player_id,
        date: item.date,
        startTime: '09:00',
        endTime: '21:00',
        available: true,
        timeSlots: item.time_slots as Record<string, AvailabilityStatus> || {},
        notes: ''
      }));

      return transformedData;
    } catch (error) {
      console.error('Error fetching availability:', error);
      return [];
    }
  };

  const convertTimeSlots = (slots: any): Record<string, AvailabilityStatus> => {
    if (!slots) return {};
    
    const result: Record<string, AvailabilityStatus> = {};
    
    Object.entries(slots).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        result[key] = value ? AvailabilityStatus.AVAILABLE : AvailabilityStatus.UNAVAILABLE;
      } else if (typeof value === 'string' && Object.values(AvailabilityStatus).includes(value as AvailabilityStatus)) {
        result[key] = value as AvailabilityStatus;
      } else {
        result[key] = AvailabilityStatus.UNKNOWN;
      }
    });
    
    return result;
  };

  const getPlayerAvailability = async (playerId: string): Promise<PlayerAvailabilitySlot[]> => {
    try {
      const { data, error } = await supabase
        .from('player_availability')
        .select('*')
        .eq('player_id', playerId)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching player availability:', error);
        return [];
      }

      return data.map(item => ({
        id: item.id,
        playerId: item.player_id,
        date: item.date,
        startTime: '09:00',
        endTime: '21:00',
        available: true,
        timeSlots: convertTimeSlots(item.time_slots),
        notes: ''
      }));
    } catch (error) {
      console.error('Unexpected error fetching player availability:', error);
      return [];
    }
  };

  const updateAvailability = async (data: PlayerAvailabilitySlot): Promise<{success: boolean}> => {
    try {
      const { error } = await supabase
        .from('player_availability')
        .upsert({
          player_id: data.playerId,
          date: data.date,
          time_slots: data.timeSlots,
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error updating availability:', error);
      return { success: false };
    }
  };

  const saveAvailabilityBatch = async (dataArray: PlayerAvailabilitySlot[]): Promise<{success: boolean}> => {
    try {
      const dbRecords = dataArray.map(data => ({
        player_id: data.playerId,
        date: data.date,
        time_slots: data.timeSlots
      }));

      const { error } = await supabase
        .from('player_availability')
        .insert(dbRecords);

      if (error) {
        console.error('Error saving batch availability:', error);
        return { success: false };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Unexpected error saving batch availability:', error);
      return { success: false };
    }
  };

  const deleteAvailability = async (id: string): Promise<{success: boolean}> => {
    try {
      const { error } = await supabase
        .from('player_availability')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting availability:', error);
        return { success: false };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Unexpected error deleting availability:', error);
      return { success: false };
    }
  };

  const value: AvailabilityContextType = {
    availabilityData: [],
    fetchAvailability,
    updateAvailability,
    saveAvailabilityBatch,
    getPlayerAvailability,
    deleteAvailability
  };

  return (
    <AvailabilityContext.Provider value={value}>
      {children}
    </AvailabilityContext.Provider>
  );
};
