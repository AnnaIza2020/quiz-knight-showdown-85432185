
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAvailabilityContext } from '@/context/AvailabilityContext';
import { PlayerAvailabilitySlot, AvailabilityStatus } from '@/types/availability-types';
import { useGameContext } from '@/context/GameContext';
import { toast } from 'sonner';
import { Calendar, Clock, Save, Users } from 'lucide-react';

const PlayerAvailabilityCalendar: React.FC = () => {
  const { players } = useGameContext();
  const { fetchAvailability, updateAvailability, saveAvailabilityBatch } = useAvailabilityContext();
  const [availabilityData, setAvailabilityData] = useState<PlayerAvailabilitySlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  useEffect(() => {
    loadAvailabilityData();
  }, []);

  const loadAvailabilityData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAvailability();
      setAvailabilityData(data);
    } catch (error) {
      toast.error('Błąd podczas ładowania dostępności');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeSlotChange = (playerId: string, timeSlot: string, status: AvailabilityStatus) => {
    setAvailabilityData(prevData => {
      const existingSlot = prevData.find(slot => 
        slot.playerId === playerId && slot.date === selectedDate
      );

      if (existingSlot) {
        return prevData.map(slot => 
          slot.playerId === playerId && slot.date === selectedDate
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
          available: true,
          timeSlots: { [timeSlot]: status }
        };
        return [...prevData, newSlot];
      }
    });
  };

  const saveAvailability = async () => {
    setIsLoading(true);
    try {
      const currentDateSlots = availabilityData.filter(slot => slot.date === selectedDate);
      
      for (const slot of currentDateSlots) {
        await updateAvailability(slot);
      }
      
      toast.success('Dostępność została zapisana');
    } catch (error) {
      toast.error('Błąd podczas zapisywania');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlayerAvailability = (playerId: string, timeSlot: string): AvailabilityStatus => {
    const slot = availabilityData.find(s => 
      s.playerId === playerId && s.date === selectedDate
    );
    return slot?.timeSlots?.[timeSlot] || AvailabilityStatus.UNKNOWN;
  };

  const getStatusColor = (status: AvailabilityStatus): string => {
    switch (status) {
      case AvailabilityStatus.AVAILABLE:
        return 'bg-green-500 hover:bg-green-600';
      case AvailabilityStatus.BUSY:
        return 'bg-red-500 hover:bg-red-600';
      case AvailabilityStatus.MAYBE:
        return 'bg-yellow-500 hover:bg-yellow-600';
      case AvailabilityStatus.UNAVAILABLE:
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-gray-300 hover:bg-gray-400';
    }
  };

  const getStatusText = (status: AvailabilityStatus): string => {
    switch (status) {
      case AvailabilityStatus.AVAILABLE:
        return 'Dostępny';
      case AvailabilityStatus.BUSY:
        return 'Zajęty';
      case AvailabilityStatus.MAYBE:
        return 'Może';
      case AvailabilityStatus.UNAVAILABLE:
        return 'Niedostępny';
      default:
        return 'Nieznane';
    }
  };

  return (
    <Card className="bg-black/40 border border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Kalendarz dostępności graczy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date selector */}
        <div className="flex items-center gap-4">
          <label className="text-white font-medium">Data:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-black/60 text-white border border-gray-600 rounded px-3 py-2"
          />
          <Button
            onClick={saveAvailability}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Zapisz
          </Button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 p-4 bg-black/20 rounded">
          <div className="text-white font-medium">Legenda:</div>
          {Object.values(AvailabilityStatus).map((status) => (
            <div key={status} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${getStatusColor(status)}`}></div>
              <span className="text-white text-sm">{getStatusText(status)}</span>
            </div>
          ))}
        </div>

        {/* Availability grid */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-white text-left p-2">
                  <Users className="h-4 w-4 inline mr-2" />
                  Gracz
                </th>
                {timeSlots.map(time => (
                  <th key={time} className="text-white text-center p-2 min-w-[80px]">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {time}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {players.map(player => (
                <tr key={player.id} className="border-t border-gray-700">
                  <td className="text-white p-2 font-medium">
                    {player.name}
                  </td>
                  {timeSlots.map(timeSlot => {
                    const currentStatus = getPlayerAvailability(player.id, timeSlot);
                    return (
                      <td key={timeSlot} className="p-1">
                        <select
                          value={currentStatus}
                          onChange={(e) => handleTimeSlotChange(
                            player.id, 
                            timeSlot, 
                            e.target.value as AvailabilityStatus
                          )}
                          className={`w-full p-1 rounded text-white text-xs ${getStatusColor(currentStatus)}`}
                        >
                          {Object.values(AvailabilityStatus).map(status => (
                            <option key={status} value={status} className="bg-gray-800">
                              {getStatusText(status)}
                            </option>
                          ))}
                        </select>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {players.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <Users className="h-8 w-8 mx-auto mb-2" />
            <p>Brak graczy do wyświetlenia</p>
            <p className="text-sm">Dodaj graczy aby zarządzać ich dostępnością</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerAvailabilityCalendar;
