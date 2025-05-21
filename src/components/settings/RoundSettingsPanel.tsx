
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
import { RoundSettings } from '@/types/round-settings';

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
                    value={localSettings.timerDurations.round1}
                    onChange={(e) => updateLocalSetting(
                      'timerDurations', 
                      'round1', 
                      parseInt(e.target.value)
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="round1-points-correct">Points for Correct Answer</Label>
                  <Input 
                    id="round1-points-correct"
                    type="number"
                    value={localSettings.round1.pointsForCorrectAnswer}
                    onChange={(e) => updateLocalSetting(
                      'round1', 
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
                    value={localSettings.round1.pointsForIncorrectAnswer}
                    onChange={(e) => updateLocalSetting(
                      'round1', 
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
                    value={localSettings.round1.livesCount}
                    onChange={(e) => updateLocalSetting(
                      'round1', 
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
                    value={localSettings.round1.healthDeductionPercentage}
                    onChange={(e) => updateLocalSetting(
                      'round1', 
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
                    value={localSettings.round1.eliminateCount}
                    onChange={(e) => updateLocalSetting(
                      'round1', 
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
                    value={localSettings.round1.maxQuestions}
                    onChange={(e) => updateLocalSetting(
                      'round1', 
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
                    value={localSettings.timerDurations.round2}
                    onChange={(e) => updateLocalSetting(
                      'timerDurations', 
                      'round2', 
                      parseInt(e.target.value)
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="round2-points-correct">Points for Correct Answer</Label>
                  <Input 
                    id="round2-points-correct"
                    type="number"
                    value={localSettings.round2.pointsForCorrectAnswer}
                    onChange={(e) => updateLocalSetting(
                      'round2', 
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
                    value={localSettings.round2.pointsForIncorrectAnswer}
                    onChange={(e) => updateLocalSetting(
                      'round2', 
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
                    value={localSettings.round2.livesCount}
                    onChange={(e) => updateLocalSetting(
                      'round2', 
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
                    value={localSettings.round2.livesDeductedOnIncorrectAnswer}
                    onChange={(e) => updateLocalSetting(
                      'round2', 
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
                    value={localSettings.round2.maxQuestions}
                    onChange={(e) => updateLocalSetting(
                      'round2', 
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
                  <Label htmlFor="round3-timer">Timer Duration (seconds)</Label>
                  <Input 
                    id="round3-timer"
                    type="number"
                    value={localSettings.timerDurations.round3}
                    onChange={(e) => updateLocalSetting(
                      'timerDurations', 
                      'round3', 
                      parseInt(e.target.value)
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="round3-points-correct">Points for Correct Answer</Label>
                  <Input 
                    id="round3-points-correct"
                    type="number"
                    value={localSettings.round3.pointsForCorrectAnswer}
                    onChange={(e) => updateLocalSetting(
                      'round3', 
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
                    value={localSettings.round3.pointsForIncorrectAnswer}
                    onChange={(e) => updateLocalSetting(
                      'round3', 
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
                    value={localSettings.round3.livesCount}
                    onChange={(e) => updateLocalSetting(
                      'round3', 
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
                    value={localSettings.round3.livesDeductedOnIncorrectAnswer}
                    onChange={(e) => updateLocalSetting(
                      'round3', 
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
                    value={localSettings.round3.maxSpins}
                    onChange={(e) => updateLocalSetting(
                      'round3', 
                      'maxSpins', 
                      parseInt(e.target.value)
                    )}
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-4">
                  <Checkbox 
                    id="round3-final-round"
                    checked={localSettings.round3.finalRoundEnabled}
                    onCheckedChange={(checked) => updateLocalSetting(
                      'round3', 
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
