
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PlayerAuthOptions {
  autoAddHeader?: boolean;
}

export const usePlayerAuth = (options: PlayerAuthOptions = {}) => {
  const { autoAddHeader = true } = options;
  const [playerToken, setPlayerToken] = useState<string | null>(null);
  const [playerData, setPlayerData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // On mount, check for token in localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('player-token');
    if (storedToken) {
      setPlayerToken(storedToken);
    }
    
    setLoading(false);
  }, []);

  // Add player token to headers if autoAddHeader is true
  useEffect(() => {
    if (autoAddHeader && playerToken) {
      // Set up Supabase functions auth with player token
      supabase.functions.setAuth(playerToken);
      
      // This creates a middleware that adds the player-token header to all requests
      const originalFetch = window.fetch;
      window.fetch = async (input, init) => {
        const headers = init?.headers ? new Headers(init.headers) : new Headers();
        headers.set('player-token', playerToken);
        
        return originalFetch(input, {
          ...init,
          headers
        });
      };
      
      // Cleanup function to restore original fetch
      return () => {
        window.fetch = originalFetch;
      };
    }
  }, [playerToken, autoAddHeader]);

  // Load player data using token
  const loadPlayerData = async (token: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .or(`token.eq.${token},unique_link_token.eq.${token}`)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setPlayerData(data);
        // Store both token types
        localStorage.setItem('player-token', data.token);
        localStorage.setItem('player-link-token', data.unique_link_token);
        
        // Set the token state
        setPlayerToken(data.token);
        return data;
      }
      
      throw new Error('Player not found');
    } catch (err) {
      console.error('Error loading player data:', err);
      setError(err instanceof Error ? err : new Error('Failed to load player data'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Clear player data and token
  const logout = () => {
    localStorage.removeItem('player-token');
    localStorage.removeItem('player-link-token');
    setPlayerToken(null);
    setPlayerData(null);
  };

  return {
    playerToken,
    playerData,
    loading,
    error,
    loadPlayerData,
    logout,
    isAuthenticated: !!playerToken
  };
};

export default usePlayerAuth;
