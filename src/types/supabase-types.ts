
// This file contains local type definitions for Supabase tables
// It complements the auto-generated types from the Supabase API

export interface GameSettings {
  id: string;
  value: any;
  created_at?: string;
  updated_at?: string;
}

export interface BoosterCard {
  id: string;
  name: string;
  description?: string;
  icon_name?: string;
  image_url?: string;
  sound_effect?: string;
  animation_style?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  round: number;
  created_at?: string;
  updated_at?: string;
}

export interface Question {
  id: string;
  category_id: string;
  text: string;
  difficulty: 5 | 10 | 15 | 20;
  options?: string[];
  correct_answer: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}
