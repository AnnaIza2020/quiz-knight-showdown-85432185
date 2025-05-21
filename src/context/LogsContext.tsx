
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { LogEntry } from '@/types/game-types';

interface LogsContextType {
  logs: LogEntry[];
  addLog: (log: string | Omit<LogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
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
          level: 'info'
        }
      : {
          id: crypto.randomUUID(),
          timestamp: new Date(),
          level: 'info',
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

  return (
    <LogsContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </LogsContext.Provider>
  );
};
