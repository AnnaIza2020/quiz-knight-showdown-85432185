
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useGameContext } from '@/context/GameContext';
import { Player } from '@/types/game-types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getRandomName } from '@/utils/name-generator';
import { toast } from 'sonner';
import { generateUniqueId, getRandomNeonColor } from '@/utils/utils';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const SettingsPlayers = () => {
  const { players, setPlayers, addPlayer } = useGameContext();
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerAvatar, setNewPlayerAvatar] = useState('');
  
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
      isActive: false,
      isEliminated: false,
      avatar: '',
      specialCards: [],
      uniqueLinkToken: generateUniqueId(), // Zmieniono z generateUniqueToken na generateUniqueId
      color: getRandomNeonColor()
    };
    
    addPlayer(newPlayer);
    
    toast.success(`Dodano gracza ${randomName}`);
  };
  
  // Function to handle adding a new player
  const handleAddPlayer = () => {
    if (newPlayerName.trim() === '') {
      toast.error('Podaj imię gracza');
      return;
    }
    
    const newPlayer: Player = {
      id: uuidv4(),
      name: newPlayerName,
      avatar: newPlayerAvatar,
      points: 0,
      health: 100,
      lives: 3,
      isEliminated: false,
      specialCards: [],
      uniqueLinkToken: generateUniqueId(), // Zmieniono z generateUniqueToken na generateUniqueId
      color: getRandomNeonColor()
    };
    
    addPlayer(newPlayer);
    
    setNewPlayerName('');
    setNewPlayerAvatar('');
  };
  
  // Function to handle removing a player
  const handleRemovePlayer = (playerId: string) => {
    const updatedPlayers = players.filter(player => player.id !== playerId);
    setPlayers(updatedPlayers);
  };
  
  // Function to handle updating a player's name
  const handleUpdatePlayerName = (playerId: string, newName: string) => {
    const updatedPlayers = players.map(player =>
      player.id === playerId ? { ...player, name: newName } : player
    );
    setPlayers(updatedPlayers);
  };
  
  return (
    <div className="bg-[#0c0e1a] rounded-lg p-6 shadow-lg border border-gray-800">
      <h2 className="text-xl font-bold mb-4 text-white">Zarządzanie Graczami</h2>
      <p className="text-white/60 text-sm mb-6">
        Dodawaj, edytuj i usuwaj graczy biorących udział w teleturnieju.
      </p>
      
      {/* Add Player Form */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-white">Dodaj Gracza</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Imię gracza"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            className="bg-black/40 border-gray-700 text-white"
          />
          <Input
            type="text"
            placeholder="URL Avatara (opcjonalnie)"
            value={newPlayerAvatar}
            onChange={(e) => setNewPlayerAvatar(e.target.value)}
            className="bg-black/40 border-gray-700 text-white"
          />
        </div>
        <div className="flex gap-2 mt-3">
          <Button 
            onClick={handleAddPlayer} 
            className="bg-neon-green hover:bg-neon-green/80 text-black"
          >
            Dodaj Gracza
          </Button>
          <Button 
            onClick={addRandomPlayer} 
            variant="secondary"
          >
            Losowy Gracz
          </Button>
        </div>
      </div>
      
      {/* Player List Table */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-white">Lista Graczy</h3>
        <div className="relative overflow-x-auto">
          <Table>
            <TableCaption>Lista wszystkich graczy w teleturnieju.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Avatar</TableHead>
                <TableHead>Imię</TableHead>
                <TableHead>Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>
                    <Avatar>
                      {player.avatar ? (
                        <AvatarImage src={player.avatar} alt={player.name} />
                      ) : (
                        <AvatarFallback>{player.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      )}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={player.name}
                      onChange={(e) => handleUpdatePlayerName(player.id, e.target.value)}
                      className="bg-black/40 border-gray-700 text-white"
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      onClick={() => handleRemovePlayer(player.id)} 
                      variant="destructive"
                      size="sm"
                    >
                      Usuń
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default SettingsPlayers;
