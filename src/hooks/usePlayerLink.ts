
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UsePlayerLinkOptions {
  baseUrl?: string;
}

export const usePlayerLink = (options?: UsePlayerLinkOptions) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Get base URL for player links
  const getBaseUrl = useCallback(() => {
    return options?.baseUrl || window.location.origin;
  }, [options?.baseUrl]);
  
  // Generate a unique token for a player
  const generateUniqueToken = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('generate_unique_player_token');
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error generating token:', err);
      // Fallback to client-side generation if RPC fails
      return crypto.randomUUID().replace(/-/g, '').substring(0, 16);
    }
  }, []);
  
  // Generate a player link
  const generateLink = useCallback(async (playerId: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Check if player already has a token
      const { data: player, error: playerError } = await supabase
        .from('players')
        .select('unique_link_token')
        .eq('id', playerId)
        .single();
      
      if (playerError) throw playerError;
      
      let token = player?.unique_link_token;
      
      // If no token exists, generate one and update player
      if (!token) {
        token = await generateUniqueToken();
        
        const { error: updateError } = await supabase
          .from('players')
          .update({ unique_link_token: token })
          .eq('id', playerId);
        
        if (updateError) throw updateError;
      }
      
      const link = `${getBaseUrl()}/player/${token}`;
      
      return {
        success: true,
        link,
        token
      };
    } catch (err) {
      console.error('Error generating player link:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      return {
        success: false,
        error: err
      };
    } finally {
      setIsGenerating(false);
    }
  }, [getBaseUrl, generateUniqueToken]);
  
  // Copy player link to clipboard
  const copyLinkToClipboard = useCallback(async (player: any) => {
    if (!player.unique_link_token) {
      const result = await generateLink(player.id);
      
      if (!result.success) {
        toast.error('Failed to generate player link');
        return false;
      }
      
      try {
        await navigator.clipboard.writeText(result.link as string);
        toast.success('Player link copied to clipboard');
        return true;
      } catch (err) {
        console.error('Error copying to clipboard:', err);
        toast.error('Failed to copy link to clipboard');
        return false;
      }
    } else {
      try {
        const link = `${getBaseUrl()}/player/${player.unique_link_token}`;
        await navigator.clipboard.writeText(link);
        toast.success('Player link copied to clipboard');
        return true;
      } catch (err) {
        console.error('Error copying to clipboard:', err);
        toast.error('Failed to copy link to clipboard');
        return false;
      }
    }
  }, [generateLink, getBaseUrl]);

  return {
    isGenerating,
    error,
    generateLink,
    copyLinkToClipboard,
    generateUniqueToken
  };
};
