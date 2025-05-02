
import { useState, useEffect } from 'react';
import { Player } from '@/types/game-types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UsePlayerManagementOptions {
  onPlayerAdd?: (player: Player) => void;
  onPlayerUpdate?: (player: Player) => void;
  onPlayerRemove?: (playerId: string) => void;
}

export const usePlayerManagement = (options?: UsePlayerManagementOptions) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Load players from Supabase
  const loadPlayers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('nickname');
      
      if (error) throw new Error(error.message);
      
      if (data) {
        // Map database players to our Player type
        const mappedPlayers = data.map(item => ({
          id: item.id,
          name: item.nickname,
          cameraUrl: item.camera_url || '',
          points: item.points || 0,
          health: item.life_percent || 100,
          lives: 3,
          isActive: item.is_active || true,
          isEliminated: item.status === 'eliminated',
          avatar: item.avatar_url,
          color: item.color,
          token: item.token,
          uniqueLinkToken: item.unique_link_token
        }));
        
        setPlayers(mappedPlayers);
      }
    } catch (err) {
      console.error('Error loading players:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  // Add a new player
  const addPlayer = async (playerData: Partial<Player>) => {
    try {
      if (!playerData.name) {
        throw new Error('Player name is required');
      }
      
      // Prepare player data for Supabase
      const { data, error } = await supabase
        .from('players')
        .insert({
          nickname: playerData.name,
          camera_url: playerData.cameraUrl,
          color: playerData.color || '#ff00ff',
          token: crypto.randomUUID(),
          life_percent: 100,
          points: 0,
          is_active: true,
          status: 'active'
        })
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      
      if (data) {
        // Map the returned data to our Player type
        const newPlayer: Player = {
          id: data.id,
          name: data.nickname,
          cameraUrl: data.camera_url || '',
          points: data.points || 0,
          health: data.life_percent || 100,
          lives: 3,
          isActive: data.is_active || true,
          isEliminated: false,
          avatar: data.avatar_url,
          color: data.color
        };
        
        setPlayers(prev => [...prev, newPlayer]);
        
        if (options?.onPlayerAdd) {
          options.onPlayerAdd(newPlayer);
        }
        
        return newPlayer;
      }
    } catch (err) {
      console.error('Error adding player:', err);
      toast.error(`Failed to add player: ${err instanceof Error ? err.message : String(err)}`);
      throw err;
    }
  };
  
  // Update a player
  const updatePlayer = async (playerData: Partial<Player> & { id: string }) => {
    try {
      const { id, ...updateData } = playerData;
      
      // Map our Player type to Supabase schema
      const dbUpdateData: any = {};
      
      if ('name' in updateData) dbUpdateData.nickname = updateData.name;
      if ('cameraUrl' in updateData) dbUpdateData.camera_url = updateData.cameraUrl;
      if ('points' in updateData) dbUpdateData.points = updateData.points;
      if ('health' in updateData) dbUpdateData.life_percent = updateData.health;
      if ('isActive' in updateData) dbUpdateData.is_active = updateData.isActive;
      if ('isEliminated' in updateData) dbUpdateData.status = updateData.isEliminated ? 'eliminated' : 'active';
      if ('color' in updateData) dbUpdateData.color = updateData.color;
      
      const { data, error } = await supabase
        .from('players')
        .update(dbUpdateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      
      if (data) {
        // Map the returned data to our Player type
        const updatedPlayer: Player = {
          id: data.id,
          name: data.nickname,
          cameraUrl: data.camera_url || '',
          points: data.points || 0,
          health: data.life_percent || 100,
          lives: 3,
          isActive: data.is_active || true,
          isEliminated: data.status === 'eliminated',
          avatar: data.avatar_url,
          color: data.color
        };
        
        setPlayers(prev => 
          prev.map(p => p.id === id ? updatedPlayer : p)
        );
        
        if (options?.onPlayerUpdate) {
          options.onPlayerUpdate(updatedPlayer);
        }
        
        return updatedPlayer;
      }
    } catch (err) {
      console.error('Error updating player:', err);
      toast.error(`Failed to update player: ${err instanceof Error ? err.message : String(err)}`);
      throw err;
    }
  };
  
  // Remove a player
  const removePlayer = async (playerId: string) => {
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId);
      
      if (error) throw new Error(error.message);
      
      setPlayers(prev => prev.filter(p => p.id !== playerId));
      
      if (options?.onPlayerRemove) {
        options.onPlayerRemove(playerId);
      }
      
      return true;
    } catch (err) {
      console.error('Error removing player:', err);
      toast.error(`Failed to remove player: ${err instanceof Error ? err.message : String(err)}`);
      throw err;
    }
  };
  
  // Generate player link
  const getPlayerLink = (player: Player) => {
    if (!player.uniqueLinkToken) return null;
    
    const baseUrl = window.location.origin;
    return `${baseUrl}/player/${player.uniqueLinkToken}`;
  };
  
  // Load players on component mount
  useEffect(() => {
    loadPlayers();
  }, []);
  
  // Subscribe to player updates from Supabase
  useEffect(() => {
    const channel = supabase
      .channel('public:players')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'players' }, 
        (payload) => {
          // Reload players when anything changes
          loadPlayers();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  return {
    players,
    loading,
    error,
    addPlayer,
    updatePlayer,
    removePlayer,
    loadPlayers,
    getPlayerLink
  };
};
