
import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useGameContext } from '@/context/GameContext';
import { Player } from '@/types/game-types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
} from "@/components/ui/table";
import { Copy, Camera, User, Link as LinkIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const SettingsPlayers = () => {
  const { players, setPlayers, addPlayer } = useGameContext();
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerAvatar, setNewPlayerAvatar] = useState('');
  const [newPlayerCamera, setNewPlayerCamera] = useState('');
  const [previewLoading, setPreviewLoading] = useState<{[key: string]: boolean}>({});
  const linkModalRef = useRef<HTMLDivElement>(null);
  
  // Funkcja do kopiowania linku gracza do schowka
  const copyPlayerLink = (token: string) => {
    const baseUrl = window.location.origin;
    const playerLink = `${baseUrl}/player/${token}`;
    
    navigator.clipboard.writeText(playerLink).then(() => {
      toast.success("Link skopiowany do schowka");
    }).catch(() => {
      toast.error("Nie można skopiować linku");
    });
  };
  
  // Funkcja do dodania losowego gracza
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
      uniqueLinkToken: generateUniqueId(),
      color: getRandomNeonColor()
    };
    
    addPlayer(newPlayer);
    
    toast.success(`Dodano gracza ${randomName}`);
  };
  
  // Funkcja do obsługi podglądu kamery
  const handleCameraPreview = (playerId: string, cameraUrl: string) => {
    if (!cameraUrl) {
      toast.error('Brak URL kamery');
      return;
    }
    
    setPreviewLoading(prev => ({ ...prev, [playerId]: true }));
    
    // Symulujemy ładowanie kamery
    setTimeout(() => {
      setPreviewLoading(prev => ({ ...prev, [playerId]: false }));
      toast.success('Kamera załadowana pomyślnie');
    }, 1500);
  };
  
  // Funkcja do obsługi dodawania nowego gracza
  const handleAddPlayer = () => {
    if (newPlayerName.trim() === '') {
      toast.error('Podaj imię gracza');
      return;
    }
    
    const newPlayer: Player = {
      id: uuidv4(),
      name: newPlayerName,
      avatar: newPlayerAvatar,
      cameraUrl: newPlayerCamera,
      points: 0,
      health: 100,
      lives: 3,
      isEliminated: false,
      specialCards: [],
      uniqueLinkToken: generateUniqueId(),
      color: getRandomNeonColor()
    };
    
    addPlayer(newPlayer);
    
    setNewPlayerName('');
    setNewPlayerAvatar('');
    setNewPlayerCamera('');
  };
  
  // Funkcja do obsługi usuwania gracza
  const handleRemovePlayer = (playerId: string) => {
    const updatedPlayers = players.filter(player => player.id !== playerId);
    setPlayers(updatedPlayers);
    toast.info("Gracz został usunięty");
  };
  
  // Funkcja do obsługi aktualizacji danych gracza
  const handleUpdatePlayerField = (playerId: string, field: keyof Player, value: string) => {
    const updatedPlayers = players.map(player =>
      player.id === playerId ? { ...player, [field]: value } : player
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
      <div className="mb-6 p-4 bg-black/30 border border-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-white">Dodaj Gracza</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-white/70 mb-1 block">Imię gracza</label>
            <Input
              type="text"
              placeholder="Imię gracza"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              className="bg-black/40 border-gray-700 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-white/70 mb-1 block">URL Avatara (opcjonalnie)</label>
            <Input
              type="text"
              placeholder="URL Avatara"
              value={newPlayerAvatar}
              onChange={(e) => setNewPlayerAvatar(e.target.value)}
              className="bg-black/40 border-gray-700 text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-white/70 mb-1 block">URL Kamery (opcjonalnie, np. ninja.vk)</label>
            <Input
              type="text"
              placeholder="URL Kamery (np. https://ninja.vk/player/abc123)"
              value={newPlayerCamera}
              onChange={(e) => setNewPlayerCamera(e.target.value)}
              className="bg-black/40 border-gray-700 text-white"
            />
          </div>
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
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead>Imię</TableHead>
                <TableHead>Kamera</TableHead>
                <TableHead>Link</TableHead>
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
                        <AvatarFallback style={{ backgroundColor: player.color || '#333' }}>{player.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      )}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={player.name}
                      onChange={(e) => handleUpdatePlayerField(player.id, 'name', e.target.value)}
                      className="bg-black/40 border-gray-700 text-white"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={player.cameraUrl || ''}
                        onChange={(e) => handleUpdatePlayerField(player.id, 'cameraUrl', e.target.value)}
                        placeholder="URL kamery"
                        className="bg-black/40 border-gray-700 text-white"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleCameraPreview(player.id, player.cameraUrl || '')}
                        disabled={!player.cameraUrl}
                        className="flex-shrink-0"
                      >
                        {previewLoading[player.id] ? (
                          <Skeleton className="h-5 w-5 rounded-full" />
                        ) : (
                          <Camera size={16} />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => copyPlayerLink(player.uniqueLinkToken)}
                    >
                      <LinkIcon size={14} className="mr-1" />
                      Kopiuj link
                    </Button>
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
