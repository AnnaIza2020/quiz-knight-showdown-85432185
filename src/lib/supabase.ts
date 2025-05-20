
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
