import { useState } from 'react';
import { Player } from '@/types/game-types';
import { toast } from 'sonner';

interface PlayerManagementOptions {
  initialPlayers?: Player[];
}

// Helper function to generate a unique token
const generateUniqueToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Helper function to generate a random neon color
const getRandomNeonColor = (): string => {
  const neonColors = ['#00FFFF', '#ADFF2F', '#FF69B4', '#FFD700', '#7FFFD4'];
  return neonColors[Math.floor(Math.random() * neonColors.length)];
};

// Helper function to generate a random name
const getRandomName = (): string => {
  const names = ['Neo', 'Trinity', 'Morpheus', 'Agent Smith', 'Oracle'];
  return names[Math.floor(Math.random() * names.length)];
};

export const usePlayerManagement = (options?: PlayerManagementOptions) => {
  const [players, setPlayers] = useState<Player[]>(options?.initialPlayers || []);
  
  // Function to create a player with default values
  const createPlayer = (data: Partial<Player>): Player => {
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
      uniqueLinkToken: data.uniqueLinkToken || generateUniqueToken()
    };
  };

  // Function to add a new player
  const addPlayer = (player: Player) => {
    setPlayers((prevPlayers) => [...prevPlayers, player]);
  };

  // Function to update an existing player
  const updatePlayer = (playerId: string, updates: Partial<Player>) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === playerId ? { ...player, ...updates } : player
      )
    );
  };

  // Function to remove a player
  const removePlayer = (playerId: string) => {
    setPlayers((prevPlayers) => prevPlayers.filter((player) => player.id !== playerId));
  };
  
  // Function to add a random player
  const addRandomPlayer = () => {
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
      uniqueLinkToken: generateUniqueToken(),
      specialCards: []
    };

    setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
    
    toast.success(`Dodano gracza ${randomName}`);
  };
  
  // Function to bulk add players
  const bulkAddPlayers = (count: number) => {
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
        uniqueLinkToken: generateUniqueToken(),
        specialCards: []
      });
    }
    
    setPlayers(prevPlayers => [...prevPlayers, ...newPlayers]);
    
    toast.success(`Dodano ${count} graczy`);
  };

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
