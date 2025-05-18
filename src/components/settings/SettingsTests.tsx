import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { useGameContext } from '@/context/GameContext';
import { useQuestions } from '@/hooks/useQuestions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bug, Zap, RotateCw, Database, Gamepad2, Headphones, FileText, AlertTriangle, Check, X } from 'lucide-react';
import { getGameWinners } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';

// Interfejs dla testów i ich wyników
interface TestResult {
  name: string;
  status: 'success' | 'error' | 'warning' | 'pending';
  message: string;
  details?: string;
}

const SettingsTests = () => {
  const [winners, setWinners] = useState<any[]>([]);
  const [winnerError, setWinnerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testProgress, setTestProgress] = useState(0);
  const [isRunningTests, setIsRunningTests] = useState(false);
  
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
        addTestResult({
          name: 'Połączenie z bazą danych',
          status: 'success',
          message: 'Połączenie z bazą danych jest aktywne'
        });
        return true;
      } else {
        setDbStatus('disconnected');
        toast.error('Nie można połączyć się z bazą danych');
        addTestResult({
          name: 'Połączenie z bazą danych',
          status: 'error',
          message: 'Nie można połączyć się z bazą danych'
        });
        return false;
      }
    } catch (error) {
      console.error('Database connection error:', error);
      setDbStatus('disconnected');
      toast.error('Nie można połączyć się z bazą danych');
      addTestResult({
        name: 'Połączenie z bazą danych',
        status: 'error',
        message: 'Nie można połączyć się z bazą danych',
        details: error instanceof Error ? error.message : 'Nieznany błąd'
      });
      return false;
    }
  };
  
  // Testowanie odtwarzania dźwięków
  const testSounds = () => {
    try {
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
      addTestResult({
        name: 'Odtwarzanie dźwięku',
        status: 'success',
        message: 'System audio działa poprawnie'
      });
      return true;
    } catch (error) {
      console.error('Audio test error:', error);
      toast.error('Test dźwięku nie powiódł się');
      addTestResult({
        name: 'Odtwarzanie dźwięku',
        status: 'error',
        message: 'System audio nie działa poprawnie',
        details: error instanceof Error ? error.message : 'Nieznany błąd'
      });
      return false;
    }
  };
  
  // Testowanie zapisywania i ładowania stanu gry
  const testStatePersistence = () => {
    try {
      const testData = {
        test: true,
        timestamp: Date.now()
      };
      
      // Zapisz testowe dane do specjalnej lokalizacji dla testów
      localStorage.setItem('test_persistence', JSON.stringify(testData));
      
      // Odczytaj testowe dane
      const loaded = JSON.parse(localStorage.getItem('test_persistence') || 'null');
      
      if (loaded && loaded.test === true && loaded.timestamp) {
        toast.success('Test zapisywania i ładowania stanu zakończony sukcesem');
        addTestResult({
          name: 'Zapisywanie i ładowanie stanu',
          status: 'success',
          message: 'Lokalny storage działa poprawnie'
        });
        
        // Usuń testowe dane
        localStorage.removeItem('test_persistence');
        return true;
      } else {
        toast.error('Test zapisywania i ładowania stanu nie powiódł się');
        addTestResult({
          name: 'Zapisywanie i ładowanie stanu',
          status: 'error',
          message: 'Problem z zapisem/odczytem danych w localStorage'
        });
        return false;
      }
    } catch (error) {
      console.error('State persistence test error:', error);
      toast.error('Wystąpił błąd podczas testu zapisywania stanu');
      addTestResult({
        name: 'Zapisywanie i ładowanie stanu',
        status: 'error',
        message: 'Wystąpił błąd podczas testu zapisywania stanu',
        details: error instanceof Error ? error.message : 'Nieznany błąd'
      });
      return false;
    }
  };
  
  // Testowanie integralności danych gry
  const testGameDataIntegrity = () => {
    const issues = [];
    
    // Sprawdź graczy
    if (!players || players.length === 0) {
      issues.push('Nie znaleziono żadnych graczy');
    } else {
      // Sprawdź czy każdy gracz ma wymagane pola
      const invalidPlayers = players.filter(p => !p.id || !p.name);
      if (invalidPlayers.length > 0) {
        issues.push(`${invalidPlayers.length} graczy ma niepełne dane`);
      }
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
      addTestResult({
        name: 'Integralność danych gry',
        status: 'success',
        message: 'Wszystkie wymagane dane gry są obecne i poprawne'
      });
      return true;
    } else {
      toast.error(`Znaleziono problemy z danymi gry: ${issues.join(', ')}`);
      addTestResult({
        name: 'Integralność danych gry',
        status: 'error',
        message: 'Znaleziono problemy z danymi gry',
        details: issues.join('\n')
      });
      return false;
    }
  };
  
  // Testowanie wydajności renderowania UI
  const testUIPerformance = () => {
    const startTime = performance.now();
    const iterations = 100;
    let totalTime = 0;
    
    try {
      // Symulujemy operacje renderowania przez wielokrotne wywołanie setState
      for (let i = 0; i < iterations; i++) {
        const iterStart = performance.now();
        setTestProgress(i); // To spowoduje przerenderowanie komponentu
        totalTime += (performance.now() - iterStart);
      }
      
      const averageTime = totalTime / iterations;
      const totalTestTime = performance.now() - startTime;
      
      if (averageTime < 5) { // Zakładamy, że poniżej 5ms to dobry wynik
        addTestResult({
          name: 'Wydajność UI',
          status: 'success',
          message: `Średni czas renderowania: ${averageTime.toFixed(2)}ms`,
          details: `Całkowity czas testu: ${totalTestTime.toFixed(2)}ms dla ${iterations} iteracji`
        });
        return true;
      } else if (averageTime < 20) { // 5-20ms to akceptowalny wynik
        addTestResult({
          name: 'Wydajność UI',
          status: 'warning',
          message: `Średni czas renderowania: ${averageTime.toFixed(2)}ms (akceptowalny)`,
          details: `Całkowity czas testu: ${totalTestTime.toFixed(2)}ms dla ${iterations} iteracji. Rozważ optymalizację renderowania.`
        });
        return true;
      } else { // Powyżej 20ms to słaby wynik
        addTestResult({
          name: 'Wydajność UI',
          status: 'error',
          message: `Średni czas renderowania: ${averageTime.toFixed(2)}ms (zbyt wolny)`,
          details: `Całkowity czas testu: ${totalTestTime.toFixed(2)}ms dla ${iterations} iteracji. Konieczna optymalizacja renderowania!`
        });
        return false;
      }
    } catch (error) {
      addTestResult({
        name: 'Wydajność UI',
        status: 'error',
        message: 'Błąd podczas testu wydajności UI',
        details: error instanceof Error ? error.message : 'Nieznany błąd'
      });
      return false;
    }
  };
  
  // Test kompatybilności przeglądarki
  const testBrowserCompatibility = () => {
    const userAgent = navigator.userAgent;
    const browserInfo = {
      chrome: /chrome/i.test(userAgent) && !/edge|opr|opera/i.test(userAgent),
      firefox: /firefox/i.test(userAgent),
      safari: /safari/i.test(userAgent) && !/chrome|edge|opr|opera/i.test(userAgent),
      edge: /edge/i.test(userAgent),
      opera: /opr|opera/i.test(userAgent),
      ie: /msie|trident/i.test(userAgent),
      mobile: /mobile/i.test(userAgent) || /android|iphone|ipad|ipod/i.test(userAgent)
    };
    
    const unsupportedFeatures = [];
    
    // Sprawdź wsparcie dla WebSockets
    if (!('WebSocket' in window)) {
      unsupportedFeatures.push('WebSockets');
    }
    
    // Sprawdź wsparcie dla Web Audio API
    if (!('AudioContext' in window || 'webkitAudioContext' in window)) {
      unsupportedFeatures.push('Web Audio API');
    }
    
    // Sprawdź wsparcie dla localStorage
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
    } catch (e) {
      unsupportedFeatures.push('Local Storage');
    }
    
    // Sprawdź wsparcie dla Canvas (do animacji)
    if (!document.createElement('canvas').getContext) {
      unsupportedFeatures.push('Canvas');
    }
    
    // Sprawdź obsługę Web Animations API
    if (!('animate' in document.createElement('div'))) {
      unsupportedFeatures.push('Web Animations API');
    }
    
    const browserName = Object.keys(browserInfo).find(key => browserInfo[key as keyof typeof browserInfo]) || 'Unknown';
    
    if (unsupportedFeatures.length === 0) {
      addTestResult({
        name: 'Kompatybilność przeglądarki',
        status: 'success',
        message: `Przeglądarka ${browserName} obsługuje wszystkie wymagane funkcje`,
        details: `User Agent: ${userAgent}`
      });
      return true;
    } else {
      addTestResult({
        name: 'Kompatybilność przeglądarki',
        status: 'warning',
        message: `Przeglądarka ${browserName} nie obsługuje niektórych funkcji`,
        details: `Nieobsługiwane funkcje: ${unsupportedFeatures.join(', ')}\nUser Agent: ${userAgent}`
      });
      return false;
    }
  };

  // Dodaj wynik testu do listy
  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [result, ...prev]);
  };
  
  // Uruchom wszystkie testy i wygeneruj raport
  const runAllTests = useCallback(async () => {
    setIsRunningTests(true);
    setTestResults([]);
    setTestProgress(0);
    
    toast.info('Rozpoczynanie kompleksowych testów...', { duration: 3000 });
    
    // Definiujemy testy do wykonania
    const tests = [
      { name: 'Połączenie z bazą danych', fn: checkDatabaseConnection },
      { name: 'System audio', fn: testSounds },
      { name: 'Zapisywanie stanu', fn: testStatePersistence },
      { name: 'Integralność danych', fn: testGameDataIntegrity },
      { name: 'Wydajność UI', fn: testUIPerformance },
      { name: 'Kompatybilność przeglądarki', fn: testBrowserCompatibility },
      { name: 'Pobieranie zwycięzców', fn: fetchWinners }
    ];
    
    // Wykonaj testy sekwencyjnie
    let passedTests = 0;
    let totalTests = tests.length;
    
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      setTestProgress(Math.floor((i / totalTests) * 100));
      
      try {
        toast.info(`Uruchamianie testu: ${test.name}...`);
        // Odczekaj 500ms przed kolejnym testem dla lepszej widoczności
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const result = await test.fn();
        if (result) passedTests++;
        
      } catch (error) {
        console.error(`Error running test ${test.name}:`, error);
        addTestResult({
          name: test.name,
          status: 'error',
          message: `Błąd podczas wykonywania testu: ${test.name}`,
          details: error instanceof Error ? error.message : 'Nieznany błąd'
        });
      }
    }
    
    setTestProgress(100);
    setIsRunningTests(false);
    
    // Wyświetl podsumowanie
    const successRate = Math.round((passedTests / totalTests) * 100);
    const summaryMessage = `Zakończono wszystkie testy. Udanych: ${passedTests}/${totalTests} (${successRate}%)`;
    
    if (successRate >= 80) {
      toast.success(summaryMessage);
    } else if (successRate >= 50) {
      toast.warning(summaryMessage);
    } else {
      toast.error(summaryMessage);
    }
  }, []);
  
  // Pobierz zwycięzców przy pierwszym renderowaniu
  useEffect(() => {
    fetchWinners();
    checkDatabaseConnection();
  }, []);
  
  // Generuj raport w formie tekstowej
  const generateTextReport = () => {
    // Generuj raport
    let report = `=== RAPORT TESTÓW DISCORD GAME SHOW ===\n`;
    report += `Data: ${new Date().toLocaleString('pl-PL')}\n\n`;
    
    // Statystyki testów
    const countByStatus = testResults.reduce((acc: Record<string, number>, test) => {
      acc[test.status] = (acc[test.status] || 0) + 1;
      return acc;
    }, {});
    
    report += `PODSUMOWANIE:\n`;
    report += `- Łączna liczba testów: ${testResults.length}\n`;
    report += `- Testy udane: ${countByStatus['success'] || 0}\n`;
    report += `- Testy z ostrzeżeniami: ${countByStatus['warning'] || 0}\n`;
    report += `- Testy nieudane: ${countByStatus['error'] || 0}\n\n`;
    
    report += `SZCZEGÓŁOWE WYNIKI:\n\n`;
    
    testResults.forEach((test, index) => {
      report += `${index + 1}. ${test.name}\n`;
      report += `   Status: ${test.status}\n`;
      report += `   Wiadomość: ${test.message}\n`;
      if (test.details) {
        report += `   Szczegóły: ${test.details}\n`;
      }
      report += `\n`;
    });
    
    return report;
  };
  
  // Pobierz raport jako plik tekstowy
  const downloadReport = () => {
    const report = generateTextReport();
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discord-game-show-test-report-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Bug className="mr-2 h-5 w-5" /> Panel Diagnostyczny
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadReport} 
                disabled={testResults.length === 0}
              >
                <FileText className="mr-2 h-4 w-4" /> Pobierz Raport
              </Button>
              <Button 
                onClick={runAllTests} 
                disabled={isRunningTests}
                size="sm"
              >
                {isRunningTests ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Testowanie...
                  </>
                ) : (
                  <>
                    <RotateCw className="mr-2 h-4 w-4" />
                    Uruchom wszystkie testy
                  </>
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                    // Removed colSpan prop as it doesn't exist on Button component
                  >
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Test danych gry
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={testUIPerformance}
                    className="w-full"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Test wydajności
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Progress bar dla testów */}
          {isRunningTests && (
            <div className="mt-4 mb-4">
              <Progress value={testProgress} className="h-2" />
              <p className="text-center text-xs mt-1 text-gray-500">
                Postęp testów: {testProgress}%
              </p>
            </div>
          )}
          
          {/* Wyniki testów */}
          {testResults.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {testResults.map((result, idx) => (
                <AccordionItem value={`item-${idx}`} key={idx}>
                  <AccordionTrigger className="flex items-center">
                    {result.status === 'success' && <Check className="mr-2 h-4 w-4 text-green-500" />}
                    {result.status === 'error' && <X className="mr-2 h-4 w-4 text-red-500" />}
                    {result.status === 'warning' && <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />}
                    <span className="mr-2">{result.name}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      result.status === 'success' ? 'bg-green-500/20 text-green-500' :
                      result.status === 'error' ? 'bg-red-500/20 text-red-500' :
                      'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {result.status === 'success' ? 'Sukces' : 
                       result.status === 'error' ? 'Błąd' : 'Ostrzeżenie'}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 bg-gray-100/10 rounded-md">
                      <p>{result.message}</p>
                      {result.details && (
                        <pre className="mt-2 p-2 bg-gray-800/50 rounded text-xs overflow-x-auto">
                          {result.details}
                        </pre>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : !isRunningTests ? (
            <Alert className="bg-gray-800/30 border-gray-700">
              <AlertDescription>
                Uruchom testy, aby zobaczyć wyniki i wygenerować raport.
              </AlertDescription>
            </Alert>
          ) : null}
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
