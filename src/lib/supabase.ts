
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return typeof supabaseClient !== 'undefined';
};

// Save game edition to Supabase
export const saveGameEdition = async (gameData: any, editionName: string = 'default') => {
  try {
    if (!isSupabaseConfigured()) {
      toast.error('Supabase nie jest skonfigurowany. Użyj localStorage.');
      return { success: false, error: 'Supabase nie jest skonfigurowany' };
    }
    
    // Use a try-catch to handle potential type errors with the game_editions table
    try {
      const { data, error } = await supabaseClient
        .from('game_editions')
        .upsert({
          name: editionName,
          data: gameData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'name' });
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Error with game_editions table:', error);
      return { success: false, error: 'Table game_editions might not exist' };
    }
  } catch (error) {
    console.error('Error saving game edition:', error);
    toast.error('Nie udało się zapisać edycji gry');
    return { success: false, error };
  }
};

// Load game edition from Supabase
export const loadGameEdition = async (editionName: string = 'default') => {
  try {
    if (!isSupabaseConfigured()) {
      toast.error('Supabase nie jest skonfigurowany. Użyj localStorage.');
      return { success: false, error: 'Supabase nie jest skonfigurowany' };
    }
    
    // Use a try-catch to handle potential type errors with the game_editions table
    try {
      const { data, error } = await supabaseClient
        .from('game_editions')
        .select('*')
        .eq('name', editionName)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
      
      if (!data) {
        return { success: false, error: 'Nie znaleziono edycji gry' };
      }
      
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error with game_editions table:', error);
      return { success: false, error: 'Table game_editions might not exist' };
    }
  } catch (error) {
    console.error('Error loading game edition:', error);
    toast.error('Nie udało się wczytać edycji gry');
    return { success: false, error };
  }
};

// Save used questions to Supabase
export const saveUsedQuestion = async (questionId: string, gameId: string = 'default') => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: false };
    }
    
    // Use a try-catch to handle potential type errors with the used_questions table
    try {
      const { data, error } = await supabaseClient
        .from('used_questions')
        .insert({
          question_id: questionId,
          game_id: gameId,
          used_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Error with used_questions table:', error);
      return { success: false, error: 'Table used_questions might not exist' };
    }
  } catch (error) {
    console.error('Error saving used question:', error);
    return { success: false, error };
  }
};

// Get all used questions
export const getUsedQuestions = async (gameId: string = 'default') => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: false, data: [] };
    }
    
    // Use a try-catch to handle potential type errors with the used_questions table
    try {
      const { data, error } = await supabaseClient
        .from('used_questions')
        .select('question_id')
        .eq('game_id', gameId);
      
      if (error) throw error;
      
      if (data) {
        return { success: true, data: data.map((q: any) => q.question_id) };
      }
      return { success: true, data: [] };
    } catch (error) {
      console.error('Error with used_questions table:', error);
      return { success: false, error: 'Table used_questions might not exist', data: [] };
    }
  } catch (error) {
    console.error('Error getting used questions:', error);
    return { success: false, error, data: [] };
  }
};

// Restore question (remove from used questions)
export const restoreQuestion = async (questionId: string, gameId: string = 'default') => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: false };
    }
    
    // Use a try-catch to handle potential type errors with the used_questions table
    try {
      const { error } = await supabaseClient
        .from('used_questions')
        .delete()
        .eq('question_id', questionId)
        .eq('game_id', gameId);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error with used_questions table:', error);
      return { success: false, error: 'Table used_questions might not exist' };
    }
  } catch (error) {
    console.error('Error restoring question:', error);
    return { success: false, error };
  }
};

// Get player by token
export const getPlayerByToken = async (token: string) => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: false, data: null };
    }
    
    const { data, error } = await supabaseClient
      .from('players')
      .select('*')
      .eq('unique_link_token', token)
      .single();
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error getting player by token:', error);
    return { success: false, error, data: null };
  }
};

// Update player status
export const updatePlayerStatus = async (playerId: string, status: string) => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: false };
    }
    
    const { data, error } = await supabaseClient
      .from('players')
      .update({ status })
      .eq('id', playerId)
      .select()
      .single();
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error updating player status:', error);
    return { success: false, error };
  }
};

// Generate unique player link
export const generatePlayerLink = async (playerId: string) => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: false, data: null };
    }
    
    // Get the player first to check if it already has a link
    const { data: player, error: playerError } = await supabaseClient
      .from('players')
      .select('unique_link_token')
      .eq('id', playerId)
      .single();
    
    if (playerError) throw playerError;
    
    // If player already has a token, return it
    if (player && player.unique_link_token) {
      const baseUrl = window.location.origin;
      const playerLink = `${baseUrl}/player/${player.unique_link_token}`;
      return { success: true, data: { link: playerLink, token: player.unique_link_token } };
    }
    
    // Generate a new token using the database function
    const { data: token, error: tokenError } = await supabaseClient.rpc('generate_unique_player_token');
    
    if (tokenError) throw tokenError;
    
    // Update the player with the new token
    const { error: updateError } = await supabaseClient
      .from('players')
      .update({ unique_link_token: token })
      .eq('id', playerId);
    
    if (updateError) throw updateError;
    
    const baseUrl = window.location.origin;
    const playerLink = `${baseUrl}/player/${token}`;
    
    return { success: true, data: { link: playerLink, token } };
  } catch (error) {
    console.error('Error generating player link:', error);
    return { success: false, error, data: null };
  }
};
