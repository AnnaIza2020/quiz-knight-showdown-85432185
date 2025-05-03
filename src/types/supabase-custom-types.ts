
import { Database } from '@/integrations/supabase/types';
import { Json } from '@/integrations/supabase/types';

// Extend the Database type to include our custom game_winners table
export interface ExtendedDatabase extends Database {
  public: Database['public'] & {
    Tables: Database['public']['Tables'] & {
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
        Relationships: [
          {
            foreignKeyName: "game_winners_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "players";
            referencedColumns: ["id"];
          }
        ];
      };
    };
  };
}

// Define the PasswordSettings type for GamePasswordSettings
export interface PasswordSettings {
  enabled: boolean;
  password: string;
  attempts: number;
  expiresAfter: number;
}

// Define ThemeData type
export interface ThemeData {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  accentColor: string;
  fontFamily: string;
}

// Helper function to safely parse JSON with fallback
export function safeJsonParse<T>(json: Json | null, defaultValue: T): T {
  if (!json) return defaultValue;
  
  try {
    if (typeof json === 'string') {
      return JSON.parse(json) as T;
    } else if (typeof json === 'object') {
      return json as unknown as T;
    }
  } catch (e) {
    console.error('Error parsing JSON:', e);
  }
  
  return defaultValue;
}

// Type guard to check if object has specific key
export function hasKey<K extends string>(obj: object, key: K): obj is { [key in K]: unknown } {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
