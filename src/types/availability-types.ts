
export interface PlayerAvailabilitySlot {
  playerId: string;
  date: string; // format ISO "YYYY-MM-DD"
  timeSlots: Record<string, AvailabilityStatus>; // key: time slot (e.g. "16:00"), value: availability status
}

export type AvailabilityStatus = 'available' | 'unavailable' | 'maybe' | '';

export interface PlayerAvailability {
  playerId: string;
  slots: PlayerAvailabilitySlot[];
}

export interface AvailabilityContextType {
  fetchAvailability: () => Promise<PlayerAvailability[]>;
  updateAvailability: (playerId: string, slot: PlayerAvailabilitySlot) => Promise<boolean>;
  playerAvailability: PlayerAvailability[];
  isLoading: boolean;
  error: Error | null;
}
