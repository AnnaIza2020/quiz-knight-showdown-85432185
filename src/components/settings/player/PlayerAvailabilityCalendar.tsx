
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Player } from '@/types/game-types';
import { PlayerAvailabilitySlot, AvailabilityStatus, TimeSlot } from '@/types/availability-types';
import { format } from 'date-fns';

interface PlayerAvailabilityCalendarProps {
  players: Player[];
  isHost: boolean;
  playerId?: string;
  onSaveAvailability?: (availability: PlayerAvailabilitySlot) => void;
}

const TIME_SLOTS = [
  '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'
];

const PlayerAvailabilityCalendar: React.FC<PlayerAvailabilityCalendarProps> = ({
  players,
  isHost,
  playerId,
  onSaveAvailability
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(playerId || null);
  const [availabilityData, setAvailabilityData] = useState<PlayerAvailabilitySlot[]>([]);
  
  // Initialize availability data for selected date and player
  useEffect(() => {
    if (!selectedPlayer || !selectedDate) return;
    
    // Check if there's existing availability data for this date/player
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const existingData = availabilityData.find(
      item => item.playerId === selectedPlayer && item.date === dateString
    );
    
    if (!existingData) {
      // Create default availability with all slots set to 'unknown'
      const defaultTimeSlots: TimeSlot[] = TIME_SLOTS.map(hour => ({
        hour,
        status: AvailabilityStatus.UNKNOWN
      }));
      
      setAvailabilityData(prev => [
        ...prev,
        {
          playerId: selectedPlayer,
          date: dateString,
          timeSlots: defaultTimeSlots
        }
      ]);
    }
  }, [selectedPlayer, selectedDate, availabilityData]);
  
  // Get current time slots for selected date & player
  const getCurrentTimeSlots = (): TimeSlot[] => {
    if (!selectedPlayer || !selectedDate) return [];
    
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const data = availabilityData.find(
      item => item.playerId === selectedPlayer && item.date === dateString
    );
    
    return data?.timeSlots || [];
  };
  
  // Update a time slot status
  const updateTimeSlotStatus = (hour: string, status: AvailabilityStatus) => {
    if (!selectedPlayer || !selectedDate) return;
    
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    
    setAvailabilityData(prev => {
      const updatedData = [...prev];
      const dataIndex = updatedData.findIndex(
        item => item.playerId === selectedPlayer && item.date === dateString
      );
      
      if (dataIndex >= 0) {
        // Update existing entry
        const updatedTimeSlots = [...updatedData[dataIndex].timeSlots];
        const slotIndex = updatedTimeSlots.findIndex(slot => slot.hour === hour);
        
        if (slotIndex >= 0) {
          updatedTimeSlots[slotIndex] = { ...updatedTimeSlots[slotIndex], status };
        } else {
          updatedTimeSlots.push({ hour, status });
        }
        
        updatedData[dataIndex] = {
          ...updatedData[dataIndex],
          timeSlots: updatedTimeSlots
        };
      } else {
        // Create new entry
        const newTimeSlots: TimeSlot[] = TIME_SLOTS.map(h => ({
          hour: h,
          status: h === hour ? status : AvailabilityStatus.UNKNOWN
        }));
        
        updatedData.push({
          playerId: selectedPlayer,
          date: dateString,
          timeSlots: newTimeSlots
        });
      }
      
      return updatedData;
    });
    
    // If there's a save callback, invoke it
    if (onSaveAvailability) {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const updatedEntry = availabilityData.find(
        item => item.playerId === selectedPlayer && item.date === dateString
      );
      
      if (updatedEntry) {
        const updatedTimeSlots = [...updatedEntry.timeSlots];
        const slotIndex = updatedTimeSlots.findIndex(slot => slot.hour === hour);
        
        if (slotIndex >= 0) {
          updatedTimeSlots[slotIndex] = { ...updatedTimeSlots[slotIndex], status };
        } else {
          updatedTimeSlots.push({ hour, status });
        }
        
        onSaveAvailability({
          ...updatedEntry,
          timeSlots: updatedTimeSlots
        });
      }
    }
  };
  
  // Render status cell with appropriate color
  const renderStatusCell = (hour: string) => {
    const timeSlots = getCurrentTimeSlots();
    const slot = timeSlots.find(s => s.hour === hour);
    const status = slot?.status || AvailabilityStatus.UNKNOWN;
    
    let bgColor = 'bg-gray-200';
    if (status === AvailabilityStatus.AVAILABLE) bgColor = 'bg-green-200';
    if (status === AvailabilityStatus.UNAVAILABLE) bgColor = 'bg-red-200';
    if (status === AvailabilityStatus.MAYBE) bgColor = 'bg-yellow-200';
    
    return (
      <td 
        className={`border p-2 ${bgColor} cursor-pointer`}
        onClick={() => {
          // Cycle through statuses when clicking
          if (status === AvailabilityStatus.UNKNOWN) {
            updateTimeSlotStatus(hour, AvailabilityStatus.AVAILABLE);
          } else if (status === AvailabilityStatus.AVAILABLE) {
            updateTimeSlotStatus(hour, AvailabilityStatus.UNAVAILABLE);
          } else if (status === AvailabilityStatus.UNAVAILABLE) {
            updateTimeSlotStatus(hour, AvailabilityStatus.MAYBE);
          } else {
            updateTimeSlotStatus(hour, AvailabilityStatus.UNKNOWN);
          }
        }}
      >
        {status === AvailabilityStatus.AVAILABLE && "Dostępny"}
        {status === AvailabilityStatus.UNAVAILABLE && "Niedostępny"}
        {status === AvailabilityStatus.MAYBE && "Może"}
        {status === AvailabilityStatus.UNKNOWN && "?"}
      </td>
    );
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Kalendarz</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Dostępność {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''}</span>
              
              {isHost && (
                <Select
                  value={selectedPlayer || undefined}
                  onValueChange={setSelectedPlayer}
                >
                  <SelectTrigger className="w-[180px]">
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
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPlayer && selectedDate ? (
              <div>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2">Godzina</th>
                      <th className="border p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TIME_SLOTS.map(hour => (
                      <tr key={hour}>
                        <td className="border p-2">{hour}</td>
                        {renderStatusCell(hour)}
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="mt-4">
                  <div className="text-sm text-gray-500 mb-2">Legenda:</div>
                  <div className="flex space-x-4 text-xs">
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-green-200 mr-1"></div> Dostępny
                    </span>
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-red-200 mr-1"></div> Niedostępny
                    </span>
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-200 mr-1"></div> Może
                    </span>
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-gray-200 mr-1"></div> Nieznany
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {!selectedPlayer && "Wybierz gracza"}
                {!selectedDate && "Wybierz datę"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlayerAvailabilityCalendar;
