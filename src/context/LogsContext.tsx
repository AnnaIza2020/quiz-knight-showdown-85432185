
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { LogEntry } from '@/types/game-types';
import { v4 as uuidv4 } from 'uuid';
import { useGameContext } from './GameContext';

interface LogsContextType {
  logs: LogEntry[];
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  filteredLogs: (types?: string[]) => LogEntry[];
  downloadLogs: (format: 'json' | 'csv') => void;
}

const LogsContext = createContext<LogsContextType | null>(null);

export const useLogsContext = (): LogsContextType => {
  const context = useContext(LogsContext);
  if (!context) {
    throw new Error('useLogsContext must be used within a LogsProvider');
  }
  return context;
};

interface LogsProviderProps {
  children: ReactNode;
}

export const LogsProvider: React.FC<LogsProviderProps> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const { addLog: gameContextAddLog } = useGameContext();

  const addLog = useCallback((log: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog: LogEntry = {
      id: uuidv4(),
      timestamp: Date.now(),
      ...log,
    };
    
    setLogs(prevLogs => [newLog, ...prevLogs]);
    
    // Also update the game context logs if available
    if (gameContextAddLog) {
      gameContextAddLog(log);
    }
  }, [gameContextAddLog]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const filteredLogs = useCallback((types?: string[]) => {
    if (!types || types.length === 0) return logs;
    return logs.filter(log => types.includes(log.type));
  }, [logs]);

  const downloadLogs = useCallback((format: 'json' | 'csv') => {
    if (logs.length === 0) return;
    
    let content: string;
    let filename: string;
    let type: string;
    
    const date = new Date().toISOString().split('T')[0];
    
    if (format === 'json') {
      content = JSON.stringify(logs, null, 2);
      filename = `discord_game_show_logs_${date}.json`;
      type = 'application/json';
    } else {
      // CSV format
      const headers = ['ID', 'Timestamp', 'Type', 'Player', 'Action', 'Value'];
      const rows = logs.map(log => [
        log.id,
        new Date(log.timestamp).toISOString(),
        log.type,
        log.player || '',
        log.action,
        typeof log.value !== 'undefined' ? String(log.value) : ''
      ]);
      
      content = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      filename = `discord_game_show_logs_${date}.csv`;
      type = 'text/csv';
    }
    
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
  }, [logs]);

  const value = {
    logs,
    addLog,
    clearLogs,
    filteredLogs,
    downloadLogs
  };

  return (
    <LogsContext.Provider value={value}>
      {children}
    </LogsContext.Provider>
  );
};
