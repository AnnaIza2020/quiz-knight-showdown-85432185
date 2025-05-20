import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useGameContext } from '@/context/GameContext';
import { toast } from 'sonner';
import { GameRound } from '@/types/game-types';
import { RoundSettings, RoundOneSettings, RoundTwoSettings, RoundThreeSettings } from '@/types/round-settings';

const RoundSettingsPanel = () => {
  const { roundSettings, updateRoundSettings } = useGameContext();
  
  // Create a deep copy of the round settings to avoid reference issues
  const [localSettings, setLocalSettings] = useState<RoundSettings>({
    ...JSON.parse(JSON.stringify(roundSettings))
  });
  
  // Update local settings when the context value changes
  useEffect(() => {
    setLocalSettings({
      ...JSON.parse(JSON.stringify(roundSettings))
    });
  }, [roundSettings]);
  
  // Update local settings with a new value
  const updateLocalSetting = <T extends keyof RoundSettings>(
    section: T,
    key: keyof RoundSettings[T],
    value: any
  ) => {
    setLocalSettings(prevSettings => ({
      ...prevSettings,
      [section]: {
        ...(prevSettings[section] as object),
        [key]: value
      }
    }));
  };
  
  // Handle saving the settings
  const handleSaveSettings = () => {
    try {
      updateRoundSettings(localSettings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Round Settings</CardTitle>
        <CardDescription>Configure the game round settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="round1">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="round1">Round 1</TabsTrigger>
            <TabsTrigger value="round2">Round 2</TabsTrigger>
            <TabsTrigger value="round3">Round 3</TabsTrigger>
          </TabsList>
          
          {/* Round 1 Settings */}
          <TabsContent value="round1">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="round1-timer">Timer Duration (seconds)</Label>
                  <Input 
                    id="round1-timer"
                    type="number"
                    value={localSettings[GameRound.ROUND_ONE].timerDuration}
                    onChange={(e) => updateLocalSetting(
                      GameRound.ROUND_ONE, 
                      'timerDuration', 
                      parseInt(e.target.value)
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="round1-points-correct">Points for Correct Answer</Label>
                  <Input 
                    id="round1-points-correct"
                    type="number"
                    value={localSettings[GameRound.ROUND_ONE].pointsForCorrectAnswer}
                    onChange={(e) => updateLocalSetting(
                      GameRound.ROUND_ONE, 
                      'pointsForCorrectAnswer', 
                      parseInt(e.target.value)
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="round1-points-incorrect">Points for Incorrect Answer</Label>
                  <Input 
                    id="round1-points-incorrect"
                    type="number"
                    value={localSettings[GameRound.ROUND_ONE].pointsForIncorrectAnswer}
                    onChange={(e) => updateLocalSetting(
                      GameRound.ROUND_ONE, 
                      'pointsForIncorrectAnswer', 
                      parseInt(e.target.value)
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="round1-lives">Lives Count</Label>
                  <Input 
                    id="round1-lives"
                    type="number"
                    value={localSettings[GameRound.ROUND_ONE].livesCount}
                    onChange={(e) => updateLocalSetting(
                      GameRound.ROUND_ONE, 
                      'livesCount', 
                      parseInt(e.target.value)
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="round1-health-deduction">Health Deduction (%)</Label>
                  <Input 
                    id="round1-health-deduction"
                    type="number"
                    value={localSettings[GameRound.ROUND_ONE].healthDeductionPercentage}
                    onChange={(e) => updateLocalSetting(
                      GameRound.ROUND_ONE, 
                      'healthDeductionPercentage', 
                      parseInt(e.target.value)
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="round1-eliminate-count">Elimination Count</Label>
                  <Input 
                    id="round1-eliminate-count"
                    type="number"
                    value={localSettings[GameRound.ROUND_ONE].eliminateCount}
                    onChange={(e) => updateLocalSetting(
                      GameRound.ROUND_ONE, 
                      'eliminateCount', 
                      parseInt(e.target.value)
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="round1-max-questions">Max Questions</Label>
                  <Input 
                    id="round1-max-questions"
                    type="number"
                    value={localSettings[GameRound.ROUND_ONE].maxQuestions}
                    onChange={(e) => updateLocalSetting(
                      GameRound.ROUND_ONE, 
                      'maxQuestions', 
                      parseInt(e.target.value)
                    )}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Round 2 Settings */}
          <TabsContent value="round2">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="round2-timer">Timer Duration (seconds)</Label>
                  <Input 
                    id="round2-timer"
                    type="number"
                    value={localSettings[GameRound.ROUND_TWO].timerDuration}
                    onChange={(e) => updateLocalSetting(
                      GameRound.ROUND_TWO, 
                      'timerDuration', 
                      parseInt(e.target.value)
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="round2-points-correct">Points for Correct Answer</Label>
                  <Input 
                    id="round2-points-correct"
                    type="number"
                    value={localSettings[GameRound.ROUND_TWO].pointsForCorrectAnswer}
                    onChange={(e) => updateLocalSetting(
                      GameRound.ROUND_TWO, 
                      'pointsForCorrectAnswer', 
                      parseInt(e.target.value)
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="round2-points-incorrect">Points for Incorrect Answer</Label>
                  <Input 
                    id="round2-points-incorrect"
                    type="number"
                    value={localSettings[GameRound.ROUND_TWO].pointsForIncorrectAnswer}
                    onChange={(e) => updateLocalSetting(
                      GameRound.ROUND_TWO, 
                      'pointsForIncorrectAnswer', 
                      parseInt(e.target.value)
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="round2-lives">Lives Count</Label>
                  <Input 
                    id="round2-lives"
                    type="number"
                    value={localSettings[GameRound.ROUND_TWO].livesCount}
                    onChange={(e) => updateLocalSetting(
                      GameRound.ROUND_TWO, 
                      'livesCount', 
                      parseInt(e.target.value)
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="round2-lives-deducted">Lives Deducted on Incorrect</Label>
                  <Input 
                    id="round2-lives-deducted"
                    type="number"
                    value={localSettings[GameRound.ROUND_TWO].livesDeductedOnIncorrectAnswer}
                    onChange={(e) => updateLocalSetting(
                      GameRound.ROUND_TWO, 
                      'livesDeductedOnIncorrectAnswer', 
                      parseInt(e.target.value)
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="round2-max-questions">Max Questions</Label>
                  <Input 
                    id="round2-max-questions"
                    type="number"
                    value={localSettings[GameRound.ROUND_TWO].maxQuestions}
                    onChange={(e) => updateLocalSetting(
                      GameRound.ROUND_TWO, 
                      'maxQuestions', 
                      parseInt(e.target.value)
                    )}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Round 3 Settings */}
          <TabsContent value="round3">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="round3-points-correct">Points for Correct Answer</Label>
                  <Input 
                    id="round3-points-correct"
                    type="number"
                    value={localSettings[GameRound.ROUND_THREE].pointsForCorrectAnswer}
                    onChange={(e) => updateLocalSetting(
                      GameRound.ROUND_THREE, 
                      'pointsForCorrectAnswer', 
                      parseInt(e.target.value)
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="round3-points-incorrect">Points for Incorrect Answer</Label>
                  <Input 
                    id="round3-points-incorrect"
                    type="number"
                    value={localSettings[GameRound.ROUND_THREE].pointsForIncorrectAnswer}
                    onChange={(e) => updateLocalSetting(
                      GameRound.ROUND_THREE, 
                      'pointsForIncorrectAnswer', 
                      parseInt(e.target.value)
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="round3-lives">Lives Count</Label>
                  <Input 
                    id="round3-lives"
                    type="number"
                    value={localSettings[GameRound.ROUND_THREE].livesCount}
                    onChange={(e) => updateLocalSetting(
                      GameRound.ROUND_THREE, 
                      'livesCount', 
                      parseInt(e.target.value)
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="round3-lives-deducted">Lives Deducted on Incorrect</Label>
                  <Input 
                    id="round3-lives-deducted"
                    type="number"
                    value={localSettings[GameRound.ROUND_THREE].livesDeductedOnIncorrectAnswer}
                    onChange={(e) => updateLocalSetting(
                      GameRound.ROUND_THREE, 
                      'livesDeductedOnIncorrectAnswer', 
                      parseInt(e.target.value)
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="round3-max-spins">Max Spins</Label>
                  <Input 
                    id="round3-max-spins"
                    type="number"
                    value={localSettings[GameRound.ROUND_THREE].maxSpins}
                    onChange={(e) => updateLocalSetting(
                      GameRound.ROUND_THREE, 
                      'maxSpins', 
                      parseInt(e.target.value)
                    )}
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-4">
                  <Checkbox 
                    id="round3-final-round"
                    checked={localSettings[GameRound.ROUND_THREE].finalRoundEnabled}
                    onCheckedChange={(checked) => updateLocalSetting(
                      GameRound.ROUND_THREE, 
                      'finalRoundEnabled', 
                      Boolean(checked)
                    )}
                  />
                  <label
                    htmlFor="round3-final-round"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Enable Final Round
                  </label>
                </div>
                
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <Button className="mt-6" onClick={handleSaveSettings}>Save Settings</Button>
      </CardContent>
    </Card>
  );
};

export default RoundSettingsPanel;
