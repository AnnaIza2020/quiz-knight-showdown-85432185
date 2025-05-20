
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string
          nickname: string
          token: string
          camera_url: string | null
          avatar_url: string | null
          color: string | null
          life_percent: number | null
          points: number | null
          cards: Json | null
          created_at: string | null
          token_expires_at: string | null
          is_active: boolean | null
          unique_link_token: string | null
          status: string | null
        }
        Insert: {
          id?: string
          nickname: string
          token: string
          camera_url?: string | null
          avatar_url?: string | null
          color?: string | null
          life_percent?: number | null
          points?: number | null
          cards?: Json | null
          created_at?: string | null
          token_expires_at?: string | null
          is_active?: boolean | null
          unique_link_token?: string | null
          status?: string | null
        }
        Update: {
          id?: string
          nickname?: string
          token?: string
          camera_url?: string | null
          avatar_url?: string | null
          color?: string | null
          life_percent?: number | null
          points?: number | null
          cards?: Json | null
          created_at?: string | null
          token_expires_at?: string | null
          is_active?: boolean | null
          unique_link_token?: string | null
          status?: string | null
        }
        Relationships: []
      }
      player_availability: {
        Row: {
          id: string
          player_id: string
          date: string
          time_slots: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          player_id: string
          date: string
          time_slots: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          player_id?: string
          date?: string
          time_slots?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_availability_player_id_fkey"
            columns: ["player_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          }
        ]
      }
      // Add other tables here as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_unique_player_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      // Add other functions here as needed
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
