
export interface PlayerAvailabilitySlot {
  id: string;
  playerId: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  notes?: string;
}
