
export interface TimeSlot {
  hour: number;
  status: AvailabilityStatus;
}

export type AvailabilityStatus = 'available' | 'unavailable' | 'maybe' | '';

export interface PlayerAvailabilitySlot {
  date: string;
  playerId: string;
  timeSlots: TimeSlot[];
}

export interface AvailabilityContextType {
  playerAvailability: PlayerAvailabilitySlot[];
  isLoading: boolean;
  error: Error | null;
  fetchAvailability: (playerId?: string) => Promise<PlayerAvailabilitySlot[]>;
  updateAvailability: (playerId: string, slot: PlayerAvailabilitySlot) => Promise<boolean>;
  getPlayerAvailabilityForDate: (playerId: string, date: string) => PlayerAvailabilitySlot | undefined;
  getAvailablePlayersForDate: (date: string, hour: number) => string[];
  getAvailabilityPercentageForDate: (date: string, hour: number) => number;
}
