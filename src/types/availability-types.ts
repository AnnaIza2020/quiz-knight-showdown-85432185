
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

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  MAYBE = 'maybe',
  UNAVAILABLE = 'unavailable',
  UNKNOWN = 'unknown'
}

export interface AvailabilityContextType {
  availabilityData: PlayerAvailabilitySlot[];
  updateAvailability: (data: PlayerAvailabilitySlot) => Promise<{success: boolean}>;
  fetchAvailability: () => Promise<PlayerAvailabilitySlot[]>;
  saveAvailabilityBatch: (data: PlayerAvailabilitySlot[]) => Promise<{success: boolean}>;
  getPlayerAvailability: (playerId: string) => Promise<PlayerAvailabilitySlot[]>;
  deleteAvailability: (id: string) => Promise<{success: boolean}>;
}
