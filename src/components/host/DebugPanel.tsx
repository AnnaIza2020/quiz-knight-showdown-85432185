
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGameContext } from '@/context/GameContext';
import { LogEntry } from '@/types/game-types';
import { toast } from 'sonner';

const DebugPanel: React.FC = () => {
  const { 
    logs, 
    clearLogs, 
    reportError, 
    round, 
    players, 
    currentQuestion,
    timerRunning,
    activePlayerId 
  } = useGameContext();
  
  const [expandedLogs, setExpandedLogs] = useState(false);

  const addTestLog = () => {
    const testLog: Omit<LogEntry, 'id' | 'timestamp'> = {
      message: 'Test log message',
      type: 'test',
      action: 'debug_test',
      value: 'test_value'
    };
    
    // Convert to the expected string format for now
    const logString = `[TEST] ${testLog.message} - ${testLog.action}: ${testLog.value}`;
    
    // For now, use reportError which expects a string
    reportError(logString);
    toast.info('Test log added');
  };

  const systemStatus = {
    playersConnected: players.length,
    currentRound: round,
    timerActive: timerRunning,
    activePlayer: activePlayerId ? players.find(p => p.id === activePlayerId)?.name || 'Unknown' : 'None',
    currentQuestion: currentQuestion ? 'Loaded' : 'None'
  };

  return (
    <Card className="bg-black/50 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* System Status */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">System Status</h3>
          <div className="grid grid-cols-2 gap-2">
            <Badge variant="outline" className="text-white">
              Players: {systemStatus.playersConnected}
            </Badge>
            <Badge variant="outline" className="text-white">
              Round: {systemStatus.currentRound}
            </Badge>
            <Badge variant="outline" className="text-white">
              Timer: {systemStatus.timerActive ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant="outline" className="text-white">
              Active: {systemStatus.activePlayer}
            </Badge>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">Debug Controls</h3>
          <div className="flex gap-2">
            <Button onClick={addTestLog} variant="outline" size="sm">
              Add Test Log
            </Button>
            <Button onClick={clearLogs} variant="outline" size="sm">
              Clear Logs ({logs.length})
            </Button>
          </div>
        </div>

        {/* Logs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Logs</h3>
            <Button 
              onClick={() => setExpandedLogs(!expandedLogs)}
              variant="ghost" 
              size="sm"
            >
              {expandedLogs ? 'Collapse' : 'Expand'}
            </Button>
          </div>
          
          <div className={`bg-black/30 rounded p-2 text-sm text-white font-mono ${
            expandedLogs ? 'max-h-96' : 'max-h-32'
          } overflow-y-auto`}>
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {typeof log === 'string' ? log : JSON.stringify(log)}
                </div>
              ))
            ) : (
              <div className="text-white/50">No logs available</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugPanel;
