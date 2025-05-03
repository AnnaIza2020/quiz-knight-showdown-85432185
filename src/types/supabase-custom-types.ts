
import { Database } from '@/integrations/supabase/types';

export type ExtendedDatabase = Database & {
  Tables: {
    game_winners: {
      Row: {
        id: string;
        player_name: string;
        player_id: string;
        round: number;
        score: number;
        created_at: string;
      };
      Insert: {
        id?: string;
        player_name: string;
        player_id: string;
        round: number;
        score: number;
        created_at?: string;
      };
      Update: {
        id?: string;
        player_name?: string;
        player_id?: string;
        round?: number;
        score?: number;
        created_at?: string;
      };
    };
  };
};

// Helper function for safe JSON parsing
export function safeJsonParse<T>(jsonString: string | null, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return defaultValue;
  }
}

// Password settings type for game security
export type PasswordSettings = {
  enabled: boolean;
  password: string;
  attempts: number;
  expiresAfter: number;
};
