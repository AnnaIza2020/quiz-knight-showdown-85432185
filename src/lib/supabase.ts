
import { toast } from 'sonner';
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return typeof supabaseClient !== 'undefined';
};

// Add player token to requests if available
export const addPlayerTokenToRequests = () => {
  try {
    const token = localStorage.getItem('player-token');
    if (token) {
      // Add the player token to all Supabase requests
      supabaseClient.functions.setAuth(token);
    }
  } catch (error) {
    console.error('Error setting player token:', error);
  }
};

// Initialize token from localStorage on load
addPlayerTokenToRequests();

// Save game data to local storage
export const saveGameData = async (gameData: any, key: string = 'gameData') => {
  try {
    localStorage.setItem(key, JSON.stringify(gameData));
    return { success: true };
  } catch (error) {
    console.error('Error saving game data:', error);
    toast.error('Nie udało się zapisać danych gry');
    return { success: false, error };
  }
};

// Load game data from local storage
export const loadGameData = async (key: string = 'gameData') => {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      return { success: false, error: 'No data found' };
    }
    return { success: true, data: JSON.parse(data) };
  } catch (error) {
    console.error('Error loading game data:', error);
    toast.error('Nie udało się wczytać danych gry');
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
