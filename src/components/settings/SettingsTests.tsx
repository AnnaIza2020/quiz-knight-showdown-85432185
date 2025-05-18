import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { useGameContext } from '@/context/GameContext';
import { useQuestions } from '@/hooks/useQuestions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bug, Zap, RotateCw, Database, Gamepad2, Headphones } from 'lucide-react';
import { getGameWinners } from '@/lib/supabase';

const SettingsTests = () => {
  const [winners, setWinners] = useState<any[]>([]);
  const [winnerError, setWinnerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  
  const { players, categories, saveGameData } = useGameContext();
  const { questions } = useQuestions();
  
  // Funkcja do pobrania zwycięzców gry
  const fetchWinners = async () => {
    setIsLoading(true);
    setWinnerError(null);
    
    try {
      const { success, data, error } = await getGameWinners();
      
      if (success && data) {
        setWinners(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length === 0) {
          setWinnerError('Brak zapisanych zwycięzców w bazie danych');
        }
      } else {
        setWinnerError(error as string || 'Wystąpił błąd podczas pobierania zwycięzców');
        setWinners([]);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching winners:', error);
      setWinnerError('Wystąpił błąd podczas pobierania zwycięzców');
      setWinners([]);
      setIsLoading(false);
    }
  };
  
  // Sprawdzanie połączenia z bazą danych
  const checkDatabaseConnection = async () => {
    setDbStatus('checking');
    
    try {
      // Użyjemy funkcji getGameWinners jako prostego testu połączenia
      const { success } = await getGameWinners();
      
      if (success) {
        setDbStatus('connected');
        toast.success('Połączenie z bazą danych jest aktywne');
      } else {
        setDbStatus('disconnected');
        toast.error('Nie można połączyć się z bazą danych');
      }
    } catch (error) {
      console.error('Database connection error:', error);
      setDbStatus('disconnected');
      toast.error('Nie można połączyć się z bazą danych');
    }
  };
  
  // Testowanie odtwarzania dźwięków
  const testSounds = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Krótki beep jako test dźwięku
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
    
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);
    
    toast.success('Test dźwięku wykonany');
  };
  
  // Testowanie zapisywania i ładowania stanu gry
  const testStatePersistence = () => {
    try {
      const testData = {
        test: true,
        timestamp: Date.now()
      };
      
      // Zapisz testowe dane
      saveGameData(testData);
      
      // Odczytaj testowe dane
      const loaded = JSON.parse(localStorage.getItem('test_persistence') || 'null');
      
      if (loaded && loaded.test === true && loaded.timestamp) {
        toast.success('Test zapisywania i ładowania stanu zakończony sukcesem');
        
        // Usuń testowe dane
        localStorage.removeItem('test_persistence');
      } else {
        toast.error('Test zapisywania i ładowania stanu nie powiódł się');
      }
    } catch (error) {
      console.error('State persistence test error:', error);
      toast.error('Wystąpił błąd podczas testu zapisywania stanu');
    }
  };
  
  // Testowanie integralności danych gry
  const testGameDataIntegrity = () => {
    const issues = [];
    
    // Sprawdź graczy
    if (!players || players.length === 0) {
      issues.push('Nie znaleziono żadnych graczy');
    }
    
    // Sprawdź kategorie
    if (!categories || categories.length === 0) {
      issues.push('Nie znaleziono żadnych kategorii');
    }
    
    // Sprawdź pytania
    if (!questions || questions.length === 0) {
      issues.push('Nie znaleziono żadnych pytań');
    } else {
      // Sprawdź czy każde pytanie ma kategorię
      const questionsWithoutCategory = questions.filter(q => !q.categoryId);
      if (questionsWithoutCategory.length > 0) {
        issues.push(`${questionsWithoutCategory.length} pytań nie ma przypisanej kategorii`);
      }
      
      // Sprawdź czy każde pytanie ma poprawną odpowiedź
      const questionsWithoutAnswer = questions.filter(q => !q.correctAnswer);
      if (questionsWithoutAnswer.length > 0) {
        issues.push(`${questionsWithoutAnswer.length} pytań nie ma poprawnej odpowiedzi`);
      }
    }
    
    if (issues.length === 0) {
      toast.success('Integralność danych gry jest poprawna');
    } else {
      toast.error(`Znaleziono problemy z danymi gry: ${issues.join(', ')}`);
    }
  };
  
  // Pobierz zwycięzców przy pierwszym renderowaniu
  useEffect(() => {
    fetchWinners();
    checkDatabaseConnection();
  }, []);
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bug className="mr-2 h-5 w-5" /> Panel Diagnostyczny
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Status Bazy Danych</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className={`h-3 w-3 rounded-full ${
                    dbStatus === 'connected' ? 'bg-green-500' : 
                    dbStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <span>
                    {dbStatus === 'connected' ? 'Połączono' : 
                     dbStatus === 'disconnected' ? 'Rozłączono' : 'Sprawdzanie...'}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={checkDatabaseConnection}
                  disabled={dbStatus === 'checking'}
                  className="w-full"
                >
                  <Database className="mr-2 h-4 w-4" />
                  {dbStatus === 'checking' ? 'Sprawdzanie...' : 'Sprawdź połączenie'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Testy Systemu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={testSounds}
                    className="w-full"
                  >
                    <Headphones className="mr-2 h-4 w-4" />
                    Test dźwięku
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={testStatePersistence}
                    className="w-full"
                  >
                    <RotateCw className="mr-2 h-4 w-4" />
                    Test zapisu
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={testGameDataIntegrity}
                    className="w-full"
                    // Removed the colSpan prop as it doesn't exist on Button component
                  >
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Test danych gry
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="mr-2 h-5 w-5" /> Historia Zwycięzców
            </div>
            <Button 
              size="sm" 
              onClick={fetchWinners}
              disabled={isLoading}
            >
              {isLoading ? 'Ładowanie...' : 'Odśwież'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {winnerError ? (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-md text-center">
              <p className="text-yellow-500">{winnerError}</p>
            </div>
          ) : winners.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gracz</TableHead>
                  <TableHead>Punkty</TableHead>
                  <TableHead>Edycja</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {winners.map((winner: any) => (
                  <TableRow key={winner.id}>
                    <TableCell>{winner.player_name}</TableCell>
                    <TableCell>{winner.score}</TableCell>
                    <TableCell>{winner.game_edition || 'Standardowa'}</TableCell>
                    <TableCell>
                      {new Date(winner.created_at).toLocaleDateString('pl-PL', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-4 text-center text-gray-500">
              {isLoading ? 'Ładowanie zwycięzców...' : 'Brak zapisanych zwycięzców'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTests;
