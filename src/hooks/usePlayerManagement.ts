
import { useState, useCallback } from 'react';
import { Player } from '@/types/game-types';
import { toast } from 'sonner';
import { generateUniqueId, getRandomNeonColor } from '@/utils/utils';
import { getRandomName } from '@/utils/name-generator';

interface PlayerManagementOptions {
  initialPlayers?: Player[];
}

export const usePlayerManagement = (options?: PlayerManagementOptions) => {
  const [players, setPlayers] = useState<Player[]>(options?.initialPlayers || []);
  
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
  }, []);

  // Funkcja do aktualizacji istniejącego gracza
  const updatePlayer = useCallback((playerId: string, updates: Partial<Player>) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === playerId ? { ...player, ...updates } : player
      )
    );
  }, []);

  // Funkcja do usuwania gracza
  const removePlayer = useCallback((playerId: string) => {
    setPlayers((prevPlayers) => prevPlayers.filter((player) => player.id !== playerId));
  }, []);
  
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
  }, []);
  
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
  }, []);

  return {
    players,
    addPlayer,
    updatePlayer,
    removePlayer,
    createPlayer,
    addRandomPlayer,
    bulkAddPlayers
  };
};
