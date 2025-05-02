
import React, { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

const COLOR_OPTIONS = [
  '#FF5252', // red
  '#FF4081', // pink
  '#AA00FF', // purple
  '#6200EA', // deep purple
  '#304FFE', // indigo
  '#2979FF', // blue
  '#00B0FF', // light blue
  '#00E5FF', // cyan
  '#1DE9B6', // teal
  '#00C853', // green
  '#76FF03', // light green
  '#FFEA00', // yellow
];

const SettingsPlayers = () => {
  const { players, addPlayer, removePlayer } = useGameContext();
  
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    cameraUrl: '',
    color: COLOR_OPTIONS[0],
  });
  
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayer.name) return;
    
    addPlayer({
      id: Math.random().toString(36).substring(2, 9),
      name: newPlayer.name,
      cameraUrl: newPlayer.cameraUrl,
      points: 0,
      health: 100,
      lives: 3,
      isActive: false,
      isEliminated: false,
      avatar: newPlayer.color // Using color as avatar for now
    });
    
    setNewPlayer({
      name: '',
      cameraUrl: '',
      color: COLOR_OPTIONS[0]
    });
  };
  
  return (
    <div className="bg-[#0c0e1a] rounded-lg p-6 shadow-lg border border-gray-800">
      <h2 className="text-xl font-bold mb-2 text-white">Ustawienia graczy</h2>
      <p className="text-white/60 text-sm mb-6">
        Tutaj zarządzasz uczestnikami show – nazwami, dostępem i kamerami.
      </p>
      
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
              <Label htmlFor="avatar-url" className="text-white mb-1">URL awatara</Label>
              <Input 
                id="avatar-url"
                type="text"
                placeholder="https://example.com/avatar.png"
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
            
            <div>
              <Label className="text-white mb-1">Kamera</Label>
              <p className="text-xs text-white/60 mb-4">
                Możliwość integracji z OBS/Discord będzie dostępna wkrótce
              </p>
            </div>
            
            <Button 
              type="submit"
              className="w-full bg-neon-pink hover:bg-neon-pink/80 text-white"
            >
              Dodaj gracza
            </Button>
          </form>
        </div>
        
        {/* Right column - Player list and links */}
        <div>
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-2">Generowanie linków uczestnictwa</h3>
            <div className="flex gap-2 mb-4">
              <Button className="bg-neon-blue hover:bg-neon-blue/80">
                Generuj globalny link
              </Button>
              <Button variant="outline" className="text-white border-gray-600">
                Instrukcja
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-3">Lista graczy</h3>
            {players.length === 0 ? (
              <p className="text-white/60 text-center py-4 border border-dashed border-gray-700 rounded bg-black/20">
                Nie dodano jeszcze żadnych graczy
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {players.map(player => (
                  <div 
                    key={player.id}
                    className="flex items-center justify-between p-3 bg-black/30 rounded border border-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: player.avatar || '#FF5252' }}
                      />
                      <div>
                        <p className="font-medium">{player.name}</p>
                        <p className="text-xs text-white/60 truncate max-w-[200px]">
                          {player.cameraUrl || 'Brak kamery'}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => removePlayer(player.id)}
                      className="h-8 text-red-500 hover:text-red-300 hover:bg-red-950/30"
                    >
                      Usuń
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPlayers;
