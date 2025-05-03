
import { useState, useCallback } from 'react';
import { Player } from '@/types/game-types';
import { toast } from 'sonner';
import { generateUniqueId, getRandomNeonColor } from '@/utils/utils';
import { getRandomName } from '@/utils/name-generator';
import { useRafState } from '@/hooks/useRafState';

interface PlayerManagementOptions {
  initialPlayers?: Player[];
  optimizeRendering?: boolean;
}

export const usePlayerManagement = (options?: PlayerManagementOptions) => {
  const useStateHook = options?.optimizeRendering ? useRafState : useState;
  const [players, setPlayers] = useStateHook<Player[]>(options?.initialPlayers || []);
  
  // Funkcja do tworzenia gracza z wartościami domyślnymi
  const createPlayer = useCallback((data: Partial<Player>): Player => {
    return {
      id: data.id || crypto.randomUUID(),
      name: data.name || 'Player',
      avatar: data.avatar || '',
      points: data.points || 0,
      health: data.health || 100,
      lives: data.lives || 3,
      isEliminated: data.isEliminated || false,
      specialCards: data.specialCards || [],
      cameraUrl: data.cameraUrl || '',
      color: data.color || getRandomNeonColor(),
      isActive: data.isActive || false,
      uniqueLinkToken: data.uniqueLinkToken || generateUniqueId()
    };
  }, []);

  // Funkcja do dodania nowego gracza
  const addPlayer = useCallback((player: Player) => {
    setPlayers((prevPlayers) => [...prevPlayers, player]);
  }, [setPlayers]);

  // Funkcja do aktualizacji istniejącego gracza
  const updatePlayer = useCallback((playerId: string, updates: Partial<Player>) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === playerId ? { ...player, ...updates } : player
      )
    );
  }, [setPlayers]);

  // Funkcja do usuwania gracza
  const removePlayer = useCallback((playerId: string) => {
    setPlayers((prevPlayers) => prevPlayers.filter((player) => player.id !== playerId));
  }, [setPlayers]);
  
  // Funkcja do dodania losowego gracza
  const addRandomPlayer = useCallback(() => {
    const randomName = getRandomName();
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: randomName,
      cameraUrl: '',
      points: 0,
      health: 100,
      lives: 3,
      isActive: true,
      isEliminated: false,
      avatar: '',
      color: getRandomNeonColor(),
      uniqueLinkToken: generateUniqueId(),
      specialCards: []
    };

    setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
    
    toast.success(`Dodano gracza ${randomName}`);
  }, [setPlayers]);
  
  // Funkcja do masowego dodawania graczy
  const bulkAddPlayers = useCallback((count: number) => {
    const newPlayers: Player[] = [];
    
    for (let i = 0; i < count; i++) {
      const randomName = getRandomName();
      newPlayers.push({
        id: crypto.randomUUID(),
        name: randomName,
        cameraUrl: '',
        points: 0,
        health: 100,
        lives: 3,
        isActive: true,
        isEliminated: false,
        avatar: '',
        color: getRandomNeonColor(),
        uniqueLinkToken: generateUniqueId(),
        specialCards: []
      });
    }
    
    setPlayers(prevPlayers => [...prevPlayers, ...newPlayers]);
    
    toast.success(`Dodano ${count} graczy`);
  }, [setPlayers]);

  // Funkcja do aktualizacji wielu graczy jednocześnie (zoptymalizowana)
  const updateMultiplePlayers = useCallback((updates: { id: string, changes: Partial<Player> }[]) => {
    setPlayers(prevPlayers => {
      const updatesMap = new Map(updates.map(u => [u.id, u.changes]));
      
      return prevPlayers.map(player => {
        const playerUpdates = updatesMap.get(player.id);
        return playerUpdates ? { ...player, ...playerUpdates } : player;
      });
    });
  }, [setPlayers]);

  return {
    players,
    addPlayer,
    updatePlayer,
    removePlayer,
    createPlayer,
    addRandomPlayer,
    bulkAddPlayers,
    updateMultiplePlayers
  };
};
