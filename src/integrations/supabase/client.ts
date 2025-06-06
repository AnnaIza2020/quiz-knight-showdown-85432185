
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jkkvxlojgxlmbypulvtu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impra3Z4bG9qZ3hsbWJ5cHVsdnR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMTQ5NjUsImV4cCI6MjA2MTY5MDk2NX0.OAjQdrGrFhKGwV_lfSmWEBTQ5ZSLnvB_glXB3G2wBSs";

// Get player token from localStorage if available
let playerToken: string | null = null;
try {
  playerToken = localStorage.getItem('player-token');
} catch (e) {
  // Ignore localStorage errors
}

// Create Supabase client with additional headers if player token exists
const globalOptions: any = {};
if (playerToken) {
  globalOptions.headers = {
    'player-token': playerToken
  };
}

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'supabase-auth',
    },
    global: globalOptions
  }
);

// Add global event listener to update headers when player token changes in localStorage
try {
  window.addEventListener('storage', (event) => {
    if (event.key === 'player-token') {
      if (event.newValue) {
        // Update headers - we need to create a new client with the updated headers
        // or use a method that doesn't rely on direct header modification
        supabase.functions.setAuth(event.newValue);
      }
    }
  });
} catch (e) {
  // Ignore errors that might occur in non-browser environments
}
