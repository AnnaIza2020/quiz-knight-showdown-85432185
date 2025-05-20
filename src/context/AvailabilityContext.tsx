
import React, { createContext, useContext, ReactNode } from 'react';
import { useAvailability } from '@/hooks/useAvailability';
import { PlayerAvailability, PlayerAvailabilitySlot, AvailabilityContextType } from '@/types/availability-types';

// Create the context
const AvailabilityContext = createContext<AvailabilityContextType | undefined>(undefined);

// Provider component
export const AvailabilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const availabilityHook = useAvailability();

  return (
    <AvailabilityContext.Provider value={availabilityHook}>
      {children}
    </AvailabilityContext.Provider>
  );
};

// Custom hook to use the context
export const useAvailabilityContext = (): AvailabilityContextType => {
  const context = useContext(AvailabilityContext);
  if (context === undefined) {
    throw new Error('useAvailabilityContext must be used within an AvailabilityProvider');
  }
  return context;
};
