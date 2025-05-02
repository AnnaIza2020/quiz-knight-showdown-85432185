
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Get Supabase URL and anon key from environment variables or use defaults for dev
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://your-supabase-url.supabase.co' && 
         supabaseAnonKey !== 'your-anon-key';
};

// Save game edition to Supabase
export const saveGameEdition = async (gameData: any, editionName: string = 'default') => {
  try {
    if (!isSupabaseConfigured()) {
      toast.error('Supabase nie jest skonfigurowany. Użyj localStorage.');
      return { success: false, error: 'Supabase nie jest skonfigurowany' };
    }
    
    const { data, error } = await supabase
      .from('game_editions')
      .upsert({
        name: editionName,
        data: gameData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'name' });
    
    if (error) throw error;
    
    return { success: true, data };
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
    
    const { data, error } = await supabase
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
    
    const { data, error } = await supabase
      .from('used_questions')
      .insert({
        question_id: questionId,
        game_id: gameId,
        used_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    return { success: true, data };
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
    
    const { data, error } = await supabase
      .from('used_questions')
      .select('question_id')
      .eq('game_id', gameId);
    
    if (error) throw error;
    
    return { success: true, data: data.map(q => q.question_id) };
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
    
    const { error } = await supabase
      .from('used_questions')
      .delete()
      .eq('question_id', questionId)
      .eq('game_id', gameId);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error restoring question:', error);
    return { success: false, error };
  }
};
