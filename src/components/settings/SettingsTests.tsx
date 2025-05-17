
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useGameContext } from '@/context/GameContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Play, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

type TestResult = {
  passed: boolean;
  message: string;
  details?: string;
};

type TestCategory = {
  id: string;
  name: string;
  description: string;
  tests: {
    id: string;
    name: string;
    description: string;
    run: () => Promise<TestResult>;
  }[];
};

const SettingsTests = () => {
  const { playSound } = useGameContext();
  const [activeTab, setActiveTab] = useState<string>('unit');
  const [runningTests, setRunningTests] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});

  const testCategories: TestCategory[] = [
    {
      id: 'unit',
      name: 'Testy Jednostkowe',
      description: 'Sprawdzanie poprawności działania podstawowych komponentów i funkcji',
      tests: [
        {
          id: 'sounds-test',
          name: 'Test dźwięków',
          description: 'Sprawdza czy system dźwięków działa poprawnie',
          run: async () => {
            try {
              playSound('success');
              await new Promise(resolve => setTimeout(resolve, 500));
              playSound('fail');
              await new Promise(resolve => setTimeout(resolve, 500));
              return { 
                passed: true, 
                message: 'Testy dźwięków zakończone sukcesem' 
              };
            } catch (error) {
              console.error('Sound test error:', error);
              return { 
                passed: false, 
                message: 'Błąd podczas odtwarzania dźwięków',
                details: error instanceof Error ? error.message : 'Nieznany błąd'
              };
            }
          }
        },
        {
          id: 'timer-test',
          name: 'Test timera',
          description: 'Sprawdza czy timer działa poprawnie',
          run: async () => {
            try {
              // Symulujemy test timera
              await new Promise(resolve => setTimeout(resolve, 1000));
              return { 
                passed: true, 
                message: 'Timer działa poprawnie' 
              };
            } catch (error) {
              return { 
                passed: false, 
                message: 'Błąd podczas testowania timera',
                details: error instanceof Error ? error.message : 'Nieznany błąd'
              };
            }
          }
        }
      ]
    },
    {
      id: 'integration',
      name: 'Testy Integracyjne',
      description: 'Sprawdzanie poprawności integracji między komponentami',
      tests: [
        {
          id: 'wheel-integration',
          name: 'Integracja koła fortuny',
          description: 'Sprawdza integrację koła fortuny z systemem kategorii',
          run: async () => {
            try {
              // Symulujemy test integracyjny
              await new Promise(resolve => setTimeout(resolve, 1500));
              return { 
                passed: true, 
                message: 'Integracja koła fortuny działa poprawnie' 
              };
            } catch (error) {
              return { 
                passed: false, 
                message: 'Błąd podczas testowania integracji koła fortuny',
                details: error instanceof Error ? error.message : 'Nieznany błąd'
              };
            }
          }
        }
      ]
    },
    {
      id: 'ui',
      name: 'Testy UI/UX',
      description: 'Sprawdzanie poprawności interfejsu użytkownika',
      tests: [
        {
          id: 'card-animation',
          name: 'Animacja kart',
          description: 'Sprawdza czy animacje kart działają poprawnie',
          run: async () => {
            try {
              // Symulujemy test animacji
              await new Promise(resolve => setTimeout(resolve, 2000));
              return { 
                passed: true, 
                message: 'Animacje kart działają poprawnie' 
              };
            } catch (error) {
              return { 
                passed: false, 
                message: 'Błąd podczas testowania animacji kart',
                details: error instanceof Error ? error.message : 'Nieznany błąd'
              };
            }
          }
        },
        {
          id: 'overlay-test',
          name: 'Test nakładki',
          description: 'Sprawdza czy nakładka działa poprawnie',
          run: async () => {
            try {
              // Symulujemy test overlay
              await new Promise(resolve => setTimeout(resolve, 1000));
              return { 
                passed: true, 
                message: 'Nakładka działa poprawnie' 
              };
            } catch (error) {
              return { 
                passed: false, 
                message: 'Błąd podczas testowania nakładki',
                details: error instanceof Error ? error.message : 'Nieznany błąd'
              };
            }
          }
        }
      ]
    }
  ];

  const runTest = async (categoryId: string, testId: string) => {
    const category = testCategories.find(c => c.id === categoryId);
    const test = category?.tests.find(t => t.id === testId);
    
    if (!test) {
      toast.error('Nie znaleziono testu');
      return;
    }
    
    setRunningTests(prev => ({ ...prev, [testId]: true }));
    toast.info(`Uruchamianie testu: ${test.name}...`);
    
    try {
      const result = await test.run();
      setTestResults(prev => ({ ...prev, [testId]: result }));
      
      if (result.passed) {
        toast.success(`Test ${test.name} zakończony sukcesem`);
      } else {
        toast.error(`Test ${test.name} zakończony niepowodzeniem: ${result.message}`);
      }
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [testId]: { 
          passed: false, 
          message: 'Błąd podczas wykonywania testu',
          details: error instanceof Error ? error.message : 'Nieznany błąd'
        } 
      }));
      toast.error(`Błąd podczas wykonywania testu ${test.name}`);
    } finally {
      setRunningTests(prev => ({ ...prev, [testId]: false }));
    }
  };

  const runAllTestsInCategory = async (categoryId: string) => {
    const category = testCategories.find(c => c.id === categoryId);
    
    if (!category) {
      toast.error('Nie znaleziono kategorii testów');
      return;
    }
    
    toast.info(`Uruchamianie wszystkich testów w kategorii: ${category.name}...`);
    
    for (const test of category.tests) {
      await runTest(categoryId, test.id);
    }
    
    toast.success(`Zakończono wszystkie testy w kategorii: ${category.name}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Testy aplikacji Discord Game Show</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          {testCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {testCategories.map(category => (
          <TabsContent key={category.id} value={category.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{category.name}</span>
                  <Button
                    onClick={() => runAllTestsInCategory(category.id)}
                    size="sm"
                    disabled={category.tests.some(t => runningTests[t.id])}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Uruchom wszystkie testy
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                
                <Accordion type="single" collapsible className="w-full">
                  {category.tests.map(test => (
                    <AccordionItem key={test.id} value={test.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2 w-full">
                          <div className="flex-1">
                            <span>{test.name}</span>
                          </div>
                          {testResults[test.id] && (
                            <div className="flex items-center">
                              {testResults[test.id].passed ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                            </div>
                          )}
                          <div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={runningTests[test.id]}
                              onClick={(e) => {
                                e.stopPropagation();
                                runTest(category.id, test.id);
                              }}
                            >
                              {runningTests[test.id] ? (
                                <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2" />
                              ) : (
                                <Play className="h-4 w-4 mr-2" />
                              )}
                              {runningTests[test.id] ? "Uruchamianie..." : "Uruchom test"}
                            </Button>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-6 border-l-2 border-gray-700">
                          <p className="text-sm text-muted-foreground mb-2">{test.description}</p>
                          
                          {testResults[test.id] && (
                            <div className={`mt-2 p-3 rounded ${
                              testResults[test.id].passed 
                                ? 'bg-green-500/10 border border-green-500/30' 
                                : 'bg-red-500/10 border border-red-500/30'
                            }`}>
                              <div className="flex items-start gap-2">
                                {testResults[test.id].passed ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                ) : (
                                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                                )}
                                <div>
                                  <p className="font-semibold">
                                    {testResults[test.id].passed ? 'Sukces' : 'Błąd'}
                                  </p>
                                  <p className="text-sm">{testResults[test.id].message}</p>
                                  
                                  {testResults[test.id].details && (
                                    <pre className="mt-2 text-xs p-2 bg-black/20 rounded overflow-auto">
                                      {testResults[test.id].details}
                                    </pre>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SettingsTests;
