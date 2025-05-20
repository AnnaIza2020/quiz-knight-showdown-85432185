
export enum AvailabilityStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  MAYBE = 'maybe',
  UNKNOWN = 'unknown'
}

export interface TimeSlot {
  hour: string; // Format: "HH:MM"
  status: AvailabilityStatus;
}

export interface PlayerAvailabilitySlot {
  playerId: string;
  date: string; // Format: "YYYY-MM-DD"
  timeSlots: TimeSlot[];
}

export interface AvailabilityContextType {
  fetchAvailability: () => Promise<PlayerAvailabilitySlot[]>;
  updateAvailability: (data: PlayerAvailabilitySlot) => Promise<boolean>;
}
