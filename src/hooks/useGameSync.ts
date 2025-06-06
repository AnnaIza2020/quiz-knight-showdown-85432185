
import { useState, useEffect, useCallback } from 'react';
import { useGameContext } from '@/context/GameContext';

interface GameSyncState {
  isConnected: boolean;
  lastSync: Date | null;
  syncErrors: string[];
}

export const useGameSync = () => {
  const [syncState, setSyncState] = useState<GameSyncState>({
    isConnected: false,
    lastSync: null,
    syncErrors: []
  });

  const { 
    round, 
    players, 
    currentQuestion, 
    timerRunning, 
    timerSeconds,
    addLog 
  } = useGameContext();

  // Mock WebSocket connection
  useEffect(() => {
    // Simulate connection establishment
    const timer = setTimeout(() => {
      setSyncState(prev => ({
        ...prev,
        isConnected: true,
        lastSync: new Date()
      }));
      addLog('Game sync established');
    }, 1000);

    return () => clearTimeout(timer);
  }, [addLog]);

  // Sync game state changes
  useEffect(() => {
    if (syncState.isConnected) {
      setSyncState(prev => ({
        ...prev,
        lastSync: new Date()
      }));
      
      // Log significant state changes
      addLog(`Game state synced - Round: ${round}, Players: ${players.length}`);
    }
  }, [round, players, currentQuestion, timerRunning, timerSeconds, syncState.isConnected, addLog]);

  const forceSync = useCallback(() => {
    setSyncState(prev => ({
      ...prev,
      lastSync: new Date()
    }));
    addLog('Manual sync triggered');
  }, [addLog]);

  const disconnect = useCallback(() => {
    setSyncState(prev => ({
      ...prev,
      isConnected: false
    }));
    addLog('Game sync disconnected');
  }, [addLog]);

  const reconnect = useCallback(() => {
    setSyncState(prev => ({
      ...prev,
      isConnected: true,
      lastSync: new Date()
    }));
    addLog('Game sync reconnected');
  }, [addLog]);

  return {
    ...syncState,
    forceSync,
    disconnect,
    reconnect
  };
};
