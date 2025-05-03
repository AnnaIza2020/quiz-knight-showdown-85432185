
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export class AuthService {
  /**
   * Authenticates a player using their token
   */
  static async authenticateWithToken(token: string): Promise<boolean> {
    try {
      if (!token) {
        toast.error('No player token provided');
        return false;
      }
      
      // Try to find the player with the given token
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .or(`token.eq.${token},unique_link_token.eq.${token}`)
        .single();
      
      if (error || !data) {
        console.error('Player authentication error:', error);
        toast.error('Invalid player token');
        return false;
      }
      
      // Store token in localStorage
      localStorage.setItem('player-token', data.token);
      localStorage.setItem('player-link-token', data.unique_link_token || '');
      
      toast.success(`Welcome, ${data.nickname}!`);
      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('Authentication failed');
      return false;
    }
  }
  
  /**
   * Logs out the current player
   */
  static logout(): void {
    localStorage.removeItem('player-token');
    localStorage.removeItem('player-link-token');
    toast.info('Logged out');
  }
  
  /**
   * Checks if a player is currently authenticated
   */
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('player-token');
  }
  
  /**
   * Gets the current player's token
   */
  static getPlayerToken(): string | null {
    return localStorage.getItem('player-token');
  }
  
  /**
   * Gets the current player's link token
   */
  static getPlayerLinkToken(): string | null {
    return localStorage.getItem('player-link-token');
  }
}

export default AuthService;
