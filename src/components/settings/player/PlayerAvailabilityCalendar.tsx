
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Player } from '@/types/interfaces';
import { PlayerAvailabilitySlot, AvailabilityStatus } from '@/types/availability-types';
import { Calendar, Clock, User } from 'lucide-react';
import { toast } from 'sonner';

interface PlayerAvailabilityCalendarProps {
  players: Player[];
  isHost: boolean;
  onSaveAvailability: (availability: PlayerAvailabilitySlot[]) => void;
}

const PlayerAvailabilityCalendar: React.FC<PlayerAvailabilityCalendarProps> = ({
  players,
  isHost,
  onSaveAvailability
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [availabilityData, setAvailabilityData] = useState<PlayerAvailabilitySlot[]>([]);

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  const updatePlayerAvailability = (
    playerId: string, 
    timeSlot: string, 
    status: AvailabilityStatus
  ) => {
    setAvailabilityData(prev => {
      const existingSlot = prev.find(
        slot => slot.playerId === playerId && slot.date === selectedDate
      );

      if (existingSlot) {
        return prev.map(slot => 
          slot.id === existingSlot.id
            ? {
                ...slot,
                timeSlots: {
                  ...slot.timeSlots,
                  [timeSlot]: status
                }
              }
            : slot
        );
      } else {
        const newSlot: PlayerAvailabilitySlot = {
          id: `${playerId}-${selectedDate}`,
          playerId,
          date: selectedDate,
          startTime: '09:00',
          endTime: '21:00',
          available: status === AvailabilityStatus.AVAILABLE,
          timeSlots: {
            [timeSlot]: status
          }
        };
        return [...prev, newSlot];
      }
    });
  };

  const getPlayerAvailability = (playerId: string, timeSlot: string): AvailabilityStatus => {
    const slot = availabilityData.find(
      s => s.playerId === playerId && s.date === selectedDate
    );
    return slot?.timeSlots?.[timeSlot] || AvailabilityStatus.UNKNOWN;
  };

  const getStatusColor = (status: AvailabilityStatus): string => {
    switch (status) {
      case AvailabilityStatus.AVAILABLE:
        return 'bg-green-500';
      case AvailabilityStatus.BUSY:
        return 'bg-red-500';
      case AvailabilityStatus.MAYBE:
        return 'bg-yellow-500';
      case AvailabilityStatus.UNAVAILABLE:
        return 'bg-gray-500';
      default:
        return 'bg-gray-300';
    }
  };

  const handleSaveAvailability = () => {
    onSaveAvailability(availabilityData);
    toast.success('Dostępność graczy zapisana');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Kalendarz dostępności graczy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Wybierz datę:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-gray-100">
                    <User className="h-4 w-4 mx-auto" />
                  </th>
                  {timeSlots.map(time => (
                    <th key={time} className="border p-2 bg-gray-100 text-xs">
                      <Clock className="h-3 w-3 mx-auto mb-1" />
                      {time}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {players.map(player => (
                  <tr key={player.id}>
                    <td className="border p-2 font-medium bg-gray-50">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: player.color || '#666' }}
                        />
                        {player.name}
                      </div>
                    </td>
                    {timeSlots.map(time => {
                      const status = getPlayerAvailability(player.id, time);
                      return (
                        <td key={time} className="border p-1">
                          <div className="flex gap-1">
                            {Object.values(AvailabilityStatus).map(statusOption => (
                              <button
                                key={statusOption}
                                className={`w-4 h-4 rounded-full border-2 ${
                                  status === statusOption 
                                    ? getStatusColor(statusOption) + ' border-gray-800' 
                                    : 'bg-gray-200 border-gray-300'
                                }`}
                                onClick={() => updatePlayerAvailability(player.id, time, statusOption)}
                                title={statusOption}
                              />
                            ))}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                Dostępny
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                Zajęty
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                Może
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full" />
                Niedostępny
              </div>
            </div>
            
            {isHost && (
              <Button onClick={handleSaveAvailability}>
                Zapisz dostępność
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerAvailabilityCalendar;
