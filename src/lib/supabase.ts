
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { GameBackup } from '@/types/game-types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

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
    // Use the raw() method to execute SQL directly since game_settings isn't in the type definition
    const { data: existingData, error: getError } = await supabase
      .rpc('get_game_setting', { setting_id: 'used_questions' });
    
    if (getError && getError.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      throw getError;
    }
    
    // Prepare the list of used questions
    let usedQuestions: string[] = [];
    if (existingData) {
      usedQuestions = existingData as string[];
    }
    
    // Add the new question ID if not already present
    if (!usedQuestions.includes(questionId)) {
      usedQuestions.push(questionId);
    }
    
    // Save the updated list
    const { error: updateError } = await supabase
      .rpc('update_game_setting', { 
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
    const { error } = await supabase
      .rpc('update_game_setting', { 
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
    const { data, error } = await supabase
      .rpc('get_game_setting', { setting_id: dataId });
    
    if (error) throw error;
    if (!data) return { success: false, error: new Error('Data not found') };
    
    return { success: true, data };
  } catch (error) {
    console.error(`Error loading game data (${dataId}):`, error);
    return { success: false, error };
  }
}

export async function saveBackup(backup: GameBackup) {
  try {
    const { error } = await supabase
      .rpc('update_game_setting', { 
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
    // Use raw SQL or a stored procedure that returns all settings with backup_ prefix
    const { data, error } = await supabase
      .rpc('get_all_backups');
    
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
    const { error } = await supabase
      .rpc('delete_game_setting', { setting_id: `backup_${backupId}` });
    
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
    const { data, error } = await supabase
      .rpc('get_game_setting', { setting_id: 'used_questions' });
    
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
    const { data: existingData, error: getError } = await supabase
      .rpc('get_game_setting', { setting_id: 'used_questions' });
    
    if (getError && getError.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      throw getError;
    }
    
    // If no used questions record exists, return success (nothing to restore)
    if (!existingData) {
      return { success: true };
    }
    
    // Remove the restored question ID from the list
    let usedQuestions = existingData as string[];
    usedQuestions = usedQuestions.filter(id => id !== questionId);
    
    // Update the used questions list
    const { error: updateError } = await supabase
      .rpc('update_game_setting', { 
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
