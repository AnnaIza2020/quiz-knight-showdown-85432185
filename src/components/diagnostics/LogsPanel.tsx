
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLogsContext } from '@/context/LogsContext';
import { DownloadCloud, Trash2, Filter } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

const LogsPanel: React.FC = () => {
  const { logs, clearLogs, downloadLogs } = useLogsContext();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCount, setShowCount] = useState(25);
  
  const availableTypes = [
    'answer', 'card', 'score', 'life', 'round', 
    'timer', 'system', 'player', 'elimination'
  ];
  
  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };
  
  const resetFilters = () => {
    setSelectedTypes([]);
    setSearchQuery('');
  };
  
  const getFilteredLogs = () => {
    let filtered = logs;
    
    // Filter by type if any selected
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(log => selectedTypes.includes(log.type));
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(query) || 
        (log.player || '').toLowerCase().includes(query) ||
        (typeof log.value === 'string' && log.value.toLowerCase().includes(query))
      );
    }
    
    // Return limited number
    return filtered.slice(0, showCount);
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'answer': return 'bg-blue-900/20 text-blue-400 border-blue-900/30';
      case 'card': return 'bg-purple-900/20 text-purple-400 border-purple-900/30';
      case 'score': return 'bg-green-900/20 text-green-400 border-green-900/30';
      case 'life': return 'bg-red-900/20 text-red-400 border-red-900/30';
      case 'round': return 'bg-yellow-900/20 text-yellow-400 border-yellow-900/30';
      case 'timer': return 'bg-teal-900/20 text-teal-400 border-teal-900/30';
      case 'system': return 'bg-gray-900/20 text-gray-400 border-gray-900/30';
      case 'player': return 'bg-indigo-900/20 text-indigo-400 border-indigo-900/30';
      case 'elimination': return 'bg-orange-900/20 text-orange-400 border-orange-900/30';
      default: return 'bg-gray-900/20 text-gray-400 border-gray-900/30';
    }
  };
  
  const handleClearLogs = () => {
    if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      clearLogs();
      toast.success('Logs cleared');
    }
  };
  
  const handleDownload = (format: 'json' | 'csv') => {
    downloadLogs(format);
  };
  
  const filteredLogs = getFilteredLogs();
  
  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="grid grid-cols-3 gap-2">
        <div className="relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs..."
            className="bg-black/20 border border-white/10"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" /> 
              Filter Types {selectedTypes.length > 0 && `(${selectedTypes.length})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-black/90 border border-white/10">
            {availableTypes.map(type => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => toggleType(type)}
              >
                <Badge className={`mr-2 ${getTypeColor(type)}`}>{type}</Badge>
              </DropdownMenuCheckboxItem>
            ))}
            {selectedTypes.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="mt-2 w-full text-xs"
              >
                Reset Filters
              </Button>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleClearLogs}
            className="bg-red-900/20 hover:bg-red-800/30"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-blue-900/20 hover:bg-blue-800/30"
              >
                <DownloadCloud className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black/90 border border-white/10">
              <DropdownMenuCheckboxItem onCheckedChange={() => handleDownload('json')}>
                Download as JSON
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem onCheckedChange={() => handleDownload('csv')}>
                Download as CSV
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Logs table */}
      <div className="bg-black/20 border border-white/10 rounded-md max-h-80 overflow-y-auto">
        {filteredLogs.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-black/30 sticky top-0">
              <tr>
                <th className="text-left p-2">Time</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Player</th>
                <th className="text-left p-2">Action</th>
                <th className="text-left p-2">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5">
                  <td className="p-2 text-xs text-white/60 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="p-2">
                    <Badge className={getTypeColor(log.type)}>
                      {log.type}
                    </Badge>
                  </td>
                  <td className="p-2">{log.player || '-'}</td>
                  <td className="p-2">{log.action}</td>
                  <td className="p-2">{
                    typeof log.value !== 'undefined' 
                      ? (typeof log.value === 'object' 
                          ? JSON.stringify(log.value).substring(0, 30) 
                          : String(log.value).substring(0, 30))
                      : '-'
                  }</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-4 text-center text-white/40">
            {logs.length === 0 
              ? 'No logs recorded yet' 
              : 'No logs match your filters'}
          </div>
        )}
      </div>
      
      {filteredLogs.length < logs.length && (
        <div className="text-center">
          <Button
            variant="link"
            size="sm"
            onClick={() => setShowCount(prev => prev + 25)}
            className="text-xs text-white/60"
          >
            Show more logs ({filteredLogs.length} of {logs.length} shown)
          </Button>
        </div>
      )}
    </div>
  );
};

export default LogsPanel;
