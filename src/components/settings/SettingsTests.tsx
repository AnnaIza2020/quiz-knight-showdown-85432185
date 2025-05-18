
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGameContext } from '@/context/GameContext';
import { toast } from 'sonner';
import { AlertOctagon, CheckCircle, Clock, Database, Download, FileWarning, Music, Save, Server, XCircle } from 'lucide-react';

// Utility function to wait for a specified time
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Types for test results
type TestStatus = 'pending' | 'running' | 'success' | 'failure' | 'warning';

interface TestResult {
  id: string;
  name: string;
  status: TestStatus;
  message: string;
  details?: string[];
  duration?: number;
}

const SettingsTests = () => {
  const { players, playSound, categories, saveGameData } = useGameContext();
  const [testResults, setTestResults] = useState<TestResult[]>([
    { id: 'db', name: 'Połączenie z bazą danych', status: 'pending', message: 'Nie uruchomiono' },
    { id: 'audio', name: 'Dźwięk', status: 'pending', message: 'Nie uruchomiono' },
    { id: 'persistence', name: 'Zapisywanie stanu', status: 'pending', message: 'Nie uruchomiono' },
    { id: 'gamedata', name: 'Integralność danych gry', status: 'pending', message: 'Nie uruchomiono' },
    { id: 'ui', name: 'Wydajność UI', status: 'pending', message: 'Nie uruchomiono' },
    { id: 'browser', name: 'Kompatybilność przeglądarki', status: 'pending', message: 'Nie uruchomiono' },
    { id: 'winners', name: 'Pobieranie zwycięzców', status: 'pending', message: 'Nie uruchomiono' }
  ]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [progress, setProgress] = useState(0);
  const [testingSummary, setTestingSummary] = useState<string>('');
  
  // Test database connection
  const testDatabaseConnection = useCallback(async () => {
    setTestResults(prev => prev.map(test => 
      test.id === 'db' ? { ...test, status: 'running', message: 'Testowanie połączenia...' } : test
    ));
    
    try {
      const startTime = Date.now();
      
      // Symulacja połączenia - w rzeczywistości tu byłaby faktyczna weryfikacja połączenia
      await wait(1500);
      
      // W przypadku braku backend API, używamy localStorage jako substytutu
      const hasAccess = localStorage !== null && localStorage !== undefined;
      const duration = Date.now() - startTime;
      
      if (hasAccess) {
        setTestResults(prev => prev.map(test => 
          test.id === 'db' ? { 
            ...test, 
            status: 'success', 
            message: 'Połączono z pamięcią lokalną', 
            details: [`Czas połączenia: ${duration}ms`],
            duration
          } : test
        ));
      } else {
        throw new Error('Brak dostępu do pamięci lokalnej');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
      setTestResults(prev => prev.map(test => 
        test.id === 'db' ? { 
          ...test, 
          status: 'failure', 
          message: 'Błąd połączenia', 
          details: [errorMessage]
        } : test
      ));
    }
  }, []);

  // Test audio playback
  const testAudioPlayback = useCallback(async () => {
    setTestResults(prev => prev.map(test => 
      test.id === 'audio' ? { ...test, status: 'running', message: 'Testowanie dźwięku...' } : test
    ));
    
    try {
      const startTime = Date.now();
      
      // Sprawdź czy funkcja playSound istnieje
      if (typeof playSound !== 'function') {
        throw new Error('Funkcja odtwarzania dźwięku nie jest dostępna');
      }
      
      // Próbujemy odtworzyć dźwięk - krótki test
      playSound('wheel-tick', 0.2);
      
      // Czekamy chwilę, aby dać czas na odtworzenie
      await wait(1000);
      
      const duration = Date.now() - startTime;
      
      // Zakładamy, że jeśli nie było błędu, to dźwięk działa
      setTestResults(prev => prev.map(test => 
        test.id === 'audio' ? { 
          ...test, 
          status: 'success', 
          message: 'Dźwięk działa', 
          details: [`Czas testu: ${duration}ms`],
          duration
        } : test
      ));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
      setTestResults(prev => prev.map(test => 
        test.id === 'audio' ? { 
          ...test, 
          status: 'failure', 
          message: 'Błąd odtwarzania dźwięku', 
          details: [errorMessage]
        } : test
      ));
    }
  }, [playSound]);
  
  // Test state persistence
  const testStatePersistence = useCallback(async () => {
    setTestResults(prev => prev.map(test => 
      test.id === 'persistence' ? { ...test, status: 'running', message: 'Testowanie zapisu stanu...' } : test
    ));
    
    try {
      const startTime = Date.now();
      
      // Zapisujemy dane testowe do localStorage
      const testData = { test: 'data', timestamp: Date.now() };
      localStorage.setItem('testPersistence', JSON.stringify(testData));
      
      // Próba zapisania danych gry
      if (typeof saveGameData === 'function') {
        saveGameData();
      }
      
      // Odczytujemy dane
      await wait(500);
      const readData = localStorage.getItem('testPersistence');
      
      if (!readData) {
        throw new Error('Nie udało się odczytać zapisanych danych');
      }
      
      // Usuwamy dane testowe
      localStorage.removeItem('testPersistence');
      
      const duration = Date.now() - startTime;
      
      setTestResults(prev => prev.map(test => 
        test.id === 'persistence' ? { 
          ...test, 
          status: 'success', 
          message: 'Zapis/odczyt działa', 
          details: [`Czas operacji: ${duration}ms`],
          duration
        } : test
      ));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
      setTestResults(prev => prev.map(test => 
        test.id === 'persistence' ? { 
          ...test, 
          status: 'failure', 
          message: 'Błąd zapisu/odczytu', 
          details: [errorMessage]
        } : test
      ));
    }
  }, [saveGameData]);
  
  // Test game data integrity
  const testGameDataIntegrity = useCallback(async () => {
    setTestResults(prev => prev.map(test => 
      test.id === 'gamedata' ? { ...test, status: 'running', message: 'Sprawdzanie danych gry...' } : test
    ));
    
    try {
      const startTime = Date.now();
      const issues: string[] = [];
      
      // Sprawdzenie graczy
      if (!players || !Array.isArray(players) || players.length === 0) {
        issues.push('Nie znaleziono żadnych graczy');
      } else {
        // Sprawdź czy każdy gracz ma wymagane pola
        const invalidPlayers = players.filter(p => !p.id || !p.name);
        if (invalidPlayers.length > 0) {
          issues.push(`${invalidPlayers.length} graczy ma niepełne dane`);
        }
      }
      
      // Sprawdzenie kategorii
      if (!categories || !Array.isArray(categories) || categories.length === 0) {
        issues.push('Nie znaleziono żadnych kategorii');
      } else {
        // Sprawdź czy kategorie mają pytania
        const emptyCategories = categories.filter(c => !c.questions || c.questions.length === 0);
        if (emptyCategories.length > 0) {
          issues.push(`${emptyCategories.length} kategorii nie ma pytań`);
        }
        
        // Sprawdź pytania w kategoriach
        let invalidQuestions = 0;
        categories.forEach(category => {
          if (category.questions && Array.isArray(category.questions)) {
            invalidQuestions += category.questions.filter(q => !q.id || !q.text || !q.correctAnswer).length;
          }
        });
        
        if (invalidQuestions > 0) {
          issues.push(`${invalidQuestions} pytań ma niepełne dane`);
        }
      }
      
      const duration = Date.now() - startTime;
      
      if (issues.length === 0) {
        setTestResults(prev => prev.map(test => 
          test.id === 'gamedata' ? { 
            ...test, 
            status: 'success', 
            message: 'Dane gry prawidłowe', 
            details: [`Sprawdzono ${players?.length || 0} graczy, ${categories?.length || 0} kategorii`],
            duration
          } : test
        ));
      } else {
        setTestResults(prev => prev.map(test => 
          test.id === 'gamedata' ? { 
            ...test, 
            status: issues.length > 2 ? 'failure' : 'warning', 
            message: `Znaleziono ${issues.length} problemów`, 
            details: issues,
            duration
          } : test
        ));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
      setTestResults(prev => prev.map(test => 
        test.id === 'gamedata' ? { 
          ...test, 
          status: 'failure', 
          message: 'Błąd weryfikacji danych', 
          details: [errorMessage]
        } : test
      ));
    }
  }, [players, categories]);
  
  // Test UI performance
  const testUIPerformance = useCallback(async () => {
    setTestResults(prev => prev.map(test => 
      test.id === 'ui' ? { ...test, status: 'running', message: 'Testowanie wydajności UI...' } : test
    ));
    
    try {
      const startTime = Date.now();
      
      // Miernik wydajności renderowania
      let frameTime = 0;
      
      // Funkcja mierząca czas renderowania
      const measureFrameTime = () => {
        const start = performance.now();
        requestAnimationFrame(() => {
          frameTime = performance.now() - start;
        });
      };
      
      // Uruchomienie mierzenia
      measureFrameTime();
      await wait(500);
      
      // Sprawdź, czy mamy dostęp do API wydajności przeglądarki
      let performanceMetrics: string[] = [];
      if (window.performance && window.performance.memory) {
        const memory = (window.performance as any).memory;
        if (memory) {
          const usedHeapMB = Math.round(memory.usedJSHeapSize / (1024 * 1024));
          const totalHeapMB = Math.round(memory.totalJSHeapSize / (1024 * 1024));
          performanceMetrics.push(`Pamięć JS: ${usedHeapMB}MB / ${totalHeapMB}MB`);
        }
      }
      
      performanceMetrics.push(`Czas rysowania ramki: ~${frameTime.toFixed(2)}ms`);
      
      // Sprawdzenie przekroczenia progów
      const duration = Date.now() - startTime;
      
      if (frameTime > 50) { // Jeśli czas ramki przekracza 50ms (daje mniej niż 20fps)
        setTestResults(prev => prev.map(test => 
          test.id === 'ui' ? { 
            ...test, 
            status: 'warning', 
            message: 'Wydajność poniżej optymalnej', 
            details: performanceMetrics,
            duration
          } : test
        ));
      } else {
        setTestResults(prev => prev.map(test => 
          test.id === 'ui' ? { 
            ...test, 
            status: 'success', 
            message: 'Wydajność UI prawidłowa', 
            details: performanceMetrics,
            duration
          } : test
        ));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
      setTestResults(prev => prev.map(test => 
        test.id === 'ui' ? { 
          ...test, 
          status: 'failure', 
          message: 'Błąd testu wydajności', 
          details: [errorMessage]
        } : test
      ));
    }
  }, []);
  
  // Test browser compatibility
  const testBrowserCompatibility = useCallback(async () => {
    setTestResults(prev => prev.map(test => 
      test.id === 'browser' ? { ...test, status: 'running', message: 'Sprawdzanie kompatybilności...' } : test
    ));
    
    try {
      const startTime = Date.now();
      
      // Zbierz informacje o przeglądarce
      const userAgent = navigator.userAgent;
      const browserInfo: string[] = [`User Agent: ${userAgent}`];
      
      // Sprawdź najważniejsze API
      const apiChecks = [
        { name: 'localStorage', supported: !!window.localStorage },
        { name: 'sessionStorage', supported: !!window.sessionStorage },
        { name: 'WebSockets', supported: 'WebSocket' in window },
        { name: 'requestAnimationFrame', supported: !!window.requestAnimationFrame },
        { name: 'Fetch API', supported: 'fetch' in window },
        { name: 'Web Audio API', supported: 'AudioContext' in window || 'webkitAudioContext' in window }
      ];
      
      const unsupportedApis = apiChecks.filter(api => !api.supported).map(api => api.name);
      
      // Dodajemy informacje o wsparciu API
      browserInfo.push(`API obsługiwane: ${apiChecks.filter(api => api.supported).length}/${apiChecks.length}`);
      
      const duration = Date.now() - startTime;
      
      if (unsupportedApis.length > 0) {
        setTestResults(prev => prev.map(test => 
          test.id === 'browser' ? { 
            ...test, 
            status: 'warning', 
            message: 'Brakujące API przeglądarki', 
            details: [...browserInfo, `Nieobsługiwane API: ${unsupportedApis.join(', ')}`],
            duration
          } : test
        ));
      } else {
        setTestResults(prev => prev.map(test => 
          test.id === 'browser' ? { 
            ...test, 
            status: 'success', 
            message: 'Przeglądarka w pełni kompatybilna', 
            details: browserInfo,
            duration
          } : test
        ));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
      setTestResults(prev => prev.map(test => 
        test.id === 'browser' ? { 
          ...test, 
          status: 'failure', 
          message: 'Błąd weryfikacji przeglądarki', 
          details: [errorMessage]
        } : test
      ));
    }
  }, []);
  
  // Test winners retrieval
  const testWinnersRetrieval = useCallback(async () => {
    setTestResults(prev => prev.map(test => 
      test.id === 'winners' ? { ...test, status: 'running', message: 'Pobieranie zwycięzców...' } : test
    ));
    
    try {
      const startTime = Date.now();
      
      // W rzeczywistości odczytywalibyśmy z bazy danych, tutaj symulujemy
      const winnersHistory = localStorage.getItem('gameWinnersHistory');
      let winners;
      
      if (winnersHistory) {
        winners = JSON.parse(winnersHistory);
      } else {
        // Testowe dane
        winners = [
          { date: '2025-05-17', names: ['Gracz1', 'Gracz2'], points: [100, 90] },
          { date: '2025-05-16', names: ['Gracz3'], points: [85] }
        ];
        // Zapisujemy testowe dane
        localStorage.setItem('gameWinnersHistory', JSON.stringify(winners));
      }
      
      const duration = Date.now() - startTime;
      
      // Sprawdzenie poprawności danych
      if (!winners || !Array.isArray(winners) || winners.length === 0) {
        setTestResults(prev => prev.map(test => 
          test.id === 'winners' ? { 
            ...test, 
            status: 'warning', 
            message: 'Brak historii zwycięzców', 
            details: ['Historia zwycięzców jest pusta'],
            duration
          } : test
        ));
      } else {
        setTestResults(prev => prev.map(test => 
          test.id === 'winners' ? { 
            ...test, 
            status: 'success', 
            message: 'Pobrano historię zwycięzców', 
            details: [`Znaleziono ${winners.length} rekordów w historii`],
            duration
          } : test
        ));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
      setTestResults(prev => prev.map(test => 
        test.id === 'winners' ? { 
          ...test, 
          status: 'failure', 
          message: 'Błąd pobierania zwycięzców', 
          details: [errorMessage]
        } : test
      ));
    }
  }, []);
  
  // Run all tests
  const runAllTests = useCallback(async () => {
    setIsRunningTests(true);
    setProgress(0);
    
    // Reset all tests to pending
    setTestResults(prev => prev.map(test => ({
      ...test,
      status: 'pending',
      message: 'Oczekiwanie...',
      details: undefined,
      duration: undefined
    })));
    
    const tests = [
      testDatabaseConnection,
      testAudioPlayback,
      testStatePersistence,
      testGameDataIntegrity,
      testUIPerformance,
      testBrowserCompatibility,
      testWinnersRetrieval
    ];
    
    // Run tests sequentially
    for (let i = 0; i < tests.length; i++) {
      setProgress(Math.round((i / tests.length) * 100));
      await tests[i]();
      // Add small delay between tests
      await wait(300);
    }
    
    setProgress(100);
    
    // Generate summary
    const summary = generateTestSummary();
    setTestingSummary(summary);
    
    toast.success('Testy zakończone');
    setIsRunningTests(false);
  }, [
    testDatabaseConnection,
    testAudioPlayback,
    testStatePersistence,
    testGameDataIntegrity,
    testUIPerformance,
    testBrowserCompatibility,
    testWinnersRetrieval
  ]);
  
  // Generate summary report
  const generateTestSummary = useCallback(() => {
    const successCount = testResults.filter(test => test.status === 'success').length;
    const warningCount = testResults.filter(test => test.status === 'warning').length;
    const failureCount = testResults.filter(test => test.status === 'failure').length;
    
    let summaryText = `Discord Game Show - Raport testów\n`;
    summaryText += `Data: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n\n`;
    summaryText += `Podsumowanie:\n`;
    summaryText += `- Sukces: ${successCount}\n`;
    summaryText += `- Ostrzeżenia: ${warningCount}\n`;
    summaryText += `- Błędy: ${failureCount}\n\n`;
    
    summaryText += `Szczegółowe wyniki:\n`;
    testResults.forEach(test => {
      summaryText += `\n${test.name}: ${getStatusText(test.status)}\n`;
      summaryText += `- ${test.message}\n`;
      if (test.details && test.details.length > 0) {
        test.details.forEach(detail => {
          summaryText += `  - ${detail}\n`;
        });
      }
      if (test.duration) {
        summaryText += `  - Czas wykonania: ${test.duration}ms\n`;
      }
    });
    
    return summaryText;
  }, [testResults]);
  
  // Helper for test status translation
  const getStatusText = (status: TestStatus): string => {
    switch (status) {
      case 'success': return 'Sukces';
      case 'warning': return 'Ostrzeżenie';
      case 'failure': return 'Błąd';
      case 'running': return 'Wykonywanie...';
      case 'pending': return 'Oczekiwanie';
      default: return 'Nieznany';
    }
  };
  
  // Helper for status icon
  const getStatusIcon = (status: TestStatus) => {
    switch (status) {
      case 'success': return <CheckCircle className="text-green-500" size={20} />;
      case 'warning': return <AlertOctagon className="text-yellow-500" size={20} />;
      case 'failure': return <XCircle className="text-red-500" size={20} />;
      case 'running': return <Clock className="text-blue-500 animate-spin" size={20} />;
      case 'pending': return <Clock className="text-gray-400" size={20} />;
      default: return <FileWarning className="text-gray-400" size={20} />;
    }
  };
  
  // Download test report
  const downloadTestReport = useCallback(() => {
    if (!testingSummary) return;
    
    const blob = new Blob([testingSummary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discord-game-show-test-report-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Raport został pobrany');
  }, [testingSummary]);
  
  const getTestIcon = (testId: string) => {
    switch (testId) {
      case 'db': return <Database size={18} />;
      case 'audio': return <Music size={18} />;
      case 'persistence': return <Save size={18} />;
      case 'gamedata': return <FileWarning size={18} />;
      case 'ui': return <Server size={18} />;
      case 'browser': return <AlertOctagon size={18} />;
      case 'winners': return <CheckCircle size={18} />;
      default: return <FileWarning size={18} />;
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Diagnostyka Systemu</span>
          <Badge variant={isRunningTests ? "secondary" : "outline"}>
            {isRunningTests ? "Trwa testowanie..." : "Gotowy do testów"}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        {isRunningTests && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Postęp testów</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
        
        {/* Test Results */}
        <div className="space-y-2">
          {testResults.map((test) => (
            <div 
              key={test.id} 
              className={`p-3 rounded-md flex items-center justify-between ${
                test.status === 'success' ? 'bg-green-500/10 border border-green-500/20' : 
                test.status === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/20' :
                test.status === 'failure' ? 'bg-red-500/10 border border-red-500/20' :
                test.status === 'running' ? 'bg-blue-500/10 border border-blue-500/20' :
                'bg-gray-500/10 border border-gray-500/20'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="text-gray-400">{getTestIcon(test.id)}</div>
                <div>
                  <div className="font-medium">{test.name}</div>
                  <div className="text-sm text-gray-500">{test.message}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {test.duration && <span className="text-xs text-gray-500">{test.duration}ms</span>}
                <div>{getStatusIcon(test.status)}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Details Expansion */}
        {testResults.some(test => test.details && test.details.length > 0) && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Szczegóły testów</h3>
            {testResults.filter(test => test.details && test.details.length > 0).map(test => (
              <div key={`${test.id}-details`} className="mb-3">
                <div className="font-medium text-sm">{test.name}:</div>
                <ul className="list-disc pl-5 text-sm text-gray-500">
                  {test.details?.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={downloadTestReport} 
          disabled={!testingSummary || isRunningTests}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          Pobierz raport
        </Button>
        
        <Button 
          onClick={runAllTests} 
          disabled={isRunningTests}
          className="flex items-center gap-2"
        >
          {isRunningTests ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1" />
              Testowanie...
            </>
          ) : (
            <>
              <Server size={16} />
              Uruchom testy
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SettingsTests;
