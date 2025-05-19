
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PlayerAvailability, PlayerAvailabilitySlot } from '@/types/availability-types';
import { toast } from 'sonner';

export function useAvailability() {
  const [playerAvailability, setPlayerAvailability] = useState<PlayerAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAvailability = async (): Promise<PlayerAvailability[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // W finalnej implementacji powinno to pobierać dane z API
      // ale jako przykład używamy lokalnego stanu
      const { data, error } = await supabase
        .from('player_availability')
        .select('*');
      
      if (error) throw error;
      
      // Przekształć dane z bazy do formatu PlayerAvailability[]
      const formattedData: PlayerAvailability[] = [];
      // Tu powinna być logika transformacji danych z API
      
      setPlayerAvailability(formattedData);
      return formattedData;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Błąd podczas pobierania dostępności graczy');
      console.error('Error fetching availability:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const updateAvailability = async (playerId: string, slot: PlayerAvailabilitySlot): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // W finalnej implementacji powinno to wysyłać PATCH do API
      // ale jako przykład używamy lokalnego stanu
      const { error } = await supabase
        .from('player_availability')
        .upsert({
          player_id: playerId,
          date: slot.date,
          time_slots: slot.timeSlots
        });
      
      if (error) throw error;
      
      // Aktualizuj lokalny stan
      setPlayerAvailability(prev => {
        const playerIndex = prev.findIndex(p => p.playerId === playerId);
        
        if (playerIndex >= 0) {
          const updatedSlots = [...prev[playerIndex].slots];
          const slotIndex = updatedSlots.findIndex(s => s.date === slot.date);
          
          if (slotIndex >= 0) {
            updatedSlots[slotIndex] = slot;
          } else {
            updatedSlots.push(slot);
          }
          
          const updatedAvailability = [...prev];
          updatedAvailability[playerIndex] = {
            ...prev[playerIndex],
            slots: updatedSlots
          };
          
          return updatedAvailability;
        }
        
        // Jeśli gracz nie istnieje, dodaj nowy wpis
        return [...prev, {
          playerId,
          slots: [slot]
        }];
      });
      
      toast.success('Dostępność zaktualizowana');
      return true;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Błąd podczas aktualizacji dostępności');
      console.error('Error updating availability:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    playerAvailability,
    isLoading,
    error,
    fetchAvailability,
    updateAvailability
  };
}
