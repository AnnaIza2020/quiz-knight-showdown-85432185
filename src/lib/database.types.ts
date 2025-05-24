
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
      used_questions: {
        Row: {
          id: string
          question_id: string
          used_at: string
          session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          question_id: string
          used_at?: string
          session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          used_at?: string
          session_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_unique_player_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      save_game_data: {
        Args: {
          key: string
          value: Json
        }
        Returns: boolean
      }
      load_game_data: {
        Args: {
          key: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
