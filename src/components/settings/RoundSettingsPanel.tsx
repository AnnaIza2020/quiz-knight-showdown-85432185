
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RoundSettings } from '@/types/round-settings';
import { useGameContext } from '@/context/GameContext';
import { Cog, RotateCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { GameRound } from '@/types/game-types';
import { toast } from 'sonner';

const RoundSettingsPanel: React.FC = () => {
  const { roundSettings, updateRoundSettings } = useGameContext();
  const [localSettings, setLocalSettings] = useState<RoundSettings>(roundSettings);
  const [activeTab, setActiveTab] = useState('global');
  
  // Update local state when context changes
  useEffect(() => {
    if (roundSettings) {
      setLocalSettings(roundSettings);
    }
  }, [roundSettings]);
  
  // Update a specific field in settings
  const updateField = (
    path: string | number | (string | number)[], 
    value: any
  ) => {
    setLocalSettings((prev) => {
      const newSettings = { ...prev };
      
      if (Array.isArray(path)) {
        // Handle nested paths like [GameRound.ROUND_ONE, 'pointsForCorrectAnswer']
        if (path.length === 2) {
          const [roundKey, fieldKey] = path;
          return {
            ...prev,
            [roundKey]: {
              ...prev[roundKey as keyof typeof prev],
              [fieldKey]: value
            }
          };
        }
      } else {
        // Handle simple paths like 'defaultTimerDuration'
        newSettings[path as keyof RoundSettings] = value;
      }
      
      return newSettings;
    });
  };
  
  // Save settings
  const saveSettings = () => {
    updateRoundSettings(localSettings);
    toast.success('Zapisano ustawienia rund');
  };
  
  // Reset settings to defaults
  const resetSettings = () => {
    // Use the original from context
    setLocalSettings(roundSettings);
    toast.info('Zresetowano zmiany');
  };
  
  return (
    <Card className="bg-black/40 border border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Cog className="h-5 w-5 text-neon-blue" />
          <span>Ustawienia rund</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="global">Globalne</TabsTrigger>
            <TabsTrigger value="round1">Runda 1</TabsTrigger>
            <TabsTrigger value="round2">Runda 2</TabsTrigger>
            <TabsTrigger value="round3">Runda 3</TabsTrigger>
          </TabsList>
          
          {/* Global Settings */}
          <TabsContent value="global" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultTimer">Domyślny czas na odpowiedź (sek)</Label>
                <Input
                  id="defaultTimer"
                  type="number"
                  value={localSettings.defaultTimerDuration}
                  onChange={(e) => updateField('defaultTimerDuration', parseInt(e.target.value) || 30)}
                  min={5}
                  max={60}
                />
              </div>
              
              <div className="space-y-2 flex items-center justify-between">
                <Label htmlFor="randomizeQuestions">Losowa kolejność pytań</Label>
                <Switch
                  id="randomizeQuestions"
                  checked={localSettings.randomizeQuestions}
                  onCheckedChange={(checked) => updateField('randomizeQuestions', checked)}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Round 1 Settings */}
          <TabsContent value="round1" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="r1-points-correct">Punkty za poprawną odpowiedź</Label>
                <Input
                  id="r1-points-correct"
                  type="number"
                  value={localSettings[GameRound.ROUND_ONE].pointsForCorrectAnswer}
                  onChange={(e) => updateField([GameRound.ROUND_ONE, 'pointsForCorrectAnswer'], parseInt(e.target.value) || 0)}
                  min={0}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="r1-points-incorrect">Punkty za błędną odpowiedź</Label>
                <Input
                  id="r1-points-incorrect"
                  type="number"
                  value={localSettings[GameRound.ROUND_ONE].pointsForIncorrectAnswer}
                  onChange={(e) => updateField([GameRound.ROUND_ONE, 'pointsForIncorrectAnswer'], parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="r1-timer">Czas na odpowiedź (sek)</Label>
                <Input
                  id="r1-timer"
                  type="number"
                  value={localSettings[GameRound.ROUND_ONE].timerDuration}
                  onChange={(e) => updateField([GameRound.ROUND_ONE, 'timerDuration'], parseInt(e.target.value) || 30)}
                  min={5}
                  max={60}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="r1-lives">Liczba żyć na start</Label>
                <Input
                  id="r1-lives"
                  type="number"
                  value={localSettings[GameRound.ROUND_ONE].livesCount}
                  onChange={(e) => updateField([GameRound.ROUND_ONE, 'livesCount'], parseInt(e.target.value) || 1)}
                  min={1}
                  max={10}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="r1-health-deduction">Utrata zdrowia za błędną odpowiedź (%)</Label>
                <Input
                  id="r1-health-deduction"
                  type="number"
                  value={localSettings[GameRound.ROUND_ONE].healthDeductionPercentage}
                  onChange={(e) => updateField([GameRound.ROUND_ONE, 'healthDeductionPercentage'], parseInt(e.target.value) || 0)}
                  min={0}
                  max={100}
                />
              </div>
              
              <div className="space-y-2 flex items-center justify-between">
                <Label htmlFor="r1-lucky-loser">Włącz Lucky Losera</Label>
                <Switch
                  id="r1-lucky-loser"
                  checked={localSettings[GameRound.ROUND_ONE].luckyLoserEnabled}
                  onCheckedChange={(checked) => updateField([GameRound.ROUND_ONE, 'luckyLoserEnabled'], checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="r1-elimination-count">Liczba eliminacji</Label>
                <Input
                  id="r1-elimination-count"
                  type="number"
                  value={localSettings[GameRound.ROUND_ONE].eliminationCount}
                  onChange={(e) => updateField([GameRound.ROUND_ONE, 'eliminationCount'], parseInt(e.target.value) || 0)}
                  min={0}
                  max={10}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="r1-max-questions">Maksymalna liczba pytań</Label>
                <Input
                  id="r1-max-questions"
                  type="number"
                  value={localSettings[GameRound.ROUND_ONE].maxQuestions}
                  onChange={(e) => updateField([GameRound.ROUND_ONE, 'maxQuestions'], parseInt(e.target.value) || 10)}
                  min={5}
                  max={30}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Round 2 Settings */}
          <TabsContent value="round2" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="r2-points-correct">Punkty za poprawną odpowiedź</Label>
                <Input
                  id="r2-points-correct"
                  type="number"
                  value={localSettings[GameRound.ROUND_TWO].pointsForCorrectAnswer}
                  onChange={(e) => updateField([GameRound.ROUND_TWO, 'pointsForCorrectAnswer'], parseInt(e.target.value) || 0)}
                  min={0}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="r2-points-incorrect">Punkty za błędną odpowiedź</Label>
                <Input
                  id="r2-points-incorrect"
                  type="number"
                  value={localSettings[GameRound.ROUND_TWO].pointsForIncorrectAnswer}
                  onChange={(e) => updateField([GameRound.ROUND_TWO, 'pointsForIncorrectAnswer'], parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="r2-timer">Czas na odpowiedź (sek)</Label>
                <Input
                  id="r2-timer"
                  type="number"
                  value={localSettings[GameRound.ROUND_TWO].timerDuration}
                  onChange={(e) => updateField([GameRound.ROUND_TWO, 'timerDuration'], parseInt(e.target.value) || 5)}
                  min={3}
                  max={10}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="r2-lives">Liczba żyć na start</Label>
                <Input
                  id="r2-lives"
                  type="number"
                  value={localSettings[GameRound.ROUND_TWO].livesCount}
                  onChange={(e) => updateField([GameRound.ROUND_TWO, 'livesCount'], parseInt(e.target.value) || 1)}
                  min={1}
                  max={5}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="r2-lives-deduct">Utrata żyć za błędną odpowiedź</Label>
                <Input
                  id="r2-lives-deduct"
                  type="number"
                  value={localSettings[GameRound.ROUND_TWO].livesDeductedOnIncorrectAnswer}
                  onChange={(e) => updateField([GameRound.ROUND_TWO, 'livesDeductedOnIncorrectAnswer'], parseInt(e.target.value) || 0)}
                  min={0}
                  max={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="r2-max-questions">Maksymalna liczba pytań</Label>
                <Input
                  id="r2-max-questions"
                  type="number"
                  value={localSettings[GameRound.ROUND_TWO].maxQuestions}
                  onChange={(e) => updateField([GameRound.ROUND_TWO, 'maxQuestions'], parseInt(e.target.value) || 10)}
                  min={5}
                  max={20}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Round 3 Settings */}
          <TabsContent value="round3" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="r3-points-correct">Punkty za poprawną odpowiedź</Label>
                <Input
                  id="r3-points-correct"
                  type="number"
                  value={localSettings[GameRound.ROUND_THREE].pointsForCorrectAnswer}
                  onChange={(e) => updateField([GameRound.ROUND_THREE, 'pointsForCorrectAnswer'], parseInt(e.target.value) || 0)}
                  min={0}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="r3-points-incorrect">Punkty za błędną odpowiedź</Label>
                <Input
                  id="r3-points-incorrect"
                  type="number"
                  value={localSettings[GameRound.ROUND_THREE].pointsForIncorrectAnswer}
                  onChange={(e) => updateField([GameRound.ROUND_THREE, 'pointsForIncorrectAnswer'], parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="r3-timer">Czas na odpowiedź (sek)</Label>
                <Input
                  id="r3-timer"
                  type="number"
                  value={localSettings[GameRound.ROUND_THREE].timerDuration}
                  onChange={(e) => updateField([GameRound.ROUND_THREE, 'timerDuration'], parseInt(e.target.value) || 15)}
                  min={5}
                  max={60}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="r3-lives">Liczba żyć na start</Label>
                <Input
                  id="r3-lives"
                  type="number"
                  value={localSettings[GameRound.ROUND_THREE].livesCount}
                  onChange={(e) => updateField([GameRound.ROUND_THREE, 'livesCount'], parseInt(e.target.value) || 1)}
                  min={1}
                  max={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="r3-lives-deduct">Utrata żyć za błędną odpowiedź</Label>
                <Input
                  id="r3-lives-deduct"
                  type="number"
                  value={localSettings[GameRound.ROUND_THREE].livesDeductedOnIncorrectAnswer}
                  onChange={(e) => updateField([GameRound.ROUND_THREE, 'livesDeductedOnIncorrectAnswer'], parseInt(e.target.value) || 1)}
                  min={0}
                  max={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="r3-max-spins">Maksymalna liczba obrotów koła</Label>
                <Input
                  id="r3-max-spins"
                  type="number"
                  value={localSettings[GameRound.ROUND_THREE].maxSpins}
                  onChange={(e) => updateField([GameRound.ROUND_THREE, 'maxSpins'], parseInt(e.target.value) || 10)}
                  min={3}
                  max={20}
                />
              </div>
              
              <div className="space-y-2 flex items-center justify-between">
                <Label htmlFor="r3-final-round">Włącz rundę finałową</Label>
                <Switch
                  id="r3-final-round"
                  checked={localSettings[GameRound.ROUND_THREE].finalRoundEnabled}
                  onCheckedChange={(checked) => updateField([GameRound.ROUND_THREE, 'finalRoundEnabled'], checked)}
                />
              </div>
            </div>
            
            {/* Wheel categories */}
            <div className="mt-6 space-y-2">
              <Label>Kategorie do koła fortuny</Label>
              <div className="border border-white/10 rounded-md p-3 bg-black/30">
                {localSettings[GameRound.ROUND_THREE].wheelCategories.map((category, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2 last:mb-0">
                    <Input
                      value={category}
                      onChange={(e) => {
                        const newCategories = [...localSettings[GameRound.ROUND_THREE].wheelCategories];
                        newCategories[index] = e.target.value;
                        updateField([GameRound.ROUND_THREE, 'wheelCategories'], newCategories);
                      }}
                      className="bg-black/20"
                    />
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newCategories = [...localSettings[GameRound.ROUND_THREE].wheelCategories, ''];
                    updateField([GameRound.ROUND_THREE, 'wheelCategories'], newCategories);
                  }}
                  className="mt-2"
                >
                  Dodaj kategorię
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-4 mt-6">
          <Button 
            variant="outline" 
            onClick={resetSettings}
            className="border-neon-red text-neon-red hover:bg-neon-red/10"
          >
            <RotateCw className="h-4 w-4 mr-1" />
            Reset zmian
          </Button>
          
          <Button 
            onClick={saveSettings}
            className="bg-neon-blue hover:bg-neon-blue/80"
          >
            Zapisz ustawienia
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoundSettingsPanel;
