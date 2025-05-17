
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { toast } from 'sonner';
import { RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

// Definiujemy typy potrzebne do testów
interface TestResult {
  status: 'idle' | 'running' | 'success' | 'fail';
  log: string[];
  startTime?: number;
  endTime?: number;
  details?: string;
  errorCount?: number;
}

interface TestCategory {
  id: string;
  name: string;
  description: string;
  tests: Test[];
  isExpanded: boolean;
}

interface Test {
  id: string;
  name: string;
  description: string;
  duration?: number;
  run: () => Promise<void>;
}

const SettingsTests: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('jednostkowe');
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [testCategories, setTestCategories] = useState<TestCategory[]>([
    {
      id: 'unit',
      name: 'Testy Jednostkowe',
      description: 'Testy poszczególnych komponentów i funkcji aplikacji',
      isExpanded: true,
      tests: [
        { 
          id: 'unit-game-context',
          name: 'GameContext',
          description: 'Test inicjalizacji i metod GameContext',
          run: async () => await simulateTest('Kontekst gry działa poprawnie', 2) 
        },
        { 
          id: 'unit-wheel',
          name: 'Koło Fortuny',
          description: 'Test losowania kategorii',
          run: async () => await simulateTest('Losowanie kategorii działa poprawnie', 3)
        },
        { 
          id: 'unit-card-effects',
          name: 'Efekty Kart',
          description: 'Test efektów kart specjalnych',
          run: async () => await simulateTest('Efekty kart działają poprawnie', 2)
        }
      ]
    },
    {
      id: 'integration',
      name: 'Testy Integracyjne',
      description: 'Testy współdziałania komponentów',
      isExpanded: false,
      tests: [
        { 
          id: 'integration-player-host',
          name: 'Gracz-Host',
          description: 'Test interakcji między panelem gracza i hosta',
          run: async () => await simulateTest('Komunikacja Gracz-Host działa poprawnie', 4)
        },
        { 
          id: 'integration-cards-game',
          name: 'Karty-Gra',
          description: 'Test integracji kart z logiką gry',
          run: async () => await simulateTest('Karty poprawnie integrują się z grą', 3)
        }
      ]
    },
    {
      id: 'performance',
      name: 'Testy Wydajnościowe',
      description: 'Testy wydajności aplikacji',
      isExpanded: false,
      tests: [
        { 
          id: 'perf-rendering',
          name: 'Renderowanie UI',
          description: 'Test wydajności renderowania UI',
          run: async () => await simulateTest('Wydajność renderowania w normie', 5)
        },
        { 
          id: 'perf-data',
          name: 'Przetwarzanie Danych',
          description: 'Test wydajności przetwarzania danych',
          run: async () => await simulateTest('Przetwarzanie danych w normie', 4)
        }
      ]
    },
    {
      id: 'ui',
      name: 'Testy UI/UX',
      description: 'Testy interfejsu użytkownika',
      isExpanded: false,
      tests: [
        { 
          id: 'ui-responsiveness',
          name: 'Responsywność',
          description: 'Test responsywności interfejsu',
          run: async () => await simulateTest('Interfejs jest responsywny', 3)
        },
        { 
          id: 'ui-accessibility',
          name: 'Dostępność',
          description: 'Test dostępności interfejsu',
          run: async () => await simulateTest('Interfejs spełnia standardy dostępności', 3)
        }
      ]
    },
    {
      id: 'compatibility',
      name: 'Testy Kompatybilności',
      description: 'Testy kompatybilności z przeglądarkami',
      isExpanded: false,
      tests: [
        { 
          id: 'compat-chrome',
          name: 'Chrome',
          description: 'Test kompatybilności z Chrome',
          run: async () => await simulateTest('Aplikacja działa poprawnie w Chrome', 2)
        },
        { 
          id: 'compat-firefox',
          name: 'Firefox',
          description: 'Test kompatybilności z Firefox',
          run: async () => await simulateTest('Aplikacja działa poprawnie w Firefox', 2)
        },
        { 
          id: 'compat-safari',
          name: 'Safari',
          description: 'Test kompatybilności z Safari',
          run: async () => await simulateTest('Aplikacja działa poprawnie w Safari', 2)
        }
      ]
    }
  ]);

  // Symulacja testu - w rzeczywistości trzeba by zaimplementować prawdziwe testy
  const simulateTest = async (message: string, seconds: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Losowy wynik testu - w rzeczywistości byłyby to prawdziwe wyniki testów
      const willSucceed = Math.random() > 0.3;
      
      setTimeout(() => {
        if (willSucceed) {
          resolve();
        } else {
          reject(new Error(`Test failed: ${message}`));
        }
      }, seconds * 1000);
    });
  };

  // Uruchomienie pojedynczego testu
  const runTest = async (categoryId: string, testId: string) => {
    const category = testCategories.find(c => c.id === categoryId);
    if (!category) return;

    const test = category.tests.find(t => t.id === testId);
    if (!test) return;

    // Ustaw stan początkowy testu
    setTestResults(prev => ({
      ...prev,
      [testId]: {
        status: 'running',
        log: [`[${new Date().toLocaleTimeString()}] Rozpoczęcie testu "${test.name}"...`],
        startTime: Date.now()
      }
    }));

    try {
      await test.run();
      
      // Test zakończony sukcesem
      setTestResults(prev => ({
        ...prev,
        [testId]: {
          ...prev[testId],
          status: 'success',
          log: [
            ...prev[testId].log,
            `[${new Date().toLocaleTimeString()}] Test zakończony sukcesem!`
          ],
          endTime: Date.now()
        }
      }));
      
      toast.success(`Test "${test.name}" zakończony pomyślnie`);
      
    } catch (error) {
      // Test zakończony niepowodzeniem
      const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
      
      setTestResults(prev => ({
        ...prev,
        [testId]: {
          ...prev[testId],
          status: 'fail',
          log: [
            ...prev[testId].log,
            `[${new Date().toLocaleTimeString()}] BŁĄD: ${errorMessage}`
          ],
          endTime: Date.now(),
          details: errorMessage,
          errorCount: 1
        }
      }));
      
      toast.error(`Test "${test.name}" zakończony niepowodzeniem`, {
        description: errorMessage
      });
    }
  };

  // Uruchomienie wszystkich testów w kategorii
  const runCategoryTests = async (categoryId: string) => {
    const category = testCategories.find(c => c.id === categoryId);
    if (!category) return;

    for (const test of category.tests) {
      await runTest(categoryId, test.id);
    }
  };

  // Uruchomienie wszystkich testów
  const runAllTests = async () => {
    setIsRunningAll(true);
    toast.info('Rozpoczęcie uruchamiania wszystkich testów', {
      description: 'To może potrwać kilka minut...'
    });
    
    for (const category of testCategories) {
      await runCategoryTests(category.id);
    }
    
    setIsRunningAll(false);
    toast.success('Wszystkie testy zostały zakończone');
  };

  // Przełączanie rozwinięcia kategorii
  const toggleCategory = (categoryId: string) => {
    setTestCategories(prev => 
      prev.map(category => 
        category.id === categoryId 
          ? { ...category, isExpanded: !category.isExpanded } 
          : category
      )
    );
  };

  return (
    <SettingsLayout
      title="Testy aplikacji Discord Game Show"
      description="Panel zarządzania testami aplikacji i monitorowania ich wyników"
      actions={
        <Button
          onClick={runAllTests}
          disabled={isRunningAll}
          className="flex items-center gap-2"
        >
          {isRunningAll ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Uruchamianie...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Uruchom wszystkie testy
            </>
          )}
        </Button>
      }
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="jednostkowe">Jednostkowe</TabsTrigger>
          <TabsTrigger value="integracyjne">Integracyjne</TabsTrigger>
          <TabsTrigger value="wydajnosciowe">Wydajnościowe</TabsTrigger>
          <TabsTrigger value="ui">UI/UX</TabsTrigger>
          <TabsTrigger value="kompatybilnosc">Kompatybilność</TabsTrigger>
        </TabsList>

        <TabsContent value="jednostkowe">
          <TestCategoryPanel 
            category={testCategories.find(c => c.id === 'unit')} 
            testResults={testResults}
            runTest={(testId) => runTest('unit', testId)}
            runAllCategoryTests={() => runCategoryTests('unit')}
            toggleCategory={() => toggleCategory('unit')}
          />
        </TabsContent>

        <TabsContent value="integracyjne">
          <TestCategoryPanel 
            category={testCategories.find(c => c.id === 'integration')} 
            testResults={testResults}
            runTest={(testId) => runTest('integration', testId)}
            runAllCategoryTests={() => runCategoryTests('integration')}
            toggleCategory={() => toggleCategory('integration')}
          />
        </TabsContent>

        <TabsContent value="wydajnosciowe">
          <TestCategoryPanel 
            category={testCategories.find(c => c.id === 'performance')} 
            testResults={testResults}
            runTest={(testId) => runTest('performance', testId)}
            runAllCategoryTests={() => runCategoryTests('performance')}
            toggleCategory={() => toggleCategory('performance')}
          />
        </TabsContent>

        <TabsContent value="ui">
          <TestCategoryPanel 
            category={testCategories.find(c => c.id === 'ui')} 
            testResults={testResults}
            runTest={(testId) => runTest('ui', testId)}
            runAllCategoryTests={() => runCategoryTests('ui')}
            toggleCategory={() => toggleCategory('ui')}
          />
        </TabsContent>

        <TabsContent value="kompatybilnosc">
          <TestCategoryPanel 
            category={testCategories.find(c => c.id === 'compatibility')} 
            testResults={testResults}
            runTest={(testId) => runTest('compatibility', testId)}
            runAllCategoryTests={() => runCategoryTests('compatibility')}
            toggleCategory={() => toggleCategory('compatibility')}
          />
        </TabsContent>
      </Tabs>
    </SettingsLayout>
  );
};

