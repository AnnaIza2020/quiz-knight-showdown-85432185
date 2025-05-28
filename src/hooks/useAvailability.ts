
import { useState } from 'react';
import { PlayerAvailabilitySlot, AvailabilityStatus } from '@/types/availability-types';

export const useAvailability = () => {
  const [availabilityData, setAvailabilityData] = useState<PlayerAvailabilitySlot[]>([]);

  const updateAvailability = async (data: PlayerAvailabilitySlot): Promise<{success: boolean}> => {
    setAvailabilityData(prev => {
      const existingIndex = prev.findIndex(item => item.id === data.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = data;
        return updated;
      }
      return [...prev, data];
    });
    return { success: true };
  };

  const fetchAvailability = async (): Promise<PlayerAvailabilitySlot[]> => {
    // Mock data with all required properties
    const mockData: PlayerAvailabilitySlot[] = [
      {
        id: '1',
        playerId: 'player1',
        date: '2024-01-01',
        startTime: '10:00',
        endTime: '18:00',
        available: true,
        timeSlots: {
          '10:00': AvailabilityStatus.AVAILABLE,
          '14:00': AvailabilityStatus.BUSY,
          '18:00': AvailabilityStatus.AVAILABLE
        }
      }
    ];
    
    setAvailabilityData(mockData);
    return mockData;
  };

  const saveAvailabilityBatch = async (data: PlayerAvailabilitySlot[]): Promise<{success: boolean}> => {
    setAvailabilityData(data);
    return { success: true };
  };

  const getPlayerAvailability = async (playerId: string): Promise<PlayerAvailabilitySlot[]> => {
    return availabilityData.filter(slot => slot.playerId === playerId);
  };

  const deleteAvailability = async (id: string): Promise<{success: boolean}> => {
    setAvailabilityData(prev => prev.filter(slot => slot.id !== id));
    return { success: true };
  };

  return {
    availabilityData,
    updateAvailability,
    fetchAvailability,
    saveAvailabilityBatch,
    getPlayerAvailability,
    deleteAvailability
  };
};
