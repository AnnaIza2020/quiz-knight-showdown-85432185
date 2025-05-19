
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RoundSettings, DEFAULT_ROUND_SETTINGS } from '@/hooks/useGameLogic';
import { useGameContext } from '@/context/GameContext';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Save, Undo } from 'lucide-react';

const RoundSettingsPanel = () => {
  const { roundSettings, updateRoundSettings } = useGameContext();
  const [activeTab, setActiveTab] = useState('round1');
  const [localSettings, setLocalSettings] = useState<RoundSettings>(roundSettings || DEFAULT_ROUND_SETTINGS);
  
  // Update local settings when context settings change
  useEffect(() => {
    if (roundSettings) {
      setLocalSettings(roundSettings);
    }
  }, [roundSettings]);
  
  // Handle input change
  const handlePointValueChange = (
    round: 'round1' | 'round2' | 'round3',
    difficulty?: keyof typeof DEFAULT_ROUND_SETTINGS.pointValues.round1
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    
    setLocalSettings(prev => {
      if (round === 'round1' && difficulty) {
        return {
          ...prev,
          pointValues: {
            ...prev.pointValues,
            round1: {
              ...prev.pointValues.round1,
              [difficulty]: value
            }
          }
        };
      } else {
        return {
          ...prev,
          pointValues: {
            ...prev.pointValues,
            [round]: value
          }
        };
      }
    });
  };
  
  // Handle life penalty change
  const handleLifePenaltyChange = (round: 'round1' | 'round2' | 'round3') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    
    setLocalSettings(prev => ({
      ...prev,
      lifePenalties: {
        ...prev.lifePenalties,
        [round]: value
      }
    }));
  };
  
  // Handle timer duration change
  const handleTimerDurationChange = (round: 'round1' | 'round2' | 'round3') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    
    setLocalSettings(prev => ({
      ...prev,
      timerDurations: {
        ...prev.timerDurations,
        [round]: value
      }
    }));
  };
  
  // Handle lucky loser threshold change
  const handleLuckyLoserThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    
    setLocalSettings(prev => ({
      ...prev,
      luckyLoserThreshold: value
    }));
  };
  
  // Save settings to context
  const handleSaveSettings = () => {
    updateRoundSettings(localSettings);
    toast.success("Zapisano ustawienia rund", {
      description: "Nowe ustawienia zostały zastosowane"
    });
  };
  
  // Reset to defaults
  const handleResetSettings = () => {
    setLocalSettings(DEFAULT_ROUND_SETTINGS);
    toast.info("Przywrócono domyślne ustawienia", {
      description: "Aby zastosować zmiany, kliknij Zapisz"
    });
  };
  
  return (
    <Card className="bg-black/40 border border-white/10">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold text-white">Ustawienia rund</CardTitle>
            <CardDescription>Konfiguracja parametrów dla każdej rundy</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="border-amber-500 text-amber-500 hover:bg-amber-500/20"
              onClick={handleResetSettings}
            >
              <Undo className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button
              className="bg-neon-green text-black hover:bg-neon-green/80"
              onClick={handleSaveSettings}
            >
              <Save className="h-4 w-4 mr-1" />
              Zapisz
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 bg-black/50">
            <TabsTrigger value="round1" className="data-[state=active]:bg-neon-blue">Runda 1</TabsTrigger>
            <TabsTrigger value="round2" className="data-[state=active]:bg-neon-yellow text-black">Runda 2</TabsTrigger>
            <TabsTrigger value="round3" className="data-[state=active]:bg-neon-purple">Runda 3</TabsTrigger>
          </TabsList>
          
          {/* Round 1 Settings */}
          <TabsContent value="round1" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="r1-easy" className="text-white">Punkty za łatwe pytanie</Label>
                  <Input 
                    id="r1-easy"
                    type="number"
                    min="1"
                    max="100"
                    value={localSettings.pointValues.round1.easy}
                    onChange={handlePointValueChange('round1', 'easy')}
                    className="bg-black/40 border-white/20 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="r1-medium" className="text-white">Punkty za średnie pytanie</Label>
                  <Input 
                    id="r1-medium"
                    type="number"
                    min="1"
                    max="100"
                    value={localSettings.pointValues.round1.medium}
                    onChange={handlePointValueChange('round1', 'medium')}
                    className="bg-black/40 border-white/20 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="r1-hard" className="text-white">Punkty za trudne pytanie</Label>
                  <Input 
                    id="r1-hard"
                    type="number"
                    min="1"
                    max="100"
                    value={localSettings.pointValues.round1.hard}
                    onChange={handlePointValueChange('round1', 'hard')}
                    className="bg-black/40 border-white/20 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="r1-expert" className="text-white">Punkty za eksperckie pytanie</Label>
                  <Input 
                    id="r1-expert"
                    type="number"
                    min="1"
                    max="100"
                    value={localSettings.pointValues.round1.expert}
                    onChange={handlePointValueChange('round1', 'expert')}
                    className="bg-black/40 border-white/20 text-white"
                  />
                </div>
              </div>
            </div>
            
            <Separator className="bg-white/10 my-4" />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="r1-life-penalty" className="text-white">Kara za błąd (% życia)</Label>
                <Input 
                  id="r1-life-penalty"
                  type="number"
                  min="1"
                  max="100"
                  value={localSettings.lifePenalties.round1}
                  onChange={handleLifePenaltyChange('round1')}
                  className="bg-black/40 border-white/20 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="r1-timer" className="text-white">Czas na odpowiedź (sekundy)</Label>
                <Input 
                  id="r1-timer"
                  type="number"
                  min="1"
                  max="300"
                  value={localSettings.timerDurations.round1}
                  onChange={handleTimerDurationChange('round1')}
                  className="bg-black/40 border-white/20 text-white"
                />
              </div>
            </div>
            
            <Separator className="bg-white/10 my-4" />
            
            <div>
              <Label htmlFor="lucky-loser" className="text-white">Próg punktowy dla Lucky Loser</Label>
              <div className="flex items-center gap-4">
                <Input 
                  id="lucky-loser"
                  type="number"
                  min="1"
                  max="100"
                  value={localSettings.luckyLoserThreshold}
                  onChange={handleLuckyLoserThresholdChange}
                  className="bg-black/40 border-white/20 text-white"
                />
                <div className="text-sm text-white/70">punktów</div>
              </div>
              <p className="text-sm text-white/50 mt-1">
                Gracz z liczbą punktów równą lub większą od tego progu może awansować jako Lucky Loser
              </p>
            </div>
          </TabsContent>
          
          {/* Round 2 Settings */}
          <TabsContent value="round2" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="r2-points" className="text-white">Punkty za poprawną odpowiedź</Label>
                <Input 
                  id="r2-points"
                  type="number"
                  min="1"
                  max="100"
                  value={localSettings.pointValues.round2}
                  onChange={handlePointValueChange('round2')}
                  className="bg-black/40 border-white/20 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="r2-life-penalty" className="text-white">Kara za błąd (% życia)</Label>
                <Input 
                  id="r2-life-penalty"
                  type="number"
                  min="1"
                  max="100"
                  value={localSettings.lifePenalties.round2}
                  onChange={handleLifePenaltyChange('round2')}
                  className="bg-black/40 border-white/20 text-white"
                />
                <p className="text-xs text-white/50 mt-1">
                  Oprócz tego, gracz traci 1 życie
                </p>
              </div>
            </div>
            
            <Separator className="bg-white/10 my-4" />
            
            <div>
              <Label htmlFor="r2-timer" className="text-white">Czas na odpowiedź (sekundy)</Label>
              <Input 
                id="r2-timer"
                type="number"
                min="1"
                max="30"
                value={localSettings.timerDurations.round2}
                onChange={handleTimerDurationChange('round2')}
                className="bg-black/40 border-white/20 text-white"
              />
              <p className="text-sm text-white/70 mt-2">
                W rundzie 2 gracze mają bardzo mało czasu na odpowiedź, standardowo 5 sekund.
              </p>
            </div>
          </TabsContent>
          
          {/* Round 3 Settings */}
          <TabsContent value="round3" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="r3-points" className="text-white">Punkty za poprawną odpowiedź</Label>
                <Input 
                  id="r3-points"
                  type="number"
                  min="1"
                  max="100"
                  value={localSettings.pointValues.round3}
                  onChange={handlePointValueChange('round3')}
                  className="bg-black/40 border-white/20 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="r3-life-penalty" className="text-white">Kara za błąd (% życia)</Label>
                <Input 
                  id="r3-life-penalty"
                  type="number"
                  min="1"
                  max="100"
                  value={localSettings.lifePenalties.round3}
                  onChange={handleLifePenaltyChange('round3')}
                  className="bg-black/40 border-white/20 text-white"
                />
                <p className="text-xs text-white/50 mt-1">
                  Oprócz tego, gracz traci 1 życie
                </p>
              </div>
            </div>
            
            <Separator className="bg-white/10 my-4" />
            
            <div>
              <Label htmlFor="r3-timer" className="text-white">Czas na odpowiedź (sekundy)</Label>
              <Input 
                id="r3-timer"
                type="number"
                min="1"
                max="300"
                value={localSettings.timerDurations.round3}
                onChange={handleTimerDurationChange('round3')}
                className="bg-black/40 border-white/20 text-white"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RoundSettingsPanel;
