
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Player } from '@/types/game-types';
import { useGameContext } from '@/context/GameContext';
import { Copy, UserPlus, Trash2, Edit, Link as LinkIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { generatePlayerLink } from '@/lib/supabase';

interface PlayerManagementProps {
  players: Player[];
  addEvent: (event: string) => void;
}

const PlayerManagement: React.FC<PlayerManagementProps> = ({ players, addEvent }) => {
  const { addPlayer } = useGameContext();
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerCamera, setNewPlayerCamera] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ff00ff');
  const [isLoading, setIsLoading] = useState(false);
  
  const colorOptions = [
    { value: '#ff00ff', label: 'Neon Pink' },
    { value: '#00ffff', label: 'Neon Blue' },
    { value: '#ffff00', label: 'Neon Yellow' },
    { value: '#00ff00', label: 'Neon Green' },
    { value: '#ff0000', label: 'Neon Red' },
    { value: '#8B5CF6', label: 'Purple' },
    { value: '#F97316', label: 'Orange' },
    { value: '#0EA5E9', label: 'Sky Blue' },
  ];

  const handleAddPlayer = async () => {
    if (!newPlayerName.trim()) {
      toast.error('Nazwa gracza nie może być pusta');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Generate a token for player access
      const playerToken = crypto.randomUUID();
      
      // Generate a unique token for player links
      const { data: uniqueToken } = await supabase.rpc('generate_unique_player_token');
      
      if (!uniqueToken) {
        throw new Error('Failed to generate unique token');
      }
      
      // Store player in Supabase
      const { data: playerData, error } = await supabase
        .from('players')
        .insert({
          nickname: newPlayerName,
          camera_url: newPlayerCamera,
          color: selectedColor,
          token: playerToken,
          unique_link_token: uniqueToken,
          is_active: true
        })
        .select('*')
        .single();
        
      if (error) throw error;
      
      if (playerData) {
        // Add player to local state
        const newPlayer: Player = {
          id: playerData.id,
          name: playerData.nickname,
          cameraUrl: playerData.camera_url || '',
          points: playerData.points || 0,
          health: playerData.life_percent || 100,
          lives: 3,
          isActive: playerData.is_active || true,
          isEliminated: false,
          avatar: playerData.avatar_url || undefined,
          // Map the color from database
          color: playerData.color || '#ff00ff',
          uniqueLinkToken: playerData.unique_link_token
        };
        
        addPlayer(newPlayer);
        addEvent(`Dodano gracza: ${newPlayerName}`);
        
        toast.success(`Gracz ${newPlayerName} dodany pomyślnie`, {
          description: 'Wygenerowano unikalny link dostępu'
        });
        
        setNewPlayerName('');
        setNewPlayerCamera('');
      }
    } catch (error) {
      console.error('Błąd dodawania gracza:', error);
      toast.error('Nie udało się dodać gracza');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Copy player link to clipboard
  const copyPlayerLink = async (player: Player) => {
    if (!player.uniqueLinkToken) {
      try {
        const result = await generatePlayerLink(player.id);
        
        if (!result.success) {
          toast.error('Nie udało się wygenerować linku dla gracza');
          return;
        }
        
        const playerLink = result.data?.link;
        
        if (playerLink) {
          await navigator.clipboard.writeText(playerLink);
          toast.success('Link skopiowany do schowka', {
            description: 'Możesz go teraz udostępnić graczowi'
          });
          addEvent(`Skopiowano link dla gracza: ${player.name}`);
        }
      } catch (err) {
        console.error('Błąd generowania linku:', err);
        toast.error('Nie udało się wygenerować linku dla gracza');
      }
      return;
    }
    
    const baseUrl = window.location.origin;
    const playerLink = `${baseUrl}/player/${player.uniqueLinkToken}`;
    
    navigator.clipboard.writeText(playerLink)
      .then(() => {
        toast.success('Link skopiowany do schowka', {
          description: 'Możesz go teraz udostępnić graczowi'
        });
        addEvent(`Skopiowano link do gracza: ${player.name}`);
      })
      .catch(err => {
        console.error('Błąd podczas kopiowania:', err);
        toast.error('Nie udało się skopiować linku');
      });
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="neon-card">
        <h2 className="text-xl font-bold mb-4 text-white">Dodawanie graczy</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Nazwa gracza</label>
            <Input
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Nazwa gracza"
              className="bg-black/50 border-white/20 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-white/70 mb-1">URL kamery (opcjonalnie)</label>
            <Input
              value={newPlayerCamera}
              onChange={(e) => setNewPlayerCamera(e.target.value)}
              placeholder="https://..."
              className="bg-black/50 border-white/20 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-white/70 mb-1">Kolor gracza</label>
            <div className="flex gap-2">
              {colorOptions.map(color => (
                <button
                  key={color.value}
                  type="button"
                  className={`w-6 h-6 rounded-full transition-all ${selectedColor === color.value ? 'ring-2 ring-white scale-125' : ''}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setSelectedColor(color.value)}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleAddPlayer}
          className="w-full bg-neon-green text-black hover:bg-neon-green/80"
          disabled={isLoading}
        >
          <UserPlus size={18} className="mr-2" />
          {isLoading ? 'Dodawanie...' : 'Dodaj gracza'}
        </Button>
      </div>
      
      <div className="neon-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Lista graczy ({players.length}/10)</h2>
        </div>
        
        {players.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player) => (
              <div key={player.id} className="border border-white/10 bg-black/30 rounded-md p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: player.color || '#ff00ff' }}
                    />
                    <span className="font-bold text-white">{player.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => copyPlayerLink(player)}
                      className="h-8 w-8 text-neon-blue hover:text-white hover:bg-neon-blue/20"
                      title="Kopiuj link gracza"
                    >
                      <LinkIcon size={16} />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      className="h-8 w-8 text-neon-yellow hover:text-white hover:bg-neon-yellow/20"
                      title="Edytuj gracza"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      className="h-8 w-8 text-neon-red hover:text-white hover:bg-neon-red/20"
                      title="Usuń gracza"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-white/70 mb-1">
                  {player.cameraUrl ? (
                    <span>Kamera: {player.cameraUrl.substring(0, 20)}...</span>
                  ) : (
                    <span>Brak kamery</span>
                  )}
                </div>
                
                <div className="flex justify-between text-xs text-white/50">
                  <span>{player.isActive ? 'Aktywny' : 'Nieaktywny'}</span>
                  <span>{player.points} pkt</span>
                </div>
                
                {player.uniqueLinkToken && (
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-white/50">Link gracza:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-neon-blue hover:text-white"
                      onClick={() => copyPlayerLink(player)}
                    >
                      <Copy size={12} className="mr-1" />
                      Kopiuj link
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-white/50">
            Brak graczy. Dodaj graczy powyżej.
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerManagement;
