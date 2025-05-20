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
    // Get existing used questions
    const { data: existingData, error: getError } = await supabase
      .from('game_settings')
      .select('value')
      .eq('id', 'used_questions')
      .single();
    
    if (getError && getError.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      throw getError;
    }
    
    // Prepare the list of used questions
    let usedQuestions: string[] = [];
    if (existingData?.value && Array.isArray(existingData.value)) {
      usedQuestions = existingData.value as string[];
    }
    
    // Add the new question ID if not already present
    if (!usedQuestions.includes(questionId)) {
      usedQuestions.push(questionId);
    }
    
    // Save the updated list
    if (existingData) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('game_settings')
        .update({ value: usedQuestions })
        .eq('id', 'used_questions');
      
      if (updateError) throw updateError;
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('game_settings')
        .insert({ id: 'used_questions', value: usedQuestions });
      
      if (insertError) throw insertError;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving used question:', error);
    return { success: false, error };
  }
}

export async function saveGameData(data: any, dataId: string) {
  try {
    // Check if data with this ID already exists
    const { data: existingData, error: getError } = await supabase
      .from('game_settings')
      .select('id')
      .eq('id', dataId)
      .maybeSingle();
    
    // Save the data
    if (existingData) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('game_settings')
        .update({ value: data })
        .eq('id', dataId);
      
      if (updateError) throw updateError;
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('game_settings')
        .insert({ id: dataId, value: data });
      
      if (insertError) throw insertError;
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error saving game data (${dataId}):`, error);
    return { success: false, error };
  }
}

export async function loadGameData(dataId: string) {
  try {
    // Get data
    const { data, error } = await supabase
      .from('game_settings')
      .select('value')
      .eq('id', dataId)
      .maybeSingle();
    
    if (error) throw error;
    if (!data) return { success: false, error: new Error('Data not found') };
    
    return { success: true, data: data.value };
  } catch (error) {
    console.error(`Error loading game data (${dataId}):`, error);
    return { success: false, error };
  }
}

export async function saveBackup(backup: GameBackup) {
  try {
    const { error } = await supabase
      .from('game_settings')
      .insert({ 
        id: `backup_${backup.id}`,
        value: backup 
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
    const { data, error } = await supabase
      .from('game_settings')
      .select('value')
      .like('id', 'backup_%');
    
    if (error) throw error;
    
    const backups: GameBackup[] = data
      ? data.map(item => item.value as unknown as GameBackup)
      : [];
    
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
      .from('game_settings')
      .delete()
      .eq('id', `backup_${backupId}`);
    
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
    // Get list of used question IDs
    const { data, error } = await supabase
      .from('game_settings')
      .select('value')
      .eq('id', 'used_questions')
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      throw error;
    }
    
    // Return used question IDs or empty array if none found
    return { 
      success: true, 
      data: data?.value ? (data.value as string[]) : [] 
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
      .from('game_settings')
      .select('value')
      .eq('id', 'used_questions')
      .single();
    
    if (getError && getError.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      throw getError;
    }
    
    // If no used questions record exists, return success (nothing to restore)
    if (!existingData?.value) {
      return { success: true };
    }
    
    // Remove the restored question ID from the list
    let usedQuestions = existingData.value as string[];
    usedQuestions = usedQuestions.filter(id => id !== questionId);
    
    // Update the used questions list
    const { error: updateError } = await supabase
      .from('game_settings')
      .update({ value: usedQuestions })
      .eq('id', 'used_questions');
    
    if (updateError) throw updateError;
    
    return { success: true };
  } catch (error) {
    console.error('Error restoring question:', error);
    return { success: false, error };
  }
}
