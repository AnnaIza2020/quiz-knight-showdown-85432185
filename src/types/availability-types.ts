
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
  player_id?: string; // For backward compatibility
  time_slots?: any; // For backward compatibility
  created_at?: string;
  updated_at?: string;
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
