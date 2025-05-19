
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Player } from '@/types/game-types';
import { CalendarDays, Calendar as CalendarIcon, Clock, Download, ChevronLeft, ChevronRight } from 'lucide-react';

// Time slots from 16:00 to 23:00
const TIME_SLOTS = [
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

type AvailabilityStatus = 'available' | 'unavailable' | 'maybe' | '';

interface PlayerAvailability {
  playerId: string;
  date: string; // ISO date string
  timeSlots: Record<string, AvailabilityStatus>; // Key: time slot, Value: availability status
}

interface PlayerAvailabilityCalendarProps {
  players: Player[];
  isHost?: boolean;
  currentPlayerId?: string;
  onSaveAvailability?: (availability: PlayerAvailability) => void;
  existingAvailability?: PlayerAvailability[];
}

const PlayerAvailabilityCalendar: React.FC<PlayerAvailabilityCalendarProps> = ({
  players,
  isHost = false,
  currentPlayerId,
  onSaveAvailability,
  existingAvailability = []
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedPlayer, setSelectedPlayer] = useState<string>(currentPlayerId || '');
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [availabilityData, setAvailabilityData] = useState<PlayerAvailability[]>(existingAvailability);
  
  // Get week days for the current selected date
  const getWeekDays = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for starting week on Monday
    
    const monday = new Date(date);
    monday.setDate(diff);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      weekDays.push(day);
    }
    
    return weekDays;
  };
  
  const weekDays = getWeekDays(selectedDate);
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'numeric' });
  };
  
  // Format date for storage
  const formatDateForStorage = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Get player availability for a specific date and time
  const getAvailability = (playerId: string, date: Date, timeSlot: string): AvailabilityStatus => {
    const dateStr = formatDateForStorage(date);
    const playerAvailability = availabilityData.find(
      a => a.playerId === playerId && a.date === dateStr
    );
    
    return playerAvailability?.timeSlots[timeSlot] || '';
  };
  
  // Set player availability for a specific date and time
  const setAvailability = (playerId: string, date: Date, timeSlot: string, status: AvailabilityStatus) => {
    const dateStr = formatDateForStorage(date);
    
    setAvailabilityData(prev => {
      // Find existing entry for this player and date
      const existingIndex = prev.findIndex(
        a => a.playerId === playerId && a.date === dateStr
      );
      
      if (existingIndex >= 0) {
        // Update existing entry
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          timeSlots: {
            ...updated[existingIndex].timeSlots,
            [timeSlot]: status
          }
        };
        return updated;
      } else {
        // Create new entry
        return [...prev, {
          playerId,
          date: dateStr,
          timeSlots: { [timeSlot]: status }
        }];
      }
    });
    
    // Save changes
    if (onSaveAvailability) {
      const playerAvailability = availabilityData.find(
        a => a.playerId === playerId && a.date === dateStr
      ) || { playerId, date: dateStr, timeSlots: {} };
      
      onSaveAvailability({
        ...playerAvailability,
        timeSlots: {
          ...playerAvailability.timeSlots,
          [timeSlot]: status
        }
      });
    }
  };
  
  // Handle cell click to cycle through availability statuses
  const handleCellClick = (playerId: string, date: Date, timeSlot: string) => {
    const currentStatus = getAvailability(playerId, date, timeSlot);
    let newStatus: AvailabilityStatus;
    
    switch (currentStatus) {
      case 'available':
        newStatus = 'maybe';
        break;
      case 'maybe':
        newStatus = 'unavailable';
        break;
      case 'unavailable':
        newStatus = '';
        break;
      default:
        newStatus = 'available';
    }
    
    setAvailability(playerId, date, timeSlot, newStatus);
  };
  
  // Get class for availability cell
  const getAvailabilityClass = (status: AvailabilityStatus) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'maybe':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
      case 'unavailable':
        return 'bg-red-500/20 text-red-500 border-red-500/50';
      default:
        return 'bg-transparent text-gray-400 border-gray-700';
    }
  };
  
  // Export availability data as CSV
  const exportAsCSV = () => {
    if (!availabilityData.length) return;
    
    // Create header
    let csvContent = "Player,Date,Time,Availability\n";
    
    // Add rows
    availabilityData.forEach(availability => {
      const player = players.find(p => p.id === availability.playerId);
      const playerName = player ? player.name : 'Unknown';
      
      Object.entries(availability.timeSlots).forEach(([timeSlot, status]) => {
        csvContent += `"${playerName}","${availability.date}","${timeSlot}","${status}"\n`;
      });
    });
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `player_availability_${formatDateForStorage(new Date())}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Previous week
  const goToPreviousWeek = () => {
    const prevWeek = new Date(selectedDate);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setSelectedDate(prevWeek);
  };
  
  // Next week
  const goToNextWeek = () => {
    const nextWeek = new Date(selectedDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setSelectedDate(nextWeek);
  };
  
  // Single day view
  const renderDayView = () => {
    const playerToRender = isHost && selectedPlayer 
      ? players.find(p => p.id === selectedPlayer) 
      : players.find(p => p.id === currentPlayerId);
    
    if (!playerToRender) return (
      <div className="text-center p-8 text-muted-foreground">
        Wybierz gracza aby zobaczyć dostępność
      </div>
    );
    
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Dostępność: {playerToRender.name}</CardTitle>
          <CardDescription>
            {selectedDate.toLocaleDateString('pl-PL', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {TIME_SLOTS.map(timeSlot => {
              const status = getAvailability(playerToRender.id, selectedDate, timeSlot);
              const statusClass = getAvailabilityClass(status);
              
              return (
                <div 
                  key={timeSlot}
                  className={`flex items-center justify-between p-3 border rounded-md cursor-pointer ${statusClass}`}
                  onClick={() => handleCellClick(playerToRender.id, selectedDate, timeSlot)}
                >
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {timeSlot}
                  </span>
                  <span>
                    {status === 'available' && 'Dostępny'}
                    {status === 'maybe' && 'Może być dostępny'}
                    {status === 'unavailable' && 'Niedostępny'}
                    {status === '' && 'Nie określono'}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // Week view
  const renderWeekView = () => {
    const playerToRender = isHost && selectedPlayer 
      ? players.find(p => p.id === selectedPlayer) 
      : players.find(p => p.id === currentPlayerId);
    
    if (!playerToRender) return (
      <div className="text-center p-8 text-muted-foreground">
        Wybierz gracza aby zobaczyć dostępność
      </div>
    );
    
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Dostępność tygodniowa: {playerToRender.name}</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            Tydzień: {formatDate(weekDays[0])} - {formatDate(weekDays[6])}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Godzina</TableHead>
                {weekDays.map(day => (
                  <TableHead key={day.toISOString()}>
                    {formatDate(day)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {TIME_SLOTS.map(timeSlot => (
                <TableRow key={timeSlot}>
                  <TableCell>{timeSlot}</TableCell>
                  {weekDays.map(day => {
                    const status = getAvailability(playerToRender.id, day, timeSlot);
                    const statusClass = getAvailabilityClass(status);
                    
                    return (
                      <TableCell
                        key={day.toISOString()}
                        className={`text-center ${statusClass} cursor-pointer`}
                        onClick={() => handleCellClick(playerToRender.id, day, timeSlot)}
                      >
                        {status === 'available' && '✓'}
                        {status === 'maybe' && '?'}
                        {status === 'unavailable' && '✗'}
                        {status === '' && ''}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };
  
  // Host view - all players for a specific date
  const renderHostView = () => {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Dostępność wszystkich graczy</CardTitle>
            <Button variant="outline" size="sm" onClick={exportAsCSV}>
              <Download className="h-4 w-4 mr-2" /> Eksport CSV
            </Button>
          </div>
          <CardDescription>
            {selectedDate.toLocaleDateString('pl-PL', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gracz</TableHead>
                {TIME_SLOTS.map(timeSlot => (
                  <TableHead key={timeSlot}>{timeSlot}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map(player => (
                <TableRow key={player.id}>
                  <TableCell>{player.name}</TableCell>
                  {TIME_SLOTS.map(timeSlot => {
                    const status = getAvailability(player.id, selectedDate, timeSlot);
                    const statusClass = getAvailabilityClass(status);
                    
                    return (
                      <TableCell
                        key={timeSlot}
                        className={`text-center ${statusClass}`}
                      >
                        {status === 'available' && '✓'}
                        {status === 'maybe' && '?'}
                        {status === 'unavailable' && '✗'}
                        {status === '' && ''}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Kalendarz</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar 
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="border rounded-md p-3"
              />
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Widok</h3>
                <div className="flex space-x-2">
                  <Button
                    variant={viewMode === 'day' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('day')}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" /> Dzień
                  </Button>
                  <Button
                    variant={viewMode === 'week' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('week')}
                  >
                    <CalendarDays className="h-4 w-4 mr-2" /> Tydzień
                  </Button>
                </div>
              </div>
              
              {(isHost || players.length > 1) && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Gracz</h3>
                  <Select 
                    value={selectedPlayer} 
                    onValueChange={setSelectedPlayer}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz gracza" />
                    </SelectTrigger>
                    <SelectContent>
                      {players.map(player => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Legenda</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500/20 border border-green-500/50 rounded mr-2"></div>
                    <span>Dostępny</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500/20 border border-yellow-500/50 rounded mr-2"></div>
                    <span>Może być dostępny</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500/20 border border-red-500/50 rounded mr-2"></div>
                    <span>Niedostępny</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-transparent border border-gray-700 rounded mr-2"></div>
                    <span>Nie określono</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-2/3">
          {isHost && viewMode === 'day' ? (
            renderHostView()
          ) : (
            viewMode === 'day' ? renderDayView() : renderWeekView()
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerAvailabilityCalendar;
