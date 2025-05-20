
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const ConnectionStatusPanel: React.FC = () => {
  const [statuses, setStatuses] = useState({
    database: { status: 'checking', latency: 0 },
    obs: { status: 'unknown', latency: 0 },
    discord: { status: 'unknown', latency: 0 },
    api: { status: 'unknown', latency: 0 }
  });
  
  const [isChecking, setIsChecking] = useState(false);

  const testDatabaseConnection = async () => {
    try {
      const startTime = performance.now();
      
      const { error } = await supabase
        .from('players')
        .select('id')
        .limit(1);
      
      const latency = Math.round(performance.now() - startTime);
      
      if (error) {
        setStatuses(prev => ({
          ...prev,
          database: { status: 'error', latency }
        }));
        console.error('Database connection error:', error);
      } else {
        setStatuses(prev => ({
          ...prev,
          database: { status: 'connected', latency }
        }));
      }
    } catch (err) {
      setStatuses(prev => ({
        ...prev,
        database: { status: 'error', latency: 0 }
      }));
      console.error('Failed to check database connection:', err);
    }
  };
  
  // Simulated tests for other services
  // In a real implementation, these would connect to actual services
  const testObsConnection = async () => {
    // Simulated OBS WebSocket connection test
    try {
      const startTime = performance.now();
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
      
      const latency = Math.round(performance.now() - startTime);
      
      // Simulate connection status (this would be replaced with actual OBS WebSocket code)
      const connected = Math.random() > 0.3;
      
      setStatuses(prev => ({
        ...prev,
        obs: { 
          status: connected ? 'connected' : 'error', 
          latency 
        }
      }));
    } catch (err) {
      setStatuses(prev => ({
        ...prev,
        obs: { status: 'error', latency: 0 }
      }));
    }
  };
  
  const testDiscordConnection = async () => {
    // Simulated Discord bot connection test
    try {
      const startTime = performance.now();
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
      
      const latency = Math.round(performance.now() - startTime);
      
      // Simulate connection status
      const connected = Math.random() > 0.2;
      
      setStatuses(prev => ({
        ...prev,
        discord: { 
          status: connected ? 'connected' : 'error', 
          latency 
        }
      }));
    } catch (err) {
      setStatuses(prev => ({
        ...prev,
        discord: { status: 'error', latency: 0 }
      }));
    }
  };
  
  const testApiConnection = async () => {
    // API endpoint test
    try {
      const startTime = performance.now();
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));
      
      const latency = Math.round(performance.now() - startTime);
      
      // Simulate API status
      const connected = Math.random() > 0.1;
      
      setStatuses(prev => ({
        ...prev,
        api: { 
          status: connected ? 'connected' : 'error', 
          latency 
        }
      }));
    } catch (err) {
      setStatuses(prev => ({
        ...prev,
        api: { status: 'error', latency: 0 }
      }));
    }
  };

  const checkAllConnections = async () => {
    setIsChecking(true);
    
    try {
      // Reset statuses to checking
      setStatuses({
        database: { status: 'checking', latency: 0 },
        obs: { status: 'checking', latency: 0 },
        discord: { status: 'checking', latency: 0 },
        api: { status: 'checking', latency: 0 }
      });
      
      // Run all tests in parallel
      await Promise.all([
        testDatabaseConnection(),
        testObsConnection(),
        testDiscordConnection(),
        testApiConnection(),
      ]);
      
      toast.success('All connection tests completed');
    } catch (error) {
      console.error('Error during connection tests:', error);
      toast.error('Failed to complete connection tests');
    } finally {
      setIsChecking(false);
    }
  };

  // Initial connection check
  useEffect(() => {
    checkAllConnections();
  }, []);

  return (
    <div className="p-4 bg-black/30 rounded-md border border-white/10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Connection Status</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={checkAllConnections}
          disabled={isChecking}
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${isChecking ? 'animate-spin' : ''}`} /> 
          {isChecking ? 'Checking...' : 'Check Connections'}
        </Button>
      </div>
      
      <div className="grid gap-3">
        <ConnectionStatusItem 
          name="Database" 
          status={statuses.database.status} 
          latency={statuses.database.latency}
        />
        
        <ConnectionStatusItem 
          name="OBS WebSocket" 
          status={statuses.obs.status} 
          latency={statuses.obs.latency}
        />
        
        <ConnectionStatusItem 
          name="Discord Bot" 
          status={statuses.discord.status} 
          latency={statuses.discord.latency}
        />
        
        <ConnectionStatusItem 
          name="API" 
          status={statuses.api.status} 
          latency={statuses.api.latency}
        />
      </div>
    </div>
  );
};

interface ConnectionStatusItemProps {
  name: string;
  status: string;
  latency: number;
}

const ConnectionStatusItem: React.FC<ConnectionStatusItemProps> = ({ name, status, latency }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-900/20 text-green-400 border-green-900/30';
      case 'checking':
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-900/30';
      case 'error':
        return 'bg-red-900/20 text-red-400 border-red-900/30';
      default:
        return 'bg-gray-900/20 text-gray-400 border-gray-900/30';
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'checking':
        return 'Checking...';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };
  
  return (
    <div className="flex justify-between items-center py-1 px-2 bg-black/20 rounded">
      <div className="text-sm">{name}</div>
      <div className="flex items-center gap-2">
        {latency > 0 && (
          <span className={`text-xs ${
            latency < 200 
              ? 'text-green-400' 
              : latency < 500 
                ? 'text-yellow-400' 
                : 'text-red-400'
          }`}>
            {latency}ms
          </span>
        )}
        <Badge 
          variant="outline"
          className={getStatusColor()}
        >
          {getStatusText()}
        </Badge>
      </div>
    </div>
  );
};

export default ConnectionStatusPanel;
