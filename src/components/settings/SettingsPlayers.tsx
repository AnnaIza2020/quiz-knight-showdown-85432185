
import React, { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Copy, Edit, Trash2, LinkIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

// Extended color palette
const COLOR_OPTIONS = [
  '#FF5252', // czerwony
  '#FF4081', // różowy
  '#AA00FF', // fioletowy
  '#6200EA', // głęboki fioletowy
  '#304FFE', // indygo
  '#2979FF', // niebieski
  '#00B0FF', // jasnoniebieski
  '#00E5FF', // cyjan
  '#1DE9B6', // turkusowy
  '#00C853', // zielony
  '#76FF03', // jasnozielony
  '#FFEA00', // żółty
  '#FFC400', // bursztynowy
  '#FF9100', // pomarańczowy
  '#FF3D00', // głęboki pomarańczowy
];

const SettingsPlayers = () => {
  const { players, addPlayer, removePlayer, updatePlayer } = useGameContext();
  const { toast } = useToast();
  
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    cameraUrl: '',
    color: COLOR_OPTIONS[0],
  });
  
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayer.name) return;
    
    // Check if name is already taken
    const nameExists = players.some(p => p.name.toLowerCase() === newPlayer.name.toLowerCase());
    if (nameExists) {
      toast({
        title: "Nazwa zajęta",
        description: "Ten nick jest już używany przez innego gracza",
        variant: "destructive"
      });
      return;
    }
    
    const playerId = Math.random().toString(36).substring(2, 9);
    
    addPlayer({
      id: playerId,
      name: newPlayer.name,
      cameraUrl: newPlayer.cameraUrl,
      points: 0,
      health: 100,
      lives: 3,
      isActive: false,
      isEliminated: false,
      avatar: newPlayer.color // Using color as avatar for now
    });
    
    toast({
      title: "Gracz dodany",
      description: `Dodano gracza "${newPlayer.name}" do gry`
    });
    
    setNewPlayer({
      name: '',
      cameraUrl: '',
      color: COLOR_OPTIONS[0]
    });
  };

  const handleEditClick = (player) => {
    setEditingPlayer({
      ...player,
      color: player.avatar || COLOR_OPTIONS[0]
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditingPlayer(null);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (!editingPlayer) return;
    
    // Check if name is already taken by another player
    const nameExists = players.some(
      p => p.id !== editingPlayer.id && p.name.toLowerCase() === editingPlayer.name.toLowerCase()
    );
    
    if (nameExists) {
      toast({
        title: "Nazwa zajęta",
        description: "Ten nick jest już używany przez innego gracza",
        variant: "destructive"
      });
      return;
    }
    
    updatePlayer({
      ...editingPlayer,
      avatar: editingPlayer.color
    });
    
    toast({
      title: "Gracz zaktualizowany",
      description: `Zaktualizowano dane gracza "${editingPlayer.name}"`
    });
    
    setEditingPlayer(null);
    setIsEditing(false);
  };
  
  const copyPlayerLink = (player) => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/player/${player.id}`;
    
    navigator.clipboard.writeText(url)
      .then(() => {
        toast({
          title: "Link skopiowany",
          description: "Link gracza został skopiowany do schowka"
        });
      })
      .catch(() => {
        toast({
          title: "Błąd kopiowania",
          description: "Nie udało się skopiować linku do schowka",
          variant: "destructive"
        });
      });
  };
  
  return (
    <div className="bg-[#0c0e1a] rounded-lg p-6 shadow-lg border border-gray-800">
      <h2 className="text-xl font-bold mb-2 text-white">Ustawienia graczy</h2>
      <p className="text-white/60 text-sm mb-6">
        Tutaj zarządzasz uczestnikami show – nazwami, dostępem i kamerami.
      </p>
      
      {isEditing ? (
        <div className="border border-gray-700 rounded-lg p-5 mb-6 bg-black/40">
          <h3 className="font-medium text-lg mb-4 text-white">Edytuj gracza</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-player-name" className="text-white mb-1">Nick gracza *</Label>
              <Input 
                id="edit-player-name"
                type="text"
                value={editingPlayer.name}
                onChange={(e) => setEditingPlayer({...editingPlayer, name: e.target.value})}
                className="bg-black/50 border border-gray-700 text-white"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="edit-camera-url" className="text-white mb-1">URL kamery</Label>
              <Input 
                id="edit-camera-url"
                type="text"
                placeholder="https://vdo.ninja/?view=..."
                value={editingPlayer.cameraUrl}
                onChange={(e) => setEditingPlayer({...editingPlayer, cameraUrl: e.target.value})}
                className="bg-black/50 border border-gray-700 text-white"
              />
            </div>
            
            <div>
              <Label className="text-white mb-2 block">Kolor gracza</Label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <div 
                    key={color}
                    className={`w-8 h-8 rounded-full cursor-pointer transition-transform ${editingPlayer.color === color ? 'ring-2 ring-white scale-110' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setEditingPlayer({...editingPlayer, color})}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex gap-3 mt-4">
              <Button 
                onClick={handleSaveEdit}
                className="flex-1 bg-neon-green hover:bg-neon-green/80 text-black"
              >
                Zapisz zmiany
              </Button>
              
              <Button 
                onClick={handleCancelEdit}
                variant="outline"
                className="flex-1 border-gray-600 text-white"
              >
                Anuluj
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column - Add player form */}
          <div>
            <h3 className="font-medium text-lg mb-4">Dodaj nowego gracza</h3>
            <form onSubmit={handleAddPlayer} className="space-y-4">
              <div>
                <Label htmlFor="player-name" className="text-white mb-1">Nick gracza *</Label>
                <Input 
                  id="player-name"
                  type="text"
                  placeholder="Wprowadź nick gracza"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                  className="bg-black/50 border border-gray-700 text-white"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="camera-url" className="text-white mb-1">URL kamery (VDO.Ninja)</Label>
                <Input 
                  id="camera-url"
                  type="text"
                  placeholder="https://vdo.ninja/?view=..."
                  value={newPlayer.cameraUrl}
                  onChange={(e) => setNewPlayer({...newPlayer, cameraUrl: e.target.value})}
                  className="bg-black/50 border border-gray-700 text-white"
                />
              </div>
              
              <div>
                <Label className="text-white mb-2 block">Kolor gracza</Label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <div 
                      key={color}
                      className={`w-8 h-8 rounded-full cursor-pointer transition-transform ${newPlayer.color === color ? 'ring-2 ring-white scale-110' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewPlayer({...newPlayer, color})}
                    />
                  ))}
                </div>
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-neon-pink hover:bg-neon-pink/80 text-white"
              >
                <Plus size={18} className="mr-2" />
                Dodaj gracza
              </Button>
            </form>
          </div>
          
          {/* Right column - Player list and links */}
          <div>
            <h3 className="font-medium text-lg mb-3">Lista graczy</h3>
            {players.length === 0 ? (
              <p className="text-white/60 text-center py-8 border border-dashed border-gray-700 rounded bg-black/20">
                Nie dodano jeszcze żadnych graczy
              </p>
            ) : (
              <div className="border border-gray-800 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-black/50 border-b border-gray-800">
                      <TableHead className="text-white">Nick</TableHead>
                      <TableHead className="text-white">Kolor</TableHead>
                      <TableHead className="text-right text-white">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {players.map(player => (
                      <TableRow 
                        key={player.id}
                        className="border-b border-gray-800 hover:bg-black/50"
                      >
                        <TableCell className="font-medium text-white">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: player.avatar || '#FF5252' }}
                            />
                            <span>{player.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="text-xs text-white/60 truncate max-w-[120px]">
                              {player.cameraUrl ? 'VDO.Ninja' : 'Bez kamery'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => copyPlayerLink(player)}
                              className="h-8 w-8 text-neon-blue hover:text-white hover:bg-neon-blue/20"
                              title="Kopiuj link gracza"
                            >
                              <LinkIcon className="h-4 w-4" />
                            </Button>
                            
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => handleEditClick(player)}
                              className="h-8 w-8 text-neon-yellow hover:text-white hover:bg-neon-yellow/20"
                              title="Edytuj gracza"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => removePlayer(player.id)}
                              className="h-8 w-8 text-red-500 hover:text-white hover:bg-red-950/30"
                              title="Usuń gracza"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            <div className="mt-6">
              <h3 className="font-medium text-lg mb-3">Instrukcje dla graczy</h3>
              <div className="bg-black/30 border border-gray-800 rounded-lg p-4 text-white/80 text-sm">
                <p>
                  Każdy gracz powinien użyć wygenerowanego linku, aby dołączyć do gry. Link prowadzi do panelu gracza, 
                  który wyświetla aktualny stan gry oraz transmituje kamerę gracza.
                </p>
                <p className="mt-2">
                  Skopiuj link używając przycisku <LinkIcon className="inline h-3 w-3" /> i przekaż go uczestnikowi.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPlayers;
