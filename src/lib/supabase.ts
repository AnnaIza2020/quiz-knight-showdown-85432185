
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

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

export async function saveGameEdition(edition: any, editionName: string) {
  try {
    // Check if edition with this name already exists
    const { data: existingData, error: getError } = await supabase
      .from('game_settings')
      .select('value')
      .eq('id', `edition_${editionName}`)
      .single();
    
    // Save the edition data
    if (existingData) {
      // Update existing edition
      const { error: updateError } = await supabase
        .from('game_settings')
        .update({ value: edition })
        .eq('id', `edition_${editionName}`);
      
      if (updateError) throw updateError;
    } else {
      // Create new edition
      const { error: insertError } = await supabase
        .from('game_settings')
        .insert({ id: `edition_${editionName}`, value: edition });
      
      if (insertError) throw insertError;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving game edition:', error);
    return { success: false, error };
  }
}

export async function loadGameEdition(editionName: string) {
  try {
    // Get edition data
    const { data, error } = await supabase
      .from('game_settings')
      .select('value')
      .eq('id', `edition_${editionName}`)
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Edition not found');
    
    return { success: true, data: data.value };
  } catch (error) {
    console.error('Error loading game edition:', error);
    return { success: false, error };
  }
}
