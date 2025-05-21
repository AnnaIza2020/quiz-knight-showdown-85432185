import React, { createContext, useContext, useState, ReactNode } from 'react';
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
  // Fetch all availability data
  const fetchAvailability = async (): Promise<PlayerAvailabilitySlot[]> => {
    try {
      const { data, error } = await supabase
        .from('player_availability')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching availability data:', error);
        return [];
      }

      // Convert database format to our expected format
      return data.map(item => ({
        id: item.id,
        playerId: item.player_id,
        date: item.date,
        timeSlots: convertTimeSlots(item.time_slots),
        // Keep original fields for backwards compatibility
        player_id: item.player_id,
        time_slots: item.time_slots,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
    } catch (error) {
      console.error('Unexpected error fetching availability:', error);
      return [];
    }
  };

  // Convert between different timeSlot formats
  const convertTimeSlots = (slots: any): Record<string, AvailabilityStatus> => {
    if (!slots) return {};
    
    const result: Record<string, AvailabilityStatus> = {};
    
    // Convert boolean values to AvailabilityStatus enum
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

  // Get availability for a specific player
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
        timeSlots: convertTimeSlots(item.time_slots),
        // Keep original fields for backwards compatibility
        player_id: item.player_id,
        time_slots: item.time_slots,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
    } catch (error) {
      console.error('Unexpected error fetching player availability:', error);
      return [];
    }
  };

  // Update player availability
  const updateAvailability = async (data: PlayerAvailabilitySlot): Promise<{success: boolean}> => {
    try {
      // Convert our format to database format
      const dbRecord = {
        player_id: data.playerId,
        date: data.date,
        time_slots: data.timeSlots
      };

      // Check if record exists
      if (data.id) {
        const { error } = await supabase
          .from('player_availability')
          .update(dbRecord)
          .eq('id', data.id);

        if (error) {
          console.error('Error updating availability:', error);
          return { success: false };
        }
      } else {
        const { error } = await supabase
          .from('player_availability')
          .insert(dbRecord);

        if (error) {
          console.error('Error inserting availability:', error);
          return { success: false };
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Unexpected error updating availability:', error);
      return { success: false };
    }
  };

  // Save batch of availability records
  const saveAvailabilityBatch = async (dataArray: PlayerAvailabilitySlot[]): Promise<{success: boolean}> => {
    try {
      // Convert our format to database format
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

  // Delete availability record
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
