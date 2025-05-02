
import { createClient } from '@supabase/supabase-js';

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
