
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface SystemInfo {
  userAgent: string;
  platform: string;
  language: string;
  cookiesEnabled: boolean;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  localStorage: boolean;
  sessionStorage: boolean;
  webSockets: boolean;
  worker: boolean;
  connectivity: 'online' | 'offline';
  performance: {
    memory?: {
      jsHeapSizeLimit?: number;
      totalJSHeapSize?: number;
      usedJSHeapSize?: number;
    }
  };
}

const SystemInfoPanel: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    userAgent: '',
    platform: '',
    language: '',
    cookiesEnabled: false,
    screenWidth: 0,
    screenHeight: 0,
    pixelRatio: 1,
    localStorage: false,
    sessionStorage: false,
    webSockets: false,
    worker: false,
    connectivity: 'offline',
    performance: {}
  });

  useEffect(() => {
    // Collect system information
    const info: SystemInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      pixelRatio: window.devicePixelRatio,
      localStorage: !!window.localStorage,
      sessionStorage: !!window.sessionStorage,
      webSockets: 'WebSocket' in window,
      worker: 'Worker' in window,
      connectivity: navigator.onLine ? 'online' : 'offline',
      performance: {}
    };

    // Try to get memory usage info if available
    if (window.performance && (performance as any).memory) {
      info.performance.memory = (performance as any).memory;
    }

    setSystemInfo(info);
    
    // Update connectivity status when it changes
    const handleOnline = () => {
      setSystemInfo(prev => ({ ...prev, connectivity: 'online' }));
    };
    
    const handleOffline = () => {
      setSystemInfo(prev => ({ ...prev, connectivity: 'offline' }));
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const copySystemInfo = () => {
    const infoString = JSON.stringify(systemInfo, null, 2);
    navigator.clipboard.writeText(infoString)
      .then(() => toast.success("System info copied to clipboard"))
      .catch(err => toast.error("Failed to copy system info"));
  };

  return (
    <div className="p-4 bg-black/30 rounded-md border border-white/10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">System Information</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={copySystemInfo}
          className="text-xs"
        >
          <Copy className="h-3 w-3 mr-1" /> Copy
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
        <div>Browser:</div>
        <div className="font-mono text-xs">{systemInfo.userAgent.split(' ').slice(-1)[0]}</div>
        
        <div>Platform:</div>
        <div className="font-mono text-xs">{systemInfo.platform}</div>
        
        <div>Screen Resolution:</div>
        <div className="font-mono text-xs">
          {systemInfo.screenWidth} × {systemInfo.screenHeight} ({systemInfo.pixelRatio}x)
        </div>
        
        <div>Network Status:</div>
        <div>
          <Badge 
            className={systemInfo.connectivity === 'online' ? 
              'bg-green-900/20 text-green-400' : 
              'bg-red-900/20 text-red-400'
            }
          >
            {systemInfo.connectivity}
          </Badge>
        </div>
      </div>
      
      <Separator className="my-4 bg-white/10" />
      
      <div className="grid grid-cols-4 gap-2">
        <StatusBadge title="LocalStorage" status={systemInfo.localStorage} />
        <StatusBadge title="WebSockets" status={systemInfo.webSockets} />
        <StatusBadge title="Workers" status={systemInfo.worker} />
        <StatusBadge title="Cookies" status={systemInfo.cookiesEnabled} />
      </div>
      
      {systemInfo.performance.memory && (
        <div className="mt-4 p-2 bg-black/20 rounded text-xs">
          <div className="text-white/60 mb-1">Memory Usage:</div>
          <div className="grid grid-cols-2 gap-1">
            <div>Used:</div>
            <div className="font-mono">
              {Math.round(systemInfo.performance.memory.usedJSHeapSize! / 1048576)} MB
            </div>
            <div>Total Allocated:</div>
            <div className="font-mono">
              {Math.round(systemInfo.performance.memory.totalJSHeapSize! / 1048576)} MB
            </div>
            <div>Limit:</div>
            <div className="font-mono">
              {Math.round(systemInfo.performance.memory.jsHeapSizeLimit! / 1048576)} MB
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusBadge: React.FC<{ title: string; status: boolean }> = ({ title, status }) => (
  <div className="flex flex-col items-center">
    <span className="text-xs mb-1">{title}</span>
    <Badge 
      variant="outline" 
      className={status ? 
        'bg-green-900/20 text-green-400 border-green-900/30' : 
        'bg-red-900/20 text-red-400 border-red-900/30'
      }
    >
      {status ? 'Supported' : 'Not Available'}
    </Badge>
  </div>
);

export default SystemInfoPanel;
