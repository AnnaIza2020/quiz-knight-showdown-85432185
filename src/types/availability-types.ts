
export interface PlayerAvailabilitySlot {
  id: string;
  playerId: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  notes?: string;
  timeSlots?: Record<string, AvailabilityStatus>;
}

export type AvailabilityStatus = 'available' | 'busy' | 'maybe';

export interface AvailabilityContextType {
  availabilityData: PlayerAvailabilitySlot[];
  updateAvailability: (data: PlayerAvailabilitySlot) => Promise<{success: boolean}>;
  fetchAvailability: () => Promise<PlayerAvailabilitySlot[]>;
  saveAvailabilityBatch: (data: PlayerAvailabilitySlot[]) => Promise<{success: boolean}>;
  getPlayerAvailability: (playerId: string) => Promise<PlayerAvailabilitySlot[]>;
  deleteAvailability: (id: string) => Promise<{success: boolean}>;
}
