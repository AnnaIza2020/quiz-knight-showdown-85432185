
import { Json } from '@/lib/database.types';

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  MAYBE = 'maybe',
  UNKNOWN = 'unknown'
}

export interface TimeSlot {
  hour: string;
  status: AvailabilityStatus;
}

export interface PlayerAvailabilitySlot {
  id?: string;
  playerId: string;
  date: string;
  timeSlots: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
  // Additional fields to match database columns
  player_id?: string;
  time_slots?: Json;
}

export interface PlayerAvailability {
  playerId: string;
  slots: PlayerAvailabilitySlot[];
}

export interface AvailabilityContextType {
  availability: PlayerAvailabilitySlot[];
  isLoading: boolean;
  error: any;
  fetchAvailability: () => Promise<PlayerAvailabilitySlot[]>;
  updateAvailability: (data: PlayerAvailabilitySlot) => Promise<boolean>;
}
