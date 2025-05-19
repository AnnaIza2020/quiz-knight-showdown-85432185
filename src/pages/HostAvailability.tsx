
import React, { useState, useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { useAvailabilityContext } from '@/context/AvailabilityContext';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Download } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

// Stałe potrzebne do działania komponentu
const TIME_SLOTS = [
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

const HostAvailability = () => {
  const { players } = useGameContext();
  const { fetchAvailability, playerAvailability, isLoading } = useAvailabilityContext();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  
  useEffect(() => {
    // Pobierz dane o dostępności graczy
    fetchAvailability();
  }, [fetchAvailability]);
  
  useEffect(() => {
    // Generuj dni tygodnia na podstawie wybranej daty
    setWeekDays(getWeekDays(selectedDate));
  }, [selectedDate]);
  
  // Pobierz dni tygodnia dla wybranej daty
  const getWeekDays = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Dostosuj do początku tygodnia w poniedziałek
    
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
  
  // Format daty do wyświetlenia
  const formatDate = (date: Date) => {
    return format(date, 'EEEE, dd MMMM', { locale: pl });
  };
  
  // Format daty do przechowywania
  const formatDateForStorage = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
  };
  
  // Poprzedni tydzień
  const goToPreviousWeek = () => {
    const prevWeek = new Date(selectedDate);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setSelectedDate(prevWeek);
  };
  
  // Następny tydzień
  const goToNextWeek = () => {
    const nextWeek = new Date(selectedDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setSelectedDate(nextWeek);
  };
  
  // Pobierz procent dostępnych graczy dla danego dnia i godziny
  const getAvailabilityPercentage = (date: Date, timeSlot: string) => {
    const dateStr = formatDateForStorage(date);
    let availableCount = 0;
    
    players.forEach(player => {
      // Znajdź dostępność gracza
      const playerAvail = playerAvailability.find(a => a.playerId === player.id);
      if (playerAvail) {
        // Znajdź slot dla danego dnia
        const dateSlot = playerAvail.slots.find(s => s.date === dateStr);
        if (dateSlot && dateSlot.timeSlots[timeSlot] === 'available') {
          availableCount++;
        }
      }
    });
    
    return players.length > 0 ? Math.round((availableCount / players.length) * 100) : 0;
  };
  
  // Pobierz dostępnych graczy dla danego dnia i godziny
  const getAvailablePlayers = (date: Date, timeSlot: string) => {
    const dateStr = formatDateForStorage(date);
    const availablePlayers: string[] = [];
    
    players.forEach(player => {
      // Znajdź dostępność gracza
      const playerAvail = playerAvailability.find(a => a.playerId === player.id);
      if (playerAvail) {
        // Znajdź slot dla danego dnia
        const dateSlot = playerAvail.slots.find(s => s.date === dateStr);
        if (dateSlot && dateSlot.timeSlots[timeSlot] === 'available') {
          availablePlayers.push(player.name);
        }
      }
    });
    
    return availablePlayers;
  };
  
  // Eksportuj dane jako CSV
  const exportAsCSV = () => {
    // Utwórz nagłówek
    let csvContent = "Data,Godzina,Dostępność (%),Dostępni gracze\n";
    
    // Dodaj wiersze dla każdego dnia i godziny
    weekDays.forEach(day => {
      TIME_SLOTS.forEach(timeSlot => {
        const date = format(day, 'yyyy-MM-dd');
        const percentage = getAvailabilityPercentage(day, timeSlot);
        const players = getAvailablePlayers(day, timeSlot).join(', ');
        
        csvContent += `"${date}","${timeSlot}","${percentage}%","${players}"\n`;
      });
    });
    
    // Utwórz i pobierz plik
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `dostepnosc_graczy_${formatDateForStorage(new Date())}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Dostępność Graczy</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Kalendarz</CardTitle>
              <CardDescription>Wybierz datę, aby zobaczyć dostępność graczy</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar 
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="border rounded-md p-3 bg-gray-800"
              />
              
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousWeek}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" /> Poprzedni tydzień
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextWeek}
                >
                  Następny tydzień <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              
              <Button 
                className="mt-4 w-full"
                onClick={exportAsCSV}
              >
                <Download className="h-4 w-4 mr-2" /> Eksportuj dane (CSV)
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-2/3">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Tygodniowa dostępność graczy</CardTitle>
                <div className="text-sm text-gray-400">
                  <CalendarIcon className="h-4 w-4 inline-block mr-1" />
                  {format(weekDays[0], 'dd.MM') + ' - ' + format(weekDays[6], 'dd.MM')}
                </div>
              </div>
              <CardDescription>
                Procent dostępności graczy dla danego dnia i godziny
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TooltipProvider>
                <Table className="border border-gray-800 rounded-md">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Godzina</TableHead>
                      {weekDays.map(day => (
                        <TableHead key={day.toISOString()} className="text-center">
                          {format(day, 'EEE', { locale: pl })}
                          <div className="text-xs font-normal">
                            {format(day, 'dd.MM')}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TIME_SLOTS.map(timeSlot => (
                      <TableRow key={timeSlot}>
                        <TableCell className="font-medium">{timeSlot}</TableCell>
                        {weekDays.map(day => {
                          const percentage = getAvailabilityPercentage(day, timeSlot);
                          const availablePlayers = getAvailablePlayers(day, timeSlot);
                          
                          // Ustal kolor komórki na podstawie procentu dostępności
                          let cellClass = '';
                          if (percentage >= 75) cellClass = 'bg-green-900/30 text-green-500';
                          else if (percentage >= 50) cellClass = 'bg-yellow-900/30 text-yellow-500';
                          else if (percentage > 0) cellClass = 'bg-orange-900/30 text-orange-500';
                          else cellClass = 'bg-red-900/10 text-gray-500';
                          
                          return (
                            <TableCell
                              key={day.toISOString()}
                              className={`text-center ${cellClass}`}
                            >
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-default">
                                    {percentage}%
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <div className="font-bold mb-1">
                                    {formatDate(day)}, {timeSlot}
                                  </div>
                                  {availablePlayers.length > 0 ? (
                                    <>
                                      <div className="mb-1">Dostępni gracze ({availablePlayers.length}):</div>
                                      <ul className="list-disc pl-4">
                                        {availablePlayers.map(player => (
                                          <li key={player}>{player}</li>
                                        ))}
                                      </ul>
                                    </>
                                  ) : (
                                    <div>Brak dostępnych graczy</div>
                                  )}
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TooltipProvider>
              
              {isLoading && (
                <div className="text-center py-4 text-gray-400">
                  Ładowanie danych...
                </div>
              )}
              
              {!isLoading && players.length === 0 && (
                <div className="text-center py-4 text-gray-400">
                  Brak graczy w systemie
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HostAvailability;
