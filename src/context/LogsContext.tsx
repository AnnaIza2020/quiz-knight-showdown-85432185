
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { LogEntry } from '@/types/game-types';

interface LogsContextType {
  logs: LogEntry[];
  addLog: (log: string | Omit<LogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  downloadLogs: (format: 'json' | 'csv') => void;
}

const LogsContext = createContext<LogsContextType | undefined>(undefined);

export const useLogsContext = () => {
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

  const addLog = (log: string | Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog: LogEntry = typeof log === 'string' 
      ? {
          id: crypto.randomUUID(),
          message: log,
          timestamp: new Date(),
          level: 'info',
          type: 'system',
          action: 'info'
        }
      : {
          id: crypto.randomUUID(),
          timestamp: new Date(),
          level: 'info',
          type: 'system',
          action: 'info',
          ...log
        };

    setLogs(prevLogs => [...prevLogs, newLog]);

    // Show toast for error level logs
    if (newLog.level === 'error') {
      toast.error(newLog.message);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const downloadLogs = (format: 'json' | 'csv') => {
    if (logs.length === 0) {
      toast.error('No logs to download');
      return;
    }

    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'json') {
      content = JSON.stringify(logs, null, 2);
      filename = `discord-game-show-logs-${new Date().toISOString()}.json`;
      mimeType = 'application/json';
    } else {
      // CSV format
      const headers = ['id', 'timestamp', 'level', 'type', 'action', 'player', 'message', 'value'].join(',');
      const rows = logs.map(log => [
        log.id,
        log.timestamp.toISOString(),
        log.level || '',
        log.type || '',
        log.action || '',
        log.player || '',
        `"${(log.message || '').replace(/"/g, '""')}"`,
        log.value ? `"${JSON.stringify(log.value).replace(/"/g, '""')}"` : ''
      ].join(','));
      
      content = [headers, ...rows].join('\n');
      filename = `discord-game-show-logs-${new Date().toISOString()}.csv`;
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Logs downloaded as ${format.toUpperCase()}`);
  };

  return (
    <LogsContext.Provider value={{ logs, addLog, clearLogs, downloadLogs }}>
      {children}
    </LogsContext.Provider>
  );
};
