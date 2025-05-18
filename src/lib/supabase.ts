
import { toast } from 'sonner';
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Export supabase for compatibility with existing imports
export const supabase = supabaseClient;

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

// Safe query to check if a table exists
export const checkTableExists = async (tableName: string) => {
  try {
    if (!isSupabaseConfigured()) {
      return { exists: false, error: 'Supabase not configured' };
    }
    
    // Use a different approach to check if a table exists since we don't have direct access to the table_exists function
    try {
      // Try to get a single row from the table
      const { count } = await supabaseClient
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      // If we get here without error, the table exists
      return { exists: true, error: null };
    } catch (err: any) {
      // If the error is about the table not existing
      if (err.message && err.message.includes('relation') && err.message.includes('does not exist')) {
        return { exists: false, error: null };
      }
      throw err; // Re-throw other errors
    }
    
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return { exists: false, error: 'Unknown error checking table' };
  }
};

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

// Additional functions needed by other components
export const saveGameEdition = async (data: any, name: string) => {
  return saveGameData(data, name);
};

export const loadGameEdition = async (name: string) => {
  return loadGameData(name);
};

export const saveUsedQuestion = async (question: any) => {
  try {
    const usedQuestions = JSON.parse(localStorage.getItem('usedQuestions') || '[]');
    usedQuestions.push(question);
    localStorage.setItem('usedQuestions', JSON.stringify(usedQuestions));
    return { success: true };
  } catch (error) {
    console.error('Error saving used question:', error);
    return { success: false, error };
  }
};

export const getUsedQuestions = async () => {
  try {
    const usedQuestions = JSON.parse(localStorage.getItem('usedQuestions') || '[]');
    return { success: true, data: usedQuestions };
  } catch (error) {
    console.error('Error getting used questions:', error);
    return { success: false, error, data: [] };
  }
};

export const restoreQuestion = async (questionId: string) => {
  try {
    const usedQuestions = JSON.parse(localStorage.getItem('usedQuestions') || '[]');
    const updatedQuestions = usedQuestions.filter((q: any) => q.id !== questionId);
    localStorage.setItem('usedQuestions', JSON.stringify(updatedQuestions));
    return { success: true };
  } catch (error) {
    console.error('Error restoring question:', error);
    return { success: false, error };
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
    
    // Generate a random token instead of using Supabase function
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
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

// Funkcja do bezpiecznego pobierania listy zwycięzców
export const getGameWinners = async () => {
  try {
    if (!isSupabaseConfigured()) {
      return { success: false, data: [], error: 'Supabase nie jest skonfigurowany' };
    }
    
    // Najpierw sprawdź czy tabela istnieje
    const { exists } = await checkTableExists('game_winners');
    
    if (!exists) {
      console.log('Tabela game_winners nie istnieje, zwracanie pustej listy');
      return { success: true, data: [], error: null };
    }
    
    // Use the Supabase JS client to access custom tables
    // This approach avoids TypeScript limitations
    const result = await supabaseClient.rpc('custom_get_winners');
    
    if (result.error) {
      throw result.error;
    }
    
    return { success: true, data: result.data || [], error: null };
  } catch (error: any) {
    console.error('Error fetching game winners:', error);
    return { 
      success: false, 
      data: [], 
      error: `Wystąpił błąd podczas pobierania zwycięzców: ${error.message || 'Nieznany błąd'}` 
    };
  }
};
