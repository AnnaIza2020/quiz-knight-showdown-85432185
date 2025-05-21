
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create a single supabase client for the entire app
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Helper function to load a game setting
export const loadGameSetting = async (key: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('game_settings')
      .select('value')
      .eq('key', key)
      .single();
      
    if (error) {
      console.error(`Error loading game setting ${key}:`, error);
      return null;
    }
    
    return data?.value || null;
  } catch (error) {
    console.error(`Error loading game setting ${key}:`, error);
    return null;
  }
};

// Helper function to save a game setting
export const saveGameSetting = async (key: string, value: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('game_settings')
      .upsert({ key, value })
      .select();
      
    if (error) {
      console.error(`Error saving game setting ${key}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error saving game setting ${key}:`, error);
    return false;
  }
};

// Helper function to load game data by key
export const loadGameData = async (key: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('game_settings')
      .select('value')
      .eq('key', key)
      .single();
      
    if (error) {
      console.error(`Error loading game data ${key}:`, error);
      return null;
    }
    
    // Parse JSON data or return as-is if not valid JSON
    try {
      return JSON.parse(data?.value || 'null');
    } catch (e) {
      return data?.value || null;
    }
  } catch (error) {
    console.error(`Error loading game data ${key}:`, error);
    return null;
  }
};

// Helper function to save game data by key
export const saveGameData = async (key: string, value: any): Promise<boolean> => {
  try {
    // Convert value to string if it's an object
    const valueToSave = typeof value === 'object' ? JSON.stringify(value) : String(value);
    
    const { data, error } = await supabase
      .from('game_settings')
      .upsert({ key, value: valueToSave })
      .select();
      
    if (error) {
      console.error(`Error saving game data ${key}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error saving game data ${key}:`, error);
    return false;
  }
};
