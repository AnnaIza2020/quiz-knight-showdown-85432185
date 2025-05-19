
import React, { createContext, useContext, ReactNode } from 'react';
import { useAvailability } from '@/hooks/useAvailability';
import { AvailabilityContextType } from '@/types/availability-types';

const AvailabilityContext = createContext<AvailabilityContextType | undefined>(undefined);

export function AvailabilityProvider({ children }: { children: ReactNode }) {
  const availability = useAvailability();
  
  return (
    <AvailabilityContext.Provider value={availability}>
      {children}
    </AvailabilityContext.Provider>
  );
}

export function useAvailabilityContext() {
  const context = useContext(AvailabilityContext);
  
  if (context === undefined) {
    throw new Error('useAvailabilityContext must be used within an AvailabilityProvider');
  }
  
  return context;
}
