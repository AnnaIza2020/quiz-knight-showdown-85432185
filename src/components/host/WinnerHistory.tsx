
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Trophy, Calendar, User, Award, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Winner {
  id: string;
  player_name: string;
  round: number;
  score: number;
  created_at: string;
}

const WinnerHistory = () => {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWinners = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('game_winners')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) {
        console.error('Error fetching winners:', error);
        return;
      }
      
      setWinners(data || []);
    } catch (error) {
      console.error('Unexpected error fetching winners:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchWinners();
    
    // Subscribe to winner changes
    const subscription = supabase
      .channel('winners_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'game_winners' 
      }, () => {
        fetchWinners();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const clearHistory = async () => {
    try {
      const { error } = await supabase
        .from('game_winners')
        .delete()
        .neq('id', 'placeholder'); // Delete all records
      
      if (error) {
        console.error('Error clearing winner history:', error);
        toast.error('Błąd podczas czyszczenia historii');
        return;
      }
      
      setWinners([]);
      toast.success('Historia zwycięzców wyczyszczona');
    } catch (error) {
      console.error('Unexpected error clearing history:', error);
      toast.error('Nieoczekiwany błąd');
    }
  };
  
  const getRoundName = (roundNumber: number): string => {
    switch (roundNumber) {
      case 1: return 'Runda 1: Zróżnicowana Wiedza';
      case 2: return 'Runda 2: 5 Sekund';
      case 3: return 'Runda 3: Koło Chaosu';
      default: return `Runda ${roundNumber}`;
    }
  };
  
  return (
    <div className="p-4 border border-white/10 rounded-lg bg-black/30 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Trophy className="mr-2 text-neon-yellow" size={20} />
          Historia Zwycięzców
        </h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchWinners}
            disabled={loading}
            className="text-white/80 hover:text-white"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            disabled={loading || winners.length === 0}
            className="text-white/80 hover:text-red-400"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse flex space-x-2">
              <div className="h-2 w-2 bg-neon-blue rounded-full"></div>
              <div className="h-2 w-2 bg-neon-blue rounded-full"></div>
              <div className="h-2 w-2 bg-neon-blue rounded-full"></div>
            </div>
          </div>
        ) : winners.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <Trophy className="mx-auto mb-2 opacity-50" size={32} />
            <p>Brak historii zwycięzców</p>
            <p className="text-sm">Po zakończeniu gry tutaj pojawią się zwycięzcy</p>
          </div>
        ) : (
          <AnimatePresence>
            {winners.map((winner) => (
              <motion.div
                key={winner.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 border border-white/20 rounded-md bg-black/20 flex items-center"
              >
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <Award className="text-neon-yellow" size={18} />
                    <span className="font-medium text-neon-yellow">{winner.player_name}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="text-xs text-white/70 flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {format(new Date(winner.created_at), 'd MMM yyyy, HH:mm', { locale: pl })}
                    </div>
                    
                    <div className="text-xs text-white/70 flex items-center">
                      <Trophy size={12} className="mr-1" />
                      {getRoundName(winner.round)}
                    </div>
                  </div>
                </div>
                
                <div className="text-lg font-bold text-white">
                  {winner.score} <span className="text-sm">pkt</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default WinnerHistory;
