
export enum AvailabilityStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  MAYBE = 'maybe',
  UNKNOWN = 'unknown'
}

export interface TimeSlot {
  hour: number;
  status: AvailabilityStatus;
}

export interface PlayerAvailabilitySlot {
  id?: string;
  playerId: string;
  date: string;
  timeSlots: Record<string, AvailabilityStatus>;
}

export interface PlayerAvailability {
  player: {
    id: string;
    name: string;
  };
  availabilitySlots: PlayerAvailabilitySlot[];
}

export interface AvailabilityContextType {
  fetchAvailability: () => Promise<PlayerAvailabilitySlot[]>;
  updateAvailability: (data: PlayerAvailabilitySlot) => Promise<{success: boolean}>;
  saveAvailabilityBatch: (data: PlayerAvailabilitySlot[]) => Promise<{success: boolean}>;
  getPlayerAvailability: (playerId: string) => Promise<PlayerAvailabilitySlot[]>;
  deleteAvailability: (id: string) => Promise<{success: boolean}>;
}