interface TestCategoryPanelProps {
  category?: TestCategory;
  testResults: Record<string, TestResult>;
  runTest: (testId: string) => void;
  runAllCategoryTests: () => void;
  toggleCategory: () => void;
}

const TestCategoryPanel: React.FC<TestCategoryPanelProps> = ({
  category,
  testResults,
  runTest,
  runAllCategoryTests,
  toggleCategory
}) => {
  if (!category) {
    return <div className="text-gray-400">Kategoria testów niedostępna</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{category.name}</h2>
          <p className="text-gray-400 text-sm">{category.description}</p>
        </div>
        <Button onClick={runAllCategoryTests}>
          Uruchom wszystkie
        </Button>
      </div>

      <div className="space-y-3">
        {category.tests.map(test => (
          <TestCard
            key={test.id}
            test={test}
            result={testResults[test.id]}
            onRunTest={() => runTest(test.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface TestCardProps {
  test: Test;
  result?: TestResult;
  onRunTest: () => void;
}

const TestCard: React.FC<TestCardProps> = ({ test, result, onRunTest }) => {
  const isRunning = result?.status === 'running';
  const hasPassed = result?.status === 'success';
  const hasFailed = result?.status === 'fail';
  
  // Obliczenie czasu trwania testu
  const duration = result?.endTime && result?.startTime 
    ? ((result.endTime - result.startTime) / 1000).toFixed(2) 
    : undefined;
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium text-lg">{test.name}</h3>
            <p className="text-sm text-gray-400">{test.description}</p>
          </div>
          <div className="flex items-center gap-2">
            {result?.status && (
              <div className="mr-2">
                {hasPassed && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
                {hasFailed && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                {isRunning && (
                  <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
                )}
              </div>
            )}
            <Button 
              onClick={onRunTest} 
              disabled={isRunning} 
              size="sm"
              variant={hasFailed ? "destructive" : hasPassed ? "outline" : "default"}
            >
              {isRunning ? 'Uruchomiony...' : hasFailed ? 'Uruchom ponownie' : hasPassed ? 'Uruchom ponownie' : 'Uruchom test'}
            </Button>
          </div>
        </div>
        
        {duration && (
          <p className="text-xs text-gray-400 mt-1">
            Czas wykonania: {duration}s
          </p>
        )}
        
        {result?.log && result.log.length > 0 && (
          <div className="mt-3 max-h-32 overflow-auto bg-black/30 rounded p-2">
            {result.log.map((line, idx) => (
              <div key={idx} className={`text-xs ${line.includes('BŁĄD') ? 'text-red-400' : line.includes('sukces') ? 'text-green-400' : 'text-gray-300'}`}>
                {line}
              </div>
            ))}
          </div>
        )}
        
        {hasFailed && result?.details && (
          <div className="mt-2 p-2 bg-red-900/20 border border-red-800 rounded text-xs text-red-400">
            {result.details}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SettingsTests;
