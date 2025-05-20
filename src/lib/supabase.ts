
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { GameBackup } from '@/types/game-types';

// Use the constants defined in .env file or use the direct URL
const supabaseUrl = "https://jkkvxlojgxlmbypulvtu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impra3Z4bG9qZ3hsbWJ5cHVsdnR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMTQ5NjUsImV4cCI6MjA2MTY5MDk2NX0.OAjQdrGrFhKGwV_lfSmWEBTQ5ZSLnvB_glXB3G2wBSs";

// Create the Supabase client with explicit URL and key
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Functions using RPC calls to work with tables that might not be in the type definitions
export async function generatePlayerLink(playerId: string) {
  try {
    // Generate a unique token for player access
    const { data: uniqueToken, error: tokenError } = await supabase.rpc('generate_unique_player_token');
    
    if (tokenError || !uniqueToken) {
      throw new Error('Failed to generate unique token');
    }
    
    // Update the player with the new token
    const { data: playerData, error: updateError } = await supabase
      .from('players')
      .update({ unique_link_token: uniqueToken })
      .eq('id', playerId)
      .select('unique_link_token')
      .single();
    
    if (updateError) throw updateError;
    
    // Generate link
    const baseUrl = window.location.origin;
    const playerLink = `${baseUrl}/player/${playerData.unique_link_token}`;
    
    return {
      success: true,
      data: { 
        link: playerLink,
        token: playerData.unique_link_token
      }
    };
  } catch (error) {
    console.error('Error generating player link:', error);
    return { success: false, error };
  }
}

export async function saveUsedQuestion(questionId: string) {
  try {
    // Use direct RPC call for game_settings
    const { data, error } = await supabase.rpc('get_game_setting', { setting_id: 'used_questions' });
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      throw error;
    }
    
    // Prepare the list of used questions
    let usedQuestions: string[] = [];
    if (data) {
      usedQuestions = data as string[];
    }
    
    // Add the new question ID if not already present
    if (!usedQuestions.includes(questionId)) {
      usedQuestions.push(questionId);
    }
    
    // Save the updated list using RPC
    const { error: updateError } = await supabase.rpc('update_game_setting', { 
      setting_id: 'used_questions', 
      setting_value: usedQuestions 
    });
    
    if (updateError) throw updateError;
    
    return { success: true };
  } catch (error) {
    console.error('Error saving used question:', error);
    return { success: false, error };
  }
}

export async function saveGameData(data: any, dataId: string) {
  try {
    // Use RPC to work with game_settings
    const { error } = await supabase.rpc('update_game_setting', { 
      setting_id: dataId, 
      setting_value: data 
    });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error(`Error saving game data (${dataId}):`, error);
    return { success: false, error };
  }
}

export async function loadGameData(dataId: string) {
  try {
    // Use RPC to work with game_settings
    const { data, error } = await supabase.rpc('get_game_setting', { setting_id: dataId });
    
    if (error && error.code !== 'PGRST116') throw error;
    if (!data && error && error.code === 'PGRST116') return { success: false, error: new Error('Data not found') };
    
    return { success: true, data };
  } catch (error) {
    console.error(`Error loading game data (${dataId}):`, error);
    return { success: false, error };
  }
}

export async function saveBackup(backup: GameBackup) {
  try {
    const { error } = await supabase.rpc('update_game_setting', { 
      setting_id: `backup_${backup.id}`, 
      setting_value: backup 
    });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error saving backup:', error);
    return { success: false, error };
  }
}

export async function getBackups() {
  try {
    // Use RPC to get all backups
    const { data, error } = await supabase.rpc('get_all_backups');
    
    if (error) throw error;
    
    const backups: GameBackup[] = data || [];
    
    // Sort by timestamp, newest first
    return { 
      success: true, 
      data: backups.sort((a, b) => b.timestamp - a.timestamp)
    };
  } catch (error) {
    console.error('Error getting backups:', error);
    return { success: false, error, data: [] };
  }
}

export async function deleteBackup(backupId: string) {
  try {
    const { error } = await supabase.rpc('delete_game_setting', { setting_id: `backup_${backupId}` });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting backup:', error);
    return { success: false, error };
  }
}

export async function saveGameEdition(edition: any, editionName: string) {
  return saveGameData(edition, `edition_${editionName}`);
}

export async function loadGameEdition(editionName: string) {
  return loadGameData(`edition_${editionName}`);
}

export async function getUsedQuestions() {
  try {
    const { data, error } = await supabase.rpc('get_game_setting', { setting_id: 'used_questions' });
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      throw error;
    }
    
    // Return used question IDs or empty array if none found
    return { 
      success: true, 
      data: data ? (data as string[]) : [] 
    };
  } catch (error) {
    console.error('Error getting used questions:', error);
    return { success: false, error, data: [] };
  }
}

export async function restoreQuestion(questionId: string) {
  try {
    // Get existing used questions
    const { data, error } = await supabase.rpc('get_game_setting', { setting_id: 'used_questions' });
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      throw error;
    }
    
    // If no used questions record exists, return success (nothing to restore)
    if (!data) {
      return { success: true };
    }
    
    // Remove the restored question ID from the list
    let usedQuestions = data as string[];
    usedQuestions = usedQuestions.filter(id => id !== questionId);
    
    // Update the used questions list
    const { error: updateError } = await supabase.rpc('update_game_setting', { 
      setting_id: 'used_questions', 
      setting_value: usedQuestions 
    });
    
    if (updateError) throw updateError;
    
    return { success: true };
  } catch (error) {
    console.error('Error restoring question:', error);
    return { success: false, error };
  }
}
