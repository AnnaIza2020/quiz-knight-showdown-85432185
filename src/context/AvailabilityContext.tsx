
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { PlayerAvailabilitySlot, AvailabilityContextType } from '@/types/availability-types';

const AvailabilityContext = createContext<AvailabilityContextType | undefined>(undefined);

export const useAvailabilityContext = () => {
  const context = useContext(AvailabilityContext);
  if (!context) {
    throw new Error('useAvailabilityContext must be used within a AvailabilityProvider');
  }
  return context;
};

interface AvailabilityProviderProps {
  children: ReactNode;
}

export const AvailabilityProvider: React.FC<AvailabilityProviderProps> = ({ children }) => {
  // Fetch all player availability data
  const fetchAvailability = async (): Promise<PlayerAvailabilitySlot[]> => {
    try {
      const { data, error } = await supabase
        .from('player_availability')
        .select('*');
      
      if (error) throw error;
      
      return data as PlayerAvailabilitySlot[] || [];
    } catch (error) {
      console.error('Error fetching player availability:', error);
      return [];
    }
  };
  
  // Update a player's availability for a specific date
  const updateAvailability = async (availabilityData: PlayerAvailabilitySlot): Promise<boolean> => {
    try {
      // Check if an entry already exists
      const { data: existingData, error: findError } = await supabase
        .from('player_availability')
        .select('*')
        .eq('playerId', availabilityData.playerId)
        .eq('date', availabilityData.date)
        .maybeSingle();
      
      if (findError) throw findError;
      
      if (existingData) {
        // Update existing entry
        const { error: updateError } = await supabase
          .from('player_availability')
          .update({ timeSlots: availabilityData.timeSlots })
          .eq('playerId', availabilityData.playerId)
          .eq('date', availabilityData.date);
        
        if (updateError) throw updateError;
      } else {
        // Insert new entry
        const { error: insertError } = await supabase
          .from('player_availability')
          .insert(availabilityData);
        
        if (insertError) throw insertError;
      }
      
      return true;
    } catch (error) {
      console.error('Error updating player availability:', error);
      return false;
    }
  };
  
  const value: AvailabilityContextType = {
    fetchAvailability,
    updateAvailability
  };
  
  return (
    <AvailabilityContext.Provider value={value}>
      {children}
    </AvailabilityContext.Provider>
  );
};
