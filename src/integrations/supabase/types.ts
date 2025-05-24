export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      auth_settings: {
        Row: {}
        Insert: {}
        Update: {}
        Relationships: []
      }
      booster_cards: {
        Row: {
          animation_style: string | null
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          image_url: string | null
          name: string
          sound_effect: string | null
          updated_at: string | null
        }
        Insert: {
          animation_style?: string | null
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          name: string
          sound_effect?: string | null
          updated_at?: string | null
        }
        Update: {
          animation_style?: string | null
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          name?: string
          sound_effect?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          round: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          round?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          round?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {}
        Insert: {}
        Update: {}
        Relationships: []
      }
      game_settings: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          value: Json | null
        }
        Insert: {
          created_at?: string | null
          id: string
          updated_at?: string | null
          value?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      game_state: {
        Row: {
          active_player_id: string | null
          current_question: Json | null
          current_round: number | null
          game_paused: boolean | null
          id: string
          timer_duration: number | null
          timer_running: boolean | null
          updated_at: string | null
          wheel_category: string | null
        }
        Insert: {
          active_player_id?: string | null
          current_question?: Json | null
          current_round?: number | null
          game_paused?: boolean | null
          id?: string
          timer_duration?: number | null
          timer_running?: boolean | null
          updated_at?: string | null
          wheel_category?: string | null
        }
        Update: {
          active_player_id?: string | null
          current_question?: Json | null
          current_round?: number | null
          game_paused?: boolean | null
          id?: string
          timer_duration?: number | null
          timer_running?: boolean | null
          updated_at?: string | null
          wheel_category?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_state_active_player_id_fkey"
            columns: ["active_player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_availability: {
        Row: {
          created_at: string
          date: string
          id: string
          player_id: string | null
          time_slots: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          player_id?: string | null
          time_slots?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          player_id?: string | null
          time_slots?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_availability_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          avatar_url: string | null
          camera_url: string | null
          cards: Json | null
          color: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          life_percent: number | null
          nickname: string
          points: number | null
          status: string | null
          token: string
          token_expires_at: string | null
          unique_link_token: string | null
        }
        Insert: {
          avatar_url?: string | null
          camera_url?: string | null
          cards?: Json | null
          color?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          life_percent?: number | null
          nickname: string
          points?: number | null
          status?: string | null
          token: string
          token_expires_at?: string | null
          unique_link_token?: string | null
        }
        Update: {
          avatar_url?: string | null
          camera_url?: string | null
          cards?: Json | null
          color?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          life_percent?: number | null
          nickname?: string
          points?: number | null
          status?: string | null
          token?: string
          token_expires_at?: string | null
          unique_link_token?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          category_id: string | null
          correct_answer: string
          created_at: string | null
          difficulty: number
          id: string
          image_url: string | null
          options: Json | null
          text: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          correct_answer: string
          created_at?: string | null
          difficulty: number
          id?: string
          image_url?: string | null
          options?: Json | null
          text: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          correct_answer?: string
          created_at?: string | null
          difficulty?: number
          id?: string
          image_url?: string | null
          options?: Json | null
          text?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      used_questions: {
        Row: {
          created_at: string
          id: string
          question_id: string
          session_id: string | null
          used_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          session_id?: string | null
          used_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          session_id?: string | null
          used_at?: string
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
      load_game_data: {
        Args: { key: string }
        Returns: Json
      }
      save_game_data: {
        Args: { key: string; value: Json }
        Returns: boolean
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
