
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import PlayerViewContent from '@/components/PlayerViewContent';

const PlayerView = () => {
  const { playerToken } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load player data from Supabase
  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);
        
        if (!playerToken) {
          setError('Nieprawidłowy token gracza');
          return;
        }
        
        // Use a link token to find the player
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .eq('unique_link_token', playerToken)
          .single();
        
        if (error) {
          console.error('Error fetching player:', error);
          setError('Nie udało się znaleźć gracza z podanym tokenem');
          return;
        }
        
        if (!data) {
          setError('Nie znaleziono gracza z podanym tokenem');
          return;
        }
        
        setPlayer(data);
        
        // Store the player tokens in local storage for reconnection
        localStorage.setItem('player-token', data.token);
        localStorage.setItem('player-link-token', data.unique_link_token || '');
        
        // Show success message
        toast.success(`Witaj, ${data.nickname}!`, {
          description: 'Połączono z grą pomyślnie'
        });
          
      } catch (err) {
        console.error('Error:', err);
        setError('Wystąpił błąd podczas ładowania danych gracza');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlayerData();
  }, [playerToken]);
  
  // Try to reconnect if token is found in localStorage
  useEffect(() => {
    if (!playerToken) {
      const storedToken = localStorage.getItem('player-link-token');
      if (storedToken) {
        navigate(`/player/${storedToken}`);
      }
    }
  }, [playerToken, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-neon-background flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
          <div className="text-white text-xl">Łączenie z panelem gracza...</div>
        </div>
      </div>
    );
  }
  
  if (error || !player) {
    return (
      <div className="min-h-screen bg-neon-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-6 rounded-lg border border-red-500 bg-black/50 shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="text-red-500 w-12 h-12" />
          </div>
          <h1 className="text-red-500 text-2xl mb-4 text-center font-bold">Błąd połączenia</h1>
          <p className="text-white text-center mb-4">{error || 'Nie można załadować panelu gracza'}</p>
          <p className="text-white/50 text-center mb-6">
            Sprawdź, czy link jest poprawny lub skontaktuj się z hostem gry.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-neon-background p-4 flex flex-col">
      <PlayerViewContent player={player} />
    </div>
  );
};

export default PlayerView;
