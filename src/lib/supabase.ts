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

// Helper function to generate a player link
export const generatePlayerLink = async (playerId: string) => {
  try {
    // Check if the player exists
    const { data: playerData, error: playerError } = await supabase
      .from('players')
      .select('unique_link_token')
      .eq('id', playerId)
      .single();
      
    if (playerError) {
      console.error('Error fetching player:', playerError);
      return { success: false, error: playerError };
    }
    
    let uniqueToken = playerData?.unique_link_token;
    
    // If no token exists, generate one
    if (!uniqueToken) {
      try {
        // Generate a unique token for player links
        const { data: newToken, error: rpcError } = await supabase.rpc('generate_unique_player_token');
        
        if (rpcError || !newToken) {
          throw new Error(rpcError?.message || 'Failed to generate unique token');
        }
        
        uniqueToken = newToken;
        
        // Update the player with the new token
        const { error: updateError } = await supabase
          .from('players')
          .update({ unique_link_token: uniqueToken })
          .eq('id', playerId);
          
        if (updateError) {
          throw new Error(updateError.message);
        }
      } catch (err) {
        console.error('Error generating player link:', err);
        return { success: false, error: err };
      }
    }
    
    // Build the player link
    const baseUrl = window.location.origin;
    const playerLink = `${baseUrl}/player/${uniqueToken}`;
    
    return { 
      success: true, 
      data: { 
        link: playerLink,
        token: uniqueToken
      }
    };
  } catch (error) {
    console.error('Error in generatePlayerLink:', error);
    return { success: false, error };
  }
};

// Helper function to load a game setting
export const loadGameSetting = async (key: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .rpc('get_game_setting', { setting_key: key });
      
    if (error) {
      console.error(`Error loading game setting ${key}:`, error);
      return null;
    }
    
    return data || null;
  } catch (error) {
    console.error(`Error loading game setting ${key}:`, error);
    return null;
  }
};

// Helper function to save a game setting
export const saveGameSetting = async (key: string, value: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('save_game_setting', { 
        setting_key: key, 
        setting_value: value 
      });
      
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
      .rpc('get_game_setting', { setting_key: key });
      
    if (error) {
      console.error(`Error loading game data ${key}:`, error);
      return null;
    }
    
    // Parse JSON data or return as-is if not valid JSON
    try {
      return JSON.parse(data || 'null');
    } catch (e) {
      return data || null;
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
      .rpc('save_game_setting', {
        setting_key: key,
        setting_value: valueToSave
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

// Add these two functions which are used in QuestionArchive.tsx
export const getUsedQuestions = async () => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('used', true);
  
  if (error) {
    console.error('Error fetching used questions:', error);
    return { success: false, data: [] };
  }
  
  return { success: true, data: data || [] };
};

export const restoreQuestion = async (questionId: string) => {
  const { data, error } = await supabase
    .from('questions')
    .update({ used: false })
    .eq('id', questionId);
  
  if (error) {
    console.error('Error restoring question:', error);
    return { success: false };
  }
  
  return { success: true };
};
