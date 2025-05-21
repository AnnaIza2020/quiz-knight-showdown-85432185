
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useGameContext } from '@/context/GameContext';
import { SoundEffect, GameSound } from '@/types/game-types';
import { supabase } from '@/lib/supabase';

import SystemInfoPanel from './SystemInfoPanel';
import ConnectionStatusPanel from './ConnectionStatusPanel';
import TestAnimationsPanel from './TestAnimationsPanel';
import LogsPanel from './LogsPanel';
import { toast } from 'sonner';

const DiagnosticsPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { playSound, soundsEnabled, availableSounds } = useGameContext();
  const [databaseStatus, setDatabaseStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    // Check database connection
    const checkDatabaseConnection = async () => {
      try {
        const { error } = await supabase
          .from('players')
          .select('id')
          .limit(1);
        
        if (error) {
          console.error('Database connection error:', error);
          setDatabaseStatus('error');
        } else {
          setDatabaseStatus('connected');
        }
      } catch (err) {
        console.error('Failed to check database connection:', err);
        setDatabaseStatus('error');
      }
    };
    
    checkDatabaseConnection();
  }, []);

  const handlePlaySound = (sound: SoundEffect) => {
    if (!soundsEnabled) {
      toast.warning('Sounds are currently disabled in settings');
      return;
    }
    
    playSound(sound);
    toast.success(`Playing sound: ${sound}`);
  };

  const handleClearCache = () => {
    if (window.confirm('This will clear your browser cache for this app. Continue?')) {
      localStorage.clear();
      sessionStorage.clear();
      toast.success('Cache cleared. Reloading application...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  // Helper function to render a game sound as text
  const renderGameSound = (sound: GameSound | string): React.ReactNode => {
    if (typeof sound === 'string') {
      return <span>{sound}</span>;
    } else if (typeof sound === 'object' && sound !== null) {
      return <span>{sound.name} ({sound.file})</span>;
    }
    return <span>Unknown sound format</span>;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border border-white/10">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>System Diagnostics</span>
            <Badge className={databaseStatus === 'connected' 
              ? 'bg-green-600/30 text-green-400' 
              : databaseStatus === 'checking' 
                ? 'bg-yellow-600/30 text-yellow-400'
                : 'bg-red-600/30 text-red-400'
            }>
              {databaseStatus === 'connected' 
                ? 'Connected' 
                : databaseStatus === 'checking' 
                  ? 'Checking...'
                  : 'Error'
              }
            </Badge>
          </CardTitle>
          <CardDescription>
            Test system components, connections, and verify functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sounds">Sound Tests</TabsTrigger>
              <TabsTrigger value="animations">Animations</TabsTrigger>
              <TabsTrigger value="logs">System Logs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <SystemInfoPanel />
              <ConnectionStatusPanel />
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={handleClearCache} variant="destructive">
                    Clear Cache & Reload
                  </Button>
                  <Button onClick={() => window.location.reload()}>
                    Reload Application
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sounds" className="space-y-4">
              <div className="p-4 bg-black/30 rounded-md border border-white/10">
                <h3 className="text-lg font-medium mb-4">Sound Effect Tests</h3>
                <p className="text-sm text-white/60 mb-4">
                  Click on any sound to test it. Make sure your system volume is on.
                  {!soundsEnabled && (
                    <Badge variant="outline" className="ml-2 bg-yellow-900/20 text-yellow-300 border-yellow-900">
                      Sounds Disabled
                    </Badge>
                  )}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    'success', 'failure', 'bonus', 'card-reveal', 'eliminate', 
                    'intro-music', 'narrator', 'round-start', 'timeout', 
                    'victory', 'wheel-tick', 'wheel-spin', 'click', 'damage', 'powerup'
                  ].map((sound) => (
                    <Button 
                      key={sound} 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handlePlaySound(sound as SoundEffect)}
                      className="text-xs"
                    >
                      {sound}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-black/30 rounded-md border border-white/10">
                <h3 className="text-lg font-medium mb-4">Sound Availability</h3>
                <div className="max-h-60 overflow-y-auto space-y-1 bg-black/40 p-2 rounded">
                  {Array.isArray(availableSounds) && availableSounds.length > 0 ? (
                    availableSounds.map((sound, index) => (
                      <div key={index} className="flex justify-between items-center p-1">
                        {renderGameSound(sound)}
                        <Badge variant="outline" className="bg-green-900/20 text-green-300">
                          Available
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-yellow-400 p-2">No sounds available or loaded</p>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="animations">
              <TestAnimationsPanel />
            </TabsContent>
            
            <TabsContent value="logs">
              <LogsPanel />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosticsPanel;
