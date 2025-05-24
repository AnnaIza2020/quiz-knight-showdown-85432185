
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

// Helper function to load game data by key
export const loadGameData = async (key: string): Promise<any> => {
  try {
    const { data, error } = await supabase.rpc('load_game_data', { key });
      
    if (error) {
      console.error(`Error loading game data ${key}:`, error);
      return null;
    }
    
    return data || null;
  } catch (error) {
    console.error(`Error loading game data ${key}:`, error);
    return null;
  }
};

// Helper function to save game data by key
export const saveGameData = async (key: string, value: any): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('save_game_data', {
      key,
      value: value as Json
    });
      
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
