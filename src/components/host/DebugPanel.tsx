import React, { useState, useEffect } from 'react';
import { Bug, RefreshCw, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGameContext } from '@/context/GameContext';
import { GameRound } from '@/types/game-types';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useLogsContext } from '@/context/LogsContext';

const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline'>('online');
  const [supabaseStatus, setSupabaseStatus] = useState<'connected' | 'error' | 'checking'>('checking');
  const [soundsStatus, setSoundsStatus] = useState<'ok' | 'issues'>('ok');
  const [consoleErrors, setConsoleErrors] = useState<{message: string, count: number, timestamp: number}[]>([]);
  
  const { 
    round,
    players,
    activePlayerId,
    timerRunning,
    timerSeconds,
    availableSounds,
    soundsEnabled,
    hasUndoHistory,
    undoLastAction
  } = useGameContext();
  
  const { logs, addLog } = useLogsContext();
  
  // Check network status
  useEffect(() => {
    const handleOnline = () => setNetworkStatus('online');
    const handleOffline = () => setNetworkStatus('offline');
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial check
    setNetworkStatus(navigator.onLine ? 'online' : 'offline');
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Check Supabase connection
  useEffect(() => {
    const checkSupabase = async () => {
      try {
        setSupabaseStatus('checking');
        const { error } = await supabase.from('players').select('id').limit(1);
        
        if (error) {
          console.error('Supabase connection error:', error);
          setSupabaseStatus('error');
        } else {
          setSupabaseStatus('connected');
        }
      } catch (err) {
        console.error('Failed to check Supabase connection:', err);
        setSupabaseStatus('error');
      }
    };
    
    checkSupabase();
    
    // Recheck periodically
    const interval = setInterval(checkSupabase, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Check sounds status
  useEffect(() => {
    // If we have available sounds and sounds are enabled, we're ok
    if (availableSounds && Object.keys(availableSounds).length > 0 && soundsEnabled) {
      setSoundsStatus('ok');
    } else {
      setSoundsStatus('issues');
    }
  }, [availableSounds, soundsEnabled]);
  
  // Monitor console errors with improved aggregation
  useEffect(() => {
    const originalConsoleError = console.error;
    
    console.error = (...args) => {
      originalConsoleError(...args);
      
      // Convert error to string
      const errorMessage = args.map(arg => 
        typeof arg === 'string' ? arg : JSON.stringify(arg)
      ).join(' ');
      
      // Truncate long error messages
      const truncatedMessage = errorMessage.substring(0, 100) + 
        (errorMessage.length > 100 ? '...' : '');
      
      // Add to system log
      addLog({
        type: 'system',
        action: 'Console Error',
        value: truncatedMessage
      });
      
      // Update errors with aggregation
      setConsoleErrors(prevErrors => {
        // Check if this is a duplicate error
        const existingErrorIndex = prevErrors.findIndex(
          err => err.message === truncatedMessage
        );
        
        if (existingErrorIndex >= 0) {
          // Update existing error count
          const updatedErrors = [...prevErrors];
          updatedErrors[existingErrorIndex] = {
            ...updatedErrors[existingErrorIndex],
            count: updatedErrors[existingErrorIndex].count + 1,
            timestamp: Date.now()
          };
          
          // Sort by timestamp (most recent first)
          return updatedErrors
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 5);
        } else {
          // Add new error
          return [
            { message: truncatedMessage, count: 1, timestamp: Date.now() },
            ...prevErrors.slice(0, 4)
          ];
        }
      });
    };
    
    return () => {
      console.error = originalConsoleError;
    };
  }, [addLog]);
  
  const getRoundName = (round: GameRound) => {
    switch (round) {
      case GameRound.SETUP: return 'Przygotowanie';
      case GameRound.ROUND_ONE: return 'Runda 1';
      case GameRound.ROUND_TWO: return 'Runda 2';
      case GameRound.ROUND_THREE: return 'Runda 3';
      case GameRound.FINISHED: return 'Zakończona';
      default: return `Nieznana (${round})`;
    }
  };
  
  const getActivePlayer = () => {
    if (!activePlayerId) return 'Brak';
    const player = players.find(p => p.id === activePlayerId);
    return player ? player.name : `Nieznany (ID: ${activePlayerId.substring(0, 8)}...)`;
  };
  
  // Utility function to format error counts
  const formatErrorMessage = (error: {message: string, count: number}) => {
    return error.count > 1 
      ? `${error.message} (${error.count}x)` 
      : error.message;
  };
  
  // Helper function to ensure we have the message field
  const ensureMessageField = (log: any) => {
    if (typeof log === 'string') return log;
    
    // If it's an object without message field, add it
    if (typeof log === 'object' && log !== null && !log.message) {
      return {
        ...log,
        message: log.value || `${log.type}: ${log.action}`,
      };
    }
    
    return log;
  };
  
  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <Bug className="mr-2" size={20} />
          <h3 className="font-medium">Panel Diagnostyczny</h3>
        </div>
        <div className="flex items-center">
          {hasUndoHistory && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                undoLastAction();
              }}
              className="mr-2 h-7 text-xs bg-amber-900/20 text-amber-400 border-amber-900/30"
            >
              Cofnij ostatnią akcję
            </Button>
          )}
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-white/10">
              {/* System status indicators */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="bg-black/20 rounded p-2 text-center">
                  <div className="text-xs text-white/60">Sieć</div>
                  <Badge 
                    variant="outline" 
                    className={`${
                      networkStatus === 'online' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                        : 'bg-red-500/20 text-red-400 border-red-500/50'
                    }`}
                  >
                    {networkStatus === 'online' ? 'Online' : 'Offline'}
                  </Badge>
                </div>
                
                <div className="bg-black/20 rounded p-2 text-center">
                  <div className="text-xs text-white/60">Baza danych</div>
                  <Badge 
                    variant="outline" 
                    className={`${
                      supabaseStatus === 'connected' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                        : supabaseStatus === 'checking'
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                          : 'bg-red-500/20 text-red-400 border-red-500/50'
                    }`}
                  >
                    {supabaseStatus === 'connected' 
                      ? 'Połączono' 
                      : supabaseStatus === 'checking'
                        ? 'Sprawdzanie'
                        : 'Błąd'}
                  </Badge>
                </div>
                
                <div className="bg-black/20 rounded p-2 text-center">
                  <div className="text-xs text-white/60">Dźwięki</div>
                  <Badge 
                    variant="outline" 
                    className={`${
                      soundsStatus === 'ok' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                    }`}
                  >
                    {soundsStatus === 'ok' ? 'OK' : 'Problemy'}
                  </Badge>
                </div>
                
                <div className="bg-black/20 rounded p-2 text-center">
                  <div className="text-xs text-white/60">Timer</div>
                  <Badge 
                    variant="outline" 
                    className={`${
                      timerRunning 
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' 
                        : 'bg-gray-500/20 text-gray-400 border-gray-500/50'
                    }`}
                  >
                    {timerRunning ? `${timerSeconds}s` : 'Stop'}
                  </Badge>
                </div>
              </div>
              
              {/* Game status */}
              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Runda:</span>
                  <span className="font-medium">{getRoundName(round)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Aktywny gracz:</span>
                  <span className="font-medium">{getActivePlayer()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Graczy:</span>
                  <span className="font-medium">
                    {players.length} ({players.filter(p => !p.isEliminated).length} aktywnych)
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Logi:</span>
                  <span className="font-medium">
                    {logs.length} ({logs.filter(log => log.type === 'system').length} systemowe)
                  </span>
                </div>
              </div>
              
              {/* Console errors with improved display */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-medium">Błędy konsoli (zagregowane):</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setConsoleErrors([])}
                  >
                    <X size={14} />
                  </Button>
                </div>
                
                <div className="bg-black/30 rounded border border-white/10">
                  {consoleErrors.length > 0 ? (
                    <div className="max-h-24 overflow-y-auto text-xs p-2">
                      {consoleErrors.map((error, index) => (
                        <div key={index} className="text-red-400 pb-1 border-b border-white/5 mb-1">
                          {formatErrorMessage(error)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2 text-xs text-white/50 text-center">
                      Brak błędów w konsoli
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 flex justify-between">
                <span className="text-xs text-white/40">
                  v1.0.2 - {new Date().toLocaleDateString()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw size={12} className="mr-1" /> Odśwież
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DebugPanel;
