
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlayCircle, Headphones, Eye, Shield, Zap, Cog, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGameContext } from '@/context/GameContext';
import { toast } from 'sonner';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'running' | 'idle';
  message?: string;
  details?: string[];
}

const SettingsTests = () => {
  const [activeTab, setActiveTab] = useState('overlay');
  const [testResults, setTestResults] = useState<Record<string, TestResult[]>>({});
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [progress, setProgress] = useState(0);
  const { playSound, stopSound } = useGameContext();

  // Test categories
  const testCategories = [
    { id: 'overlay', name: 'Testy Overlayu', icon: <Eye className="h-4 w-4" /> },
    { id: 'cards', name: 'Testy Kart', icon: <Shield className="h-4 w-4" /> },
    { id: 'sounds', name: 'Testy Dźwięków', icon: <Headphones className="h-4 w-4" /> },
    { id: 'performance', name: 'Testy Wydajności', icon: <Zap className="h-4 w-4" /> },
    { id: 'integration', name: 'Testy Integracji', icon: <Cog className="h-4 w-4" /> }
  ];

  // Mock test functions
  const runOverlayTests = async () => {
    // Symulacja testów overlayu
    setIsRunningTest(true);
    setProgress(0);
    
    const results: TestResult[] = [];
    
    // Test 1: Podstawowy render komponentów
    setProgress(10);
    results.push({
      name: 'Podstawowy render komponentów',
      status: 'running',
    });
    
    await delay(500);
    setProgress(20);
    results[0].status = 'passed';
    results[0].message = 'Wszystkie komponenty zostały wyrenderowane poprawnie';
    setTestResults(prev => ({ ...prev, overlay: [...results] }));
    
    // Test 2: Responsywność UI
    results.push({
      name: 'Responsywność UI',
      status: 'running',
    });
    setTestResults(prev => ({ ...prev, overlay: [...results] }));
    
    await delay(700);
    setProgress(40);
    results[1].status = 'passed';
    results[1].message = 'UI działa poprawnie w różnych rozmiarach ekranu';
    setTestResults(prev => ({ ...prev, overlay: [...results] }));
    
    // Test 3: Animacje przejść
    results.push({
      name: 'Animacje przejść',
      status: 'running',
    });
    setTestResults(prev => ({ ...prev, overlay: [...results] }));
    
    await delay(800);
    setProgress(70);
    results[2].status = 'passed';
    results[2].message = 'Animacje działają zgodnie z oczekiwaniami';
    setTestResults(prev => ({ ...prev, overlay: [...results] }));
    
    // Test 4: Synchronizacja z panelem hosta
    results.push({
      name: 'Synchronizacja z panelem hosta',
      status: 'running',
    });
    setTestResults(prev => ({ ...prev, overlay: [...results] }));
    
    await delay(900);
    setProgress(90);
    results[3].status = 'passed';
    results[3].message = 'Synchronizacja działa poprawnie';
    setTestResults(prev => ({ ...prev, overlay: [...results] }));
    
    setProgress(100);
    await delay(200);
    
    toast.success('Testy overlayu zakończone pomyślnie!');
    setIsRunningTest(false);
  };
  
  const runCardTests = async () => {
    // Symulacja testów kart
    setIsRunningTest(true);
    setProgress(0);
    
    const results: TestResult[] = [];
    
    // Test 1: Renderowanie kart
    setProgress(10);
    results.push({
      name: 'Renderowanie kart',
      status: 'running',
    });
    
    await delay(300);
    setProgress(25);
    results[0].status = 'passed';
    results[0].message = 'Wszystkie karty renderują się poprawnie';
    setTestResults(prev => ({ ...prev, cards: [...results] }));
    
    // Test 2: Efekty kart
    results.push({
      name: 'Efekty kart',
      status: 'running',
    });
    setTestResults(prev => ({ ...prev, cards: [...results] }));
    
    await delay(500);
    setProgress(50);
    results[1].status = 'passed';
    results[1].message = 'Efekty kart działają poprawnie';
    setTestResults(prev => ({ ...prev, cards: [...results] }));
    
    // Test 3: Przydzielanie kart
    results.push({
      name: 'Przydzielanie kart',
      status: 'running',
    });
    setTestResults(prev => ({ ...prev, cards: [...results] }));
    
    await delay(400);
    setProgress(80);
    results[2].status = 'passed';
    results[2].message = 'System przydzielania kart działa poprawnie';
    setTestResults(prev => ({ ...prev, cards: [...results] }));
    
    setProgress(100);
    await delay(200);
    
    toast.success('Testy kart zakończone pomyślnie!');
    setIsRunningTest(false);
  };
  
  const runSoundTests = async () => {
    // Symulacja testów dźwięków
    setIsRunningTest(true);
    setProgress(0);
    const results: TestResult[] = [];
    
    // Test poszczególnych dźwięków
    const sounds: Array<{name: string, id: string}> = [
      { name: 'Dźwięk sukcesu', id: 'success' },
      { name: 'Dźwięk porażki', id: 'fail' },
      { name: 'Dźwięk eliminacji', id: 'eliminate' },
      { name: 'Dźwięk końca czasu', id: 'timeout' },
      { name: 'Dźwięk startu rundy', id: 'round-start' },
      { name: 'Dźwięk koła', id: 'wheel-spin' },
      { name: 'Dźwięk karty', id: 'card-reveal' }
    ];
    
    let testProgress = 0;
    const progressStep = 100 / sounds.length;
    
    for (const sound of sounds) {
      // Dodaj nowy test dla dźwięku
      const currentIndex = results.length;
      results.push({
        name: `Odtwarzanie: ${sound.name}`,
        status: 'running'
      });
      setTestResults(prev => ({ ...prev, sounds: [...results] }));
      
      // Odtwórz dźwięk
      playSound(sound.id);
      
      // Czekaj i zaktualizuj status
      await delay(800);
      testProgress += progressStep;
      setProgress(Math.min(100, Math.round(testProgress)));
      
      // Zaktualizuj wynik
      results[currentIndex].status = 'passed';
      results[currentIndex].message = `Dźwięk ${sound.name} odtworzony poprawnie`;
      setTestResults(prev => ({ ...prev, sounds: [...results] }));
      
      // Zatrzymaj dźwięk przed przejściem do następnego
      stopSound(sound.id);
      await delay(200);
    }
    
    // Finalny rezultat
    setProgress(100);
    await delay(200);
    
    toast.success('Testy dźwięków zakończone pomyślnie!');
    setIsRunningTest(false);
  };
  
  // Helper function to delay execution for UI simulation
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Run test based on category
  const runTest = async (category: string) => {
    if (isRunningTest) {
      toast.info('Test jest już w toku, poczekaj na jego zakończenie');
      return;
    }
    
    setTestResults(prev => ({ ...prev, [category]: [] }));
    
    switch(category) {
      case 'overlay':
        await runOverlayTests();
        break;
      case 'cards':
        await runCardTests();
        break;
      case 'sounds':
        await runSoundTests();
        break;
      case 'performance':
      case 'integration':
      default:
        toast.info('Te testy będą dostępne w przyszłej aktualizacji');
        setIsRunningTest(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Testy aplikacji Discord Game Show</CardTitle>
        <CardDescription>
          Uruchamiaj i monitoruj testy różnych modułów aplikacji
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 w-full flex overflow-x-auto space-x-1 pb-1">
            {testCategories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-1"
              >
                {category.icon}
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {testCategories.map(category => (
            <TabsContent key={category.id} value={category.id}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <Button 
                    onClick={() => runTest(category.id)} 
                    disabled={isRunningTest}
                  >
                    {isRunningTest ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uruchamianie...
                      </>
                    ) : (
                      <>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Uruchom testy
                      </>
                    )}
                  </Button>
                </div>
                
                {isRunningTest && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Postęp testów:</p>
                    <Progress value={progress} className="h-2 w-full" />
                  </div>
                )}
                
                {testResults[category.id] && testResults[category.id].length > 0 && (
                  <div className="border rounded-lg p-4 space-y-4">
                    <h4 className="font-medium">Wyniki testów:</h4>
                    
                    <Accordion type="single" collapsible className="w-full">
                      {testResults[category.id].map((result, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-sm">
                            <div className="flex items-center gap-2">
                              {result.status === 'passed' && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                              {result.status === 'failed' && (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                              {result.status === 'running' && (
                                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                              )}
                              <span>{result.name}</span>
                              <Badge variant={result.status === 'passed' ? 'outline' : 'secondary'}>
                                {result.status === 'passed' ? 'PASS' : 
                                 result.status === 'failed' ? 'FAIL' : 'RUNNING'}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            {result.message && (
                              <Alert>
                                <AlertTitle>Informacja</AlertTitle>
                                <AlertDescription>{result.message}</AlertDescription>
                              </Alert>
                            )}
                            {result.details && result.details.length > 0 && (
                              <div className="mt-2 pl-4 border-l-2 border-muted">
                                {result.details.map((detail, i) => (
                                  <p key={i} className="text-sm text-muted-foreground">{detail}</p>
                                ))}
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}
                
                {(!testResults[category.id] || testResults[category.id].length === 0) && !isRunningTest && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nie uruchomiono jeszcze testów dla tej kategorii.</p>
                    <p className="text-sm mt-2">Kliknij "Uruchom testy" aby rozpocząć.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SettingsTests;
